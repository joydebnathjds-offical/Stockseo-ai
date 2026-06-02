import React from "react";
import { cn } from "../../utils/cn";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "strong" | "bubble" | "neon";
  glow?: "cyan" | "pink" | "violet" | "blue" | "none";
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = "default",
  glow = "none",
  className,
  children,
  ...props
}) => {
  const variantClasses = {
    default: "glass",
    strong: "glass-strong",
    bubble: "bubble-glass",
    neon: "glass border border-[rgba(0,196,204,0.3)]",
  };

  const glowClasses = {
    cyan: "glow-cyan",
    pink: "glow-pink",
    violet: "glow-violet",
    blue: "glow-blue",
    none: "",
  };

  return (
    <div
      className={cn(
        "rounded-2xl transition-theme",
        variantClasses[variant],
        glowClasses[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
