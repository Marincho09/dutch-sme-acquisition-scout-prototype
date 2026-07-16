"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Building2, Calendar, CheckCircle2, Clipboard, Link2, Mail, MapPin, ShieldAlert, Sparkles } from "lucide-react";
import { assessmentSchema, type Assessment } from "@/lib/schema";
import { Badge } from "@/components/badge";
import { Logo } from "@/components/logo";
import { ScorePill } from "@/components/score-pill";
import { scoreLabels, scoreWeights } from "@/lib/scoring";

export function AcquisitionProfile({ id }: { id: string }) {
  const [assessment, setAssessment] = useState<Assessment | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("sourcing-copilot-assessments") || "[]") as unknown[];
      const found = stored.map((item) => assessmentSchema.safeParse(item)).find((result) => result.success && result.data.id === id);
      setAssessment(found?.success ? found.data : null);
    } catch {
      setAssessment(null);
    }
  }, [id]);

  if (assessment === undefined) {
    return <div className="grid min-h-screen place-items-center bg-cream"><div className="flex items-center gap-3 text-sm font-semibold text-[#697268]"><Sparkles className="animate-pulse text-moss-500" size={18} /> Loading acquisition profile</div></div>;
  }

  if (!assessment) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream px-6 text-center">
        <div><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-moss-50 text-moss-500"><Building2 size={24} /></div><h1 className="mt-5 text-xl font-bold">Profile not found</h1><p className="mt-2 text-sm text-[#717a70]">Run an assessment from the dashboard before opening a target profile.</p><Link href="/" className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-ink px-4 text-xs font-bold text-white"><ArrowLeft size={14} /> Back to sourcing</Link></div>
      </div>
    );
  }

  async function copyOutreach() {
    await navigator.clipboard.writeText(assessment!.outreachDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="border-b border-[#e0e4dc] bg-[#fbfcf8]">
        <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-5 md:px-8"><Logo /><Link href="/" className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#dde2da] bg-white px-3 text-xs font-bold shadow-sm"><ArrowLeft size={14} /> Back to ranked targets</Link></div>
      </header>

      <main className="mx-auto max-w-[1320px] px-5 py-8 md:px-8 lg:py-10">
        <section className="rounded-3xl bg-ink p-6 text-white shadow-soft md:p-8 lg:p-10">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2"><Badge tone={assessment.mode === "live" ? "green" : "amber"}>{assessment.mode === "live" ? "Live evidence-backed profile" : assessment.mode === "demo" ? "Curated evidence profile" : "Mock profile"}</Badge><Badge>{assessment.confidence} confidence</Badge></div>
              <h1 className="mt-5 text-3xl font-semibold tracking-[-.04em] md:text-5xl">{assessment.companyName}</h1>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#bec8ba]"><span className="flex items-center gap-2"><Building2 size={14} />{assessment.sector}</span><span className="flex items-center gap-2"><MapPin size={14} />{assessment.location}</span><a href={assessment.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-lime hover:underline"><Link2 size={14} />{new URL(assessment.website).hostname}<ArrowUpRight size={12} /></a></div>
            </div>
            <div className="flex items-end gap-4"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-[.14em] text-[#9eaa9b]">Weighted score</p><ScorePill value={assessment.totalScore} large /></div><div className="pb-1 text-[11px] leading-4 text-[#aebaaa]">out of 5.00<br />across 5 criteria</div></div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <Card title="Acquisition thesis" icon={<Sparkles size={17} />}>
              <p className="text-sm leading-7 text-[#566155]">{assessment.overview}</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Products & services" value={assessment.productsServices} /><Field label="Likely customer type" value={assessment.customerType} /><Field label="Business model" value={assessment.businessModel} /><Field label="Repeat revenue" value={assessment.recurringRevenueCharacteristics} /></div>
            </Card>

            <Card title="Operating perspective" icon={<Building2 size={17} />}>
              <div className="grid gap-4 sm:grid-cols-2"><Field label="Operational complexity" value={assessment.operationalComplexity} /><Field label="Ownership / succession" value={assessment.successionOwnershipIndicators} /></div>
              <div className="mt-5"><ListSection title="Potential AI & automation opportunities" items={assessment.aiAutomationOpportunities} tone="green" /></div>
            </Card>

            <Card title="Risk & diligence map" icon={<ShieldAlert size={17} />}>
              <div className="grid gap-6 md:grid-cols-2"><ListSection title="Key risks" items={assessment.keyRisks} tone="amber" /><ListSection title="Information gaps" items={assessment.informationGaps} tone="neutral" /></div>
            </Card>

            <Card title="Source evidence" icon={<Link2 size={17} />}>
              <div className="space-y-2">{assessment.sourceUrls.map((url) => <a key={url} href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 rounded-xl border border-[#e3e7df] bg-[#fafbf8] px-4 py-3 text-xs font-semibold text-moss-700 hover:border-moss-100 hover:bg-moss-50"><span className="truncate">{url}</span><ArrowUpRight className="shrink-0" size={14} /></a>)}</div>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card title="Scorecard" icon={<CheckCircle2 size={17} />}>
              <div className="space-y-5">{Object.entries(assessment.scores).map(([key, score]) => <div key={key}><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold">{scoreLabels[key as keyof typeof scoreLabels]}</p><p className="mt-1 text-[10px] text-[#8a9289]">Weight {Math.round(scoreWeights[key as keyof typeof scoreWeights] * 100)}%</p></div><ScorePill value={score.value} /></div><div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#edf0e9]"><div className="h-full rounded-full bg-moss-500" style={{ width: `${score.value * 20}%` }} /></div><p className="mt-2 text-[10px] leading-4 text-[#717b70]">{score.evidence}</p></div>)}</div>
              <div className="mt-5 rounded-xl bg-moss-50 p-4"><p className="text-[10px] font-bold uppercase tracking-[.13em] text-moss-700">Overall rationale</p><p className="mt-2 text-xs leading-5 text-[#586657]">{assessment.scoreExplanation}</p></div>
            </Card>

            <Card title="Introductory outreach" icon={<Mail size={17} />}>
              <pre className="whitespace-pre-wrap font-sans text-xs leading-6 text-[#566155]">{assessment.outreachDraft}</pre>
              <button onClick={copyOutreach} className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-ink text-xs font-bold text-white hover:bg-[#243426]"><Clipboard size={14} />{copied ? "Copied" : "Copy outreach draft"}</button>
            </Card>

            <div className="flex items-center gap-3 px-2 text-[10px] text-[#818a80]"><Calendar size={14} /><span>Generated {new Date(assessment.generatedAt).toLocaleString("en-NL", { dateStyle: "medium", timeStyle: "short" })}</span></div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-[#dfe3dc] bg-white p-6 shadow-card"><div className="mb-5 flex items-center gap-2.5 border-b border-[#edf0ea] pb-4 text-sm font-bold"><span className="text-moss-500">{icon}</span><h2>{title}</h2></div>{children}</section>;
}

function Field({ label, value }: { label: string; value: string }) {
  const missing = value.toLowerCase().startsWith("information unavailable");
  return <div className="rounded-xl bg-[#fafbf8] p-4 ring-1 ring-inset ring-[#e7eae4]"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#7f887e]">{label}</p><p className={`mt-2 text-xs leading-5 ${missing ? "font-semibold text-[#a16b43]" : "text-[#536052]"}`}>{value}</p></div>;
}

function ListSection({ title, items, tone }: { title: string; items: string[]; tone: "green" | "amber" | "neutral" }) {
  const dots = { green: "bg-moss-400", amber: "bg-[#d79b5a]", neutral: "bg-[#aeb7ac]" };
  return <div><h3 className="text-[10px] font-bold uppercase tracking-[.12em] text-[#7f887e]">{title}</h3><ul className="mt-3 space-y-2.5">{items.map((item, index) => <li key={`${item}-${index}`} className="flex gap-3 text-xs leading-5 text-[#596558]"><span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dots[tone]}`} />{item}</li>)}</ul></div>;
}
