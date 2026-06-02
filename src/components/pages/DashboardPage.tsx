import React from "react";
import { useAppStore } from "../../store/useAppStore";
import { StatCard } from "../ui/StatCard";
import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/Button";
import { TierBadge } from "../ui/Badge";
import {
  Image as ImageIcon, TrendingUp, Star, Zap, ArrowRight,
  CheckCircle2, Clock, AlertCircle, BarChart3, Globe,
  Layers, Sparkles,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ACTIVITY_DATA = [
  { date: "Jan 10", score: 72, images: 12 },
  { date: "Jan 11", score: 78, images: 18 },
  { date: "Jan 12", score: 75, images: 9 },
  { date: "Jan 13", score: 83, images: 24 },
  { date: "Jan 14", score: 88, images: 31 },
  { date: "Jan 15", score: 91, images: 28 },
  { date: "Jan 16", score: 86, images: 22 },
];

const RECENT_ASSETS = [
  { name: "mountain_landscape_4k.jpg", score: 94, status: "done", time: "2m ago", tags: 45, category: "Nature & Wildlife" },
  { name: "corporate_team_meeting.jpg", score: 88, status: "done", time: "15m ago", tags: 40, category: "Business & Finance" },
  { name: "abstract_tech_background.png", score: 76, status: "done", time: "1h ago", tags: 38, category: "Technology" },
  { name: "street_food_vendor.jpg", score: 91, status: "done", time: "3h ago", tags: 42, category: "Food & Beverage" },
  { name: "urban_architecture.webp", score: 0, status: "processing", time: "now", tags: 0, category: "Architecture" },
];

const PLATFORM_STATS = [
  { name: "Shutterstock", color: "#EE2626", uploads: 284, revenue: "$1,240", score: 91 },
  { name: "Adobe Stock", color: "#FF0000", uploads: 198, revenue: "$890", score: 88 },
  { name: "Freepik", color: "#1DB954", uploads: 156, revenue: "$420", score: 85 },
  { name: "iStock", color: "#000099", uploads: 122, revenue: "$680", score: 87 },
  { name: "Dreamstime", color: "#0052CC", uploads: 89, revenue: "$310", score: 82 },
  { name: "Alamy", color: "#FF6B00", uploads: 67, revenue: "$540", score: 89 },
];

const statusIcon = (s: string) =>
  s === "done" ? <CheckCircle2 size={14} className="text-emerald-400" /> :
  s === "processing" ? <Clock size={14} className="text-amber-400 animate-spin" /> :
  <AlertCircle size={14} className="text-rose-400" />;

const scoreColor = (s: number) =>
  s >= 90 ? "text-emerald-400" : s >= 75 ? "text-amber-400" : "text-rose-400";

export const DashboardPage: React.FC = () => {
  const { user, setActiveTab } = useAppStore();

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-text)]">
            Welcome back, <span className="gradient-text-primary">{user?.displayName?.split(" ")[0] || "Contributor"}</span> 👋
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            Your stock media SEO performance at a glance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TierBadge tier={user?.tier || "BASIC"} />
          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveTab("workspace")}
            icon={<Sparkles size={14} />}
            glow
          >
            New Generation
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<ImageIcon size={18} />}
          label="Images Processed"
          value={user?.imagesProcessed?.toString() || "0"}
          trend="23%"
          trendUp
          glow="cyan"
          accentColor="#00C4CC"
          delay={0}
        />
        <StatCard
          icon={<BarChart3 size={18} />}
          label="Avg SEO Score"
          value="88.4"
          sub="Last 30 days"
          trend="5.2"
          trendUp
          glow="blue"
          accentColor="#007BFF"
          delay={100}
        />
        <StatCard
          icon={<Star size={18} />}
          label="Platform Rating"
          value="4.9/5"
          sub="Across all markets"
          trend="0.2"
          trendUp
          glow="pink"
          accentColor="#FF4EAD"
          delay={200}
        />
        <StatCard
          icon={<Zap size={18} />}
          label="AI Credits Left"
          value={user?.credits?.toString() || "0"}
          sub={user?.isAdmin ? "Unlimited" : `of ${user?.creditsCap}`}
          accentColor="#8B5CF6"
          glow="violet"
          delay={300}
        />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Activity Chart */}
        <GlassCard variant="bubble" className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-sm text-[var(--color-text)]">SEO Performance</h2>
              <p className="text-xs text-[var(--color-text-muted)]">Score trends & image activity</p>
            </div>
            <div className="flex gap-3 text-xs text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00C4CC]" />Score</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FF4EAD]" />Images</span>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ACTIVITY_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C4CC" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00C4CC" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="imgGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4EAD" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF4EAD" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "var(--color-text)",
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="#00C4CC" strokeWidth={2} fill="url(#scoreGrad)" />
                <Area type="monotone" dataKey="images" stroke="#FF4EAD" strokeWidth={2} fill="url(#imgGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard variant="bubble" className="p-5">
          <h2 className="font-bold text-sm text-[var(--color-text)] mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "Upload & Optimize Image", icon: <ImageIcon size={14} />, tab: "workspace", color: "#00C4CC" },
              { label: "View SEO Analytics", icon: <TrendingUp size={14} />, tab: "analytics", color: "#007BFF" },
              { label: "Manage AI Engine Keys", icon: <Zap size={14} />, tab: "api-keys", color: "#8B5CF6" },
              { label: "Bulk Process Images", icon: <Layers size={14} />, tab: "bulk", color: "#FF4EAD" },
              { label: "Configure Marketplaces", icon: <Globe size={14} />, tab: "marketplaces", color: "#F97316" },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => setActiveTab(action.tab)}
                className="w-full flex items-center gap-3 p-3 rounded-xl glass hover:border-[var(--color-primary)]/30 border border-transparent transition-all group text-left"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${action.color}20`, color: action.color }}
                >
                  {action.icon}
                </div>
                <span className="text-xs font-medium text-[var(--color-text)] flex-1">{action.label}</span>
                <ArrowRight size={12} className="text-[var(--color-text-muted)] group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Recent Assets */}
      <GlassCard variant="bubble" className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-sm text-[var(--color-text)]">Recent Generations</h2>
          <Button variant="ghost" size="xs" onClick={() => setActiveTab("workspace")}>
            View All →
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {["File", "Category", "Tags", "SEO Score", "Status", "Time"].map((h) => (
                  <th key={h} className="pb-2 text-left font-semibold text-[var(--color-text-muted)] pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]/50">
              {RECENT_ASSETS.map((asset) => (
                <tr key={asset.name} className="hover:bg-[var(--color-glass)] transition-colors">
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00C4CC]/20 to-[#007BFF]/20 flex items-center justify-center">
                        <ImageIcon size={12} className="text-[#00C4CC]" />
                      </div>
                      <span className="font-medium text-[var(--color-text)] max-w-[160px] truncate">{asset.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-4 text-[var(--color-text-muted)]">{asset.category}</td>
                  <td className="py-2.5 pr-4 text-[var(--color-text-muted)]">{asset.tags || "—"}</td>
                  <td className="py-2.5 pr-4">
                    <span className={`font-bold ${scoreColor(asset.score)}`}>
                      {asset.score > 0 ? asset.score : "—"}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-1">
                      {statusIcon(asset.status)}
                      <span className="capitalize text-[var(--color-text-muted)]">{asset.status}</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-[var(--color-text-muted)]">{asset.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Platform Performance */}
      <GlassCard variant="bubble" className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-sm text-[var(--color-text)]">Marketplace Performance</h2>
          <Button variant="ghost" size="xs" onClick={() => setActiveTab("marketplaces")}>
            Configure →
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PLATFORM_STATS.map((p) => (
            <div key={p.name} className="p-3 rounded-xl glass border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                  <span className="text-xs font-bold text-[var(--color-text)]">{p.name}</span>
                </div>
                <span className={`text-xs font-bold ${scoreColor(p.score)}`}>{p.score}</span>
              </div>
              <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
                <span>{p.uploads} uploads</span>
                <span className="font-semibold text-emerald-400">{p.revenue}</span>
              </div>
              <div className="mt-2 h-1 rounded-full bg-[var(--color-border)]">
                <div
                  className="h-1 rounded-full transition-all"
                  style={{ width: `${p.score}%`, background: p.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
