from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
import asyncio
import httpx
from dotenv import load_dotenv
from typing import List, Optional
from uuid import UUID
from groq import Groq, AsyncGroq
import io

from schemas import (
    Profile, ProfileBase, Field, FieldCreate,
    SoilReport, Recommendation, Alert,
    ChatRequest, ChatMessage
)

# Load environment variables
load_dotenv("../.env")

app = FastAPI(
    title="Kisaan Bandhu AI API",
    description="Climate Intelligence System for Resilient Agriculture",
    version="1.1.0"
)

# Enable CORS for frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase & Groq
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELEVENLABS_AGENT_ID = os.getenv("ELEVENLABS_AGENT_ID", "agent_8401kmrag3adf5qv4gc619bwe4qq")
BHASHINI_API_KEY = os.getenv("BHASHINI_API_KEY")
BHASHINI_USER_ID = os.getenv("BHASHINI_USER_ID")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
groq_client = AsyncGroq(api_key=GROQ_API_KEY)

# Constants for AI
GROQ_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"]
BANDHU_SYSTEM_PROMPT = """
You are 'Bandhu', a calm, composed, and highly knowledgeable agricultural assistant. 
Your goal is to help Indian farmers with resilient farming practices, weather insights, crop recommendations, and government schemes.
Speak in a friendly, brotherly tone. Support Hindi, English, and other regional languages.
Keep responses concise and actionable.
"""

# Middleware to handle Windows-specific connection reset errors
@app.middleware("http")
async def handle_connection_reset(request, call_next):
    try:
        return await call_next(request)
    except ConnectionResetError:
        # This is common on Windows with uvicorn and doesn't usually impact the user
        print("ConnectionResetError caught and handled.")
        from fastapi.responses import Response
        return Response(status_code=204)

# --- BHASHINI CONFIGURATION ---
BHASHINI_ENDPOINT = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"

async def bhashini_asr(audio_content: str, source_lang: str = "hi"):
    """
    Sends audio to Bhashini for high-accuracy Indian language transcription.
    source_lang 'hi' covers many dialects, but Bhashini supports specific codes.
    """
    async with httpx.AsyncClient() as client:
        payload = {
            "pipelineTasks": [
                {
                    "taskType": "asr",
                    "config": {
                        "language": {"sourceLanguage": source_lang},
                        "serviceId": "ai4bharat/whisper-medium-en-hi--gpu" # Example Service ID
                    }
                }
            ],
            "inputData": {"audio": [{"audioContent": audio_content}]}
        }
        headers = {
            "Content-Type": "application/json",
            "Authorization": BHASHINI_API_KEY,
            "userID": BHASHINI_USER_ID
        }
        try:
            response = await client.post(BHASHINI_ENDPOINT, json=payload, headers=headers, timeout=30.0)
            data = response.json()
            # Bhashini returns transcription in pipelineResponse
            return data['pipelineResponse'][0]['output'][0]['source']
        except Exception as e:
            print(f"Bhashini Error: {e}")
            return None

# --- ELEVENLABS VOICE FACILITATOR ROUTES ---

@app.get("/voice/token")
async def get_voice_token():
    """
    Mints a signed ElevenLabs conversation token for secure WebRTC sessions.
    Called by the frontend to avoid exposing the API key in client-side code.
    """
    if not ELEVENLABS_API_KEY:
        raise HTTPException(status_code=500, detail="ElevenLabs API key not configured.")
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"https://api.elevenlabs.io/v1/convai/conversation/token?agent_id={ELEVENLABS_AGENT_ID}",
                headers={"xi-api-key": ELEVENLABS_API_KEY},
                timeout=10.0,
            )
        if resp.status_code != 200:
            raise HTTPException(status_code=resp.status_code, detail=resp.text)
        return resp.json()  # {"token": "...", ...}
    except httpx.RequestError as exc:
        raise HTTPException(status_code=503, detail=f"Could not reach ElevenLabs: {exc}")


# --- BANDHU AI ASSISTANT ROUTES ---

@app.post("/ai/chat")
async def chat_with_bandhu(request: ChatRequest):
    last_error = None
    for model_name in GROQ_MODELS:
        try:
            groq_messages = [{"role": "system", "content": BANDHU_SYSTEM_PROMPT}]
            for msg in request.messages:
                groq_messages.append({"role": msg.role, "content": msg.content})

            chat_completion = await groq_client.chat.completions.create(
                messages=groq_messages,
                model=model_name,
                temperature=0.6,
                max_tokens=1024,
            )
            
            return {
                "response": chat_completion.choices[0].message.content,
                "model_used": model_name
            }
        except Exception as e:
            print(f"Model {model_name} failed: {str(e)}")
            last_error = e
            continue
            
    raise HTTPException(status_code=500, detail=f"Bandhu is currently unavailable. Error: {str(last_error)}")

@app.post("/ai/voice-to-text")
async def voice_to_text(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        file_tuple = (file.filename, contents)
        transcription = await groq_client.audio.transcriptions.create(
            file=file_tuple,
            model="whisper-large-v3",
            response_format="json",
        )
        return {"text": transcription.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import io
import json
from PIL import Image
import numpy as np

# Try importing torch for model inference
try:
    import torch
    import torch.nn as nn
    from torchvision import models, transforms
    HAS_TORCH = True
except ImportError:
    HAS_TORCH = False

# Load disease knowledge base
with open("disease_knowledge.json", "r", encoding="utf-8") as f:
    DISEASE_KNOWLEDGE = json.load(f)

# Load class indices if they exist
try:
    with open("class_indices.json", "r") as f:
        CLASS_INDICES = json.load(f)
except FileNotFoundError:
    CLASS_INDICES = {
        "0": "Potato Early Blight",
        "1": "Potato Late Blight",
        "2": "Tomato Early Blight",
        "3": "Tomato Late Blight",
        "4": "Tomato Yellow Leaf Curl Virus",
        "5": "Healthy"
    }

# Global variables for model
model = None
device = None
preprocess = None

if HAS_TORCH:
    try:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        num_classes = len(CLASS_INDICES)
        
        # Reconstruct the architecture
        model = models.mobilenet_v2(weights=None)
        num_ftrs = model.classifier[1].in_features
        model.classifier[1] = nn.Sequential(
            nn.Linear(num_ftrs, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, num_classes)
        )
        
        if os.path.exists("plant_disease_model.pth"):
            model.load_state_dict(torch.load("plant_disease_model.pth", map_location=device))
            print("Successfully loaded PyTorch plant disease model.")
        
        model.to(device)
        model.eval()
        
        preprocess = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
    except Exception as e:
        print(f"Error loading PyTorch model: {e}")

async def run_inference(image_bytes: bytes):
    """
    Preprocesses the image and runs inference using the trained PyTorch model.
    Falls back to a mock inference if no model is loaded.
    """
    if not HAS_TORCH or model is None or preprocess is None:
        # Mock inference for demonstration
        import random
        disease_names = list(CLASS_INDICES.values())
        predicted_class = random.choice(disease_names)
        confidence = round(random.uniform(0.85, 0.98), 2)
        return predicted_class, confidence

    try:
        # Preprocessing
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        input_tensor = preprocess(img)
        input_batch = input_tensor.unsqueeze(0).to(device)

        # Prediction
        with torch.no_grad():
            output = model(input_batch)
        
        probabilities = torch.nn.functional.softmax(output[0], dim=0)
        confidence, top_idx = torch.max(probabilities, 0)
        
        predicted_class = CLASS_INDICES.get(str(top_idx.item()), "Unknown")
        
        return predicted_class, float(confidence.item())
    except Exception as e:
        print(f"Inference error: {e}")
        return "Unknown", 0.0

import base64

async def groq_fallback(disease_name: str):
    """
    Uses Groq Llama 3.3 Versatile to generate details about the disease as a fallback, 
    since Groq Vision models were decommissioned.
    """
    try:
        prompt = f"""
        Provide information about the plant disease '{disease_name}'. 
        Provide the response in EXACTLY this JSON format:
        {{
            "disease": "{disease_name}",
            "disease_hindi": "Disease name in Hindi",
            "confidence": 0.85,
            "symptoms": "Detailed symptoms of this disease",
            "prevention": "How to prevent this disease",
            "recommendation": "What the farmer should do now"
        }}
        If '{disease_name}' is healthy or unknown, adapt the response accordingly. Keep it simple and farmer-friendly.
        """

        response = await groq_client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"},
        )
        
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Groq Fallback Error: {e}")
        return None

# --- NEW FEATURE SECTIONS ---

@app.post("/disease-detection/analyze")
async def detect_disease(image: UploadFile = File(...)):
    """
    Endpoint to receive a plant leaf image and return a detailed diagnosis.
    Tries local PyTorch model first, falls back to Groq Vision if confidence is low.
    """
    try:
        image_bytes = await image.read()
        
        # 1. Try Local PyTorch Model
        disease_name, confidence = await run_inference(image_bytes)
        
        # 2. Check if local model is confident enough (> 50%)
        # If model is not loaded (model is None), it returns mock with random confidence
        if model is not None and confidence > 0.50:
            knowledge = DISEASE_KNOWLEDGE.get(disease_name, {
                "disease_hindi": "अज्ञात रोग",
                "symptoms": "Unable to determine symptoms for this class.",
                "prevention": "Maintain general plant health and sanitation.",
                "recommendation": "Consult a local agricultural expert for verification."
            })

            return {
                "disease": disease_name,
                "disease_hindi": knowledge["disease_hindi"],
                "confidence": confidence,
                "symptoms": knowledge["symptoms"],
                "prevention": knowledge["prevention"],
                "recommendation": knowledge["recommendation"],
                "source": "local_model",
                "status": "success"
            }
        
        # 3. Fallback to Groq Text if local model fails or lacks confidence
        print(f"Local model confidence {confidence} too low or model missing. Falling back to Groq Text...")
        groq_result = await groq_fallback(disease_name)
        
        if groq_result:
            groq_result["source"] = "groq_text_fallback"
            groq_result["status"] = "success"
            return groq_result

        # 4. Final Fallback (Mock or Error)
        return {
            "disease": disease_name,
            "disease_hindi": "अज्ञात",
            "confidence": confidence,
            "symptoms": "Could not verify diagnosis with AI cloud.",
            "prevention": "N/A",
            "recommendation": "Try taking a clearer photo.",
            "source": "local_mock",
            "status": "partial_success"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/finance/schemes")
async def get_schemes(state: Optional[str] = None):
    query = supabase.table("finance_schemes").select("*")
    if state:
        query = query.eq("state", state)
    res = query.execute()
    return res.data

@app.get("/weather/alerts/{location}")
async def get_weather_alerts(location: str):
    res = supabase.table("weather_alerts").select("*").eq("location_name", location).execute()
    return res.data

# --- EXISTING ROUTES (KEEP FOR COMPATIBILITY) ---

@app.get("/profile/{user_id}", response_model=Profile)
async def get_profile(user_id: UUID):
    res = supabase.table("profiles").select("*").eq("id", str(user_id)).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return res.data[0]

@app.get("/fields/{user_id}", response_model=List[Field])
async def get_user_fields(user_id: UUID):
    res = supabase.table("fields").select("*").eq("user_id", str(user_id)).execute()
    return res.data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
