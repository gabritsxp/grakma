import type { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

type StatCardProps = {
  label: string;
  value: string;
  icon?: LucideIcon;
  trend?: string;
  tone?: 'default' | 'positive' | 'negative';
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  tone = 'default',
}: StatCardProps) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
      {Icon && (
        <div
          className={clsx(
            'mb-4 flex h-9 w-9 items-center justify-center rounded-2xl bg-zinc-900',
            tone === 'default' && 'text-zinc-300',
            tone === 'positive' && 'text-emerald-400',
            tone === 'negative' && 'text-red-400'
          )}
        >
          <Icon size={18} />
        </div>
      )}

      <p className="text-xs text-zinc-500">{label}</p>

      <strong
        className={clsx(
          'mt-1 block text-sm font-semibold',
          tone === 'default' && 'text-white',
          tone === 'positive' && 'text-emerald-400',
          tone === 'negative' && 'text-red-400'
        )}
      >
        {value}
      </strong>

      {trend && (
        <span className="mt-2 block text-[11px] text-zinc-500">
          {trend}
        </span>
      )}
    </div>
  );
}