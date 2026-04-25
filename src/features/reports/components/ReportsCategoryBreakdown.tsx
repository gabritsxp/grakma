'use client';

import { useLocale, useTranslations } from 'next-intl';
import { SectionCard } from '@/components/ui/SectionCard';
import { ReportCategoryRow } from '@/features/reports/components/ReportCategoryRow';
import { useTransactions } from '@/lib/db/useTransactions';
import {
  formatCurrency,
  getCurrentMonthTransactions,
  summarizeExpenseCategories,
} from '@/lib/transactions/summary';

export function ReportsCategoryBreakdown() {
  const locale = useLocale();
  const t = useTranslations('reports');
  const { transactions } = useTransactions();
  const monthTransactions = getCurrentMonthTransactions(transactions);
  const categories = summarizeExpenseCategories(monthTransactions);

  return (
    <SectionCard className="space-y-4">
      <h2 className="text-lg font-semibold">{t('byCategory')}</h2>

      <div className="space-y-3">
        {categories.length > 0 ? (
          categories.map((category) => (
            <ReportCategoryRow
              key={category.category}
              label={category.category}
              value={formatCurrency(category.total, locale)}
              percent={`${category.percent}%`}
            />
          ))
        ) : (
          <p className="rounded-2xl bg-black p-4 text-sm text-zinc-500">
            {t('empty')}
          </p>
        )}
      </div>
    </SectionCard>
  );
}
