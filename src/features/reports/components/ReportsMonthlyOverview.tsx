'use client';

import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  PiggyBank,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { SectionCard } from '@/components/ui/SectionCard';
import { StatCard } from '@/components/ui/StatCard';
import { useTransactions } from '@/lib/db/useTransactions';
import {
  formatCurrency,
  getCurrentMonthTransactions,
  summarizeTransactions,
} from '@/lib/transactions/summary';

export function ReportsMonthlyOverview() {
  const locale = useLocale();
  const t = useTranslations('reports');
  const { transactions } = useTransactions();
  const monthTransactions = getCurrentMonthTransactions(transactions);
  const summary = summarizeTransactions(monthTransactions);

  return (
    <SectionCard className="space-y-4">
      <h2 className="text-lg font-semibold">{t('monthlyOverview')}</h2>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label={t('income')}
          value={formatCurrency(summary.income, locale)}
          icon={ArrowDownLeft}
          tone="positive"
        />

        <StatCard
          label={t('expenses')}
          value={formatCurrency(summary.expenses, locale)}
          icon={ArrowUpRight}
          tone="negative"
        />

        <StatCard
          label={t('balance')}
          value={formatCurrency(summary.balance, locale)}
          icon={PiggyBank}
        />

        <StatCard
          label={t('benefit')}
          value={formatCurrency(summary.benefit, locale)}
          icon={CreditCard}
        />
      </div>
    </SectionCard>
  );
}
