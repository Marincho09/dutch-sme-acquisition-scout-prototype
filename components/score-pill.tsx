export function ScorePill({ value, large = false }: { value: number; large?: boolean }) {
  const tone = value >= 4 ? "bg-moss-50 text-moss-700" : value >= 3 ? "bg-[#f2f3eb] text-[#526052]" : "bg-[#fff0eb] text-[#9b4e39]";
  return (
    <span className={`inline-grid place-items-center rounded-lg font-bold tabular-nums ${tone} ${large ? "h-12 min-w-16 px-3 text-lg" : "h-8 min-w-9 px-2 text-xs"}`}>
      {Number.isInteger(value) ? value : value.toFixed(2)}
    </span>
  );
}
