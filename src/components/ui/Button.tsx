import React from "react";
import { cn } from "../../utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "neon" | "danger" | "outline" | "glass";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  glow?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconRight,
  glow = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-[0.97] whitespace-nowrap";

  const variants = {
    primary:
      "bg-gradient-to-r from-[#00C4CC] to-[#007BFF] text-white hover:opacity-90 focus:ring-[#00C4CC]/40 shadow-lg",
    secondary:
      "bg-[var(--color-surface-secondary)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[#00C4CC]/50 hover:bg-[rgba(0,196,204,0.05)] focus:ring-[#00C4CC]/30",
    ghost:
      "bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-glass)] focus:ring-[var(--color-border)]",
    neon:
      "bg-gradient-to-r from-[#FF4EAD] to-[#8B5CF6] text-white hover:opacity-90 focus:ring-[#FF4EAD]/40 shadow-lg",
    danger:
      "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:opacity-90 focus:ring-red-500/40",
    outline:
      "bg-transparent border border-[#00C4CC] text-[#00C4CC] hover:bg-[rgba(0,196,204,0.1)] focus:ring-[#00C4CC]/30",
    glass:
      "glass text-[var(--color-text)] hover:bg-[rgba(255,255,255,0.15)] focus:ring-[var(--color-border)]",
  };

  const sizes = {
    xs: "px-2.5 py-1 text-xs rounded-lg gap-1",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
    xl: "px-6 py-3 text-base",
  };

  const glowClass = glow
    ? variant === "neon"
      ? "glow-pink"
      : "glow-cyan"
    : "";

  return (
    <button
      className={cn(
        base,
        variants[variant],
        sizes[size],
        glowClass,
        (disabled || loading) && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
      {!loading && iconRight}
    </button>
  );
};
