import React, { useState } from "react";
import { useAppStore, AIEngine } from "../../store/useAppStore";
import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/Button";
import { ENGINE_LABELS } from "../../lib/aiEngine";
import toast from "react-hot-toast";
import { Eye, EyeOff, Save, Zap, CheckCircle2, ExternalLink } from "lucide-react";

const ENGINE_DOCS: Record<AIEngine, string> = {
  "gemini-2.5-pro": "https://aistudio.google.com/app/apikey",
  "gemini-2.5-flash": "https://aistudio.google.com/app/apikey",
  "gpt-4o": "https://platform.openai.com/api-keys",
  "gpt-5": "https://platform.openai.com/api-keys",
  "grok-4": "https://console.x.ai/",
  "grok-fast": "https://console.x.ai/",
};

export const APIKeysPage: React.FC = () => {
  const { apiKeys, setApiKey, activeEngine, setActiveEngine } = useAppStore();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [localKeys, setLocalKeys] = useState<Record<AIEngine, string>>({ ...apiKeys });

  const toggleShow = (engine: AIEngine) =>
    setShowKeys((p) => ({ ...p, [engine]: !p[engine] }));

  const handleSave = (engine: AIEngine) => {
    setApiKey(engine, localKeys[engine]);
    toast.success(`${ENGINE_LABELS[engine].name} API key saved!`);
  };

  const hasKey = (engine: AIEngine) => !!apiKeys[engine]?.trim();

  return (
    <div className="space-y-5 animate-fade-up max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--color-text)]">
          <span className="gradient-text-primary">AI Engine Keys</span>
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
          Configure API keys for each AI engine. Keys are stored locally and never sent to our servers.
        </p>
      </div>

      <GlassCard variant="bubble" className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Zap size={15} className="text-amber-400" />
          <span className="text-xs font-bold text-[var(--color-text)]">Active Engine</span>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mb-3">
          Select your primary AI engine for metadata generation
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.entries(ENGINE_LABELS) as [AIEngine, typeof ENGINE_LABELS[AIEngine]][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setActiveEngine(key)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                activeEngine === key
                  ? "border-[#00C4CC]/50 bg-[rgba(0,196,204,0.1)] text-[var(--color-text)]"
                  : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/30"
              }`}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
              <span className="flex-1 text-left truncate">{cfg.name}</span>
              {hasKey(key) && <CheckCircle2 size={11} className="text-emerald-400 flex-shrink-0" />}
            </button>
          ))}
        </div>
      </GlassCard>

      <div className="space-y-3">
        {(Object.entries(ENGINE_LABELS) as [AIEngine, typeof ENGINE_LABELS[AIEngine]][]).map(([engine, cfg]) => (
          <GlassCard key={engine} variant="default" className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${cfg.color}20` }}>
                  <span className="text-xs font-bold" style={{ color: cfg.color }}>{cfg.badge}</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--color-text)]">{cfg.name}</div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">{cfg.badge} AI Engine</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {hasKey(engine) && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                    <CheckCircle2 size={11} /> Connected
                  </span>
                )}
                <a
                  href={ENGINE_DOCS[engine]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] hover:text-[#00C4CC] transition-colors"
                >
                  <ExternalLink size={10} /> Get Key
                </a>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showKeys[engine] ? "text" : "password"}
                  value={localKeys[engine] || ""}
                  onChange={(e) => setLocalKeys((p) => ({ ...p, [engine]: e.target.value }))}
                  placeholder={`Paste your ${cfg.name} API key...`}
                  className="w-full pr-10 px-3 py-2 text-xs rounded-xl bg-[var(--color-input)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/40 focus:outline-none focus:border-[#00C4CC]/50 transition-all"
                />
                <button
                  onClick={() => toggleShow(engine)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  {showKeys[engine] ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSave(engine)}
                icon={<Save size={13} />}
              >
                Save
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard variant="bubble" className="p-4">
        <div className="text-xs font-bold text-amber-400 mb-2">⚠️ Demo Mode</div>
        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
          StockSEO AI simulates AI generation for demo purposes. Add your real API keys above to enable actual Gemini / GPT / Grok-powered metadata generation. Keys are stored in your browser's local storage and are never transmitted to our servers.
        </p>
      </GlassCard>
    </div>
  );
};
