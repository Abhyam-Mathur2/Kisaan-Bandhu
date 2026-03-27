import { Mic, Square } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function getSpeechSupport() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export default function VoiceButton({ text = "Welcome to Kisan Bandhu dashboard." }) {
  const [speaking, setSpeaking] = useState(false);
  const isSupported = useMemo(() => getSpeechSupport(), []);

  useEffect(() => {
    const handleEnd = () => setSpeaking(false);
    window.speechSynthesis?.addEventListener("voiceschanged", handleEnd);

    return () => {
      window.speechSynthesis?.removeEventListener("voiceschanged", handleEnd);
      window.speechSynthesis?.cancel();
    };
  }, []);

  function speak() {
    if (!isSupported) {
      console.log("[Voice] Web Speech API not supported");
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onstart = () => {
      console.log("[Voice] speech started");
      setSpeaking(true);
    };
    utterance.onend = () => {
      console.log("[Voice] speech ended");
      setSpeaking(false);
    };
    utterance.onerror = (event) => {
      console.log("[Voice] speech error", event.error);
      setSpeaking(false);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return (
    <button
      type="button"
      onClick={speak}
      disabled={!isSupported}
      className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
      aria-label={speaking ? "Stop voice guide" : "Play voice guide"}
      title={isSupported ? "Voice guide" : "Web Speech API unavailable"}
    >
      {speaking ? <Square size={15} /> : <Mic size={15} />}
      {speaking ? "Stop" : "Voice"}
    </button>
  );
}
