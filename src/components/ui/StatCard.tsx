import React from "react";
import { cn } from "../../utils/cn";
import { GlassCard } from "./GlassCard";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  trend?: string;
  trendUp?: boolean;
  glow?: "cyan" | "pink" | "violet" | "blue" | "none";
  accentColor?: string;
  className?: string;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  sub,
  trend,
  trendUp,
  glow = "none",
  accentColor = "#00C4CC",
  className,
  delay = 0,
}) => {
  return (
    <GlassCard
      variant="bubble"
      glow={glow}
      className={cn("p-5 animate-fade-up", className)}
      style={{ animationDelay: `${delay}ms` } as React.CSSProperties}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
          style={{ background: `${accentColor}20`, color: accentColor }}
        >
          {icon}
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full",
              trendUp
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-rose-500/15 text-rose-400"
            )}
          >
            {trendUp ? "↑" : "↓"} {trend}
          </span>
        )}
      </div>
      <div
        className="text-2xl font-extrabold mb-0.5 animate-count"
        style={{ color: accentColor }}
      >
        {value}
      </div>
      <div className="text-xs font-medium text-[var(--color-text-muted)]">{label}</div>
      {sub && <div className="text-[10px] text-[var(--color-text-muted)] mt-1 opacity-70">{sub}</div>}
    </GlassCard>
  );
};
