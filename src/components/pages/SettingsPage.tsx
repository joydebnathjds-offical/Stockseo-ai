import React, { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/Button";
import { TierBadge } from "../ui/Badge";
import toast from "react-hot-toast";
import {
  Sun, Moon, Bell, Shield, User, Palette,
  Monitor, Check, Globe,
} from "lucide-react";

export const SettingsPage: React.FC = () => {
  const { user, isDark, toggleTheme } = useAppStore();
  const [notifications, setNotifications] = useState({
    credits: true,
    generation: true,
    updates: false,
    marketing: false,
  });

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications((p) => ({ ...p, [key]: !p[key] }));
    toast.success("Preference saved");
  };

  return (
    <div className="space-y-5 animate-fade-up max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--color-text)]">
          <span className="gradient-text-primary">Settings</span>
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">Manage your account preferences</p>
      </div>

      {/* Profile */}
      <GlassCard variant="bubble" className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <User size={16} className="text-[#00C4CC]" />
          <h2 className="font-bold text-sm text-[var(--color-text)]">Profile</h2>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00C4CC] to-[#007BFF] flex items-center justify-center text-2xl font-black text-white">
            {user?.displayName?.charAt(0) || "U"}
          </div>
          <div>
            <div className="font-bold text-[var(--color-text)]">{user?.displayName}</div>
            <div className="text-sm text-[var(--color-text-muted)]">{user?.email}</div>
            <div className="mt-1"><TierBadge tier={user?.tier || "BASIC"} /></div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: "Display Name", val: user?.displayName || "" },
            { label: "Email", val: user?.email || "" },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] mb-1 block uppercase tracking-wide">{f.label}</label>
              <input
                defaultValue={f.val}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--color-input)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[#00C4CC]/50"
              />
            </div>
          ))}
        </div>
        <Button variant="primary" size="sm" className="mt-3" onClick={() => toast.success("Profile updated!")}>
          Save Changes
        </Button>
      </GlassCard>

      {/* Theme */}
      <GlassCard variant="bubble" className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Palette size={16} className="text-[#8B5CF6]" />
          <h2 className="font-bold text-sm text-[var(--color-text)]">Appearance</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Light Mode", icon: <Sun size={16} />, active: !isDark },
            { label: "Dark Mode", icon: <Moon size={16} />, active: isDark },
          ].map((t) => (
            <button
              key={t.label}
              onClick={toggleTheme}
              className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-sm font-semibold ${
                t.active
                  ? "border-[#00C4CC]/50 bg-[rgba(0,196,204,0.1)] text-[#00C4CC]"
                  : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[#00C4CC]/30"
              }`}
            >
              {t.icon}
              {t.label}
              {t.active && <Check size={13} className="ml-auto" />}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Notifications */}
      <GlassCard variant="bubble" className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} className="text-[#FF4EAD]" />
          <h2 className="font-bold text-sm text-[var(--color-text)]">Notifications</h2>
        </div>
        <div className="space-y-3">
          {[
            { key: "credits" as const, label: "Low credits warning", desc: "Alert when credits fall below 5" },
            { key: "generation" as const, label: "Generation complete", desc: "Notify when AI processing finishes" },
            { key: "updates" as const, label: "Feature updates", desc: "New features and improvements" },
            { key: "marketing" as const, label: "Promotional emails", desc: "Offers and special deals" },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between py-1">
              <div>
                <div className="text-xs font-semibold text-[var(--color-text)]">{n.label}</div>
                <div className="text-[10px] text-[var(--color-text-muted)]">{n.desc}</div>
              </div>
              <button
                onClick={() => toggleNotif(n.key)}
                className={`w-10 h-5 rounded-full transition-all relative ${
                  notifications[n.key] ? "bg-[#00C4CC]" : "bg-[var(--color-border)]"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                    notifications[n.key] ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Security */}
      <GlassCard variant="bubble" className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} className="text-[#007BFF]" />
          <h2 className="font-bold text-sm text-[var(--color-text)]">Security</h2>
        </div>
        <div className="space-y-2">
          <Button variant="secondary" size="sm" className="w-full justify-start" onClick={() => toast.success("Password reset email sent!")}>
            Change Password
          </Button>
          <Button variant="secondary" size="sm" className="w-full justify-start" onClick={() => toast("2FA coming soon!")}>
            Enable Two-Factor Authentication
          </Button>
          <Button variant="danger" size="sm" className="w-full justify-start" onClick={() => toast.error("Account deletion requires email confirmation")}>
            Delete Account
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};
