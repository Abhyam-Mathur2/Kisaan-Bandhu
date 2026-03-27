import { Globe } from "lucide-react";
import { STORAGE_KEYS } from "../data/storageKeys";
import { useLanguage } from "../context/LanguageContext";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "hi", label: "HI" },
];

export default function LanguageToggle({ compact = false }) {
  const { language, setLanguage } = useLanguage();
  const current = LANGUAGES.find((item) => item.code === language) || LANGUAGES[0];

  function handleToggle() {
    const next = current.code === "en" ? "hi" : "en";
    localStorage.setItem(STORAGE_KEYS.language, next);
    setLanguage(next);
    console.log("[Storage] language toggled", { from: current.code, to: next });
    window.dispatchEvent(new CustomEvent("kb:language-change", { detail: next }));
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={compact
        ? "flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-50"
        : "flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-3 py-2 text-sm font-bold text-emerald-800 hover:bg-emerald-50"
      }
      aria-label="Toggle language"
    >
      <Globe size={16} />
      {current.label}
    </button>
  );
}
