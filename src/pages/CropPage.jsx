import { motion, useReducedMotion } from "framer-motion";
import { Leaf, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Skeleton } from "../components/Skeleton";
import { STORAGE_KEYS } from "../data/storageKeys";
import { fetchCropRecommendation } from "../data/cropService";
import { useCachedResource } from "../hooks/useCachedResource";

export function CropPage() {
  const reduceMotion = useReducedMotion();
  const {
    data,
    isLoading,
    error,
    isCached,
    isOnline,
    staleLabel,
    retry,
  } = useCachedResource({
    storageKey: STORAGE_KEYS.cropRecommendation,
    fetcher: fetchCropRecommendation,
    staleAfterMinutes: 60,
  });

  return (
    <div className="space-y-6 pb-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-emerald-950">Crop Recommendation</h2>
          <p className="text-sm text-emerald-900/70">AI recommendation cached for offline use.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={retry}>
          <RefreshCw size={16} />
          Refresh
        </Button>
      </header>

      {isLoading ? <CropLoadingSkeleton /> : null}

      {!isLoading && error && !data ? (
        <ErrorState message={error} onRetry={retry} />
      ) : null}

      {!isLoading && data ? (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="bg-white border border-emerald-100 p-6 sm:p-8" hover={false}>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge label={`Confidence ${Math.round(data.confidence * 100)}%`} tone="emerald" />
              {isCached || !isOnline ? <Badge label="Cached" tone="amber" /> : null}
              {!isOnline ? <Badge label="Offline" tone="slate" icon={<WifiOff size={12} />} /> : null}
            </div>

            <div className="mb-6 flex items-start gap-3">
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                <Leaf size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700/70">Recommended Crop</p>
                <h3 className="text-3xl font-black text-emerald-950">{data.crop}</h3>
                <p className="mt-1 text-sm text-emerald-900/70">Updated {staleLabel}</p>
              </div>
            </div>

            <p className="mb-5 rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-900/80">{data.rationale}</p>

            <ul className="space-y-2">
              {data.actions.map((action) => (
                <li key={action} className="rounded-xl border border-emerald-100 bg-white px-3 py-2 text-sm text-slate-700">
                  {action}
                </li>
              ))}
            </ul>
          </Card>

          {error ? (
            <p className="text-sm font-medium text-amber-700">{error}</p>
          ) : null}
        </motion.div>
      ) : null}
    </div>
  );
}

function CropLoadingSkeleton() {
  return (
    <Card className="space-y-4 bg-white border border-emerald-100 p-6" hover={false}>
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-12 w-2/3" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </Card>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <Card className="bg-white border border-red-100 p-6" hover={false}>
      <p className="mb-4 text-sm font-semibold text-red-700">{message || "Unable to load crop recommendation."}</p>
      <Button onClick={onRetry} size="sm">
        <RefreshCw size={16} />
        Retry
      </Button>
    </Card>
  );
}

function Badge({ label, tone, icon }) {
  const tones = {
    emerald: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-800",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${tones[tone] || tones.slate}`}>
      {icon}
      {label}
    </span>
  );
}
