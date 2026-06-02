import React from "react";
import { GlassCard } from "../ui/GlassCard";
import { Badge } from "../ui/Badge";
import { Globe, ExternalLink, CheckCircle2, TrendingUp } from "lucide-react";

const MARKETPLACES = [
  {
    name: "Shutterstock",
    url: "https://shutterstock.com",
    color: "#EE2626",
    status: "connected",
    titleMax: 200,
    descMax: 2000,
    tagsMax: 50,
    features: ["Auto keyword suggestions", "Editorial upload", "Vector support", "Video files"],
    tips: "Use descriptive, specific keywords. Avoid generic terms. Shutterstock's algorithm favors detailed descriptions.",
    commission: "15–40%",
    bestScore: 91,
  },
  {
    name: "Adobe Stock",
    url: "https://stock.adobe.com",
    color: "#FF0000",
    status: "connected",
    titleMax: 200,
    descMax: 2000,
    tagsMax: 49,
    features: ["Creative Cloud integration", "AI-enhanced search", "Smart collections", "Subscription model"],
    tips: "Adobe Stock rewards authenticity. Include location, mood, and subject matter in your keywords.",
    commission: "33%",
    bestScore: 88,
  },
  {
    name: "Freepik",
    url: "https://freepik.com",
    color: "#1DB954",
    status: "connected",
    titleMax: 255,
    descMax: 1000,
    tagsMax: 30,
    features: ["Vector & PSD support", "Free + premium tiers", "High traffic volume", "Community features"],
    tips: "Freepik focuses on design resources. Tag with design-related terms and file formats.",
    commission: "30–50%",
    bestScore: 85,
  },
  {
    name: "iStock (Getty)",
    url: "https://istockphoto.com",
    color: "#000099",
    status: "configured",
    titleMax: 200,
    descMax: 500,
    tagsMax: 50,
    features: ["Getty Images network", "Editorial content", "Global distribution", "Rights managed"],
    tips: "iStock values exclusivity. Focus on commercial viability and avoid overly generic compositions.",
    commission: "15–45%",
    bestScore: 87,
  },
  {
    name: "Dreamstime",
    url: "https://dreamstime.com",
    color: "#0052CC",
    status: "configured",
    titleMax: 100,
    descMax: 1000,
    tagsMax: 50,
    features: ["7-level contributor system", "Extended licenses", "Print-on-demand", "Editorial section"],
    tips: "Dreamstime uses keyword relevance scoring. Accurate, specific tags improve your contributor level.",
    commission: "25–50%",
    bestScore: 82,
  },
  {
    name: "Alamy",
    url: "https://alamy.com",
    color: "#FF6B00",
    status: "active",
    titleMax: 200,
    descMax: 2000,
    tagsMax: 50,
    features: ["Editorial emphasis", "News content", "Global reach", "Direct licensing"],
    tips: "Alamy excels at editorial and news imagery. Include dates, events, and locations in descriptions.",
    commission: "40–50%",
    bestScore: 89,
  },
];

const statusConfig = {
  connected: { label: "Connected", variant: "success" as const },
  configured: { label: "Configured", variant: "info" as const },
  active: { label: "Active", variant: "success" as const },
};

export const MarketplacesPage: React.FC = () => {
  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-text)]">
            <span className="gradient-text-primary">Marketplaces</span>
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Platform-specific optimization rules and requirements
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <Globe size={14} className="text-[#00C4CC]" />
          <span>6 platforms supported</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {MARKETPLACES.map((m) => (
          <GlassCard key={m.name} variant="bubble" className="p-5 hover:scale-[1.01] transition-transform">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black"
                  style={{ background: m.color }}
                >
                  {m.name.slice(0, 2)}
                </div>
                <div>
                  <div className="font-extrabold text-sm text-[var(--color-text)]">{m.name}</div>
                  <Badge variant={statusConfig[m.status as keyof typeof statusConfig].variant} size="sm">
                    {statusConfig[m.status as keyof typeof statusConfig].label}
                  </Badge>
                </div>
              </div>
              <a
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:text-[#00C4CC] hover:bg-[rgba(0,196,204,0.1)] transition-all"
              >
                <ExternalLink size={13} />
              </a>
            </div>

            {/* Limits */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { label: "Title", val: m.titleMax },
                { label: "Desc", val: m.descMax },
                { label: "Tags", val: m.tagsMax },
              ].map((l) => (
                <div key={l.label} className="text-center p-1.5 glass rounded-xl border border-[var(--color-border)]">
                  <div className="text-xs font-extrabold" style={{ color: m.color }}>{l.val}</div>
                  <div className="text-[9px] text-[var(--color-text-muted)]">{l.label} chars</div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="space-y-1 mb-3">
              {m.features.map((f) => (
                <div key={f} className="flex items-center gap-1.5 text-xs">
                  <CheckCircle2 size={11} style={{ color: m.color }} />
                  <span className="text-[var(--color-text-muted)]">{f}</span>
                </div>
              ))}
            </div>

            {/* Commission + Score */}
            <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
              <div className="text-xs">
                <span className="text-[var(--color-text-muted)]">Commission: </span>
                <span className="font-bold text-emerald-400">{m.commission}</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp size={11} className="text-[#00C4CC]" />
                <span className="font-bold text-[#00C4CC]">{m.bestScore} SEO</span>
              </div>
            </div>

            {/* Tip */}
            <div className="mt-3 p-2.5 rounded-xl bg-[rgba(0,196,204,0.05)] border border-[rgba(0,196,204,0.1)]">
              <div className="text-[9px] font-bold uppercase tracking-widest text-[#00C4CC] mb-1">Pro Tip</div>
              <p className="text-[10px] text-[var(--color-text-muted)] leading-relaxed">{m.tips}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
