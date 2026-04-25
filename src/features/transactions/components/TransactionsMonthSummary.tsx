'use client';

import { CalendarDays } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { IconButton } from '@/components/ui/IconButton';
import { SectionCard } from '@/components/ui/SectionCard';
import { StatCard } from '@/components/ui/StatCard';
import { useTransactions } from '@/lib/db/useTransactions';
import {
  formatCurrency,
  getCurrentMonthLabel,
  getCurrentMonthTransactions,
  summarizeTransactions,
} from '@/lib/transactions/summary';

export function TransactionsMonthSummary() {
  const locale = useLocale();
  const t = useTranslations('transactionsPage');
  const { transactions } = useTransactions();
  const monthTransactions = getCurrentMonthTransactions(transactions);
  const summary = summarizeTransactions(monthTransactions);

  return (
    <SectionCard>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500">
            {getCurrentMonthLabel(locale)}
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            {formatCurrency(summary.balance, locale)}
          </h2>
        </div>

        <IconButton
          icon={CalendarDays}
          label={t('selectMonth')}
          className="h-12 w-12 rounded-2xl"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label={t('income')}
          value={formatCurrency(summary.income, locale)}
          tone="positive"
        />

        <StatCard
          label={t('expenses')}
          value={formatCurrency(summary.expenses, locale)}
          tone="negative"
        />
      </div>
    </SectionCard>
  );
}
