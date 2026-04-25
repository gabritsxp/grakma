type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, action }: PageHeaderProps) {
  return (
    <header className="space-y-1">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-sm text-zinc-500">
              {eyebrow}
            </p>
          )}

          <h1 className="truncate text-2xl font-semibold tracking-tight">
            {title}
          </h1>
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}