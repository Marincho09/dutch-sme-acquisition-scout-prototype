import React, { type ReactNode } from "react";

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "green" | "amber" | "dark" }) {
  const tones = {
    neutral: "bg-[#eef0e9] text-[#5b665b] ring-[#dfe4da]",
    green: "bg-moss-50 text-moss-700 ring-moss-100",
    amber: "bg-[#fff5d9] text-[#836619] ring-[#f4e5b8]",
    dark: "bg-ink text-white ring-ink",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${tones[tone]}`}>{children}</span>;
}
