import { cn } from "../utils/cn";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-emerald-100/50", className)}
      {...props}
    />
  );
}
