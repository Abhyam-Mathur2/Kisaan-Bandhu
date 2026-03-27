import { useCallback, useEffect, useMemo, useState } from "react";
import { useOnlineStatus } from "./useOnlineStatus";

function readCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return parsed?.data ? parsed : null;
  } catch (error) {
    console.log("[Cache] read failed", { key, message: error.message });
    return null;
  }
}

function writeCache(key, data) {
  try {
    const payload = { data, savedAt: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify(payload));
    console.log("[Cache] saved", { key, savedAt: payload.savedAt, data });
    return payload;
  } catch (error) {
    console.log("[Cache] write failed", { key, message: error.message });
    return null;
  }
}

function formatRelativeMinutes(timestamp) {
  if (!timestamp) {
    return "unknown";
  }
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000));
  if (minutes < 1) {
    return "just now";
  }
  if (minutes === 1) {
    return "1 minute ago";
  }
  if (minutes < 60) {
    return `${minutes} minutes ago`;
  }
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function useCachedResource({ storageKey, fetcher, staleAfterMinutes = 30 }) {
  const isOnline = useOnlineStatus();
  const [data, setData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCached, setIsCached] = useState(false);

  const load = useCallback(
    async ({ force = false } = {}) => {
      const cache = readCache(storageKey);
      const canUseCacheFirst = !force && cache?.data;

      if (!isOnline && canUseCacheFirst) {
        console.log("[Cache] serving offline cached data", { key: storageKey });
        setData(cache.data);
        setLastUpdated(cache.savedAt);
        setIsCached(true);
        setError(null);
        setIsLoading(false);
        return;
      }

      if (canUseCacheFirst) {
        setData(cache.data);
        setLastUpdated(cache.savedAt);
        setIsCached(true);
      }

      setIsLoading(true);
      setError(null);

      try {
        const fresh = await fetcher();
        const saved = writeCache(storageKey, fresh);
        setData(fresh);
        setLastUpdated(saved?.savedAt || new Date().toISOString());
        setIsCached(false);
        setError(null);
      } catch (loadError) {
        const fallback = readCache(storageKey);
        if (fallback?.data) {
          console.log("[Cache] fetch failed, serving stale cache", { key: storageKey, message: loadError.message });
          setData(fallback.data);
          setLastUpdated(fallback.savedAt);
          setIsCached(true);
          setError("Live data unavailable. Showing cached snapshot.");
        } else {
          setError(loadError.message || "Failed to load data.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [fetcher, isOnline, storageKey]
  );

  useEffect(() => {
    load();
  }, [load]);

  const isStale = useMemo(() => {
    if (!lastUpdated) {
      return false;
    }
    const ageMs = Date.now() - new Date(lastUpdated).getTime();
    return ageMs > staleAfterMinutes * 60 * 1000;
  }, [lastUpdated, staleAfterMinutes]);

  const staleLabel = useMemo(() => formatRelativeMinutes(lastUpdated), [lastUpdated]);

  return {
    data,
    lastUpdated,
    isLoading,
    error,
    isCached,
    isStale,
    staleLabel,
    isOnline,
    retry: () => load({ force: true }),
  };
}
