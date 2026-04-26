'use client';

import { useMemo, useState, type FormEvent } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
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
import type {
  AccountType,
  TransactionStatus,
  TransactionType,
} from '@/lib/db/database';
import {
  createAccount,
  createCategory,
  createRecurringTransactions,
  createTransaction,
} from '@/lib/db/transactions';
import { useFinanceData } from '@/lib/db/useFinanceData';
import { parseCurrencyInput } from '@/lib/transactions/summary';

type AddKind = 'income' | 'expense' | 'benefit' | 'account';

const addKinds = [
  {
    value: 'income',
    icon: ArrowDownLeft,
  },
  {
    value: 'expense',
    icon: ArrowUpRight,
  },
  {
    value: 'benefit',
    icon: CreditCard,
  },
  {
    value: 'account',
    icon: Wallet,
  },
] as const;

const accountTypes: AccountType[] = [
  'checking',
  'savings',
  'cash',
  'credit_card',
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function getSelectedText(id: string, options: { id: string; name: string }[]) {
  return options.find((option) => option.id === id)?.name ?? '';
}

export function AddTransactionForm() {
  const t = useTranslations('add');
  const setup = useTranslations('financeSetup');
  const router = useRouter();
  const { categories, accounts } = useFinanceData();
  const [kind, setKind] = useState<AddKind>('expense');
  const [status, setStatus] = useState<TransactionStatus>('pending');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(today);
  const [categoryId, setCategoryId] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [accountId, setAccountId] = useState('');
  const [fundingAccountId, setFundingAccountId] = useState('');
  const [isFixed, setIsFixed] = useState(false);
  const [fixedStartsAt, setFixedStartsAt] = useState(today);
  const [fixedEndsAt, setFixedEndsAt] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('checking');
  const [isSaving, setIsSaving] = useState(false);

  const transactionType = kind as Extract<AddKind, 'income' | 'expense'>;
  const canCreateTransaction = kind === 'income' || kind === 'expense';
  const availableCategories = useMemo(
    () =>
      categories.filter(
        (category) =>
          category.type === 'all' ||
          (canCreateTransaction && category.type === transactionType)
      ),
    [canCreateTransaction, categories, transactionType]
  );

  function resetForKind(nextKind: AddKind) {
    setKind(nextKind);
    setStatus('pending');
    setDescription('');
    setAmount('');
    setDate(today());
    setCategoryId('');
    setNewCategory('');
    setAccountId('');
    setFundingAccountId('');
    setIsFixed(false);
    setFixedStartsAt(today());
    setFixedEndsAt('');
    setAccountName('');
    setAccountType(nextKind === 'benefit' ? 'benefit_card' : 'checking');
  }

  async function ensureCategory(type: TransactionType) {
    if (categoryId) {
      return categoryId;
    }

    if (!newCategory.trim()) {
      return '';
    }

    const category = await createCategory({
      name: newCategory,
      type,
    });

    return category.id;
  }

  async function handleCreateAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!accountName.trim()) {
      return;
    }

    setIsSaving(true);

    await createAccount({
      name: accountName,
      type: kind === 'benefit' ? 'benefit_card' : accountType,
    });

    router.push('/settings');
  }

  async function handleCreateTransaction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canCreateTransaction) {
      return;
    }

    const parsedAmount = parseCurrencyInput(amount);

    if (
      !description.trim() ||
      parsedAmount <= 0 ||
      !accountId ||
      (kind === 'expense' && !fundingAccountId)
    ) {
      return;
    }

    if (isFixed && !fixedEndsAt) {
      return;
    }

    setIsSaving(true);

    const finalCategoryId = await ensureCategory(transactionType);
    const categoryName =
      getSelectedText(finalCategoryId, categories) ||
      newCategory.trim() ||
      t(transactionType);
    const accountName = getSelectedText(accountId, accounts);
    const fundingAccountName =
      kind === 'expense' ? getSelectedText(fundingAccountId, accounts) : '';
    const dueDate = isFixed ? fixedStartsAt : date;

    const transaction = {
      type: transactionType,
      status,
      description,
      amount: parsedAmount,
      dueDate,
      paidAt: status === 'confirmed' ? dueDate : undefined,
      category: categoryName,
      categoryId: finalCategoryId || undefined,
      account: accountName,
      accountId,
      chargedAccount: kind === 'expense' ? accountName : undefined,
      chargedAccountId: kind === 'expense' ? accountId : undefined,
      fundingAccount: kind === 'expense' ? fundingAccountName : accountName,
      fundingAccountId: kind === 'expense' ? fundingAccountId : accountId,
    };

    if (isFixed) {
      await createRecurringTransactions(transaction, fixedEndsAt);
    } else {
      await createTransaction(transaction);
    }

    router.push('/transactions');
  }

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 gap-3">
        {addKinds.map((option) => {
          const Icon = option.icon;
          const isActive = kind === option.value;

          return (
            <button
              key={option.value}
              type="button"
              className={
                isActive
                  ? 'flex items-center gap-3 rounded-3xl border border-white bg-white p-4 text-left text-black'
                  : 'flex items-center gap-3 rounded-3xl border border-zinc-800 bg-zinc-950 p-4 text-left text-white'
              }
              onClick={() => resetForKind(option.value)}
            >
              <span
                className={
                  isActive
                    ? 'flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white'
                    : 'flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-400'
                }
              >
                <Icon size={20} />
              </span>

              <span className="text-sm font-semibold">
                {t(`${option.value}Kind`)}
              </span>
            </button>
          );
        })}
      </section>

      {canCreateTransaction ? (
        <form className="space-y-6" onSubmit={handleCreateTransaction}>
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
              label={kind === 'expense' ? t('chargeDate') : t('receiveDate')}
              icon={CreditCard}
              type="date"
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                setFixedStartsAt(event.target.value);
              }}
              required
            />

            <div className="grid grid-cols-2 gap-2">
              {(['pending', 'confirmed'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  className={
                    status === option
                      ? 'rounded-2xl border border-white bg-white px-3 py-3 text-sm font-semibold text-black'
                      : 'rounded-2xl border border-zinc-800 bg-black px-3 py-3 text-sm font-semibold text-zinc-400'
                  }
                  onClick={() => setStatus(option)}
                >
                  {t(option)}
                </button>
              ))}
            </div>

            <label className="space-y-2">
              <span className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                <Wallet size={16} />
                {kind === 'expense' ? t('chargedAccount') : t('targetAccount')}
              </span>
              <select
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm text-zinc-200 outline-none"
                value={accountId}
                onChange={(event) => setAccountId(event.target.value)}
                required
              >
                <option value="">{t('selectAccount')}</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </label>

            {kind === 'expense' && (
              <label className="space-y-2">
                <span className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                  <DollarSign size={16} />
                  {t('fundingAccount')}
                </span>
                <select
                  className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm text-zinc-200 outline-none"
                  value={fundingAccountId}
                  onChange={(event) => setFundingAccountId(event.target.value)}
                  required
                >
                  <option value="">{t('selectFundingAccount')}</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="space-y-2">
              <span className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                <Tag size={16} />
                {t('category')}
              </span>
              <select
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm text-zinc-200 outline-none"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
              >
                <option value="">{t('selectCategory')}</option>
                {availableCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            {!categoryId && (
              <TextInput
                label={t('newCategory')}
                icon={Tag}
                placeholder={t('categoryPlaceholder')}
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
              />
            )}

            <button
              type="button"
              className={
                isFixed
                  ? 'w-full rounded-2xl border border-white bg-white px-3 py-3 text-sm font-semibold text-black'
                  : 'w-full rounded-2xl border border-zinc-800 bg-black px-3 py-3 text-sm font-semibold text-zinc-400'
              }
              onClick={() => setIsFixed((current) => !current)}
            >
              {t('fixed')}
            </button>

            {isFixed && (
              <div className="grid grid-cols-2 gap-3">
                <TextInput
                  label={t('fixedStartsAt')}
                  icon={CreditCard}
                  type="date"
                  value={fixedStartsAt}
                  onChange={(event) => setFixedStartsAt(event.target.value)}
                  required
                />

                <TextInput
                  label={t('fixedEndsAt')}
                  icon={CreditCard}
                  type="date"
                  value={fixedEndsAt}
                  onChange={(event) => setFixedEndsAt(event.target.value)}
                  required
                />
              </div>
            )}

            <Button className="mt-2" disabled={isSaving}>
              {t('save')}
            </Button>
          </SectionCard>
        </form>
      ) : (
        <form className="space-y-6" onSubmit={handleCreateAccount}>
          <SectionCard className="space-y-4">
            <TextInput
              label={kind === 'benefit' ? t('benefitName') : t('accountName')}
              icon={kind === 'benefit' ? CreditCard : Wallet}
              placeholder={
                kind === 'benefit'
                  ? t('benefitPlaceholder')
                  : t('accountPlaceholder')
              }
              value={accountName}
              onChange={(event) => setAccountName(event.target.value)}
              required
            />

            {kind === 'account' && (
              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-400">
                  {t('accountType')}
                </span>
                <select
                  className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm text-zinc-200 outline-none"
                  value={accountType}
                  onChange={(event) =>
                    setAccountType(event.target.value as AccountType)
                  }
                >
                  {accountTypes.map((type) => (
                    <option key={type} value={type}>
                      {setup(type)}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <Button className="mt-2" disabled={isSaving}>
              {kind === 'benefit' ? t('saveBenefit') : t('saveAccount')}
            </Button>
          </SectionCard>
        </form>
      )}
    </div>
  );
}
