import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

type TransactionListItemProps = {
  title: string;
  subtitle: string;
  amount: string;
  type: 'income' | 'expense' | 'benefit';
};

export function TransactionListItem({
  title,
  subtitle,
  amount,
  type,
}: TransactionListItemProps) {
  const isPositive = type === 'income' || type === 'benefit';
  const Icon = isPositive ? ArrowDownLeft : ArrowUpRight;

  return (
    <div className="flex items-center justify-between rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={
            isPositive
              ? 'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400'
              : 'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-400/10 text-red-400'
          }
        >
          <Icon size={20} />
        </div>

        <div className="min-w-0">
          <p className="truncate font-medium">{title}</p>

          <p className="mt-1 truncate text-sm text-zinc-500">
            {subtitle}
          </p>
        </div>
      </div>

      <span
        className={
          isPositive
            ? 'shrink-0 font-semibold text-emerald-400'
            : 'shrink-0 font-semibold text-red-400'
        }
      >
        {amount}
      </span>
    </div>
  );
}