import React from "react";
import { useAppStore } from "../../store/useAppStore";
import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/Button";
import {
  X, Check, MessageCircle, Crown,
  Image as ImageIcon, Globe, BarChart3, Star,
} from "lucide-react";

const WHATSAPP_URL = "https://wa.me/8801540595258";
const WHATSAPP_NUMBER = "+880 1540 595 258";

const PLANS = [
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    period: "/month",
    credits: "500",
    color: "#007BFF",
    glow: "blue" as const,
    badge: null,
    features: [
      "500 AI Credits/month",
      "All 6 AI Engines",
      "Bulk Processing (50 images)",
      "Advanced SEO Analytics",
      "Title + Description + Tags",
      "Priority Support",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$49",
    period: "/month",
    credits: "1,000",
    color: "#FF4EAD",
    glow: "pink" as const,
    badge: "MOST POPULAR",
    features: [
      "1,000 AI Credits/month",
      "GPT-5 & Gemini 2.5 Pro",
      "Bulk Processing (200 images)",
      "SEO Score Optimization",
      "6 Marketplace Templates",
      "Dedicated Support",
      "API Access",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$129",
    period: "/month",
    credits: "5,000",
    color: "#8B5CF6",
    glow: "violet" as const,
    badge: null,
    features: [
      "5,000 AI Credits/month",
      "All AI Engines + Early Access",
      "Unlimited Bulk Processing",
      "White-label Export",
      "Custom Marketplace Rules",
      "SLA + Priority Support",
      "Team Collaboration",
      "Custom API Integration",
    ],
  },
];

export const PaywallModal: React.FC = () => {
  const { showPaywall, setShowPaywall } = useAppStore();

  if (!showPaywall) return null;

  const handleWhatsApp = (planName: string) => {
    const msg = encodeURIComponent(
      `Hi! I'd like to activate the ${planName} plan on StockSEO AI. Please assist with billing confirmation.`
    );
    window.open(`${WHATSAPP_URL}?text=${msg}`, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "var(--color-overlay)", backdropFilter: "blur(8px)" }}
    >
      <div className="w-full max-w-4xl animate-fade-up">
        {/* Header Card */}
        <GlassCard variant="strong" className="relative overflow-hidden mb-4">
          {/* Background orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#FF4EAD]/20 blur-2xl" />
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#8B5CF6]/20 blur-2xl" />
          </div>

          <div className="relative p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF4EAD]/30 to-[#8B5CF6]/30 flex items-center justify-center">
                  <Crown size={16} className="text-[#FF4EAD]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF4EAD]">
                  Credits Exhausted
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-[var(--color-text)] mb-1">
                Upgrade to Continue Generating
              </h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                Your free credits have been used. Choose a plan to unlock unlimited AI-powered SEO metadata generation.
              </p>
            </div>
            <button
              onClick={() => setShowPaywall(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-glass)] transition-all"
            >
              <X size={16} />
            </button>
          </div>

          {/* Mini stats */}
          <div className="border-t border-[var(--color-border)] px-6 py-3 flex flex-wrap gap-6">
            {[
              { icon: <ImageIcon size={13} />, val: "2.4M+", lbl: "Images Processed" },
              { icon: <BarChart3 size={13} />, val: "88.4 Avg", lbl: "SEO Score" },
              { icon: <Globe size={13} />, val: "6", lbl: "Marketplaces" },
              { icon: <Star size={13} />, val: "4.9/5", lbl: "Rating" },
            ].map((s) => (
              <div key={s.lbl} className="flex items-center gap-2 text-xs">
                <span className="text-[#00C4CC]">{s.icon}</span>
                <span className="font-bold text-[var(--color-text)]">{s.val}</span>
                <span className="text-[var(--color-text-muted)]">{s.lbl}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Pricing Grid */}
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          {PLANS.map((plan) => (
            <GlassCard
              key={plan.id}
              variant="bubble"
              glow={plan.badge ? plan.glow : "none"}
              className="p-5 relative overflow-hidden"
              style={{
                border: plan.badge ? `1px solid ${plan.color}50` : undefined,
              } as React.CSSProperties}
            >
              {plan.badge && (
                <div
                  className="absolute top-0 left-0 right-0 text-center py-1 text-[10px] font-extrabold tracking-widest text-white"
                  style={{ background: `linear-gradient(90deg, ${plan.color}, #8B5CF6)` }}
                >
                  {plan.badge}
                </div>
              )}

              <div className={plan.badge ? "mt-4" : ""}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-extrabold text-sm text-[var(--color-text)]">{plan.name}</div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">{plan.credits} credits/mo</div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold" style={{ color: plan.color }}>{plan.price}</span>
                    <span className="text-xs text-[var(--color-text-muted)]">{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-1.5 mb-5">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-xs">
                      <Check size={11} className="mt-0.5 flex-shrink-0" style={{ color: plan.color }} />
                      <span className="text-[var(--color-text-muted)]">{f}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant={plan.badge ? "neon" : "outline"}
                  size="sm"
                  className="w-full"
                  onClick={() => handleWhatsApp(plan.name)}
                  icon={<MessageCircle size={13} />}
                  style={plan.badge ? {} : { borderColor: plan.color, color: plan.color }}
                  glow={!!plan.badge}
                >
                  Get {plan.name}
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* WhatsApp CTA Banner */}
        <GlassCard variant="strong" className="p-5">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#25D366" }}>
              <MessageCircle size={22} className="text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-extrabold text-sm text-[var(--color-text)] mb-0.5">
                Instant Manual Billing Activation
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                To activate your premium credits tier immediately, contact manual billing confirmation via WhatsApp at{" "}
                <span className="font-bold text-[#25D366]">{WHATSAPP_NUMBER}</span>.
                Our team activates your plan within minutes.
              </p>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 glow-cyan flex-shrink-0 whitespace-nowrap"
              style={{ background: "#25D366" }}
            >
              <MessageCircle size={16} />
              Chat on WhatsApp
            </a>
          </div>
        </GlassCard>

        {/* Free continue link */}
        <div className="text-center mt-3">
          <button
            onClick={() => setShowPaywall(false)}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors underline underline-offset-2"
          >
            Continue exploring (limited features)
          </button>
        </div>
      </div>
    </div>
  );
};
