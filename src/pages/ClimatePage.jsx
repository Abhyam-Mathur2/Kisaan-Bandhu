import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Skeleton } from "../components/Skeleton";
import { fetchClimateRiskAssessment } from "../data/climateService";
import { STORAGE_KEYS } from "../data/storageKeys";
import { useCachedResource } from "../hooks/useCachedResource";

export function ClimatePage() {
  const reduceMotion = useReducedMotion();
  const {
    data,
    isLoading,
    error,
    isCached,
    staleLabel,
    retry,
  } = useCachedResource({
    storageKey: STORAGE_KEYS.climateRisk,
    fetcher: fetchClimateRiskAssessment,
    staleAfterMinutes: 45,
  });

  return (
    <div className="space-y-6 pb-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-emerald-950">Climate Risk</h2>
          <p className="text-sm text-emerald-900/70">Last known assessment is served as stale cache when needed.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={retry}>
          <RefreshCw size={16} />
          Reassess
        </Button>
      </header>

      {isLoading ? <ClimateLoadingSkeleton /> : null}
      {!isLoading && error && !data ? <ErrorState message={error} onRetry={retry} /> : null}

      {!isLoading && data ? (
        <motion.div initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={reduceMotion ? {} : { opacity: 1, y: 0 }}>
          <Card className="bg-white border border-emerald-100 p-6 sm:p-8" hover={false}>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <RiskBadge level={data.riskLevel} />
              {isCached ? <Badge label={`Stale (${staleLabel})`} tone="amber" /> : <Badge label={`Updated ${staleLabel}`} tone="emerald" />}
            </div>

            <div className="mb-5 flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
              <AlertTriangle className="mt-0.5 text-amber-600" size={20} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Risk Summary</p>
                <p className="mt-1 text-sm font-medium text-slate-700">{data.summary}</p>
              </div>
            </div>

            <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700/70">Risk Score</p>
              <p className="text-3xl font-black text-emerald-900">{data.score}/100</p>
            </div>

            <ul className="space-y-2">
              {data.recommendations.map((item) => (
                <li key={item} className="rounded-xl border border-emerald-100 px-3 py-2 text-sm text-slate-700">
                  {item}
                </li>
              ))}
            </ul>

            {error ? <p className="mt-4 text-sm font-medium text-amber-700">{error}</p> : null}
          </Card>
        </motion.div>
      ) : null}
    </div>
  );
}

function ClimateLoadingSkeleton() {
  return (
    <Card className="space-y-4 bg-white border border-emerald-100 p-6" hover={false}>
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </Card>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <Card className="bg-white border border-red-100 p-6" hover={false}>
      <p className="mb-4 text-sm font-semibold text-red-700">{message || "Climate data unavailable."}</p>
      <Button onClick={onRetry} size="sm">
        <RefreshCw size={16} />
        Retry
      </Button>
    </Card>
  );
}

function RiskBadge({ level }) {
  const map = {
    Low: "bg-emerald-100 text-emerald-800",
    Moderate: "bg-amber-100 text-amber-800",
    High: "bg-red-100 text-red-700",
  };

  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${map[level] || map.Moderate}`}>{level} Risk</span>;
}

function Badge({ label, tone }) {
  const toneMap = {
    emerald: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-800",
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${toneMap[tone]}`}>{label}</span>;
}
