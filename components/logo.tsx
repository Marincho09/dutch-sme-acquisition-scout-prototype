import { Sparkles } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink text-lime shadow-sm">
        <Sparkles size={18} strokeWidth={2.3} />
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="text-[15px] font-semibold tracking-tight text-ink">Sourcing Copilot</div>
          <div className="text-[10px] font-bold uppercase tracking-[.16em] text-moss-500">Search fund intelligence</div>
        </div>
      )}
    </div>
  );
}
