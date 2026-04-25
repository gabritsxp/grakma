'use client';

import { useState, type FormEvent } from 'react';
import {
  Calendar,
  DollarSign,
  FileText,
  Tag,
  Wallet,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { SectionCard } from '@/components/ui/SectionCard';
import { TextInput } from '@/components/ui/TextInput';
import { useRouter } from '@/i18n/navigation';
import { createTransaction } from '@/lib/db/transactions';
import type { TransactionType } from '@/lib/db/database';
import { parseCurrencyInput } from '@/lib/transactions/summary';
import { TransactionTypeSelector } from './TransactionTypeSelector';

export function AddTransactionForm() {
  const t = useTranslations('add');
  const router = useRouter();
  const [type, setType] = useState<TransactionType>('income');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedAmount = parseCurrencyInput(amount);

    if (!description.trim() || !category.trim() || !account.trim() || parsedAmount <= 0) {
      return;
    }

    setIsSaving(true);

    await createTransaction({
      type,
      description,
      amount: parsedAmount,
      date,
      category,
      account,
    });

    router.push('/transactions');
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <TransactionTypeSelector value={type} onChange={setType} />

      <SectionCard className="space-y-4">
        <TextInput
          label={t('description')}
          icon={FileText}
          placeholder={t('descriptionPlaceholder')}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />

        <TextInput
          label={t('amount')}
          icon={DollarSign}
          placeholder={t('amountPlaceholder')}
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          required
        />

        <TextInput
          label={t('date')}
          icon={Calendar}
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          required
        />

        <TextInput
          label={t('category')}
          icon={Tag}
          placeholder={t('categoryPlaceholder')}
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          required
        />

        <TextInput
          label={t('account')}
          icon={Wallet}
          placeholder={t('accountPlaceholder')}
          value={account}
          onChange={(event) => setAccount(event.target.value)}
          required
        />

        <Button className="mt-2" disabled={isSaving}>
          {t('save')}
        </Button>
      </SectionCard>
    </form>
  );
}
