import React from "react";
import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/Button";
import { TierBadge } from "../ui/Badge";
import { useAppStore } from "../../store/useAppStore";
import { MessageCircle, Check, Crown } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/8801540595258";

const PLANS = [
  {
    name: "BASIC",
    price: "Free",
    credits: 10,
    features: ["10 AI Credits total", "Basic SEO Generation", "1 AI Engine", "3 Marketplaces"],
    color: "#64748b",
  },
  {
    name: "PRO",
    price: "$19/mo",
    credits: 500,
    features: ["500 Credits/month", "All 6 AI Engines", "Bulk Processing", "All 6 Marketplaces", "SEO Analytics"],
    color: "#007BFF",
    popular: false,
  },
  {
    name: "PREMIUM",
    price: "$49/mo",
    credits: 1000,
    features: ["1,000 Credits/month", "GPT-5 & Gemini Pro", "Bulk (200 images)", "All 6 Marketplaces", "Advanced Analytics", "API Access"],
    color: "#FF4EAD",
    popular: true,
  },
  {
    name: "ENTERPRISE",
    price: "$129/mo",
    credits: 5000,
    features: ["5,000 Credits/month", "All AI Engines", "Unlimited Bulk", "White-label Export", "SLA Support", "Team Access", "Custom API"],
    color: "#8B5CF6",
    popular: false,
  },
];

export const BillingPage: React.FC = () => {
  const { user, setShowPaywall } = useAppStore();

  const handleUpgrade = (planName: string) => {
    const msg = encodeURIComponent(
      `Hi! I'd like to upgrade to the ${planName} plan on StockSEO AI. Please help me with the billing process.`
    );
    window.open(`${WHATSAPP_URL}?text=${msg}`, "_blank");
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--color-text)]">
          <span className="gradient-text-primary">Billing & Plans</span>
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">Manage your subscription and credits</p>
      </div>

      {/* Current Plan */}
      {user && (
        <GlassCard variant="bubble" className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Current Plan</div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-extrabold text-[var(--color-text)]">{user.tier}</h2>
                <TierBadge tier={user.tier} />
              </div>
              <div className="mt-2 text-sm text-[var(--color-text-muted)]">
                <span className="font-bold text-[#00C4CC]">{user.credits.toLocaleString()}</span>
                {" "}/{" "}
                <span>{user.isAdmin ? "∞" : user.creditsCap.toLocaleString()} credits remaining</span>
              </div>
            </div>
            {user.tier !== "ENTERPRISE" && (
              <Button
                variant="primary"
                icon={<Crown size={15} />}
                onClick={() => setShowPaywall(true)}
                glow
              >
                Upgrade Plan
              </Button>
            )}
          </div>

          {!user.isAdmin && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1">
                <span>Credits used</span>
                <span>{(user.creditsCap - user.credits).toLocaleString()} / {user.creditsCap.toLocaleString()}</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--color-border)]">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-[#00C4CC] to-[#007BFF] transition-all"
                  style={{ width: `${((user.creditsCap - user.credits) / user.creditsCap) * 100}%` }}
                />
              </div>
            </div>
          )}
        </GlassCard>
      )}

      {/* Plans Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {PLANS.map((plan) => (
          <GlassCard
            key={plan.name}
            variant="bubble"
            className="p-5 relative"
            style={{
              border: plan.popular ? `1px solid ${plan.color}40` : undefined,
            } as React.CSSProperties}
          >
            {plan.popular && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-[9px] font-extrabold px-3 py-0.5 rounded-full text-white"
                  style={{ background: plan.color }}>
                  ⭐ MOST POPULAR
                </span>
              </div>
            )}
            <div className="text-center mb-4 pt-2">
              <div className="font-extrabold text-base text-[var(--color-text)]">{plan.name}</div>
              <div className="text-2xl font-black mt-1" style={{ color: plan.color }}>{plan.price}</div>
              <div className="text-xs text-[var(--color-text-muted)]">{plan.credits.toLocaleString()} credits</div>
            </div>
            <div className="space-y-1.5 mb-5">
              {plan.features.map((f) => (
                <div key={f} className="flex items-start gap-1.5 text-xs">
                  <Check size={11} className="mt-0.5 flex-shrink-0" style={{ color: plan.color }} />
                  <span className="text-[var(--color-text-muted)]">{f}</span>
                </div>
              ))}
            </div>
            {plan.name === user?.tier ? (
              <div className="w-full py-2 text-center text-xs font-bold text-[var(--color-text-muted)] glass rounded-xl border border-[var(--color-border)]">
                Current Plan ✓
              </div>
            ) : (
              <Button
                variant={plan.popular ? "neon" : "outline"}
                size="sm"
                className="w-full"
                onClick={() => handleUpgrade(plan.name)}
                icon={<MessageCircle size={12} />}
                style={!plan.popular ? { borderColor: plan.color, color: plan.color } : {}}
              >
                {plan.name === "BASIC" ? "Downgrade" : "Upgrade"}
              </Button>
            )}
          </GlassCard>
        ))}
      </div>

      {/* WhatsApp Contact */}
      <GlassCard variant="bubble" className="p-5" glow="cyan">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "#25D366" }}>
            <MessageCircle size={22} className="text-white" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-extrabold text-sm text-[var(--color-text)]">Instant Billing via WhatsApp</h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Contact our billing team at <span className="font-bold text-[#25D366]">+880 1540 595 258</span> for immediate plan activation. We typically respond within minutes.
            </p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-all flex-shrink-0"
            style={{ background: "#25D366" }}>
            <MessageCircle size={16} /> Contact Billing
          </a>
        </div>
      </GlassCard>
    </div>
  );
};
