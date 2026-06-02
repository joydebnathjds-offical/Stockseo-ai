import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase";
import { useAppStore, UserProfile } from "../../store/useAppStore";
import { Button } from "../ui/Button";
import { GlassCard } from "../ui/GlassCard";
import toast from "react-hot-toast";
import {
  Eye, EyeOff, Mail, Lock, User, Sparkles,
  BarChart3, Zap, Globe, TrendingUp,
} from "lucide-react";

/* ─── SUPER ADMIN CREDENTIALS ────────────────────────────────────────────── */
const ADMIN_EMAIL = "emotionalboy5904@gmail.com";
const ADMIN_PASSWORD = "Qwerasdf1234@#";

/* ─── HELPER: BUILD USER PROFILE ─────────────────────────────────────────── */
const buildProfile = (
  uid: string,
  email: string,
  displayName: string,
  photoURL?: string
): UserProfile => {
  const isAdmin = email === ADMIN_EMAIL;
  return {
    uid,
    email,
    displayName: displayName || email.split("@")[0],
    photoURL,
    tier: isAdmin ? "ENTERPRISE" : "BASIC",
    credits: isAdmin ? 99999 : 10,
    creditsCap: isAdmin ? 99999 : 10,
    isAdmin,
    joinedAt: new Date().toISOString(),
    imagesProcessed: isAdmin ? 0 : 0,
    apiKeys: {} as UserProfile["apiKeys"],
  };
};

/* ─── FEATURE HIGHLIGHTS ──────────────────────────────────────────────────── */
const features = [
  { icon: <Sparkles size={16} />, text: "AI-Powered SEO Metadata Generation" },
  { icon: <BarChart3 size={16} />, text: "Real-time SEO Score Analytics" },
  { icon: <Globe size={16} />, text: "6 Major Marketplace Optimization" },
  { icon: <TrendingUp size={16} />, text: "Bulk Processing & Batch Upload" },
  { icon: <Zap size={16} />, text: "Gemini, GPT-5, Grok AI Engines" },
];

/* ─── MAIN AUTH COMPONENT ────────────────────────────────────────────────── */
export const AuthPage: React.FC = () => {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const { setUser } = useAppStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === "signup") {
        if (!form.fullName.trim()) {
          toast.error("Full name is required");
          setLoading(false);
          return;
        }
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await updateProfile(cred.user, { displayName: form.fullName });
        const profile = buildProfile(cred.user.uid, form.email, form.fullName, cred.user.photoURL ?? undefined);
        setUser(profile);
        toast.success(`Welcome to StockSEO AI, ${form.fullName}! 🎉`);
      } else {
        /* ── Admin override check ── */
        if (form.email === ADMIN_EMAIL && form.password === ADMIN_PASSWORD) {
          try {
            const cred = await signInWithEmailAndPassword(auth, form.email, form.password);
            const profile = buildProfile(cred.user.uid, form.email, cred.user.displayName || "Super Admin", cred.user.photoURL ?? undefined);
            setUser(profile);
          } catch {
            // Firebase account might not exist — create mock admin session
            const profile = buildProfile("admin_mock_uid", ADMIN_EMAIL, "Super Admin");
            setUser(profile);
          }
          toast.success("Admin access granted 🔐");
        } else {
          const cred = await signInWithEmailAndPassword(auth, form.email, form.password);
          const profile = buildProfile(
            cred.user.uid,
            form.email,
            cred.user.displayName || "",
            cred.user.photoURL ?? undefined
          );
          setUser(profile);
          toast.success("Welcome back! 👋");
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      if (msg.includes("user-not-found") || msg.includes("wrong-password") || msg.includes("invalid-credential")) {
        toast.error("Invalid email or password");
      } else if (msg.includes("email-already-in-use")) {
        toast.error("Email already registered — Sign in instead");
      } else if (msg.includes("weak-password")) {
        toast.error("Password must be at least 6 characters");
      } else {
        // Allow demo login for dev/preview environment
        const profile = buildProfile(`uid_${Date.now()}`, form.email, form.fullName || form.email.split("@")[0]);
        setUser(profile);
        toast.success("Signed in (demo mode) 🚀");
      }
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { user } = result;
      const profile = buildProfile(
        user.uid,
        user.email || "",
        user.displayName || "",
        user.photoURL ?? undefined
      );
      setUser(profile);
      toast.success(`Welcome, ${user.displayName || "Contributor"}! 🎉`);
    } catch {
      toast.error("Google sign-in failed. Try email instead.");
    }
    setGoogleLoading(false);
  };

  return (
    <div className="min-h-screen mesh-bg flex items-stretch">
      {/* ── Left Panel: Branding ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-10 relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-gradient-to-r from-[#00C4CC]/20 to-[#007BFF]/10 blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full bg-gradient-to-r from-[#FF4EAD]/15 to-[#8B5CF6]/10 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00C4CC] to-[#007BFF] flex items-center justify-center glow-cyan">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-xl font-extrabold gradient-text-primary">StockSEO AI</span>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-widest">
            Next-Gen Stock Media Optimization
          </p>
        </div>

        {/* Main Headline */}
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight">
            Maximize Your{" "}
            <span className="gradient-text-primary">Stock Media</span>{" "}
            Earnings with{" "}
            <span className="gradient-text-neon">AI-Powered SEO</span>
          </h1>
          <p className="text-[var(--color-text-muted)] text-lg leading-relaxed max-w-md">
            Automate metadata generation for Shutterstock, Adobe Stock, Freepik, iStock, Dreamstime & Alamy — achieving 88%+ SEO scores in seconds.
          </p>

          {/* Feature List */}
          <div className="space-y-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00C4CC]/20 to-[#007BFF]/20 flex items-center justify-center text-[#00C4CC]">
                  {f.icon}
                </div>
                <span className="text-sm font-medium text-[var(--color-text)]">{f.text}</span>
              </div>
            ))}
          </div>

          {/* Stats Row */}
          <div className="flex gap-6 pt-2">
            {[
              { val: "2.4M+", lbl: "Images Processed" },
              { val: "12K+", lbl: "Contributors" },
              { val: "88.4", lbl: "Avg SEO Score" },
            ].map((s) => (
              <div key={s.lbl}>
                <div className="text-2xl font-extrabold gradient-text-primary">{s.val}</div>
                <div className="text-xs text-[var(--color-text-muted)]">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-[var(--color-text-muted)]">
          © 2025 StockSEO AI. All rights reserved.
        </div>
      </div>

      {/* ── Right Panel: Auth Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 py-12">
        <GlassCard variant="strong" className="w-full max-w-md p-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00C4CC] to-[#007BFF] flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-extrabold gradient-text-primary">StockSEO AI</span>
          </div>

          {/* Tab Switcher */}
          <div className="flex glass rounded-xl p-1 mb-6">
            {(["signin", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  tab === t
                    ? "bg-gradient-to-r from-[#00C4CC] to-[#007BFF] text-white shadow-md"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                {t === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <h2 className="text-xl font-extrabold mb-1 text-[var(--color-text)]">
            {tab === "signin" ? "Welcome back 👋" : "Join StockSEO AI ✨"}
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">
            {tab === "signin"
              ? "Sign in to your contributor dashboard"
              : "Start optimizing your stock media for free"}
          </p>

          {/* Google Button */}
          <Button
            variant="glass"
            size="lg"
            className="w-full mb-4 border border-[var(--color-border)]"
            loading={googleLoading}
            onClick={handleGoogle}
            icon={
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
                <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z" />
                <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z" />
                <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
              </svg>
            }
          >
            Continue with Google
          </Button>

          <div className="relative flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[var(--color-border)]" />
            <span className="text-xs text-[var(--color-text-muted)]">or with email</span>
            <div className="flex-1 h-px bg-[var(--color-border)]" />
          </div>

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {tab === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input
                    name="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Alex Rodriguez"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[var(--color-input)] border border-[var(--color-border)] text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[#00C4CC]/60 focus:ring-2 focus:ring-[#00C4CC]/20 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[var(--color-input)] border border-[var(--color-border)] text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[#00C4CC]/60 focus:ring-2 focus:ring-[#00C4CC]/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder={tab === "signup" ? "Min 6 characters" : "Your password"}
                  required
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[var(--color-input)] border border-[var(--color-border)] text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[#00C4CC]/60 focus:ring-2 focus:ring-[#00C4CC]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={loading}
              glow
            >
              {tab === "signin" ? "Sign In →" : "Create Free Account →"}
            </Button>
          </form>

          {/* Demo hint */}
          {tab === "signin" && (
            <div className="mt-4 p-3 rounded-xl bg-[rgba(0,196,204,0.08)] border border-[rgba(0,196,204,0.2)] text-xs text-[var(--color-text-muted)]">
              <span className="font-semibold text-[#00C4CC]">Demo:</span> Enter any email & password to explore as a contributor, or use admin credentials for full access.
            </div>
          )}

          <p className="text-center text-xs text-[var(--color-text-muted)] mt-4">
            {tab === "signin" ? "No account? " : "Already have one? "}
            <button
              onClick={() => setTab(tab === "signin" ? "signup" : "signin")}
              className="text-[#00C4CC] font-semibold hover:underline"
            >
              {tab === "signin" ? "Create free account" : "Sign in"}
            </button>
          </p>
        </GlassCard>
      </div>
    </div>
  );
};
