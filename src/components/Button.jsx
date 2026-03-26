import { cn } from "../utils/cn";

export function Button({ 
  className, 
  variant = "primary", 
  size = "md", 
  ...props 
}) {
  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200/50",
    secondary: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-emerald-100/50",
    outline: "border-2 border-emerald-600/30 bg-transparent text-emerald-700 hover:border-emerald-600 hover:bg-emerald-50",
    ghost: "bg-transparent text-emerald-700 hover:bg-emerald-50",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg font-semibold",
  };

  return (
    <button
      className={cn(
        "rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
