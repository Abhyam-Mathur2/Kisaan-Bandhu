import { cn } from "../utils/cn";

export function Input({ label, error, icon: Icon, className, ...props }) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-emerald-800 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 group-focus-within:text-emerald-500 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          className={cn(
            "w-full bg-white/50 border-2 border-emerald-100 rounded-2xl py-3 px-4 outline-none transition-all duration-300 focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-900/5",
            Icon && "pl-11",
            error && "border-red-400 focus:border-red-500",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 ml-1 mt-0.5">{error}</p>}
    </div>
  );
}
