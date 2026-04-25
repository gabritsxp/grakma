type SettingsItemProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function SettingsItem({
  title,
  description,
  action,
}: SettingsItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-black p-4">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>

        <p className="mt-1 text-xs text-zinc-500">{description}</p>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}