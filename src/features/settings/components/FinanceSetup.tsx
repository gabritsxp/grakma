'use client';

import { useState, type FormEvent } from 'react';
import { CreditCard, Tag, Wallet } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { SectionCard } from '@/components/ui/SectionCard';
import { TextInput } from '@/components/ui/TextInput';
import type { AccountType, PaymentMethodType, TransactionType } from '@/lib/db/database';
import {
  createAccount,
  createCategory,
  createPaymentMethod,
} from '@/lib/db/transactions';
import { useFinanceData } from '@/lib/db/useFinanceData';

export function FinanceSetup() {
  const t = useTranslations('financeSetup');
  const { categories, accounts, paymentMethods } = useFinanceData();
  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState<TransactionType | 'all'>('all');
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('checking');
  const [paymentMethodName, setPaymentMethodName] = useState('');
  const [paymentMethodType, setPaymentMethodType] =
    useState<PaymentMethodType>('pix');

  async function handleCreateCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!categoryName.trim()) {
      return;
    }

    await createCategory({
      name: categoryName,
      type: categoryType,
    });
    setCategoryName('');
  }

  async function handleCreateAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!accountName.trim()) {
      return;
    }

    await createAccount({
      name: accountName,
      type: accountType,
    });
    setAccountName('');
  }

  async function handleCreatePaymentMethod(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!paymentMethodName.trim()) {
      return;
    }

    await createPaymentMethod({
      name: paymentMethodName,
      type: paymentMethodType,
    });
    setPaymentMethodName('');
  }

  return (
    <SectionCard className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{t('title')}</h2>
        <p className="mt-1 text-sm text-zinc-500">{t('description')}</p>
      </div>

      <form className="space-y-3" onSubmit={handleCreateCategory}>
        <TextInput
          label={t('category')}
          icon={Tag}
          value={categoryName}
          onChange={(event) => setCategoryName(event.target.value)}
        />

        <select
          className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm text-zinc-200 outline-none"
          value={categoryType}
          onChange={(event) =>
            setCategoryType(event.target.value as TransactionType | 'all')
          }
        >
          <option value="all">{t('all')}</option>
          <option value="income">{t('income')}</option>
          <option value="expense">{t('expense')}</option>
          <option value="benefit">{t('benefit')}</option>
        </select>

        <Button type="submit" variant="secondary">
          {t('addCategory')}
        </Button>
      </form>

      <form className="space-y-3" onSubmit={handleCreateAccount}>
        <TextInput
          label={t('account')}
          icon={Wallet}
          value={accountName}
          onChange={(event) => setAccountName(event.target.value)}
        />

        <select
          className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm text-zinc-200 outline-none"
          value={accountType}
          onChange={(event) => setAccountType(event.target.value as AccountType)}
        >
          <option value="checking">{t('checking')}</option>
          <option value="savings">{t('savings')}</option>
          <option value="cash">{t('cash')}</option>
          <option value="credit_card">{t('creditCard')}</option>
          <option value="benefit_card">{t('benefitCard')}</option>
        </select>

        <Button type="submit" variant="secondary">
          {t('addAccount')}
        </Button>
      </form>

      <form className="space-y-3" onSubmit={handleCreatePaymentMethod}>
        <TextInput
          label={t('paymentMethod')}
          icon={CreditCard}
          value={paymentMethodName}
          onChange={(event) => setPaymentMethodName(event.target.value)}
        />

        <select
          className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm text-zinc-200 outline-none"
          value={paymentMethodType}
          onChange={(event) =>
            setPaymentMethodType(event.target.value as PaymentMethodType)
          }
        >
          <option value="pix">{t('pix')}</option>
          <option value="debit">{t('debit')}</option>
          <option value="credit">{t('credit')}</option>
          <option value="cash">{t('cash')}</option>
          <option value="bank_slip">{t('bankSlip')}</option>
          <option value="transfer">{t('transfer')}</option>
          <option value="benefit">{t('benefit')}</option>
        </select>

        <Button type="submit" variant="secondary">
          {t('addPaymentMethod')}
        </Button>
      </form>

      <div className="grid grid-cols-3 gap-2 text-center text-xs text-zinc-500">
        <div className="rounded-2xl bg-black p-3">
          <strong className="block text-base text-white">{categories.length}</strong>
          {t('categories')}
        </div>
        <div className="rounded-2xl bg-black p-3">
          <strong className="block text-base text-white">{accounts.length}</strong>
          {t('accounts')}
        </div>
        <div className="rounded-2xl bg-black p-3">
          <strong className="block text-base text-white">
            {paymentMethods.length}
          </strong>
          {t('paymentMethods')}
        </div>
      </div>
    </SectionCard>
  );
}
