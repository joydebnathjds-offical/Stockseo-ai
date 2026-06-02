import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ─── TYPES ──────────────────────────────────────────────────────────────── */
export type UserTier = "BASIC" | "PRO" | "PREMIUM" | "ENTERPRISE";
export type AIEngine = "gemini-2.5-pro" | "gemini-2.5-flash" | "gpt-4o" | "gpt-5" | "grok-4" | "grok-fast";
export type TitleLength = 80 | 100 | 120 | 150;
export type DescLength = 150 | 200 | 300 | 400;
export type TagCount = 30 | 40 | 50;

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  tier: UserTier;
  credits: number;
  creditsCap: number;
  isAdmin: boolean;
  joinedAt: string;
  imagesProcessed: number;
  apiKeys: Record<AIEngine, string>;
}

export interface GeneratedMeta {
  title: string;
  description: string;
  tags: string[];
  categories: string[];
  subCategories: string[];
  seoScore: number;
  readabilityScore: number;
  tagDensity: number;
  marketplaceCompliance: number;
}

export interface WorkspaceAsset {
  id: string;
  file: File | null;
  previewUrl: string;
  filename: string;
  resolution: string;
  size: string;
  format: string;
  status: "idle" | "processing" | "done" | "error";
  meta: GeneratedMeta | null;
  lockedFields: { title: boolean; description: boolean; tags: boolean };
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  tier: UserTier;
  credits: number;
  creditsCap: number;
  joinedAt: string;
  imagesProcessed: number;
  lastActive: string;
}

/* ─── STORE INTERFACE ────────────────────────────────────────────────────── */
interface AppStore {
  /* Theme */
  isDark: boolean;
  toggleTheme: () => void;

  /* Auth */
  user: UserProfile | null;
  isAuthenticated: boolean;
  setUser: (u: UserProfile | null) => void;

  /* Workspace Config */
  activeEngine: AIEngine;
  titleLength: TitleLength;
  descLength: DescLength;
  tagCount: TagCount;
  setActiveEngine: (e: AIEngine) => void;
  setTitleLength: (l: TitleLength) => void;
  setDescLength: (l: DescLength) => void;
  setTagCount: (c: TagCount) => void;

  /* Workspace Assets */
  assets: WorkspaceAsset[];
  activeAssetId: string | null;
  addAsset: (asset: WorkspaceAsset) => void;
  removeAsset: (id: string) => void;
  updateAsset: (id: string, patch: Partial<WorkspaceAsset>) => void;
  setActiveAsset: (id: string | null) => void;
  clearAssets: () => void;

  /* API Keys */
  apiKeys: Record<AIEngine, string>;
  setApiKey: (engine: AIEngine, key: string) => void;

  /* Paywall */
  showPaywall: boolean;
  setShowPaywall: (v: boolean) => void;

  /* Admin */
  adminUsers: AdminUser[];
  setAdminUsers: (users: AdminUser[]) => void;
  updateAdminUser: (uid: string, patch: Partial<AdminUser>) => void;

  /* UI State */
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

/* ─── MOCK ADMIN USERS ───────────────────────────────────────────────────── */
const mockAdminUsers: AdminUser[] = [
  {
    uid: "usr_001",
    email: "creator@adobe.com",
    displayName: "Alex Rodriguez",
    tier: "PRO",
    credits: 450,
    creditsCap: 500,
    joinedAt: "2024-09-12",
    imagesProcessed: 1240,
    lastActive: "2025-01-15",
  },
  {
    uid: "usr_002",
    email: "photo@shutterstock.com",
    displayName: "Maria Chen",
    tier: "PREMIUM",
    credits: 980,
    creditsCap: 1000,
    joinedAt: "2024-08-03",
    imagesProcessed: 3892,
    lastActive: "2025-01-16",
  },
  {
    uid: "usr_003",
    email: "freelancer@freepik.com",
    displayName: "James Wilson",
    tier: "BASIC",
    credits: 0,
    creditsCap: 10,
    joinedAt: "2025-01-10",
    imagesProcessed: 10,
    lastActive: "2025-01-14",
  },
  {
    uid: "usr_004",
    email: "studio@istock.com",
    displayName: "Sarah Johnson",
    tier: "ENTERPRISE",
    credits: 4900,
    creditsCap: 5000,
    joinedAt: "2024-06-20",
    imagesProcessed: 12450,
    lastActive: "2025-01-16",
  },
  {
    uid: "usr_005",
    email: "artist@dreamstime.com",
    displayName: "Erik Petersen",
    tier: "PRO",
    credits: 210,
    creditsCap: 500,
    joinedAt: "2024-11-05",
    imagesProcessed: 678,
    lastActive: "2025-01-13",
  },
  {
    uid: "usr_006",
    email: "photo@alamy.com",
    displayName: "Priya Sharma",
    tier: "BASIC",
    credits: 5,
    creditsCap: 10,
    joinedAt: "2025-01-08",
    imagesProcessed: 5,
    lastActive: "2025-01-11",
  },
];

/* ─── STORE IMPLEMENTATION ───────────────────────────────────────────────── */
export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      /* Theme */
      isDark: false,
      toggleTheme: () => {
        const next = !get().isDark;
        if (next) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
        set({ isDark: next });
      },

      /* Auth */
      user: null,
      isAuthenticated: false,
      setUser: (u) => set({ user: u, isAuthenticated: !!u }),

      /* Workspace Config */
      activeEngine: "gemini-2.5-flash",
      titleLength: 100,
      descLength: 200,
      tagCount: 40,
      setActiveEngine: (e) => set({ activeEngine: e }),
      setTitleLength: (l) => set({ titleLength: l }),
      setDescLength: (l) => set({ descLength: l }),
      setTagCount: (c) => set({ tagCount: c }),

      /* Workspace Assets */
      assets: [],
      activeAssetId: null,
      addAsset: (asset) =>
        set((s) => ({ assets: [...s.assets, asset] })),
      removeAsset: (id) =>
        set((s) => ({ assets: s.assets.filter((a) => a.id !== id) })),
      updateAsset: (id, patch) =>
        set((s) => ({
          assets: s.assets.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),
      setActiveAsset: (id) => set({ activeAssetId: id }),
      clearAssets: () => set({ assets: [], activeAssetId: null }),

      /* API Keys */
      apiKeys: {
        "gemini-2.5-pro": "",
        "gemini-2.5-flash": "",
        "gpt-4o": "",
        "gpt-5": "",
        "grok-4": "",
        "grok-fast": "",
      },
      setApiKey: (engine, key) =>
        set((s) => ({ apiKeys: { ...s.apiKeys, [engine]: key } })),

      /* Paywall */
      showPaywall: false,
      setShowPaywall: (v) => set({ showPaywall: v }),

      /* Admin */
      adminUsers: mockAdminUsers,
      setAdminUsers: (users) => set({ adminUsers: users }),
      updateAdminUser: (uid, patch) =>
        set((s) => ({
          adminUsers: s.adminUsers.map((u) =>
            u.uid === uid ? { ...u, ...patch } : u
          ),
        })),

      /* UI State */
      sidebarOpen: true,
      setSidebarOpen: (v) => set({ sidebarOpen: v }),
      activeTab: "dashboard",
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: "stockseo-app",
      partialize: (s) => ({
        isDark: s.isDark,
        activeEngine: s.activeEngine,
        titleLength: s.titleLength,
        descLength: s.descLength,
        tagCount: s.tagCount,
        apiKeys: s.apiKeys,
      }),
    }
  )
);

/* ─── HELPER: INIT THEME ─────────────────────────────────────────────────── */
export function initTheme() {
  const stored = localStorage.getItem("stockseo-app");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed?.state?.isDark) {
        document.documentElement.classList.add("dark");
      }
    } catch (_) {}
  }
}
