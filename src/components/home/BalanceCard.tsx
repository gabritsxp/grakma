'use client';

import { Plus, Wallet } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { SectionCard } from '@/components/ui/SectionCard';
import { useTransactions } from '@/lib/db/useTransactions';
import {
  formatCurrency,
  summarizeTransactions,
} from '@/lib/transactions/summary';

export function BalanceCard() {
  const locale = useLocale();
  const t = useTranslations('home');
  const { transactions } = useTransactions();
  const summary = summarizeTransactions(transactions);

  return (
    <SectionCard className="shadow-2xl shadow-black/30">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500">{t('availableBalance')}</p>

          <h2 className="mt-1 text-3xl font-semibold tracking-tight">
            {formatCurrency(summary.balance, locale)}
          </h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
          <Wallet size={24} />
        </div>
      </div>

      <Button asChild>
        <Link href="/add">
          <Plus size={18} />
          {t('addTransaction')}
        </Link>
      </Button>
    </SectionCard>
  );
}
