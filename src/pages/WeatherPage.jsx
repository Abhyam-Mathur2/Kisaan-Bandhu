import { motion, useReducedMotion } from "framer-motion";
import { CloudSun, RefreshCw } from "lucide-react";
import { useCallback } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Skeleton } from "../components/Skeleton";
import { STORAGE_KEYS } from "../data/storageKeys";
import { fetchWeather } from "../data/weatherService";
import { useCachedResource } from "../hooks/useCachedResource";

export function WeatherPage() {
  const reduceMotion = useReducedMotion();
  const weatherFetcher = useCallback(() => fetchWeather(30.9, 75.85), []);

  const {
    data,
    isLoading,
    error,
    isCached,
    isStale,
    staleLabel,
    retry,
  } = useCachedResource({
    storageKey: STORAGE_KEYS.weather,
    fetcher: weatherFetcher,
    staleAfterMinutes: 20,
  });

  return (
    <div className="space-y-6 pb-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-emerald-950">Weather Snapshot</h2>
          <p className="text-sm text-emerald-900/70">Open-Meteo live fetch with cached fallback.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={retry}>
          <RefreshCw size={16} />
          Refresh Weather
        </Button>
      </header>

      {isLoading ? <WeatherLoadingSkeleton /> : null}
      {!isLoading && error && !data ? <ErrorState message={error} onRetry={retry} /> : null}

      {!isLoading && data ? (
        <motion.div initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={reduceMotion ? {} : { opacity: 1, y: 0 }}>
          <Card className="bg-white border border-emerald-100 p-6 sm:p-8" hover={false}>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <StatusBadge label={isCached ? "Cached" : "Live"} tone={isCached ? "amber" : "emerald"} />
              <StatusBadge label={isStale ? `Stale (${staleLabel})` : `Fresh (${staleLabel})`} tone={isStale ? "red" : "slate"} />
            </div>

            <div className="mb-6 flex items-start gap-3">
              <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                <CloudSun size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Location</p>
                <h3 className="text-2xl font-black text-slate-900">{data.location}</h3>
                <p className="text-sm text-slate-500">{data.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Metric title="Temperature" value={`${data.temperature} C`} />
              <Metric title="Wind Speed" value={`${data.windSpeed} km/h`} />
              <Metric title="Rain Chance" value={`${data.precipitationChance}%`} />
            </div>

            {error ? <p className="mt-4 text-sm font-medium text-amber-700">{error}</p> : null}
          </Card>
        </motion.div>
      ) : null}
    </div>
  );
}

function Metric({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-1 text-xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function WeatherLoadingSkeleton() {
  return (
    <Card className="space-y-4 bg-white border border-emerald-100 p-6" hover={false}>
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-12 w-2/3" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </Card>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <Card className="bg-white border border-red-100 p-6" hover={false}>
      <p className="mb-4 text-sm font-semibold text-red-700">{message || "Weather data unavailable."}</p>
      <Button onClick={onRetry} size="sm">
        <RefreshCw size={16} />
        Retry
      </Button>
    </Card>
  );
}

function StatusBadge({ label, tone }) {
  const map = {
    emerald: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-red-100 text-red-700",
    slate: "bg-slate-100 text-slate-700",
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${map[tone]}`}>{label}</span>;
}
