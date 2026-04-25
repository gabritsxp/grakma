type ReportInsightRowProps = {
  label: string;
  value: string;
};

export function ReportInsightRow({ label, value }: ReportInsightRowProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-black p-4">
      <span className="text-sm text-zinc-500">{label}</span>

      <strong className="text-sm font-semibold">{value}</strong>
    </div>
  );
}