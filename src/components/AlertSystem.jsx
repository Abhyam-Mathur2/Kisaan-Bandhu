import { BellRing } from "lucide-react";
import { Link } from "react-router-dom";

export default function AlertSystem({ unreadCount = 0 }) {
  return (
    <Link
      to="/dashboard/alerts"
      className="relative rounded-2xl border border-emerald-200 bg-white p-2.5 text-slate-500 transition-colors hover:text-emerald-700"
      aria-label="Open alerts"
    >
      <BellRing size={20} />
      {unreadCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      ) : null}
    </Link>
  );
}
