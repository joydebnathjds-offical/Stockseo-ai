import React from "react";
import { GlassCard } from "../ui/GlassCard";
import { StatCard } from "../ui/StatCard";
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line,
} from "recharts";
import { BarChart3, TrendingUp, Target, Award } from "lucide-react";

const SEO_RADAR_DATA = [
  { subject: "Titles", A: 88, fullMark: 100 },
  { subject: "Descriptions", A: 82, fullMark: 100 },
  { subject: "Keywords", A: 91, fullMark: 100 },
  { subject: "Categories", A: 79, fullMark: 100 },
  { subject: "Readability", A: 85, fullMark: 100 },
  { subject: "Compliance", A: 93, fullMark: 100 },
];

const DAILY_SCORES = [
  { day: "Mon", avg: 82, best: 96, worst: 64 },
  { day: "Tue", avg: 85, best: 97, worst: 71 },
  { day: "Wed", avg: 83, best: 95, worst: 68 },
  { day: "Thu", avg: 88, best: 98, worst: 74 },
  { day: "Fri", avg: 91, best: 99, worst: 79 },
  { day: "Sat", avg: 89, best: 97, worst: 76 },
  { day: "Sun", avg: 87, best: 96, worst: 72 },
];

const MARKETPLACE_SCORES = [
  { platform: "Shutterstock", score: 91, uploads: 284 },
  { platform: "Adobe Stock", score: 88, uploads: 198 },
  { platform: "Freepik", score: 85, uploads: 156 },
  { platform: "iStock", score: 87, uploads: 122 },
  { platform: "Dreamstime", score: 82, uploads: 89 },
  { platform: "Alamy", score: 89, uploads: 67 },
];

const TOP_KEYWORDS = [
  { tag: "nature photography", count: 142, score: 94 },
  { tag: "corporate teamwork", count: 118, score: 91 },
  { tag: "digital technology", count: 96, score: 88 },
  { tag: "aerial landscape", count: 84, score: 95 },
  { tag: "food styling", count: 71, score: 87 },
  { tag: "abstract pattern", count: 63, score: 82 },
  { tag: "urban architecture", count: 59, score: 85 },
  { tag: "business meeting", count: 52, score: 90 },
];

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-5 animate-fade-up">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--color-text)]">
          <span className="gradient-text-primary">SEO Analytics</span>
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Track your optimization performance across all marketplaces
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<BarChart3 size={18} />} label="Avg SEO Score" value="88.4" trend="5.2%" trendUp glow="cyan" accentColor="#00C4CC" delay={0} />
        <StatCard icon={<TrendingUp size={18} />} label="Top Score This Week" value="99" sub="Achieved 6× this week" glow="blue" accentColor="#007BFF" delay={100} />
        <StatCard icon={<Target size={18} />} label="Compliance Rate" value="93.2%" trend="2.1%" trendUp glow="pink" accentColor="#FF4EAD" delay={200} />
        <StatCard icon={<Award size={18} />} label="Total Keywords" value="18.4K" sub="Across all images" glow="violet" accentColor="#8B5CF6" delay={300} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Score Trends */}
        <GlassCard variant="bubble" className="lg:col-span-2 p-5">
          <h2 className="font-bold text-sm text-[var(--color-text)] mb-4">Weekly Score Distribution</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DAILY_SCORES} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "12px", color: "var(--color-text)" }}
                />
                <Line type="monotone" dataKey="best" stroke="#22C55E" strokeWidth={2} dot={false} name="Best" />
                <Line type="monotone" dataKey="avg" stroke="#00C4CC" strokeWidth={2.5} dot={false} name="Average" />
                <Line type="monotone" dataKey="worst" stroke="#EF4444" strokeWidth={2} dot={false} strokeDasharray="4 2" name="Worst" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2 justify-end text-xs text-[var(--color-text-muted)]">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-400 inline-block" /> Best</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#00C4CC] inline-block" /> Average</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-rose-400 inline-block" /> Worst</span>
          </div>
        </GlassCard>

        {/* Radar Chart */}
        <GlassCard variant="bubble" className="p-5">
          <h2 className="font-bold text-sm text-[var(--color-text)] mb-2">SEO Quality Radar</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={SEO_RADAR_DATA}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: "var(--color-text-muted)" }} />
                <Radar name="SEO Score" dataKey="A" stroke="#00C4CC" fill="#00C4CC" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Marketplace Breakdown */}
      <GlassCard variant="bubble" className="p-5">
        <h2 className="font-bold text-sm text-[var(--color-text)] mb-4">Marketplace Score Breakdown</h2>
        <div className="space-y-3">
          {MARKETPLACE_SCORES.map((m) => (
            <div key={m.platform} className="flex items-center gap-4">
              <div className="text-xs font-semibold text-[var(--color-text)] w-28 flex-shrink-0">{m.platform}</div>
              <div className="flex-1 h-2.5 rounded-full bg-[var(--color-border)]">
                <div
                  className="h-2.5 rounded-full transition-all duration-700"
                  style={{
                    width: `${m.score}%`,
                    background: `linear-gradient(90deg, #00C4CC, #007BFF)`,
                  }}
                />
              </div>
              <div className="text-xs font-bold text-[#00C4CC] w-10 text-right">{m.score}</div>
              <div className="text-xs text-[var(--color-text-muted)] w-20 text-right">{m.uploads} uploads</div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Top Keywords */}
      <GlassCard variant="bubble" className="p-5">
        <h2 className="font-bold text-sm text-[var(--color-text)] mb-4">Top Performing Keywords</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {TOP_KEYWORDS.map((kw, i) => (
            <div key={kw.tag} className="flex items-center gap-3 p-2.5 glass rounded-xl border border-[var(--color-border)]">
              <div className="text-xs font-bold text-[var(--color-text-muted)] w-5 text-center">#{i + 1}</div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-[var(--color-text)]">{kw.tag}</div>
                <div className="text-[10px] text-[var(--color-text-muted)]">{kw.count} uses</div>
              </div>
              <div className={`text-xs font-bold ${kw.score >= 90 ? "text-emerald-400" : kw.score >= 80 ? "text-amber-400" : "text-rose-400"}`}>
                {kw.score}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
