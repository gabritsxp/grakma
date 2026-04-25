import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  type LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { TransactionType } from '@/lib/db/database';

type TransactionTypeOption = {
  value: TransactionType;
  label: string;
  description: string;
  icon: LucideIcon;
};

type TransactionTypeSelectorProps = {
  value: TransactionType;
  onChange: (value: TransactionType) => void;
};

export function TransactionTypeSelector({
  value,
  onChange,
}: TransactionTypeSelectorProps) {
  const t = useTranslations('add');

  const transactionTypes: TransactionTypeOption[] = [
    {
      value: 'income',
      label: t('income'),
      description: t('incomeDescription'),
      icon: ArrowDownLeft,
    },
    {
      value: 'expense',
      label: t('expense'),
      description: t('expenseDescription'),
      icon: ArrowUpRight,
    },
    {
      value: 'benefit',
      label: t('benefit'),
      description: t('benefitDescription'),
      icon: CreditCard,
    },
  ];

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium text-zinc-400">
        {t('transactionType')}
      </h2>

      <div className="grid gap-3">
        {transactionTypes.map((type) => {
          const Icon = type.icon;
          const isActive = value === type.value;

          return (
            <button
              key={type.value}
              type="button"
              onClick={() => onChange(type.value)}
              className={
                isActive
                  ? 'flex items-center gap-4 rounded-3xl border border-white bg-white p-4 text-left text-black'
                  : 'flex items-center gap-4 rounded-3xl border border-zinc-800 bg-zinc-950 p-4 text-left text-white'
              }
            >
              <div
                className={
                  isActive
                    ? 'flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white'
                    : 'flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-400'
                }
              >
                <Icon size={22} />
              </div>

              <div>
                <p className="font-semibold">{type.label}</p>

                <p
                  className={
                    isActive
                      ? 'mt-1 text-sm text-zinc-700'
                      : 'mt-1 text-sm text-zinc-500'
                  }
                >
                  {type.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
