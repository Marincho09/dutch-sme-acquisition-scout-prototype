"use client";

import React, { useEffect, useState } from "react";
import { Check, Clipboard, Database, Mail, ShieldCheck, Sparkles, X } from "lucide-react";
import type { Assessment, ScoreKey } from "../lib/schema";
import { scoreLabels, scoreWeights } from "../lib/scoring";
import { Badge } from "./badge";

export type DashboardPanel = "scorecards" | "outreach" | "settings";

const scoreDescriptions: Record<ScoreKey, string> = {
  businessModelAttractiveness: "Quality, scalability and durability of how the company creates and captures value.",
  recurringRevenue: "Evidence of subscriptions, service agreements, repeat orders or embedded ongoing usage.",
  defensibility: "Niche expertise, switching costs, integrations, customer relationships and competitive differentiation.",
  operationalImprovement: "Practical scope for process improvement, software enablement, AI and automation.",
  ownerOperatorFit: "Suitability for patient, hands-on ownership without relying on institutional scale or complexity.",
};

export function DashboardPanelDialog({
  panel,
  assessments,
  onClose,
  onClearResults,
}: {
  panel: DashboardPanel | null;
  assessments: Assessment[];
  onClose: () => void;
  onClearResults: () => void;
}) {
  useEffect(() => {
    if (!panel) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose, panel]);

  if (!panel) return null;

  const titles: Record<DashboardPanel, { eyebrow: string; title: string; description: string }> = {
    scorecards: {
      eyebrow: "Acquisition framework",
      title: "Scorecard methodology",
      description: "A transparent five-factor model designed for long-term search-fund ownership.",
    },
    outreach: {
      eyebrow: "Founder conversations",
      title: "Personalized outreach",
      description: "Evidence-safe introductory drafts for every completed company profile.",
    },
    settings: {
      eyebrow: "Workspace controls",
      title: "Settings & data",
      description: "Review the operating mode, evidence policy and local browser storage.",
    },
  };
  const copy = titles[panel];

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      <button className="absolute inset-0 cursor-default bg-ink/35 backdrop-blur-sm" onClick={onClose} aria-label="Close panel" />
      <section
        role="dialog"
        aria-modal="true"
        aria-label={copy.title}
        className="absolute inset-y-0 right-0 flex w-full max-w-[620px] flex-col border-l border-[#dfe3dc] bg-cream shadow-2xl"
      >
        <header className="flex items-start justify-between gap-5 border-b border-[#dfe3dc] bg-white px-6 py-6 md:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.17em] text-moss-500">{copy.eyebrow}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-.03em]">{copy.title}</h2>
            <p className="mt-2 max-w-lg text-xs leading-5 text-[#707a6f]">{copy.description}</p>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#dfe3dc] text-[#677166] hover:bg-[#f5f7f2]" aria-label="Close panel">
            <X size={17} />
          </button>
        </header>
        <div className="thin-scrollbar flex-1 overflow-y-auto p-6 md:p-8">
          {panel === "scorecards" && <ScorecardPanel />}
          {panel === "outreach" && <OutreachPanel assessments={assessments} />}
          {panel === "settings" && <SettingsPanel assessments={assessments} onClearResults={onClearResults} />}
        </div>
      </section>
    </div>
  );
}

function ScorecardPanel() {
  return (
    <div>
      <div className="rounded-2xl bg-ink p-5 text-white">
        <div className="flex items-center gap-2 text-xs font-bold text-lime"><Sparkles size={15} /> Weighted acquisition score</div>
        <p className="mt-3 text-xs leading-6 text-[#c5cec2]">Each criterion is scored from 1–5. The final score is the weighted sum, rounded to two decimals. Financial performance is never inferred.</p>
        <div className="mt-4 rounded-xl bg-white/10 px-4 py-3 font-mono text-[11px] text-white">Total = Σ (criterion score × weight)</div>
      </div>
      <div className="mt-5 space-y-3">
        {(Object.keys(scoreWeights) as ScoreKey[]).map((key, index) => (
          <article key={key} className="rounded-2xl border border-[#dfe3dc] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-xl bg-moss-50 text-xs font-bold text-moss-700">{index + 1}</span><h3 className="text-sm font-bold">{scoreLabels[key]}</h3></div>
              <Badge tone="green">{Math.round(scoreWeights[key] * 100)}% weight</Badge>
            </div>
            <p className="mt-3 text-xs leading-5 text-[#657064]">{scoreDescriptions[key]}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function OutreachPanel({ assessments }: { assessments: Assessment[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyDraft(assessment: Assessment) {
    await navigator.clipboard.writeText(assessment.outreachDraft);
    setCopiedId(assessment.id);
    window.setTimeout(() => setCopiedId(null), 1600);
  }

  if (!assessments.length) {
    return <EmptyPanel icon={<Mail size={22} />} title="No outreach drafts yet" description="Run an assessment first. A personalized, evidence-safe introduction will appear here for every target." />;
  }

  return (
    <div className="space-y-4">
      {assessments.map((assessment) => (
        <article key={assessment.id} className="rounded-2xl border border-[#dfe3dc] bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div><h3 className="text-sm font-bold">{assessment.companyName}</h3><p className="mt-1 text-[10px] text-[#7d867c]">{assessment.sector} · {assessment.confidence} confidence</p></div>
            <button onClick={() => copyDraft(assessment)} className="inline-flex h-9 shrink-0 items-center gap-2 rounded-xl bg-ink px-3 text-[11px] font-bold text-white hover:bg-[#283829]">
              {copiedId === assessment.id ? <Check size={14} className="text-lime" /> : <Clipboard size={14} />}{copiedId === assessment.id ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="mt-4 max-h-52 overflow-y-auto whitespace-pre-wrap rounded-xl bg-[#f7f8f4] p-4 font-sans text-[11px] leading-5 text-[#5d685c]">{assessment.outreachDraft}</pre>
        </article>
      ))}
    </div>
  );
}

function SettingsPanel({ assessments, onClearResults }: { assessments: Assessment[]; onClearResults: () => void }) {
  const mode = assessments[0]?.mode;
  const modeName = mode === "live" ? "Live OpenAI research" : mode === "demo" ? "Curated evidence demo" : "Evidence-safe mock mode";

  return (
    <div className="space-y-4">
      <SettingCard icon={<Sparkles size={17} />} title="Research mode">
        <div className="flex items-center justify-between gap-4"><p className="text-xs text-[#657064]">Current workspace mode</p><Badge tone={mode === "live" ? "green" : "amber"}>{modeName}</Badge></div>
        <p className="mt-3 text-[11px] leading-5 text-[#7b847a]">Add a server-side <code className="rounded bg-[#eef1ea] px-1.5 py-0.5">OPENAI_API_KEY</code> in <code className="rounded bg-[#eef1ea] px-1.5 py-0.5">.env.local</code> to enable live research for arbitrary uploads.</p>
      </SettingCard>
      <SettingCard icon={<ShieldCheck size={17} />} title="Evidence policy">
        <ul className="space-y-2 text-xs leading-5 text-[#657064]"><li>• Unsupported financial and employee figures are never generated.</li><li>• Ownership and succession are marked unavailable unless a source supports them.</li><li>• Every researched profile exposes the URLs used as evidence.</li></ul>
      </SettingCard>
      <SettingCard icon={<Database size={17} />} title="Local data">
        <p className="text-xs leading-5 text-[#657064]">Results are stored only in this browser so detailed profile pages remain available. No database or user account is connected.</p>
        <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-[#f6f7f3] p-3"><span className="text-[11px] font-semibold text-[#6d776c]">{assessments.length} saved profile{assessments.length === 1 ? "" : "s"}</span><button onClick={onClearResults} disabled={!assessments.length} className="rounded-lg border border-[#e0cfc8] bg-white px-3 py-2 text-[10px] font-bold text-[#9a513d] disabled:cursor-not-allowed disabled:opacity-40">Clear saved results</button></div>
      </SettingCard>
    </div>
  );
}

function SettingCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return <article className="rounded-2xl border border-[#dfe3dc] bg-white p-5 shadow-sm"><div className="mb-4 flex items-center gap-2 text-sm font-bold text-ink"><span className="grid h-8 w-8 place-items-center rounded-xl bg-moss-50 text-moss-700">{icon}</span>{title}</div>{children}</article>;
}

function EmptyPanel({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return <div className="flex min-h-[420px] flex-col items-center justify-center text-center"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-moss-50 text-moss-500">{icon}</div><h3 className="mt-4 text-sm font-bold">{title}</h3><p className="mt-2 max-w-sm text-xs leading-5 text-[#768075]">{description}</p></div>;
}
