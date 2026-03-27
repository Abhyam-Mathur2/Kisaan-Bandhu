import React, { useState, useCallback } from "react";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import {
  Mic,
  MicOff,
  Bot,
  Sparkles,
  MessageSquare,
  Languages,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { cn } from "../utils/cn";
import { Link } from "react-router-dom";
import { edgeGet } from "../utils/api";

const AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID || "agent_8401kmrag3adf5qv4gc619bwe4qq";

// Inner component – must live inside <ConversationProvider>
function BandhuVoiceUI() {
  const [errorMsg, setErrorMsg] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log("✅ Connected to ElevenLabs Bandhu");
      setErrorMsg(null);
      setIsConnecting(false);
    },
    onDisconnect: () => {
      console.log("🔌 Disconnected");
      setIsConnecting(false);
    },
    onError: (error) => {
      console.error("❌ ElevenLabs Error:", error);
      setErrorMsg(
        typeof error === "string" ? error : error?.message || "Voice connection error."
      );
      setIsConnecting(false);
    },
    onModeChange: (mode) => console.log("🔄 Mode:", mode),
  });

  const startConversation = useCallback(async () => {
    try {
      setErrorMsg(null);
      setIsConnecting(true);

      // Request mic permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Try to get a signed token from edge function for secure WebRTC
      let sessionOptions = { agentId: AGENT_ID };
      try {
        const { token } = await edgeGet("voice-token");
        if (token) {
          sessionOptions = { conversationToken: token, connectionType: "webrtc" };
          console.log("🔐 Using signed WebRTC token from Supabase Edge Function");
        }
      } catch {
        console.warn("⚠️ voice-token edge function unavailable – using direct agentId");
      }

      conversation.startSession(sessionOptions);
    } catch (error) {
      console.error("Mic / Session Error:", error);
      setErrorMsg("Could not start Bandhu. Please allow microphone access and try again.");
      setIsConnecting(false);
    }
  }, [conversation]);

  const stopConversation = useCallback(() => {
    conversation.endSession();
  }, [conversation]);

  const isActive = conversation.status === "connected";

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Bot className="text-amber-500" size={28} />
            Bandhu Voice Facilitator
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Real-time Hindi voice assistance for all your farming needs.
          </p>
        </div>
        <Link
          to="/dashboard"
          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-600"
        >
          <ArrowLeft size={20} />
        </Link>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-3 text-sm font-semibold">
          ⚠️ {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Main Interaction Panel */}
        <div className="md:col-span-2 flex flex-col bg-white rounded-[2rem] border border-emerald-100 shadow-xl overflow-hidden">
          {/* Status Bar */}
          <div className="p-4 bg-emerald-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-3 h-3 rounded-full",
                isConnecting
                  ? "bg-amber-400 animate-pulse"
                  : isActive
                  ? "bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                  : "bg-red-400"
              )} />
              <span className="text-xs font-black uppercase tracking-widest">
                {isConnecting
                  ? "Connecting to Bandhu..."
                  : isActive
                  ? "Bandhu is Listening..."
                  : "Bandhu is Offline"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {conversation.isSpeaking && (
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-1 h-4 bg-amber-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              )}
              <span className="text-[10px] font-bold text-emerald-300">
                {isConnecting
                  ? "CONNECTING"
                  : conversation.isSpeaking
                  ? "SPEAKING"
                  : isActive
                  ? "LISTENING"
                  : "READY"}
              </span>
            </div>
          </div>

          {/* Avatar Area */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-emerald-50/30">
            <div className="relative">
              {isActive && (
                <>
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping scale-150" />
                  <div className="absolute inset-0 bg-amber-500/10 rounded-full animate-ping scale-[2] [animation-delay:0.5s]" />
                </>
              )}
              <div className={cn(
                "w-48 h-48 rounded-[3rem] bg-emerald-900 flex items-center justify-center shadow-2xl relative z-10 transition-transform duration-500",
                isActive ? "scale-110" : "scale-100"
              )}>
                {isConnecting ? (
                  <Loader2 size={80} className="text-amber-400 animate-spin" />
                ) : (
                  <Bot
                    size={80}
                    className={cn(
                      "transition-all duration-500",
                      isActive ? "text-amber-400 scale-110" : "text-emerald-100"
                    )}
                  />
                )}
              </div>
              {isActive && (
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-2xl shadow-lg border border-emerald-100 flex items-center gap-2 whitespace-nowrap">
                  <div className="flex gap-0.5 items-end h-5">
                    {[4, 7, 5, 8, 5].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-emerald-500 rounded-full"
                        style={{ height: `${h}px` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-black text-emerald-800">Voice Active</span>
                </div>
              )}
            </div>

            <div className="mt-12 text-center max-w-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {isConnecting
                  ? "Starting up..."
                  : isActive
                  ? "How can I help you today?"
                  : "Ready to start talking?"}
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                {isActive
                  ? "I am listening. Ask me about weather, crops, or mandi prices."
                  : "Click the button below to start a live voice conversation with Bandhu."}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="p-8 bg-white border-t border-emerald-50 flex flex-col items-center gap-4">
            {!isActive ? (
              <button
                onClick={startConversation}
                disabled={isConnecting}
                className={cn(
                  "group flex items-center gap-3 text-white px-10 py-5 rounded-[2rem] text-lg font-black shadow-xl transition-all",
                  isConnecting
                    ? "bg-emerald-400 cursor-wait"
                    : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 hover:scale-105 active:scale-95"
                )}
              >
                {isConnecting ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <Mic size={24} className="group-hover:animate-pulse" />
                )}
                {isConnecting ? "CONNECTING..." : "START TALKING (SHURU KAREIN)"}
              </button>
            ) : (
              <button
                onClick={stopConversation}
                className="group flex items-center gap-3 bg-red-500 hover:bg-red-600 text-white px-10 py-5 rounded-[2rem] text-lg font-black shadow-xl shadow-red-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <MicOff size={24} />
                STOP CONVERSATION (ROKEIN)
              </button>
            )}

            <div className="flex gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Ultra Low Latency
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Hindi Supported
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                AI Driven
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-amber-50 rounded-[2rem] p-6 border border-amber-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-500 rounded-xl">
                <Languages size={20} className="text-white" />
              </div>
              <h4 className="font-black text-slate-800 text-sm uppercase">Language Info</h4>
            </div>
            <p className="text-xs font-bold text-amber-900 leading-relaxed">
              Bandhu understands Hindi and English perfectly. Speak naturally like talking to a friend.
            </p>
          </div>

          <div className="bg-white rounded-[2rem] p-6 border border-emerald-50 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <Sparkles size={20} className="text-emerald-700" />
              </div>
              <h4 className="font-black text-slate-800 text-sm uppercase">What to ask?</h4>
            </div>
            <div className="space-y-3">
              {[
                "Aaj mausam kaisa rahega?",
                "Gehu ki kheti ke liye tips dein.",
                "Sarkaari yojanaon ke baare mein batayein.",
                "Mandi mein pyaaz ka bhav kya hai?"
              ].map((tip, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-bold text-slate-600 hover:border-emerald-200 hover:bg-white transition-all cursor-pointer"
                >
                  {tip}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-900 rounded-[2rem] p-6 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare size={20} className="text-amber-400" />
              <h4 className="font-black text-xs uppercase tracking-widest">About Bandhu</h4>
            </div>
            <p className="text-[11px] font-medium text-emerald-100/70 leading-relaxed">
              Powered by ElevenLabs Conversational AI with WebRTC for ultra-low latency. Tuned for rural dialects and agricultural context.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Outer component that provides the ElevenLabs context
export function VoiceAssistantPage() {
  return (
    <ConversationProvider agentId={AGENT_ID}>
      <BandhuVoiceUI />
    </ConversationProvider>
  );
}
