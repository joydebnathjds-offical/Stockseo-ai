import React from "react";
import { useAppStore } from "../../store/useAppStore";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { DashboardPage } from "../pages/DashboardPage";
import { WorkspacePage } from "../pages/WorkspacePage";
import { AnalyticsPage } from "../pages/AnalyticsPage";
import { AdminPage } from "../pages/AdminPage";
import { APIKeysPage } from "../pages/APIKeysPage";
import { MarketplacesPage } from "../pages/MarketplacesPage";
import { BillingPage } from "../pages/BillingPage";
import { BulkPage } from "../pages/BulkPage";
import { PaywallModal } from "../modals/PaywallModal";
import { cn } from "../../utils/cn";
import { Settings, HelpCircle } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";

const PAGE_MAP: Record<string, React.ReactNode> = {
  dashboard: <DashboardPage />,
  workspace: <WorkspacePage />,
  analytics: <AnalyticsPage />,
  admin: <AdminPage />,
  "admin-users": <AdminPage />,
  "admin-analytics": <AdminPage />,
  bulk: <BulkPage />,
  "api-keys": <APIKeysPage />,
  marketplaces: <MarketplacesPage />,
  billing: <BillingPage />,
  settings: <SettingsPlaceholder />,
  help: <HelpPlaceholder />,
};

function SettingsPlaceholder() {
  return (
    <div className="animate-fade-up">
      <h1 className="text-2xl font-extrabold mb-4">
        <span className="gradient-text-primary">Settings</span>
      </h1>
      <GlassCard variant="bubble" className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Settings size={24} className="text-[#00C4CC]" />
          <div>
            <div className="font-bold text-[var(--color-text)]">Application Settings</div>
            <div className="text-sm text-[var(--color-text-muted)]">Configure your workspace preferences</div>
          </div>
        </div>
        <div className="text-sm text-[var(--color-text-muted)]">Settings panel coming soon. Use the AI Engine Keys section to configure your API keys.</div>
      </GlassCard>
    </div>
  );
}

function HelpPlaceholder() {
  return (
    <div className="animate-fade-up">
      <h1 className="text-2xl font-extrabold mb-4">
        <span className="gradient-text-primary">Help Center</span>
      </h1>
      <GlassCard variant="bubble" className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <HelpCircle size={24} className="text-[#00C4CC]" />
          <div>
            <div className="font-bold text-[var(--color-text)]">Getting Started</div>
            <div className="text-sm text-[var(--color-text-muted)]">Learn how to use StockSEO AI</div>
          </div>
        </div>
        <div className="space-y-3 text-sm text-[var(--color-text-muted)]">
          <div>1. Upload images via the <strong className="text-[var(--color-text)]">AI Workspace</strong></div>
          <div>2. Configure your preferred <strong className="text-[var(--color-text)]">AI Engine</strong> in the Engine Keys section</div>
          <div>3. Set title/description/tag length using the sliders</div>
          <div>4. Click <strong className="text-[var(--color-text)]">Generate Metadata</strong> for AI-powered SEO optimization</div>
          <div>5. Use isolated <strong className="text-[var(--color-text)]">Regen</strong> buttons to regenerate individual fields</div>
          <div>6. Copy metadata to use in your stock marketplace uploads</div>
        </div>
      </GlassCard>
    </div>
  );
}

export const AppLayout: React.FC = () => {
  const { activeTab, sidebarOpen } = useAppStore();

  const currentPage = PAGE_MAP[activeTab] || <DashboardPage />;

  return (
    <div className="min-h-screen mesh-bg">
      <Navbar />
      <Sidebar />

      {/* Main content area */}
      <main
        className={cn(
          "pt-14 transition-all duration-300 ease-in-out min-h-screen",
          sidebarOpen ? "lg:pl-60" : "lg:pl-16",
          "pl-0"
        )}
      >
        <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
          {currentPage}
        </div>
      </main>

      <PaywallModal />
    </div>
  );
};
