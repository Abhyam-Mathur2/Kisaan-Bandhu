import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Mic, 
  MicOff, 
  X, 
  Bot, 
  User, 
  Loader2, 
  Volume2,
  Minimize2,
  Maximize2
} from "lucide-react";
import { cn } from "../utils/cn";
import { edgePost, edgePostForm } from "../utils/api";

export default function BandhuAssistant({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      content: "Namaste! I am Bandhu, your digital friend. How can I help you with your farm today?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const scrollRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage = { role: "user", content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const data = await edgePost("chat", {
        messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
      });

      if (!data?.response || typeof data.response !== "string") {
        throw new Error("Bandhu returned an empty response.");
      }

      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [{
        role: "assistant",
        content: error?.message || "I apologize, but I'm having trouble connecting. Please try again in a moment."
      }, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        await handleVoiceUpload(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Mic Error:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleVoiceUpload = async (blob) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", blob, "recording.wav");

    try {
      const data = await edgePostForm("voice-to-text", formData);
      if (data.text) {
        handleSendMessage(data.text);
      }
    } catch (error) {
      console.error("Voice Processing Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={cn(
        "fixed right-6 bottom-6 w-96 bg-white rounded-3xl shadow-2xl border border-emerald-100 flex flex-col z-50 transition-all duration-300 overflow-hidden",
        isMinimized ? "h-16" : "h-[600px]"
      )}
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-800 to-emerald-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-400 rounded-2xl flex items-center justify-center shadow-lg">
            <Bot size={24} className="text-emerald-900" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Bandhu Assistant</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[10px] text-emerald-100 font-medium">Always here to help</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
          >
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={cn(
                  "flex items-start gap-2 max-w-[85%]",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
                  msg.role === "assistant" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                )}>
                  {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={cn(
                  "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                  msg.role === "assistant" 
                    ? "bg-white text-slate-700 border border-emerald-50 rounded-tl-none" 
                    : "bg-emerald-600 text-white rounded-tr-none"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-emerald-600">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs font-medium italic">Bandhu is thinking...</span>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-emerald-50">
            <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-2xl border border-slate-200 focus-within:border-emerald-500 focus-within:bg-white transition-all">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={cn(
                  "p-2.5 rounded-xl transition-all shadow-sm",
                  isRecording 
                    ? "bg-red-500 text-white animate-pulse" 
                    : "bg-white text-emerald-600 hover:bg-emerald-50"
                )}
              >
                {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Talk to Bandhu..."
                className="flex-1 bg-transparent border-none focus:outline-none text-sm px-2 text-slate-700 font-medium"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 disabled:opacity-50 disabled:hover:bg-amber-500 transition-colors shadow-lg shadow-amber-500/20"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-3 font-medium">
              Bandhu can speak Hindi, Marathi, Telugu, and more!
            </p>
          </div>
        </>
      )}
    </div>
  );
}
