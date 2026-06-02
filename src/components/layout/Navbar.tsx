import React from "react";
import { Sun, Moon, Menu, X, Sparkles, Bell, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import { TierBadge } from "../ui/Badge";
import toast from "react-hot-toast";

export const Navbar: React.FC = () => {
  const { isDark, toggleTheme, user, setUser, sidebarOpen, setSidebarOpen } = useAppStore();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (_) {}
    setUser(null);
    toast.success("Signed out successfully");
    setDropdownOpen(false);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 gap-4 transition-theme"
      style={{ background: "var(--color-nav)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--color-border)" }}
    >
      {/* Sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-glass)] transition-all"
      >
        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00C4CC] to-[#007BFF] flex items-center justify-center glow-cyan">
          <Sparkles size={14} className="text-white" />
        </div>
        <span className="font-extrabold text-sm gradient-text-primary hidden sm:block">StockSEO AI</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Credits pill */}
      {user && (
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl glass border border-[var(--color-border)] text-xs">
          <span className="text-[var(--color-text-muted)]">Credits:</span>
          <span
            className={`font-bold ${user.credits === 0 ? "text-rose-400" : user.credits < 3 ? "text-amber-400" : "text-[#00C4CC]"}`}
          >
            {user.credits.toLocaleString()}
          </span>
          {!user.isAdmin && (
            <span className="text-[var(--color-text-muted)]">/ {user.creditsCap}</span>
          )}
        </div>
      )}

      {/* Notifications */}
      <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-glass)] transition-all">
        <Bell size={16} />
        <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#FF4EAD] rounded-full" />
      </button>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-glass)] transition-all"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* User Dropdown */}
      {user && (
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded-xl glass border border-[var(--color-border)] hover:border-[#00C4CC]/30 transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00C4CC] to-[#007BFF] flex items-center justify-center text-white text-xs font-bold overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
              ) : (
                user.displayName.charAt(0).toUpperCase()
              )}
            </div>
            <span className="hidden md:block text-xs font-semibold text-[var(--color-text)] max-w-[100px] truncate">
              {user.displayName}
            </span>
            <ChevronDown size={12} className="text-[var(--color-text-muted)]" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 glass-strong rounded-2xl border border-[var(--color-glass-border)] shadow-xl overflow-hidden z-50 animate-fade-up">
              <div className="p-3 border-b border-[var(--color-border)]">
                <div className="font-semibold text-sm text-[var(--color-text)] truncate">{user.displayName}</div>
                <div className="text-xs text-[var(--color-text-muted)] truncate">{user.email}</div>
                <div className="mt-2">
                  <TierBadge tier={user.tier} />
                </div>
              </div>
              <div className="p-1">
                {[
                  { icon: <User size={14} />, label: "Profile", action: () => setDropdownOpen(false) },
                  { icon: <Settings size={14} />, label: "Settings", action: () => setDropdownOpen(false) },
                  { icon: <LogOut size={14} />, label: "Sign Out", action: handleLogout, danger: true },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      item.danger
                        ? "text-rose-400 hover:bg-rose-500/10"
                        : "text-[var(--color-text)] hover:bg-[var(--color-glass)]"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
