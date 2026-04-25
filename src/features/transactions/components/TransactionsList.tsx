'use client';

import { useLocale, useTranslations } from 'next-intl';
import { TransactionListItem } from '@/components/ui/TransactionListItem';
import { useTransactions } from '@/lib/db/useTransactions';
import {
  formatTransactionAmount,
  formatTransactionDate,
} from '@/lib/transactions/summary';

export function TransactionsList() {
  const locale = useLocale();
  const page = useTranslations('transactionsPage');
  const { transactions } = useTransactions();

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">
        {page('allTransactions')}
      </h2>

      <div className="space-y-3">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
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
            {page('empty')}
          </p>
        )}
      </div>
    </section>
  );
}
