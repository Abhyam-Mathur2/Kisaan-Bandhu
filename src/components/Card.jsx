import { motion } from "framer-motion";
import { cn } from "../utils/cn";

export function Card({ 
  children, 
  className, 
  hover = true, 
  glass = true,
  animate = true,
  ...props 
}) {
  const Component = animate ? motion.div : "div";
  
  return (
    <Component
      whileHover={hover ? { scale: 1.02, y: -5 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "rounded-3xl p-6",
        glass ? "glass" : "bg-white border border-emerald-100 shadow-xl shadow-emerald-900/5",
        hover && "hover:shadow-2xl hover:shadow-emerald-900/10",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
