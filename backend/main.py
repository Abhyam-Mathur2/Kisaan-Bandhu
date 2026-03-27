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
ELEVENLABS_AGENT_ID = "agent_8401kmrag3adf5qv4gc619bwe4qq"
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

# --- NEW FEATURE SECTIONS ---

@app.post("/disease-detection/analyze")
async def detect_disease(user_id: UUID, image: UploadFile = File(...)):
    # This will later call a CNN model. For now, it records the request.
    return {
        "status": "success",
        "analysis": "Currently processing your leaf image...",
        "detected": "Potential Late Blight",
        "confidence": 0.89,
        "advice": "Apply Copper-based fungicides and remove infected leaves."
    }

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
