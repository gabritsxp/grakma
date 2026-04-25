type ReportCategoryRowProps = {
  label: string;
  value: string;
  percent: string;
};

export function ReportCategoryRow({
  label,
  value,
  percent,
}: ReportCategoryRowProps) {
  return (
    <div className="space-y-2 rounded-2xl bg-black p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-zinc-400">{value}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-zinc-900">
        <div
          className="h-full rounded-full bg-white"
          style={{ width: percent }}
        />
      </div>

      <p className="text-right text-xs text-zinc-500">{percent}</p>
    </div>
  );
}
