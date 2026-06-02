import React from "react";
import {
  LayoutDashboard, Upload, BarChart3, Settings, Shield,
  ChevronRight, Zap, Globe, Star, Users,
  Image as ImageIcon, CreditCard, HelpCircle,
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { cn } from "../../utils/cn";
import { TierBadge } from "../ui/Badge";

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  adminOnly: boolean;
  badge?: string;
}
interface NavGroup {
  group: string;
  adminGroup?: boolean;
  items: NavItem[];
}

const NAV_ITEMS: NavGroup[] = [
  {
    group: "Main",
    items: [
      { id: "dashboard", icon: <LayoutDashboard size={17} />, label: "Dashboard", adminOnly: false },
      { id: "workspace", icon: <Upload size={17} />, label: "AI Workspace", adminOnly: false, badge: "NEW" },
      { id: "analytics", icon: <BarChart3 size={17} />, label: "SEO Analytics", adminOnly: false },
    ],
  },
  {
    group: "Tools",
    items: [
      { id: "bulk", icon: <ImageIcon size={17} />, label: "Bulk Processor", adminOnly: false, badge: "PRO" },
      { id: "marketplaces", icon: <Globe size={17} />, label: "Marketplaces", adminOnly: false },
      { id: "api-keys", icon: <Zap size={17} />, label: "AI Engine Keys", adminOnly: false },
    ],
  },
  {
    group: "Admin",
    adminGroup: true,
    items: [
      { id: "admin", icon: <Shield size={17} />, label: "Admin Console", adminOnly: true },
      { id: "admin-users", icon: <Users size={17} />, label: "User Management", adminOnly: true },
      { id: "admin-analytics", icon: <Star size={17} />, label: "SaaS Analytics", adminOnly: true },
    ],
  },
  {
    group: "Account",
    items: [
      { id: "billing", icon: <CreditCard size={17} />, label: "Billing & Plans", adminOnly: false },
      { id: "settings", icon: <Settings size={17} />, label: "Settings", adminOnly: false },
      { id: "help", icon: <HelpCircle size={17} />, label: "Help Center", adminOnly: false },
    ],
  },
];

const MARKETPLACES = [
  { name: "Shutterstock", color: "#EE2626" },
  { name: "Adobe Stock", color: "#FF0000" },
  { name: "Freepik", color: "#1DB954" },
  { name: "iStock", color: "#000000" },
  { name: "Dreamstime", color: "#0052CC" },
  { name: "Alamy", color: "#FF6B00" },
];

export const Sidebar: React.FC = () => {
  const { sidebarOpen, activeTab, setActiveTab, user } = useAppStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-14 bottom-0 z-40 flex flex-col transition-all duration-300 ease-in-out overflow-hidden",
        sidebarOpen ? "w-60" : "w-0 lg:w-16"
      )}
      style={{
        background: "var(--color-nav)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid var(--color-border)",
      }}
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2">
        {NAV_ITEMS.map((group) => {
          // Skip admin group for non-admin users
          if (group.adminGroup && !user?.isAdmin) return null;

          const visibleItems = group.items.filter(
            (item) => !item.adminOnly || user?.isAdmin
          );
          if (!visibleItems.length) return null;

          return (
            <div key={group.group} className="mb-4">
              {sidebarOpen && (
                <div className="px-3 mb-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]/60">
                    {group.group}
                  </span>
                </div>
              )}
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      title={!sidebarOpen ? item.label : undefined}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-left group",
                        isActive
                          ? "bg-gradient-to-r from-[#00C4CC]/15 to-[#007BFF]/10 text-[#00C4CC] border border-[#00C4CC]/20"
                          : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-glass)]",
                        group.adminGroup && "text-[#FF4EAD] hover:text-[#FF4EAD]",
                        group.adminGroup && isActive && "from-[#FF4EAD]/15 to-[#8B5CF6]/10 text-[#FF4EAD] border-[#FF4EAD]/20"
                      )}
                    >
                      <span className={cn("flex-shrink-0", isActive ? "" : "group-hover:scale-110 transition-transform")}>
                        {item.icon}
                      </span>
                      {sidebarOpen && (
                        <>
                          <span className="flex-1 text-xs font-semibold truncate">{item.label}</span>
                          {item.badge && (
                            <span className={cn(
                              "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                              item.badge === "NEW" ? "bg-emerald-500/20 text-emerald-400" : "bg-[#FF4EAD]/20 text-[#FF4EAD]"
                            )}>
                              {item.badge}
                            </span>
                          )}
                          {isActive && <ChevronRight size={12} />}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Marketplace indicators */}
      {sidebarOpen && (
        <div className="p-3 border-t border-[var(--color-border)]">
          <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]/60 mb-2 px-1">
            Supported Platforms
          </div>
          <div className="grid grid-cols-3 gap-1">
            {MARKETPLACES.map((m) => (
              <div
                key={m.name}
                title={m.name}
                className="h-6 rounded-lg flex items-center justify-center text-[8px] font-bold text-white/90 truncate px-1"
                style={{ background: m.color, opacity: 0.8 }}
              >
                {m.name.slice(0, 4)}
              </div>
            ))}
          </div>

          {/* User tier in sidebar */}
          {user && (
            <div className="mt-3 p-2 rounded-xl glass border border-[var(--color-border)]">
              <div className="text-xs font-semibold text-[var(--color-text)] truncate mb-1">
                {user.displayName}
              </div>
              <TierBadge tier={user.tier} />
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
