'use client';

import { ArrowDownLeft, ArrowUpRight, CreditCard } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { StatCard } from '@/components/ui/StatCard';
import { useTransactions } from '@/lib/db/useTransactions';
import {
  formatCurrency,
  getCurrentMonthTransactions,
  summarizeTransactions,
} from '@/lib/transactions/summary';

export function SummaryCards() {
  const locale = useLocale();
  const t = useTranslations('home');
  const { transactions } = useTransactions();
  const summary = summarizeTransactions(getCurrentMonthTransactions(transactions));

  const summaryCards = [
    {
      label: t('income'),
      value: formatCurrency(summary.confirmedIncome, locale),
      icon: ArrowDownLeft,
      tone: 'positive' as const,
    },
    {
      label: t('expenses'),
      value: formatCurrency(summary.confirmedExpenses, locale),
      icon: ArrowUpRight,
      tone: 'negative' as const,
    },
    {
      label: t('benefit'),
      value: formatCurrency(summary.confirmedBenefit, locale),
      icon: CreditCard,
      trend: t('available'),
      tone: 'default' as const,
    },
  ];

  return (
    <section className="grid grid-cols-3 gap-3">
      {summaryCards.map((card) => (
        <StatCard
          key={card.label}
          label={card.label}
          value={card.value}
          trend={card.trend}
          icon={card.icon}
          tone={card.tone}
        />
      ))}
    </section>
  );
}
