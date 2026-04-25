'use client';

import { useLocale, useTranslations } from 'next-intl';
import { TransactionListItem } from '@/components/ui/TransactionListItem';
import { useTransactions } from '@/lib/db/useTransactions';
import {
  formatTransactionAmount,
  formatTransactionDate,
} from '@/lib/transactions/summary';

export function RecentTransactions() {
  const locale = useLocale();
  const home = useTranslations('home');
  const { transactions } = useTransactions();
  const recentTransactions = transactions.slice(0, 3);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{home('recentTransactions')}</h2>

        <button type="button" className="text-sm text-zinc-500">
          {home('seeAll')}
        </button>
      </div>

      <div className="space-y-3">
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction) => (
            <TransactionListItem
              key={transaction.id}
              title={transaction.description}
              subtitle={`${transaction.category} • ${formatTransactionDate(
                transaction.date,
                locale
              )}`}
              amount={formatTransactionAmount(
                transaction.amount,
                transaction.type,
                locale
              )}
              type={transaction.type}
            />
          ))
        ) : (
          <p className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-500">
            {home('empty')}
          </p>
        )}
      </div>
    </section>
  );
}
