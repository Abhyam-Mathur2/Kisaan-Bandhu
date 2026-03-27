import { WifiOff } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { useLanguage } from "../context/LanguageContext";

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const reduceMotion = useReducedMotion();
  const { t } = useLanguage();

  if (isOnline) {
    return null;
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: -8 }}
      animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
      className="mx-4 mt-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900"
      role="status"
      aria-live="polite"
    >
      <p className="flex items-center gap-2 text-sm font-semibold">
        <WifiOff size={16} />
        {t("offlineBanner", "Offline mode: showing saved data where available.")}
      </p>
    </motion.div>
  );
}
