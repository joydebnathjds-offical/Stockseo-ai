import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAppStore } from "../../store/useAppStore";
import { generateMetadata } from "../../lib/aiEngine";
import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/Button";
import { TierBadge } from "../ui/Badge";
import toast from "react-hot-toast";
import {
  Play, Download, X, CheckCircle2,
  Clock, AlertCircle, Layers,
} from "lucide-react";
import { cn } from "../../utils/cn";

interface BulkAsset {
  id: string;
  file: File;
  previewUrl: string;
  status: "queued" | "processing" | "done" | "error";
  seoScore?: number;
  title?: string;
  tags?: string[];
}

export const BulkPage: React.FC = () => {
  const { user, setUser, activeEngine, titleLength, descLength, tagCount, apiKeys, setShowPaywall } = useAppStore();
  const [assets, setAssets] = useState<BulkAsset[]>([]);
  const [running, setRunning] = useState(false);
  const [csvData, setCsvData] = useState<string>("");

  const canBulk = user?.tier !== "BASIC";

  const onDrop = useCallback((accepted: File[]) => {
    if (!canBulk) {
      toast.error("Bulk processing requires a Pro+ plan");
      setShowPaywall(true);
      return;
    }
    const newAssets: BulkAsset[] = accepted.map((f) => ({
      id: `bulk_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      file: f,
      previewUrl: URL.createObjectURL(f),
      status: "queued",
    }));
    setAssets((p) => [...p, ...newAssets]);
  }, [canBulk, setShowPaywall]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [], "image/tiff": [] },
    maxFiles: 50,
  });

  const processAll = async () => {
    if (!user || assets.length === 0) return;
    if (user.credits < assets.length && !user.isAdmin) {
      toast.error(`Not enough credits. Need ${assets.length}, have ${user.credits}.`);
      setShowPaywall(true);
      return;
    }
    setRunning(true);
    let processed = 0;

    for (const asset of assets.filter((a) => a.status === "queued")) {
      setAssets((p) => p.map((a) => a.id === asset.id ? { ...a, status: "processing" } : a));
      try {
        const meta = await generateMetadata(asset.file.name, activeEngine, titleLength, descLength, tagCount, apiKeys[activeEngine]);
        setAssets((p) => p.map((a) =>
          a.id === asset.id
            ? { ...a, status: "done", seoScore: meta.seoScore, title: meta.title, tags: meta.tags }
            : a
        ));
        processed++;
        if (!user.isAdmin) {
          setUser({ ...user, credits: Math.max(0, user.credits - 1), imagesProcessed: (user.imagesProcessed || 0) + 1 });
        }
      } catch {
        setAssets((p) => p.map((a) => a.id === asset.id ? { ...a, status: "error" } : a));
      }
    }

    toast.success(`Bulk processing complete! ${processed} images optimized.`);
    setRunning(false);

    // Build CSV
    const rows = [["Filename", "Title", "Tags", "SEO Score"]];
    assets.forEach((a) => {
      if (a.status === "done") {
        rows.push([a.file.name, a.title || "", (a.tags || []).join("; "), String(a.seoScore || "")]);
      }
    });
    setCsvData(rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n"));
  };

  const downloadCSV = () => {
    if (!csvData) return;
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stockseo_bulk_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded!");
  };

  const doneCount = assets.filter((a) => a.status === "done").length;
  const queuedCount = assets.filter((a) => a.status === "queued").length;

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-text)]">
            <span className="gradient-text-primary">Bulk Processor</span>
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">Process up to 50 images simultaneously</p>
        </div>
        <TierBadge tier={user?.tier || "BASIC"} />
      </div>

      {!canBulk && (
        <GlassCard variant="bubble" className="p-4" glow="pink">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="text-[#FF4EAD]" />
            <div className="flex-1">
              <div className="text-sm font-bold text-[var(--color-text)]">Pro+ Required</div>
              <div className="text-xs text-[var(--color-text-muted)]">Upgrade to Pro, Premium, or Enterprise to unlock bulk processing.</div>
            </div>
            <Button variant="neon" size="sm" onClick={() => setShowPaywall(true)}>Upgrade</Button>
          </div>
        </GlassCard>
      )}

      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all",
          isDragActive ? "border-[#00C4CC] bg-[rgba(0,196,204,0.1)] glow-cyan" : "border-[var(--color-border)] hover:border-[#00C4CC]/50 hover:bg-[rgba(0,196,204,0.05)]",
          !canBulk && "opacity-50 pointer-events-none"
        )}
      >
        <input {...getInputProps()} />
        <Layers size={36} className="mx-auto mb-3 text-[#00C4CC]/50" />
        <p className="text-sm font-bold text-[var(--color-text)]">{isDragActive ? "Drop images!" : "Drag & Drop up to 50 Images"}</p>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">JPG, PNG, WEBP, TIFF supported</p>
      </div>

      {assets.length > 0 && (
        <>
          <GlassCard variant="bubble" className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 text-sm">
                <span className="font-bold text-[var(--color-text)]">{assets.length} images</span>
                <span className="text-emerald-400">{doneCount} done</span>
                <span className="text-amber-400">{queuedCount} queued</span>
              </div>
              <div className="flex gap-2">
                {doneCount > 0 && (
                  <Button variant="secondary" size="sm" onClick={downloadCSV} icon={<Download size={13} />}>
                    Export CSV
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  loading={running}
                  onClick={processAll}
                  icon={running ? undefined : <Play size={13} />}
                  disabled={queuedCount === 0}
                  glow
                >
                  {running ? "Processing..." : `Process ${queuedCount} Images`}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setAssets([]); setCsvData(""); }}>
                  <X size={13} />
                </Button>
              </div>
            </div>

            {/* Progress bar */}
            {running && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1">
                  <span>Processing...</span>
                  <span>{Math.round((doneCount / assets.length) * 100)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--color-border)]">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-[#00C4CC] to-[#007BFF] transition-all"
                    style={{ width: `${(doneCount / assets.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-h-96 overflow-y-auto">
              {assets.map((asset) => (
                <div key={asset.id} className="relative">
                  <div className={cn(
                    "rounded-xl overflow-hidden border transition-all",
                    asset.status === "done" && "border-emerald-500/30",
                    asset.status === "processing" && "border-[#00C4CC]/50 glow-cyan",
                    asset.status === "error" && "border-rose-500/30",
                    asset.status === "queued" && "border-[var(--color-border)]",
                  )}>
                    <img src={asset.previewUrl} alt={asset.file.name} className="w-full h-20 object-cover" />
                    <div className="p-1.5 glass">
                      <div className="text-[9px] text-[var(--color-text-muted)] truncate">{asset.file.name}</div>
                      <div className="flex items-center justify-between mt-0.5">
                        <div className="flex items-center gap-1">
                          {asset.status === "done" && <CheckCircle2 size={10} className="text-emerald-400" />}
                          {asset.status === "processing" && <div className="w-3 h-3 border-2 border-[#00C4CC] border-t-transparent rounded-full animate-spin" />}
                          {asset.status === "error" && <AlertCircle size={10} className="text-rose-400" />}
                          {asset.status === "queued" && <Clock size={10} className="text-[var(--color-text-muted)]" />}
                          <span className="text-[8px] text-[var(--color-text-muted)] capitalize">{asset.status}</span>
                        </div>
                        {asset.seoScore && (
                          <span className={cn("text-[9px] font-bold", asset.seoScore >= 85 ? "text-emerald-400" : asset.seoScore >= 70 ? "text-amber-400" : "text-rose-400")}>
                            {asset.seoScore}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setAssets((p) => p.filter((a) => a.id !== asset.id))}
                    className="absolute top-1 right-1 w-4 h-4 rounded bg-black/50 flex items-center justify-center text-white hover:bg-black/80 transition-all"
                  >
                    <X size={8} />
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
};
