import React, { useState } from "react";
import { useAppStore, UserTier, AdminUser } from "../../store/useAppStore";
import { GlassCard } from "../ui/GlassCard";
import { Badge, TierBadge } from "../ui/Badge";
import { StatCard } from "../ui/StatCard";
import toast from "react-hot-toast";
import {
  Shield, Users, Search, Edit3, Check, X,
  Plus, Minus, RotateCcw, ChevronDown, BarChart3,
  Star, Image as ImageIcon,
  Activity, Clock, Database,
} from "lucide-react";
import { cn } from "../../utils/cn";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";

const TIERS: UserTier[] = ["BASIC", "PRO", "PREMIUM", "ENTERPRISE"];

const TIER_COLORS = {
  BASIC: "#64748b",
  PRO: "#3B82F6",
  PREMIUM: "#FF4EAD",
  ENTERPRISE: "#8B5CF6",
};

const GROWTH_DATA = [
  { month: "Aug", users: 4200, images: 180000, revenue: 12400 },
  { month: "Sep", users: 6800, images: 290000, revenue: 18900 },
  { month: "Oct", users: 8200, images: 420000, revenue: 24200 },
  { month: "Nov", users: 9600, images: 580000, revenue: 31800 },
  { month: "Dec", users: 11200, images: 760000, revenue: 42100 },
  { month: "Jan", users: 12400, images: 980000, revenue: 51600 },
];

const TIER_DISTRIBUTION = [
  { name: "Basic", value: 7200, color: "#64748b" },
  { name: "Pro", value: 3400, color: "#3B82F6" },
  { name: "Premium", value: 1400, color: "#FF4EAD" },
  { name: "Enterprise", value: 400, color: "#8B5CF6" },
];

/* ─── EDITABLE CREDIT CELL ───────────────────────────────────────────────── */
const CreditCell: React.FC<{
  uid: string;
  credits: number;
  creditsCap: number;
  onUpdate: (uid: string, patch: Partial<AdminUser>) => void;
}> = ({ uid, credits, creditsCap, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(credits);

  const apply = () => {
    onUpdate(uid, { credits: val });
    setEditing(false);
    toast.success("Credits updated!");
  };

  return (
    <div className="flex items-center gap-1.5">
      {editing ? (
        <>
          <input
            type="number"
            value={val}
            onChange={(e) => setVal(Number(e.target.value))}
            className="w-20 text-xs px-2 py-1 rounded-lg bg-[var(--color-input)] border border-[#00C4CC]/50 text-[var(--color-text)] focus:outline-none"
            min={0}
          />
          <button onClick={apply} className="text-emerald-400 hover:text-emerald-300 transition-colors">
            <Check size={12} />
          </button>
          <button onClick={() => { setEditing(false); setVal(credits); }} className="text-[var(--color-text-muted)] hover:text-rose-400 transition-colors">
            <X size={12} />
          </button>
        </>
      ) : (
        <>
          <span className={cn("text-xs font-bold", credits === 0 ? "text-rose-400" : credits < 10 ? "text-amber-400" : "text-[#00C4CC]")}>
            {credits.toLocaleString()}
          </span>
          <span className="text-[10px] text-[var(--color-text-muted)]">/ {creditsCap.toLocaleString()}</span>
          <div className="flex gap-0.5 ml-1">
            <button
              onClick={() => onUpdate(uid, { credits: credits + 100 })}
              className="w-4 h-4 flex items-center justify-center rounded text-emerald-400 hover:bg-emerald-500/10 transition-colors"
              title="Add 100 credits"
            >
              <Plus size={9} />
            </button>
            <button
              onClick={() => onUpdate(uid, { credits: Math.max(0, credits - 100) })}
              className="w-4 h-4 flex items-center justify-center rounded text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Remove 100 credits"
            >
              <Minus size={9} />
            </button>
            <button
              onClick={() => onUpdate(uid, { credits: 0 })}
              className="w-4 h-4 flex items-center justify-center rounded text-amber-400 hover:bg-amber-500/10 transition-colors"
              title="Reset to zero"
            >
              <RotateCcw size={9} />
            </button>
            <button
              onClick={() => setEditing(true)}
              className="w-4 h-4 flex items-center justify-center rounded text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-glass)] transition-colors"
              title="Custom amount"
            >
              <Edit3 size={9} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

/* ─── TIER SELECTOR ──────────────────────────────────────────────────────── */
const TierSelector: React.FC<{
  uid: string;
  currentTier: UserTier;
  onUpdate: (uid: string, patch: Partial<AdminUser>) => void;
}> = ({ uid, currentTier, onUpdate }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg glass border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 transition-all"
      >
        <TierBadge tier={currentTier} />
        <ChevronDown size={10} className="text-[var(--color-text-muted)]" />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 w-36 glass-strong rounded-xl border border-[var(--color-glass-border)] shadow-xl z-50 overflow-hidden animate-fade-up">
          {TIERS.map((tier) => (
            <button
              key={tier}
              onClick={() => {
                onUpdate(uid, {
                  tier,
                  creditsCap: tier === "BASIC" ? 10 : tier === "PRO" ? 500 : tier === "PREMIUM" ? 1000 : 5000,
                });
                toast.success(`Tier updated to ${tier}`);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-[var(--color-glass)] transition-colors"
            >
              <div className="w-2 h-2 rounded-full" style={{ background: TIER_COLORS[tier] }} />
              <span className="text-[var(--color-text)]">{tier}</span>
              {tier === currentTier && <Check size={10} className="ml-auto text-[#00C4CC]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── ADMIN PAGE ─────────────────────────────────────────────────────────── */
export const AdminPage: React.FC = () => {
  const { adminUsers, updateAdminUser, activeTab } = useAppStore();
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<UserTier | "ALL">("ALL");

  const filtered = adminUsers.filter((u) => {
    const matchSearch =
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchTier = tierFilter === "ALL" || u.tier === tierFilter;
    return matchSearch && matchTier;
  });

  if (activeTab === "admin-analytics") {
    return <AdminAnalyticsPage />;
  }

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF4EAD]/20 to-[#8B5CF6]/20 flex items-center justify-center">
          <Shield size={20} className="text-[#FF4EAD]" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">
            <span className="gradient-text-neon">Admin Console</span>
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Full system control & user management
          </p>
        </div>
        <div className="ml-auto">
          <Badge variant="neon" size="md">⚡ SUPER ADMIN</Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users size={18} />} label="Total Users" value="12,400" trend="18%" trendUp glow="pink" accentColor="#FF4EAD" delay={0} />
        <StatCard icon={<ImageIcon size={18} />} label="Images Processed" value="2.4M+" trend="32%" trendUp glow="cyan" accentColor="#00C4CC" delay={100} />
        <StatCard icon={<BarChart3 size={18} />} label="Avg SEO Score" value="88.4" trend="5.1" trendUp glow="blue" accentColor="#007BFF" delay={200} />
        <StatCard icon={<Star size={18} />} label="Rating" value="4.9/5" sub="From 12K+ reviews" glow="violet" accentColor="#8B5CF6" delay={300} />
      </div>

      {/* User Management Table */}
      <GlassCard variant="bubble" className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-[#FF4EAD]" />
            <h2 className="font-bold text-sm text-[var(--color-text)]">User Management</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#FF4EAD]/15 text-[#FF4EAD] font-semibold">
              {adminUsers.length} users
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Search */}
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[var(--color-input)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[#FF4EAD]/40 w-44"
              />
            </div>

            {/* Tier Filter */}
            <div className="flex items-center gap-1">
              {(["ALL", ...TIERS] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTierFilter(t)}
                  className={cn(
                    "text-[9px] font-bold px-2 py-1 rounded-lg transition-all",
                    tierFilter === t
                      ? "bg-[#FF4EAD]/20 text-[#FF4EAD] border border-[#FF4EAD]/30"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-glass)]"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {["User", "Tier", "Credits", "Images", "Joined", "Last Active"].map((h) => (
                  <th key={h} className="pb-2 text-left font-semibold text-[var(--color-text-muted)] pr-4 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]/40">
              {filtered.map((user) => (
                <tr key={user.uid} className="hover:bg-[var(--color-glass)] transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: TIER_COLORS[user.tier] }}
                      >
                        {user.displayName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-[var(--color-text)]">{user.displayName}</div>
                        <div className="text-[10px] text-[var(--color-text-muted)]">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <TierSelector uid={user.uid} currentTier={user.tier} onUpdate={updateAdminUser} />
                  </td>
                  <td className="py-3 pr-4">
                    <CreditCell
                      uid={user.uid}
                      credits={user.credits}
                      creditsCap={user.creditsCap}
                      onUpdate={updateAdminUser}
                    />
                  </td>
                  <td className="py-3 pr-4 text-[var(--color-text-muted)]">
                    {user.imagesProcessed.toLocaleString()}
                  </td>
                  <td className="py-3 pr-4 text-[var(--color-text-muted)]">{user.joinedAt}</td>
                  <td className="py-3 text-[var(--color-text-muted)]">{user.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-[var(--color-text-muted)] text-sm">
              No users match your search
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

/* ─── ADMIN ANALYTICS SUB-PAGE ───────────────────────────────────────────── */
const AdminAnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF4EAD]/20 to-[#8B5CF6]/20 flex items-center justify-center">
          <BarChart3 size={20} className="text-[#FF4EAD]" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold"><span className="gradient-text-neon">SaaS Analytics</span></h1>
          <p className="text-sm text-[var(--color-text-muted)]">Platform performance overview</p>
        </div>
      </div>

      {/* Big Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <ImageIcon size={20} />, val: "2.4M+", lbl: "Images Processed", color: "#00C4CC", glow: "cyan" as const, trend: "32%", up: true },
          { icon: <Users size={20} />, val: "12K+", lbl: "Active Contributors", color: "#FF4EAD", glow: "pink" as const, trend: "18%", up: true },
          { icon: <BarChart3 size={20} />, val: "88.4", lbl: "Average SEO Score", color: "#007BFF", glow: "blue" as const, trend: "5.1", up: true },
          { icon: <Star size={20} />, val: "4.9/5", lbl: "Product Rating", color: "#8B5CF6", glow: "violet" as const, trend: "0.2", up: true },
        ].map((s, i) => (
          <StatCard key={s.lbl} icon={s.icon} value={s.val} label={s.lbl} accentColor={s.color} glow={s.glow} trend={s.trend} trendUp={s.up} delay={i * 100} />
        ))}
      </div>

      {/* Growth Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <GlassCard variant="bubble" className="p-5">
          <h3 className="font-bold text-sm text-[var(--color-text)] mb-4">User Growth</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={GROWTH_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4EAD" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF4EAD" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="users" stroke="#FF4EAD" strokeWidth={2} fill="url(#usersGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard variant="bubble" className="p-5">
          <h3 className="font-bold text-sm text-[var(--color-text)] mb-4">Tier Distribution</h3>
          <div className="flex items-center gap-4">
            <div className="h-48 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={TIER_DISTRIBUTION} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {TIER_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {TIER_DISTRIBUTION.map((t) => (
                <div key={t.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
                  <span className="text-[var(--color-text-muted)]">{t.name}</span>
                  <span className="font-bold text-[var(--color-text)] ml-auto">{t.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="bubble" className="p-5">
          <h3 className="font-bold text-sm text-[var(--color-text)] mb-4">Images Processed / Month</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={GROWTH_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "12px" }} />
                <Bar dataKey="images" fill="url(#barGrad)" radius={[4, 4, 0, 0]}>
                  {GROWTH_DATA.map((_, i) => (
                    <Cell key={i} fill={`hsl(${188 + i * 10}, 80%, ${50 + i * 3}%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard variant="bubble" className="p-5">
          <h3 className="font-bold text-sm text-[var(--color-text)] mb-4">Revenue Growth (MRR)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={GROWTH_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "12px" }} formatter={(v) => [`$${Number(v).toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* System Health */}
      <GlassCard variant="bubble" className="p-5">
        <h3 className="font-bold text-sm text-[var(--color-text)] mb-4">System Health</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: "API Uptime", val: "99.97%", icon: <Activity size={16} />, color: "#22C55E" },
            { label: "Avg Generation Time", val: "2.1s", icon: <Clock size={16} />, color: "#00C4CC" },
            { label: "DB Storage Used", val: "84.2 GB", icon: <Database size={16} />, color: "#8B5CF6" },
          ].map((item) => (
            <div key={item.label} className="p-4 glass rounded-2xl border border-[var(--color-border)]">
              <div className="flex items-center gap-2 mb-1" style={{ color: item.color }}>
                {item.icon}
                <span className="text-xs font-semibold text-[var(--color-text-muted)]">{item.label}</span>
              </div>
              <div className="text-xl font-extrabold" style={{ color: item.color }}>{item.val}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
