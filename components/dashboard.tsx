"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowDownToLine, ArrowRight, BarChart3, Building2, Check, ChevronDown, ChevronUp,
  CircleAlert, FileSpreadsheet, LayoutDashboard, Link2, Loader2, Menu, Search, Settings2,
  Sparkles, UploadCloud, Users, X,
} from "lucide-react";
import { assessmentSchema, type Assessment, type CompanyInput } from "@/lib/schema";
import { assessmentsToCsv, parseCompanyCsv } from "@/lib/csv";
import { Badge } from "@/components/badge";
import { Logo } from "@/components/logo";
import { ScorePill } from "@/components/score-pill";
import { scoreLabels, scoreWeights } from "@/lib/scoring";
import { DashboardPanelDialog, type DashboardPanel } from "@/components/dashboard-panels";

type Stage = "empty" | "ready" | "running" | "complete";
type NavigationView = "workspace" | "library" | DashboardPanel;

export function Dashboard() {
  const [companies, setCompanies] = useState<CompanyInput[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [stage, setStage] = useState<Stage>("empty");
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [panel, setPanel] = useState<DashboardPanel | null>(null);
  const [activeNav, setActiveNav] = useState<NavigationView>("workspace");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const ranked = useMemo(
    () => [...assessments].sort((a, b) => b.totalScore - a.totalScore || a.companyName.localeCompare(b.companyName)),
    [assessments],
  );
  const visible = ranked.filter((item) => `${item.companyName} ${item.sector} ${item.location}`.toLowerCase().includes(query.toLowerCase()));
  const completed = assessments.length;
  const average = ranked.length ? ranked.reduce((sum, item) => sum + item.totalScore, 0) / ranked.length : 0;

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("sourcing-copilot-assessments") || "[]") as unknown[];
      const restored = stored.flatMap((item) => {
        const parsed = assessmentSchema.safeParse(item);
        return parsed.success ? [parsed.data] : [];
      });
      if (restored.length) {
        setAssessments(restored);
        setCompanies(restored.map((item) => ({ company_name: item.companyName, website_url: item.website })));
        setFileName("Previous analysis");
        setProgress(100);
        setStage("complete");
      }
    } catch {
      localStorage.removeItem("sourcing-copilot-assessments");
    }
  }, []);

  async function loadFile(file: File) {
    setErrors([]);
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setErrors(["Please upload a .csv file."]);
      return;
    }
    const result = parseCompanyCsv(await file.text());
    setErrors(result.errors);
    setCompanies(result.companies);
    setFileName(file.name);
    setAssessments([]);
    localStorage.removeItem("sourcing-copilot-assessments");
    setProgress(0);
    setStage(result.companies.length ? "ready" : "empty");
  }

  async function loadSample() {
    setErrors([]);
    try {
      const response = await fetch("/sample-companies.csv");
      if (!response.ok) throw new Error("Sample file request failed");
      const result = parseCompanyCsv(await response.text());
      setCompanies(result.companies);
      setErrors(result.errors);
      setFileName("sample-companies.csv");
      setAssessments([]);
      localStorage.removeItem("sourcing-copilot-assessments");
      setProgress(0);
      setStage("ready");
    } catch {
      setErrors(["The sample file could not be loaded."]);
    }
  }

  async function runAnalysis() {
    if (!companies.length || stage === "running") return;
    setStage("running");
    setErrors([]);
    setAssessments([]);
    localStorage.removeItem("sourcing-copilot-assessments");
    const completedItems: Assessment[] = [];
    const runErrors: string[] = [];

    for (let index = 0; index < companies.length; index += 1) {
      const company = companies[index];
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company }),
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Analysis failed");
        const assessment = assessmentSchema.parse(payload.assessment);
        completedItems.push(assessment);
        setAssessments([...completedItems]);
        localStorage.setItem("sourcing-copilot-assessments", JSON.stringify(completedItems));
      } catch (error) {
        if (error instanceof TypeError && /fetch|network/i.test(error.message)) {
          setErrors(["The analysis service is unavailable. Keep the development server running, refresh the page, and retry."]);
          setProgress(Math.round((completedItems.length / companies.length) * 100));
          setStage(completedItems.length ? "complete" : "ready");
          return;
        }
        runErrors.push(`${company.company_name}: ${error instanceof Error ? error.message : "Analysis failed"}`);
        setErrors([...runErrors]);
      }
      setProgress(Math.round(((index + 1) / companies.length) * 100));
    }
    setStage("complete");
  }

  function reset() {
    setCompanies([]);
    setAssessments([]);
    setErrors([]);
    setFileName("");
    setProgress(0);
    setStage("empty");
    localStorage.removeItem("sourcing-copilot-assessments");
  }

  function openPanel(nextPanel: DashboardPanel) {
    setPanel(nextPanel);
    setActiveNav(nextPanel);
  }

  function closePanel() {
    setPanel(null);
    setActiveNav("workspace");
  }

  function clearSavedResults() {
    reset();
    closePanel();
  }

  function goToSection(view: "workspace" | "library", sectionId: string) {
    setMobileMenuOpen(false);
    setPanel(null);
    setActiveNav(view);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openNavigationPanel(nextPanel: DashboardPanel) {
    setMobileMenuOpen(false);
    openPanel(nextPanel);
  }

  function exportCsv() {
    const blob = new Blob([assessmentsToCsv(ranked)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `ranked-acquisition-targets-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[236px] flex-col border-r border-[#e1e4dc] bg-[#fbfcf8] px-5 py-6 lg:flex">
        <Logo />
        <nav className="mt-10 space-y-1.5" aria-label="Main navigation">
          <SideItem active={activeNav === "workspace"} icon={<LayoutDashboard size={17} />} label="Sourcing workspace" onClick={() => goToSection("workspace", "sourcing-workspace")} />
          <SideItem active={activeNav === "library"} icon={<Building2 size={17} />} label="Target library" count={assessments.length || undefined} onClick={() => goToSection("library", "target-library")} />
          <SideItem active={activeNav === "scorecards"} icon={<BarChart3 size={17} />} label="Scorecards" onClick={() => openPanel("scorecards")} />
          <SideItem active={activeNav === "outreach"} icon={<Users size={17} />} label="Outreach" onClick={() => openPanel("outreach")} />
        </nav>
        <div className="mt-auto rounded-2xl border border-[#dfe5db] bg-moss-50 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-moss-700"><Sparkles size={14} /> Evidence policy</div>
          <p className="mt-2 text-[11px] leading-5 text-[#60705e]">Unsupported financial, employee, ownership and succession claims are always marked unavailable.</p>
        </div>
        <button onClick={() => openPanel("settings")} className={`mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold ${activeNav === "settings" ? "bg-ink text-white" : "text-[#697268] hover:bg-[#f1f3ed]"}`}><Settings2 size={16} /> Settings</button>
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-ink/35 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" />
          <aside className="absolute inset-y-0 left-0 flex w-[280px] flex-col border-r border-[#e1e4dc] bg-[#fbfcf8] px-5 py-6 shadow-2xl">
            <div className="flex items-center justify-between"><Logo /><button onClick={() => setMobileMenuOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl border border-[#dfe3dc]" aria-label="Close menu"><X size={17} /></button></div>
            <nav className="mt-9 space-y-1.5" aria-label="Mobile navigation">
              <SideItem active={activeNav === "workspace"} icon={<LayoutDashboard size={17} />} label="Sourcing workspace" onClick={() => goToSection("workspace", "sourcing-workspace")} />
              <SideItem active={activeNav === "library"} icon={<Building2 size={17} />} label="Target library" count={assessments.length || undefined} onClick={() => goToSection("library", "target-library")} />
              <SideItem active={activeNav === "scorecards"} icon={<BarChart3 size={17} />} label="Scorecards" onClick={() => openNavigationPanel("scorecards")} />
              <SideItem active={activeNav === "outreach"} icon={<Users size={17} />} label="Outreach" onClick={() => openNavigationPanel("outreach")} />
              <SideItem active={activeNav === "settings"} icon={<Settings2 size={17} />} label="Settings" onClick={() => openNavigationPanel("settings")} />
            </nav>
          </aside>
        </div>
      )}

      <main id="sourcing-workspace" className="scroll-mt-24 lg:pl-[236px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-[#e1e4dc] bg-cream/90 px-5 backdrop-blur-xl md:px-8 lg:px-10">
          <div className="flex items-center gap-3 lg:hidden"><button onClick={() => setMobileMenuOpen(true)} className="rounded-lg p-2" aria-label="Open menu"><Menu size={20} /></button><Logo compact /></div>
          <div className="hidden lg:block">
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-moss-500">Workspace</p>
            <h1 className="text-base font-semibold tracking-tight">Dutch SME target sourcing</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge tone={assessments[0]?.mode === "live" ? "green" : "amber"}>
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />{modeLabel(assessments[0]?.mode)}
            </Badge>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-ink text-xs font-bold text-lime">SF</div>
          </div>
        </header>

        <div className="mx-auto max-w-[1440px] px-5 py-7 md:px-8 lg:px-10 lg:py-9">
          <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-moss-100 bg-white px-3 py-1 text-[11px] font-bold text-moss-700 shadow-sm"><span className="h-1.5 w-1.5 rounded-full bg-moss-400" /> ACQUISITION PIPELINE</div>
              <h2 className="max-w-3xl text-3xl font-semibold leading-[1.12] tracking-[-.035em] md:text-[42px]">Find the businesses worth a <span className="text-moss-500">closer look.</span></h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#697268]">Upload a target list. The copilot researches public evidence, applies your scorecard and prepares a ranked shortlist.</p>
            </div>
            {ranked.length > 0 && (
              <button onClick={exportCsv} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#d9ded5] bg-white px-4 text-xs font-bold shadow-sm transition hover:-translate-y-0.5 hover:shadow-card">
                <ArrowDownToLine size={15} /> Export ranked CSV
              </button>
            )}
          </section>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="overflow-hidden rounded-3xl border border-[#dfe3dc] bg-white shadow-card">
              <div className="grid-noise border-b border-[#e6e9e2] px-5 py-5 md:px-7">
                <div className="flex items-start justify-between gap-4">
                  <div><h3 className="text-sm font-bold">Import target companies</h3><p className="mt-1 text-xs text-[#788177]">Required columns: company_name, website_url</p></div>
                  {fileName && <button onClick={reset} className="rounded-lg p-1.5 text-[#747c73] hover:bg-white" aria-label="Clear file"><X size={16} /></button>}
                </div>
              </div>
              <div className="p-5 md:p-7">
                <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(event) => event.target.files?.[0] && loadFile(event.target.files[0])} />
                <div
                  onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
                  onDragOver={(event) => event.preventDefault()}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(event) => { event.preventDefault(); setDragging(false); if (event.dataTransfer.files[0]) loadFile(event.dataTransfer.files[0]); }}
                  className={`relative flex min-h-[168px] flex-col items-center justify-center rounded-2xl border border-dashed px-6 text-center transition ${dragging ? "border-moss-500 bg-moss-50" : "border-[#cfd6cc] bg-[#fafbf8]"}`}
                >
                  <div className={`grid h-11 w-11 place-items-center rounded-2xl ${fileName ? "bg-moss-50 text-moss-700" : "bg-white text-moss-500 shadow-sm ring-1 ring-[#e3e7df]"}`}>
                    {fileName ? <FileSpreadsheet size={21} /> : <UploadCloud size={21} />}
                  </div>
                  {fileName ? (
                    <><p className="mt-3 text-sm font-bold">{fileName}</p><p className="mt-1 text-xs text-[#758074]">{companies.length} valid companies ready for assessment</p></>
                  ) : (
                    <><p className="mt-3 text-sm font-bold">Drop your CSV here, or <button onClick={() => inputRef.current?.click()} className="text-moss-700 underline decoration-moss-100 decoration-2 underline-offset-4">browse</button></p><p className="mt-1.5 text-xs text-[#7b847a]">Up to 100 companies · CSV only</p></>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <button onClick={loadSample} disabled={stage === "running"} className="text-xs font-bold text-moss-700 hover:underline">Use 10-company sample</button>
                  <button onClick={runAnalysis} disabled={!companies.length || stage === "running"} className="inline-flex h-11 items-center gap-2 rounded-xl bg-ink px-5 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#243426] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0">
                    {stage === "running" ? <><Loader2 size={15} className="animate-spin" /> Researching {completed + 1} of {companies.length}</> : <>Research & rank targets <ArrowRight size={15} /></>}
                  </button>
                </div>
                {errors.length > 0 && (
                  <div className="mt-4 rounded-xl border border-[#f1d4c9] bg-[#fff7f3] p-3 text-xs text-[#944f3c]">
                    <div className="flex items-center gap-2 font-bold"><CircleAlert size={14} /> {errors.length} issue{errors.length > 1 ? "s" : ""}</div>
                    <ul className="mt-2 space-y-1 pl-5">{errors.slice(0, 4).map((error) => <li key={error} className="list-disc">{error}</li>)}</ul>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-ink p-6 text-white shadow-card">
              <div className="flex items-center justify-between"><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#aebaaa]">Analysis run</p><div className="grid h-8 w-8 place-items-center rounded-xl bg-white/10 text-lime"><Sparkles size={15} /></div></div>
              <div className="mt-7 flex items-end gap-2"><span className="text-4xl font-semibold tracking-[-.05em]">{stage === "empty" ? "—" : `${progress}%`}</span>{stage === "complete" && <Check className="mb-1 text-lime" size={20} />}</div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-lime transition-all duration-500" style={{ width: `${progress}%` }} /></div>
              <div className="mt-6 space-y-3 text-xs">
                <StatusRow done={stage !== "empty"} label="CSV validated" value={companies.length ? `${companies.length} targets` : "Waiting"} />
                <StatusRow done={completed > 0} label="Profiles assessed" value={`${completed}/${companies.length || 0}`} />
                <StatusRow done={stage === "complete" && completed > 0} label="Ranking prepared" value={stage === "complete" ? "Ready" : "Pending"} />
              </div>
              <p className="mt-6 border-t border-white/10 pt-4 text-[10px] leading-4 text-[#aebaaa]">Runs sequentially so progress and per-company errors remain visible.</p>
            </div>
          </section>

          <section id="target-library" className="mt-8 scroll-mt-24">
            <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div><h3 className="text-lg font-bold tracking-tight">Ranked targets</h3><p className="mt-1 text-xs text-[#788177]">Weighted score across five acquisition criteria</p></div>
              <div className="flex items-center gap-2">
                {ranked.length > 0 && <Badge tone="green">Average {average.toFixed(2)}</Badge>}
                <label className="relative block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b938a]" size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter targets" className="h-9 w-48 rounded-xl border-[#dfe3dc] bg-white pl-9 pr-3 text-xs placeholder:text-[#9ba29a] focus:border-moss-400 focus:ring-moss-100" /></label>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-[#dfe3dc] bg-white shadow-card">
              {ranked.length === 0 ? (
                <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-moss-50 text-moss-500"><BarChart3 size={22} /></div>
                  <h4 className="mt-4 text-sm font-bold">Your shortlist will appear here</h4>
                  <p className="mt-2 max-w-sm text-xs leading-5 text-[#7a8379]">Load the sample CSV or upload your own target list to create ranked, expandable acquisition profiles.</p>
                </div>
              ) : (
                <div className="overflow-x-auto thin-scrollbar">
                  <table className="w-full min-w-[1000px] border-collapse text-left">
                    <thead><tr className="border-b border-[#e8ebe5] bg-[#fafbf8] text-[10px] font-bold uppercase tracking-[.11em] text-[#7e887d]">
                      <th className="w-16 px-5 py-3.5">Rank</th><th className="min-w-[240px] px-3 py-3.5">Target</th><th className="px-3 py-3.5">Sector</th><th className="text-center px-3 py-3.5">Model</th><th className="text-center px-3 py-3.5">Repeat</th><th className="text-center px-3 py-3.5">Moat</th><th className="text-center px-3 py-3.5">Total</th><th className="px-3 py-3.5">Confidence</th><th className="w-16 px-5 py-3.5"></th>
                    </tr></thead>
                    <tbody>{visible.map((item) => {
                      const rank = ranked.findIndex((candidate) => candidate.id === item.id) + 1;
                      const isOpen = expanded === item.id;
                      return [
                        <tr key={item.id} className={`border-b border-[#edf0ea] transition hover:bg-[#fbfcf9] ${isOpen ? "bg-moss-50/40" : ""}`}>
                          <td className="px-5 py-4"><span className={`grid h-7 w-7 place-items-center rounded-lg text-xs font-bold ${rank <= 3 ? "bg-ink text-lime" : "bg-[#f0f2eb] text-[#6c766b]"}`}>{String(rank).padStart(2, "0")}</span></td>
                          <td className="px-3 py-4"><div className="font-bold text-[13px]">{item.companyName}</div><a href={item.website} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-[10px] text-moss-500 hover:underline"><Link2 size={10} />{new URL(item.website).hostname}</a></td>
                          <td className="px-3 py-4"><div className="max-w-[155px] truncate text-xs font-medium">{item.sector}</div><div className="mt-1 max-w-[155px] truncate text-[10px] text-[#8a9289]">{item.location}</div></td>
                          <td className="px-3 py-4 text-center"><ScorePill value={item.scores.businessModelAttractiveness.value} /></td>
                          <td className="px-3 py-4 text-center"><ScorePill value={item.scores.recurringRevenue.value} /></td>
                          <td className="px-3 py-4 text-center"><ScorePill value={item.scores.defensibility.value} /></td>
                          <td className="px-3 py-4 text-center"><ScorePill value={item.totalScore} large /></td>
                          <td className="px-3 py-4"><Badge tone={item.confidence === "High" ? "green" : item.confidence === "Medium" ? "neutral" : "amber"}>{item.confidence}</Badge></td>
                          <td className="px-5 py-4"><button onClick={() => setExpanded(isOpen ? null : item.id)} className="grid h-8 w-8 place-items-center rounded-lg border border-[#e2e6df] text-[#697268] hover:bg-white" aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.companyName}`}>{isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</button></td>
                        </tr>,
                        isOpen ? <tr key={`${item.id}-details`}><td colSpan={9} className="border-b border-[#e6eae3] bg-[#fafbf8] p-0"><CompanyPreview assessment={item} /></td></tr> : null,
                      ];
                    })}</tbody>
                  </table>
                  {visible.length === 0 && <div className="py-16 text-center text-xs text-[#7b847a]">No targets match “{query}”.</div>}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <DashboardPanelDialog panel={panel} assessments={ranked} onClose={closePanel} onClearResults={clearSavedResults} />
    </div>
  );
}

function SideItem({ icon, label, active, count, onClick }: { icon: React.ReactNode; label: string; active?: boolean; count?: number; onClick: () => void }) {
  return <button onClick={onClick} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold ${active ? "bg-ink text-white shadow-sm" : "text-[#6d766c] hover:bg-[#f1f3ed]"}`}>{icon}<span>{label}</span>{count !== undefined && <span className="ml-auto text-[10px] opacity-70">{count}</span>}</button>;
}

function StatusRow({ done, label, value }: { done: boolean; label: string; value: string }) {
  return <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-[#c7d0c4]"><span className={`grid h-4 w-4 place-items-center rounded-full ${done ? "bg-lime text-ink" : "border border-white/20"}`}>{done && <Check size={10} strokeWidth={3} />}</span>{label}</span><span className="font-bold text-white">{value}</span></div>;
}

function CompanyPreview({ assessment }: { assessment: Assessment }) {
  return (
    <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_.8fr] lg:p-7">
      <div>
        <div className="flex items-center gap-2"><Badge tone={assessment.mode === "live" ? "green" : "amber"}>{assessment.mode === "live" ? "Live public research" : assessment.mode === "demo" ? "Curated public evidence" : "Mock assessment"}</Badge><Badge>{assessment.confidence} confidence</Badge></div>
        <h4 className="mt-4 text-base font-bold">Investment snapshot</h4>
        <p className="mt-2 text-xs leading-6 text-[#606a5f]">{assessment.overview}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Info label="Business model" value={assessment.businessModel} />
          <Info label="Recurring characteristics" value={assessment.recurringRevenueCharacteristics} />
          <Info label="Ownership / succession" value={assessment.successionOwnershipIndicators} />
          <Info label="Operational complexity" value={assessment.operationalComplexity} />
        </div>
        <div className="mt-5 rounded-xl border border-[#e3e7df] bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-[.13em] text-[#7a8479]">Score rationale</p><p className="mt-2 text-xs leading-5 text-[#5f695e]">{assessment.scoreExplanation}</p></div>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.13em] text-[#7a8479]">Criterion scores</p>
        <div className="mt-3 space-y-3">{Object.entries(assessment.scores).map(([key, score]) => (
          <div key={key} className="rounded-xl border border-[#e3e7df] bg-white p-3">
            <div className="flex items-center justify-between text-[11px] font-bold"><span>{scoreLabels[key as keyof typeof scoreLabels]}</span><span>{score.value}/5 · {Math.round(scoreWeights[key as keyof typeof scoreWeights] * 100)}%</span></div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eef0e9]"><div className="h-full rounded-full bg-moss-500" style={{ width: `${score.value * 20}%` }} /></div>
            <p className="mt-2 text-[10px] leading-4 text-[#788177]">{score.evidence}</p>
          </div>
        ))}</div>
        <Link href={`/targets/${assessment.id}`} className="mt-4 flex h-10 items-center justify-center gap-2 rounded-xl bg-ink text-xs font-bold text-white hover:bg-[#243426]">Open acquisition profile <ArrowRight size={14} /></Link>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  const unavailable = value.toLowerCase().startsWith("information unavailable");
  return <div className="rounded-xl border border-[#e4e7e1] bg-white p-3.5"><p className="text-[10px] font-bold uppercase tracking-[.11em] text-[#838b82]">{label}</p><p className={`mt-2 text-xs leading-5 ${unavailable ? "font-semibold text-[#a16b43]" : "text-[#536052]"}`}>{value}</p></div>;
}

function modeLabel(mode?: Assessment["mode"]): string {
  if (mode === "live") return "Live research";
  if (mode === "demo") return "Curated demo";
  return "Demo-ready";
}
