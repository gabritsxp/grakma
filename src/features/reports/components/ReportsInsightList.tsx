'use client';

import { useLocale, useTranslations } from 'next-intl';
import { SectionCard } from '@/components/ui/SectionCard';
import { ReportInsightRow } from '@/features/reports/components/ReportInsightRow';
import { useTransactions } from '@/lib/db/useTransactions';
import {
  formatCurrency,
  getCurrentMonthTransactions,
  getHighestExpense,
  getMostUsedCategory,
  summarizeTransactions,
} from '@/lib/transactions/summary';

export function ReportsInsightList() {
  const locale = useLocale();
  const t = useTranslations('reports');
  const { transactions } = useTransactions();
  const monthTransactions = getCurrentMonthTransactions(transactions);
  const summary = summarizeTransactions(monthTransactions);
  const highestExpense = getHighestExpense(monthTransactions);
  const mostUsedCategory = getMostUsedCategory(monthTransactions);

  return (
    <SectionCard className="space-y-3">
      <h2 className="text-lg font-semibold">{t('monthlyCashFlow')}</h2>

      <ReportInsightRow
        label={t('availableAfterExpenses')}
        value={formatCurrency(summary.confirmedBalance, locale)}
      />

      <ReportInsightRow
        label={t('highestExpense')}
        value={highestExpense?.description ?? '-'}
      />

      <ReportInsightRow
        label={t('mostUsedCategory')}
        value={mostUsedCategory ?? '-'}
      />
    </SectionCard>
  );
}
