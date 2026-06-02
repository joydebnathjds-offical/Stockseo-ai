import React from "react";
import { cn } from "../../utils/cn";
import { UserTier } from "../../store/useAppStore";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "neon" | "violet";
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "sm",
  className,
}) => {
  const variants = {
    default: "bg-[var(--color-glass)] border-[var(--color-glass-border)] text-[var(--color-text-muted)]",
    success: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
    warning: "bg-amber-500/15 border-amber-500/30 text-amber-400",
    danger: "bg-rose-500/15 border-rose-500/30 text-rose-400",
    info: "bg-blue-500/15 border-blue-500/30 text-blue-400",
    neon: "bg-[#FF4EAD]/15 border-[#FF4EAD]/30 text-[#FF4EAD]",
    violet: "bg-violet-500/15 border-violet-500/30 text-violet-400",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px] font-semibold",
    md: "px-2.5 py-1 text-xs font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border tracking-wide uppercase",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export const TierBadge: React.FC<{ tier: UserTier }> = ({ tier }) => {
  const configs: Record<UserTier, { label: string; variant: BadgeProps["variant"]; icon: string }> = {
    BASIC: { label: "Basic Free", variant: "default", icon: "◎" },
    PRO: { label: "Pro", variant: "info", icon: "⚡" },
    PREMIUM: { label: "Premium", variant: "neon", icon: "✦" },
    ENTERPRISE: { label: "Enterprise", variant: "violet", icon: "◈" },
  };
  const { label, variant, icon } = configs[tier];
  return (
    <Badge variant={variant} size="md">
      {icon} {label}
    </Badge>
  );
};
