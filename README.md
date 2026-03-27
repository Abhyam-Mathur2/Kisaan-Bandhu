# 🌾 Kisaan Bandhu

**Kisaan Bandhu** is a comprehensive *Climate Intelligence System for Resilient Agriculture*, built to empower Indian farmers with real-time, actionable insights. Featuring a state-of-the-art AI Voice Facilitator, it provides ultra-low latency, multi-lingual agricultural assistance directly to farmers on their mobile devices or desktops.

## ✨ Key Features

- 🎙️ **Bandhu Voice Facilitator**: Ultra-low latency voice conversational AI powered by **ElevenLabs WebRTC**, tuned for Hindi and regional dialects. Speaks naturally like a companion to guide farmers.
- 💬 **AI Smart Chat**: Context-aware agricultural assistant powered by **Groq (Llama 3)**, understanding both Hindi and English text/voice inputs via **Whisper**.
- 🦠 **Crop Disease Detection**: Upload photos of infected leaves for instant AI analysis and actionable mitigation strategies.
- ⛅ **Real-Time Weather Alerts**: Localized weather risk assessments to help farmers plan irrigation and harvests.
- 💰 **Finance & Government Schemes**: Curated access to active agricultural schemes, subsidies, and financial support.
- 📈 **Market Insights**: Access to current Mandi prices and localized market trends.

---

## 🛠️ Technology Stack

**Frontend**
- React 18 & Vite
- Tailwind CSS & Framer Motion
- Lucide React (Icons)
- `@elevenlabs/react` (v1.0.0 WebRTC SDK)

**Backend (Serverless Edge)**
- **Supabase Edge Functions** (Deno + TypeScript)
- Replaces traditional servers for zero-maintenance, globally distributed API routes.

**AI Integrations**
- **ElevenLabs**: Conversational AI and voice synthesis.
- **Groq**: Lightning-fast Llama-3 inference and Whisper audio transcription.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- [Supabase CLI](https://supabase.com/docs/guides/cli) installed (`npm install -g supabase`)
- API Keys: Supabase, Groq, and ElevenLabs.

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Abhyam-Mathur2/Kisaan-Bandhu.git
cd Kisaan-Bandhu
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory based on `.env.example` (or configure via Vite):
```env
# Vite Frontend Config
VITE_ELEVENLABS_AGENT_ID=your_elevenlabs_agent_id
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Supabase Edge Functions Base URL
VITE_API_BASE_URL=https://<YOUR_PROJECT_ID>.supabase.co/functions/v1
```

### 3. Deploy Supabase Edge Functions
The backend runs entirely on Supabase Edge Functions. Use the provided PowerShell script to deploy:

```powershell
# Logs in, sets secrets, and deploys all 8 edge functions
.\deploy-functions.ps1
```
*(If you are on Linux/Mac, you can deploy them manually using `supabase functions deploy <name>`)*

### 4. Run the Development Server
```bash
npm run dev
```
The app will be available at [http://localhost:5173](http://localhost:5173).

---

## 📂 Project Structure

```
Kisaan-Bandhu/
├── src/
│   ├── components/       # Reusable UI components (BandhuAssistant, Cards, Buttons)
│   ├── pages/            # Application views (Dashboard, VoiceAssistant, etc.)
│   ├── utils/            # Shared utilities (api.js edge function helpers)
│   └── context/          # React contexts (Language support)
├── supabase/
│   ├── functions/        # Deno Edge Functions (chat, voice-token, profile, etc.)
│   └── config.toml       # Supabase CLI configuration
├── backend/              # Existing FastAPI backend (Kept for historical reference/fallback)
├── deploy-functions.ps1  # Deployment automation script
└── index.html            # Vite entry point
```

---

## 🤝 Contributing

We welcome contributions! Please follow standard GitHub Flow:
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project was developed for the CSI Hackathon. All rights reserved.
