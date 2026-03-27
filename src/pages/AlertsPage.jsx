import { useEffect, useMemo, useState } from "react";
import { BellRing, CheckCheck, Trash2 } from "lucide-react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { getStoredAlerts, saveAlerts } from "../data/alertsService";

export function AlertsPage() {
  const [alerts, setAlerts] = useState(() => getStoredAlerts());

  useEffect(() => {
    saveAlerts(alerts);
    window.dispatchEvent(new CustomEvent("kb:alerts-updated", { detail: alerts }));
  }, [alerts]);

  const unreadCount = useMemo(() => alerts.filter((item) => !item.read).length, [alerts]);

  function markAllRead() {
    setAlerts((prev) => prev.map((item) => ({ ...item, read: true })));
  }

  function removeAlert(id) {
    setAlerts((prev) => prev.filter((item) => item.id !== id));
  }

  function markRead(id) {
    setAlerts((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  }

  return (
    <div className="space-y-6 pb-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-emerald-950">Alerts Center</h2>
          <p className="text-sm text-emerald-900/70">Alerts are persisted in local storage for offline access.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">Unread {unreadCount}</span>
          <Button variant="secondary" size="sm" onClick={markAllRead}>
            <CheckCheck size={15} />
            Mark all read
          </Button>
        </div>
      </header>

      {alerts.length === 0 ? (
        <Card className="border border-emerald-100 bg-white p-8 text-center" hover={false}>
          <p className="text-sm font-semibold text-slate-500">No active alerts.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card key={alert.id} className="border border-emerald-100 bg-white p-4 sm:p-5" hover={false}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
                    <BellRing size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{alert.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{alert.message}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${severityClass(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      {!alert.read ? <span className="rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-700">Unread</span> : null}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!alert.read ? (
                    <Button variant="ghost" size="sm" onClick={() => markRead(alert.id)}>
                      Mark read
                    </Button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => removeAlert(alert.id)}
                    className="rounded-xl border border-red-100 p-2 text-red-500 hover:bg-red-50"
                    aria-label="Delete alert"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function severityClass(level) {
  if (level === "high") {
    return "bg-red-100 text-red-700";
  }
  if (level === "medium") {
    return "bg-amber-100 text-amber-700";
  }
  return "bg-emerald-100 text-emerald-700";
}
