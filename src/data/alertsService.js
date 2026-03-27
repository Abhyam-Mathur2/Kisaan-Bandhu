import { STORAGE_KEYS } from "./storageKeys";

const DEFAULT_ALERTS = [
  {
    id: "a1",
    title: "Heavy Rain Watch",
    message: "Drainage inspection recommended before tomorrow morning.",
    severity: "high",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "a2",
    title: "Pest Activity Notice",
    message: "Aphid activity rising in nearby districts. Start field checks.",
    severity: "medium",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];

export function getStoredAlerts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.alerts);
    if (!raw) {
      console.log("[Storage] No saved alerts, writing defaults");
      localStorage.setItem(STORAGE_KEYS.alerts, JSON.stringify(DEFAULT_ALERTS));
      return DEFAULT_ALERTS;
    }
    const parsed = JSON.parse(raw);
    console.log("[Storage] Loaded alerts", parsed);
    return Array.isArray(parsed) ? parsed : DEFAULT_ALERTS;
  } catch (error) {
    console.log("[Storage] Failed to load alerts, using defaults", { message: error.message });
    return DEFAULT_ALERTS;
  }
}

export function saveAlerts(alerts) {
  console.log("[Storage] Persisting alerts", alerts);
  localStorage.setItem(STORAGE_KEYS.alerts, JSON.stringify(alerts));
}
