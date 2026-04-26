'use client';

import { useLocale, useTranslations } from 'next-intl';
import { SectionCard } from '@/components/ui/SectionCard';
import { StatCard } from '@/components/ui/StatCard';
import { useTransactions } from '@/lib/db/useTransactions';
import {
  addCalendarMonths,
  formatCurrency,
  getMonthLabel,
  getMonthTransactions,
  getTransactionsUntilMonth,
  summarizeAccounts,
  summarizeTransactions,
} from '@/lib/transactions/summary';
import { MonthSelector } from '@/components/ui/MonthSelector';

type TransactionsMonthSummaryProps = {
  monthDate: Date;
  onMonthChange: (monthDate: Date) => void;
};

export function TransactionsMonthSummary({
  monthDate,
  onMonthChange,
}: TransactionsMonthSummaryProps) {
  const locale = useLocale();
  const t = useTranslations('transactionsPage');
  const { transactions } = useTransactions();
  const monthTransactions = getMonthTransactions(transactions, monthDate);
  const accumulatedTransactions = getTransactionsUntilMonth(
    transactions,
    monthDate
  );
  const summary = summarizeTransactions(monthTransactions);
  const accumulatedSummary = summarizeTransactions(accumulatedTransactions);
  const accountForecasts = summarizeAccounts(accumulatedTransactions);

  return (
    <SectionCard>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500">{getMonthLabel(locale, monthDate)}</p>

          <h2 className="mt-1 text-xl font-semibold">
            {formatCurrency(accumulatedSummary.balance, locale)}
          </h2>
        </div>

        <MonthSelector value={monthDate} onChange={onMonthChange} />
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

        <StatCard
          label={t('confirmed')}
          value={formatCurrency(accumulatedSummary.confirmedBalance, locale)}
          tone="positive"
        />

        <StatCard
          label={t('pending')}
          value={formatCurrency(
            accumulatedSummary.balance - accumulatedSummary.confirmedBalance,
            locale
          )}
        />
      </div>

      {accountForecasts.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium text-zinc-400">
            {t('accountForecast')}
          </h3>

          {accountForecasts.map((account) => (
            <div
              key={account.accountId || account.account}
              className="rounded-2xl bg-black p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">{account.account}</span>
                <strong className="text-sm">
                  {formatCurrency(account.balance, locale)}
                </strong>
              </div>

              <p className="mt-1 text-xs text-zinc-500">
                {t('income')}: {formatCurrency(account.income, locale)} •{' '}
                {t('expenses')}: {formatCurrency(account.expenses, locale)}
              </p>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
