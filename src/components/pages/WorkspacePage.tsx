import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAppStore, WorkspaceAsset, AIEngine, TitleLength, DescLength, TagCount } from "../../store/useAppStore";
import { generateMetadata, regenerateField, ENGINE_LABELS } from "../../lib/aiEngine";
import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/Button";
import toast from "react-hot-toast";
import {
  Upload, X, RefreshCw, Copy, Edit3, Check, ChevronDown,
  Sparkles, Image as ImageIcon, Tag, FileText, Zap,
  BarChart3, Lock, Eye,
} from "lucide-react";
import { cn } from "../../utils/cn";

/* ─── HELPERS ────────────────────────────────────────────────────────────── */
const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const generateId = () => `asset_${Date.now()}_${Math.random().toString(36).slice(2)}`;

/* ─── SEO SCORE RING ─────────────────────────────────────────────────────── */
const SEOScoreRing: React.FC<{ score: number; size?: number }> = ({ score, size = 80 }) => {
  const circumference = 2 * Math.PI * 28;
  const fill = (score / 100) * circumference;
  const color = score >= 85 ? "#22C55E" : score >= 65 ? "#EAB308" : "#EF4444";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 64 64" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="32" cy="32" r="28" fill="none" stroke="var(--color-border)" strokeWidth="5" />
        <circle
          cx="32" cy="32" r="28" fill="none"
          stroke={color} strokeWidth="5"
          strokeDasharray={`${fill} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-base font-extrabold" style={{ color }}>{score}</div>
        <div className="text-[8px] text-[var(--color-text-muted)] -mt-0.5">SEO</div>
      </div>
    </div>
  );
};

/* ─── EDITABLE FIELD ─────────────────────────────────────────────────────── */
interface FieldPanelProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  locked: boolean;
  isRegenerating: boolean;
  onCopy?: () => void;
  onRegenerate: () => void;
  onEdit: (v: string) => void;
  multiline?: boolean;
  charLimit?: number;
  accentColor?: string;
}

const FieldPanel: React.FC<FieldPanelProps> = ({
  label, value, icon, locked, isRegenerating,
  onRegenerate, onEdit, multiline = false,
  charLimit, accentColor = "#00C4CC",
}) => {
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(value);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => { setEditVal(value); }, [value]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onEdit(editVal);
    setEditing(false);
  };

  return (
    <GlassCard variant="default" className="p-4 relative overflow-hidden">
      {/* Lock overlay */}
      {locked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl"
          style={{ background: "rgba(0,0,0,0.15)", backdropFilter: "blur(2px)" }}>
          <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full">
            <Lock size={12} className="text-[var(--color-text-muted)]" />
            <span className="text-xs text-[var(--color-text-muted)]">Locked</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: `${accentColor}20`, color: accentColor }}>
            {icon}
          </div>
          <span className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">{label}</span>
          {charLimit && (
            <span className="text-[10px] text-[var(--color-text-muted)]/60">
              {value.length}/{charLimit}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {!editing ? (
            <>
              <button
                onClick={() => { setEditing(true); setEditVal(value); }}
                className="w-6 h-6 flex items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-glass)] transition-all"
                title="Edit"
              >
                <Edit3 size={12} />
              </button>
              <button
                onClick={handleCopy}
                className="w-6 h-6 flex items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-glass)] transition-all"
                title="Copy"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              </button>
              <button
                onClick={onRegenerate}
                disabled={isRegenerating}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all"
                style={{
                  background: `${accentColor}20`,
                  color: accentColor,
                  opacity: isRegenerating ? 0.5 : 1,
                }}
                title="Regenerate this field only"
              >
                <RefreshCw size={10} className={isRegenerating ? "animate-spin" : ""} />
                {isRegenerating ? "..." : "Regen"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="w-6 h-6 flex items-center justify-center rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-all"
              >
                <Check size={12} />
              </button>
              <button
                onClick={() => setEditing(false)}
                className="w-6 h-6 flex items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-glass)] transition-all"
              >
                <X size={12} />
              </button>
            </>
          )}
        </div>
      </div>

      {editing ? (
        multiline ? (
          <textarea
            value={editVal}
            onChange={(e) => setEditVal(e.target.value)}
            maxLength={charLimit}
            className="w-full min-h-[80px] text-xs text-[var(--color-text)] bg-[var(--color-input)] border border-[var(--color-border)] rounded-xl p-2.5 focus:outline-none focus:border-[#00C4CC]/60 resize-none"
            autoFocus
          />
        ) : (
          <input
            value={editVal}
            onChange={(e) => setEditVal(e.target.value)}
            maxLength={charLimit}
            className="w-full text-xs text-[var(--color-text)] bg-[var(--color-input)] border border-[var(--color-border)] rounded-xl px-3 py-2 focus:outline-none focus:border-[#00C4CC]/60"
            autoFocus
          />
        )
      ) : (
        <div className={cn(
          "text-xs text-[var(--color-text)] leading-relaxed",
          isRegenerating && "opacity-40 animate-pulse"
        )}>
          {value || <span className="text-[var(--color-text-muted)] italic">No content generated</span>}
        </div>
      )}
    </GlassCard>
  );
};

/* ─── TAGS PANEL ─────────────────────────────────────────────────────────── */
interface TagsPanelProps {
  tags: string[];
  locked: boolean;
  isRegenerating: boolean;
  onRegenerate: () => void;
  onCopyAll?: () => void;
}

const TagsPanel: React.FC<TagsPanelProps> = ({
  tags, locked, isRegenerating, onRegenerate,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tags.join(", "));
    setCopied(true);
    toast.success("All tags copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassCard variant="default" className="p-4 relative overflow-hidden">
      {locked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl"
          style={{ background: "rgba(0,0,0,0.15)", backdropFilter: "blur(2px)" }}>
          <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full">
            <Lock size={12} className="text-[var(--color-text-muted)]" />
            <span className="text-xs text-[var(--color-text-muted)]">Locked</span>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-[#8B5CF6]/20">
            <Tag size={12} className="text-[#8B5CF6]" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">Tags / Keywords</span>
          <span className="text-[10px] text-[var(--color-text-muted)]/60">{tags.length} tags</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="w-6 h-6 flex items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-glass)] transition-all"
            title="Copy all tags"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          </button>
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold bg-[#8B5CF6]/20 text-[#8B5CF6] transition-all"
            style={{ opacity: isRegenerating ? 0.5 : 1 }}
          >
            <RefreshCw size={10} className={isRegenerating ? "animate-spin" : ""} />
            {isRegenerating ? "..." : "Regen"}
          </button>
        </div>
      </div>
      <div className={cn("flex flex-wrap gap-1.5", isRegenerating && "opacity-40 animate-pulse")}>
        {tags.length > 0 ? (
          tags.map((tag, i) => (
            <span key={i} className="tag-chip text-[var(--color-text-muted)]">{tag}</span>
          ))
        ) : (
          <span className="text-xs text-[var(--color-text-muted)] italic">No tags generated</span>
        )}
      </div>
    </GlassCard>
  );
};

/* ─── MAIN WORKSPACE ─────────────────────────────────────────────────────── */
export const WorkspacePage: React.FC = () => {
  const {
    user, setUser, assets, addAsset, removeAsset, updateAsset,
    activeAssetId, setActiveAsset, activeEngine, setActiveEngine,
    titleLength, setTitleLength, descLength, setDescLength,
    tagCount, setTagCount, setShowPaywall, apiKeys,
  } = useAppStore();

  const [engineOpen, setEngineOpen] = useState(false);
  const [regenerating, setRegenerating] = useState<Record<string, boolean>>({});

  const activeAsset = assets.find((a) => a.id === activeAssetId) || null;

  /* ── Drop zone ── */
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (!user) return;
      if (user.credits <= 0 && !user.isAdmin) {
        setShowPaywall(true);
        return;
      }
      accepted.forEach((file) => {
        const id = generateId();
        const previewUrl = URL.createObjectURL(file);

        // Get image resolution
        const img = new Image();
        img.onload = () => {
          const asset: WorkspaceAsset = {
            id,
            file,
            previewUrl,
            filename: file.name,
            resolution: `${img.naturalWidth}×${img.naturalHeight}px`,
            size: formatBytes(file.size),
            format: file.type.split("/")[1]?.toUpperCase() || "IMG",
            status: "idle",
            meta: null,
            lockedFields: { title: false, description: false, tags: false },
          };
          addAsset(asset);
          setActiveAsset(id);
        };
        img.onerror = () => {
          const asset: WorkspaceAsset = {
            id,
            file,
            previewUrl,
            filename: file.name,
            resolution: "Unknown",
            size: formatBytes(file.size),
            format: file.type.split("/")[1]?.toUpperCase() || "IMG",
            status: "idle",
            meta: null,
            lockedFields: { title: false, description: false, tags: false },
          };
          addAsset(asset);
          setActiveAsset(id);
        };
        img.src = previewUrl;
      });
    },
    [user, addAsset, setActiveAsset, setShowPaywall]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [], "image/tiff": [] },
    maxFiles: 10,
  });

  /* ── Generate metadata ── */
  const handleGenerate = async (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset || !user) return;

    if (user.credits <= 0 && !user.isAdmin) {
      setShowPaywall(true);
      return;
    }

    updateAsset(assetId, { status: "processing" });
    const toastId = toast.loading(`Processing ${asset.filename}...`);

    try {
      const meta = await generateMetadata(
        asset.filename, activeEngine, titleLength, descLength, tagCount,
        apiKeys[activeEngine]
      );
      updateAsset(assetId, { status: "done", meta });

      // Deduct credit
      if (!user.isAdmin) {
        const newCredits = Math.max(0, user.credits - 1);
        setUser({ ...user, credits: newCredits, imagesProcessed: (user.imagesProcessed || 0) + 1 });
        if (newCredits === 0) {
          setTimeout(() => setShowPaywall(true), 1500);
        }
      }
      toast.success("Metadata generated!", { id: toastId });
    } catch {
      updateAsset(assetId, { status: "error" });
      toast.error("Generation failed. Check your API key.", { id: toastId });
    }
  };

  /* ── Regenerate single field ── */
  const handleRegenField = async (
    assetId: string,
    field: "title" | "description" | "tags"
  ) => {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset?.meta || !user) return;

    if (user.credits <= 0 && !user.isAdmin) {
      setShowPaywall(true);
      return;
    }

    // Lock other fields
    const otherFields = (["title", "description", "tags"] as const).filter((f) => f !== field);
    const lockedFields: WorkspaceAsset["lockedFields"] = {
      title: otherFields.includes("title"),
      description: otherFields.includes("description"),
      tags: otherFields.includes("tags"),
    };
    updateAsset(assetId, { lockedFields });

    setRegenerating((p) => ({ ...p, [`${assetId}_${field}`]: true }));

    try {
      const patch = await regenerateField(
        field, asset.filename, activeEngine,
        titleLength, descLength, tagCount, asset.meta
      );
      updateAsset(assetId, {
        meta: { ...asset.meta, ...patch },
        lockedFields: { title: false, description: false, tags: false },
      });

      if (!user.isAdmin) {
        const newCredits = Math.max(0, user.credits - 1);
        setUser({ ...user, credits: newCredits });
      }
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} regenerated!`);
    } catch {
      updateAsset(assetId, { lockedFields: { title: false, description: false, tags: false } });
      toast.error("Regeneration failed.");
    }

    setRegenerating((p) => ({ ...p, [`${assetId}_${field}`]: false }));
  };

  /* ── Copy ── */
  const copyField = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied!`);
  };

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-text)]">
            <span className="gradient-text-primary">AI Workspace</span>
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Upload images, generate optimized SEO metadata with isolated field control
          </p>
        </div>

        {/* Engine Selector */}
        <div className="relative">
          <button
            onClick={() => setEngineOpen(!engineOpen)}
            className="flex items-center gap-2 px-3 py-2 glass rounded-xl border border-[var(--color-border)] hover:border-[#00C4CC]/30 transition-all text-sm"
          >
            <Zap size={14} className="text-[#00C4CC]" />
            <span className="font-semibold text-[var(--color-text)]">
              {ENGINE_LABELS[activeEngine].name}
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[var(--color-border)] text-[var(--color-text-muted)]">
              {ENGINE_LABELS[activeEngine].badge}
            </span>
            <ChevronDown size={12} className="text-[var(--color-text-muted)]" />
          </button>
          {engineOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 glass-strong rounded-2xl border border-[var(--color-glass-border)] shadow-xl z-50 overflow-hidden animate-fade-up">
              {(Object.entries(ENGINE_LABELS) as [AIEngine, typeof ENGINE_LABELS[AIEngine]][]).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => { setActiveEngine(key); setEngineOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-xs hover:bg-[var(--color-glass)] transition-all",
                    activeEngine === key && "bg-[var(--color-glass)]"
                  )}
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
                  <span className="flex-1 font-semibold text-[var(--color-text)] text-left">{cfg.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                    style={{ background: `${cfg.color}20`, color: cfg.color }}>
                    {cfg.badge}
                  </span>
                  {activeEngine === key && <Check size={12} className="text-[#00C4CC]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Config Sliders Row */}
      <GlassCard variant="bubble" className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Title Length */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-semibold text-[var(--color-text-muted)]">Title Length</span>
              <span className="text-xs font-bold text-[#00C4CC]">{titleLength} chars</span>
            </div>
            <input
              type="range" min={80} max={150} step={20}
              value={titleLength}
              onChange={(e) => setTitleLength(Number(e.target.value) as TitleLength)}
              className="w-full accent-[#00C4CC]"
            />
            <div className="flex justify-between text-[10px] text-[var(--color-text-muted)]/60 mt-0.5">
              {[80, 100, 120, 150].map(v => <span key={v}>{v}</span>)}
            </div>
          </div>

          {/* Description Length */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-semibold text-[var(--color-text-muted)]">Description Length</span>
              <span className="text-xs font-bold text-[#007BFF]">{descLength} chars</span>
            </div>
            <input
              type="range" min={150} max={400} step={50}
              value={descLength}
              onChange={(e) => setDescLength(Number(e.target.value) as DescLength)}
              className="w-full accent-[#007BFF]"
            />
            <div className="flex justify-between text-[10px] text-[var(--color-text-muted)]/60 mt-0.5">
              {[150, 200, 300, 400].map(v => <span key={v}>{v}</span>)}
            </div>
          </div>

          {/* Tag Count */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-semibold text-[var(--color-text-muted)]">Keywords Count</span>
              <span className="text-xs font-bold text-[#8B5CF6]">{tagCount} tags</span>
            </div>
            <input
              type="range" min={30} max={50} step={10}
              value={tagCount}
              onChange={(e) => setTagCount(Number(e.target.value) as TagCount)}
              className="w-full accent-[#8B5CF6]"
            />
            <div className="flex justify-between text-[10px] text-[var(--color-text-muted)]/60 mt-0.5">
              {[30, 40, 50].map(v => <span key={v}>{v}</span>)}
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: Upload + Asset List */}
        <div className="space-y-4">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all",
              isDragActive
                ? "border-[#00C4CC] bg-[rgba(0,196,204,0.1)] glow-cyan"
                : "border-[var(--color-border)] hover:border-[#00C4CC]/50 hover:bg-[rgba(0,196,204,0.05)]"
            )}
          >
            <input {...getInputProps()} />
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00C4CC]/20 to-[#007BFF]/20 flex items-center justify-center mx-auto mb-3">
              <Upload size={20} className="text-[#00C4CC]" />
            </div>
            <p className="text-sm font-semibold text-[var(--color-text)]">
              {isDragActive ? "Drop images here!" : "Upload Images"}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              JPG, PNG, WEBP, TIFF • Max 10 files
            </p>
            <div className="mt-3 flex justify-center gap-1.5 flex-wrap">
              {["JPG", "PNG", "WEBP", "TIFF"].map((f) => (
                <span key={f} className="text-[9px] px-2 py-0.5 rounded-full bg-[var(--color-glass)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Asset List */}
          {assets.length > 0 && (
            <GlassCard variant="default" className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wide">
                  Queue ({assets.length})
                </span>
                <button
                  onClick={() => useAppStore.getState().clearAssets()}
                  className="text-[10px] text-rose-400 hover:text-rose-300 transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {assets.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => setActiveAsset(asset.id)}
                    className={cn(
                      "flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all border",
                      activeAssetId === asset.id
                        ? "border-[#00C4CC]/40 bg-[rgba(0,196,204,0.08)]"
                        : "border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-glass)]"
                    )}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--color-surface-secondary)]">
                      <img src={asset.previewUrl} alt={asset.filename} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[var(--color-text)] truncate">{asset.filename}</div>
                      <div className="text-[10px] text-[var(--color-text-muted)]">{asset.size} • {asset.format}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      {asset.status === "processing" && (
                        <div className="w-3 h-3 border-2 border-[#00C4CC] border-t-transparent rounded-full animate-spin" />
                      )}
                      {asset.status === "done" && (
                        <div className="w-3 h-3 rounded-full bg-emerald-400" />
                      )}
                      {asset.status === "error" && (
                        <div className="w-3 h-3 rounded-full bg-rose-400" />
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeAsset(asset.id); }}
                        className="w-5 h-5 flex items-center justify-center rounded text-[var(--color-text-muted)] hover:text-rose-400 transition-colors"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>

        {/* Right: Metadata Output */}
        <div className="lg:col-span-2 space-y-4">
          {activeAsset ? (
            <>
              {/* Asset Header */}
              <GlassCard variant="bubble" className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--color-surface-secondary)]">
                    <img src={activeAsset.previewUrl} alt={activeAsset.filename} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-[var(--color-text)] truncate mb-1">{activeAsset.filename}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {[
                        { label: activeAsset.resolution, icon: <Eye size={10} /> },
                        { label: activeAsset.size, icon: <FileText size={10} /> },
                        { label: activeAsset.format, icon: <ImageIcon size={10} /> },
                      ].map(({ label, icon }) => (
                        <span key={label} className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full glass border border-[var(--color-border)] text-[var(--color-text-muted)]">
                          {icon} {label}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      {activeAsset.status !== "done" ? (
                        <Button
                          variant="primary"
                          size="sm"
                          glow
                          loading={activeAsset.status === "processing"}
                          onClick={() => handleGenerate(activeAsset.id)}
                          icon={<Sparkles size={14} />}
                        >
                          {activeAsset.status === "processing" ? "Generating..." : "Generate Metadata"}
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleGenerate(activeAsset.id)}
                          icon={<RefreshCw size={14} />}
                        >
                          Regenerate All
                        </Button>
                      )}
                    </div>
                  </div>
                  {activeAsset.meta && (
                    <div className="flex-shrink-0">
                      <SEOScoreRing score={activeAsset.meta.seoScore} size={80} />
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* Metadata Fields */}
              {activeAsset.meta ? (
                <div className="space-y-3">
                  {/* Title */}
                  <FieldPanel
                    label="Title"
                    value={activeAsset.meta.title}
                    icon={<FileText size={12} />}
                    locked={activeAsset.lockedFields.title}
                    isRegenerating={!!regenerating[`${activeAsset.id}_title`]}
                    onCopy={() => copyField(activeAsset.meta!.title, "Title")}
                    onRegenerate={() => handleRegenField(activeAsset.id, "title")}
                    onEdit={(v) => updateAsset(activeAsset.id, { meta: { ...activeAsset.meta!, title: v } })}
                    charLimit={titleLength}
                    accentColor="#00C4CC"
                  />

                  {/* Description */}
                  <FieldPanel
                    label="Description"
                    value={activeAsset.meta.description}
                    icon={<FileText size={12} />}
                    locked={activeAsset.lockedFields.description}
                    isRegenerating={!!regenerating[`${activeAsset.id}_description`]}
                    onCopy={() => copyField(activeAsset.meta!.description, "Description")}
                    onRegenerate={() => handleRegenField(activeAsset.id, "description")}
                    onEdit={(v) => updateAsset(activeAsset.id, { meta: { ...activeAsset.meta!, description: v } })}
                    multiline
                    charLimit={descLength}
                    accentColor="#007BFF"
                  />

                  {/* Tags */}
                  <TagsPanel
                    tags={activeAsset.meta.tags}
                    locked={activeAsset.lockedFields.tags}
                    isRegenerating={!!regenerating[`${activeAsset.id}_tags`]}
                    onRegenerate={() => handleRegenField(activeAsset.id, "tags")}
                    onCopyAll={() => copyField(activeAsset.meta!.tags.join(", "), "All tags")}
                  />

                  {/* Categories + Scores */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <GlassCard variant="default" className="p-4">
                      <div className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)] mb-2">Categories</div>
                      <div className="space-y-1.5">
                        {activeAsset.meta.categories.map((cat) => (
                          <div key={cat} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#00C4CC]" />
                            <span className="text-xs text-[var(--color-text)]">{cat}</span>
                          </div>
                        ))}
                        {activeAsset.meta.subCategories.map((cat) => (
                          <div key={cat} className="flex items-center gap-2 pl-3">
                            <div className="w-1 h-1 rounded-full bg-[#007BFF]/60" />
                            <span className="text-xs text-[var(--color-text-muted)]">{cat}</span>
                          </div>
                        ))}
                      </div>
                    </GlassCard>

                    <GlassCard variant="default" className="p-4">
                      <div className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)] mb-3">SEO Metrics</div>
                      <div className="space-y-2">
                        {[
                          { label: "Overall SEO", val: activeAsset.meta.seoScore, color: "#00C4CC" },
                          { label: "Readability", val: activeAsset.meta.readabilityScore, color: "#007BFF" },
                          { label: "Marketplace", val: activeAsset.meta.marketplaceCompliance, color: "#8B5CF6" },
                          { label: "Tag Density", val: Math.min(100, activeAsset.meta.tagDensity), color: "#FF4EAD" },
                        ].map(({ label, val, color }) => (
                          <div key={label}>
                            <div className="flex justify-between text-[10px] mb-1">
                              <span className="text-[var(--color-text-muted)]">{label}</span>
                              <span className="font-bold" style={{ color }}>{val}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-[var(--color-border)]">
                              <div
                                className="h-1.5 rounded-full transition-all duration-700"
                                style={{ width: `${val}%`, background: color }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </div>
                </div>
              ) : (
                <GlassCard variant="default" className="p-10 text-center">
                  <BarChart3 size={40} className="mx-auto mb-3 text-[var(--color-text-muted)]/30" />
                  <p className="text-sm font-semibold text-[var(--color-text-muted)]">
                    Click "Generate Metadata" to start AI-powered SEO analysis
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]/60 mt-1">
                    Using {ENGINE_LABELS[activeEngine].name} engine
                  </p>
                </GlassCard>
              )}
            </>
          ) : (
            <GlassCard variant="default" className="p-16 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00C4CC]/10 to-[#007BFF]/10 flex items-center justify-center mx-auto mb-4">
                <ImageIcon size={36} className="text-[#00C4CC]/50" />
              </div>
              <h3 className="text-base font-bold text-[var(--color-text)] mb-2">Upload Your First Image</h3>
              <p className="text-sm text-[var(--color-text-muted)] max-w-xs mx-auto">
                Drag & drop an image or click the upload zone to start generating AI-optimized SEO metadata
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};
