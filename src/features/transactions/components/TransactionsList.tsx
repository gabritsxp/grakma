'use client';

import { useState } from 'react';
import { Pencil, Trash2, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { TransactionListItem } from '@/components/ui/TransactionListItem';
import type { Transaction, TransactionType } from '@/lib/db/database';
import {
  deleteRecurringTransactionsFrom,
  deleteTransaction,
  updateRecurringTransactionsFrom,
  updateTransaction,
} from '@/lib/db/transactions';
import { useTransactions } from '@/lib/db/useTransactions';
import {
  formatTransactionAmount,
  formatTransactionDate,
  getMonthTransactions,
  parseCurrencyInput,
} from '@/lib/transactions/summary';

type EditState = {
  type: TransactionType;
  description: string;
  amount: string;
  date: string;
  category: string;
  account: string;
  status: 'pending' | 'confirmed';
};

function createEditState(transaction: Transaction): EditState {
  return {
    type: transaction.type,
    description: transaction.description,
    amount: String(transaction.amount).replace('.', ','),
    date: transaction.dueDate,
    category: transaction.category,
    account: transaction.account,
    status: transaction.status,
  };
}

type TransactionsListProps = {
  monthDate?: Date;
};

export function TransactionsList({ monthDate }: TransactionsListProps) {
  const locale = useLocale();
  const page = useTranslations('transactionsPage');
  const add = useTranslations('add');
  const { transactions, reloadTransactions } = useTransactions();
  const visibleTransactions = monthDate
    ? getMonthTransactions(transactions, monthDate)
    : transactions;
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(
    null
  );
  const [isChoosingRecurringDelete, setIsChoosingRecurringDelete] =
    useState(false);
  const [isChoosingRecurringUpdate, setIsChoosingRecurringUpdate] =
    useState(false);

  function openTransaction(transaction: Transaction) {
    setSelectedTransaction(transaction);
    setEditState(createEditState(transaction));
    setDeleteConfirmationId(null);
    setIsChoosingRecurringDelete(false);
    setIsChoosingRecurringUpdate(false);
  }

  function closeTransaction() {
    setSelectedTransaction(null);
    setEditState(null);
    setDeleteConfirmationId(null);
    setIsChoosingRecurringDelete(false);
    setIsChoosingRecurringUpdate(false);
  }

  function updateEditState<Key extends keyof EditState>(
    field: Key,
    value: EditState[Key]
  ) {
    setEditState((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : current
    );
  }

  function getUpdateInput() {
    if (!editState) {
      return null;
    }

    const amount = parseCurrencyInput(editState.amount);

    if (
      !editState.description.trim() ||
      !editState.category.trim() ||
      !editState.account.trim() ||
      amount <= 0
    ) {
      return null;
    }

    return {
      type: editState.type,
      description: editState.description,
      amount,
      dueDate: editState.date,
      status: editState.status,
      category: editState.category,
      account: editState.account,
    };
  }

  async function handleUpdate(id: string) {
    if (selectedTransaction?.recurrenceId && !isChoosingRecurringUpdate) {
      setIsChoosingRecurringUpdate(true);
      return;
    }

    await handleUpdateCurrentMonth(id);
  }

  async function handleUpdateCurrentMonth(id: string) {
    const updateInput = getUpdateInput();

    if (!updateInput) {
      return;
    }

    await updateTransaction(id, updateInput);

    closeTransaction();
    await reloadTransactions();
  }

  async function handleUpdateCurrentAndNext(transaction: Transaction) {
    const updateInput = getUpdateInput();

    if (!updateInput || !transaction.recurrenceId) {
      return;
    }

    await updateRecurringTransactionsFrom(
      transaction.recurrenceId,
      transaction.dueDate,
      updateInput
    );

    closeTransaction();
    await reloadTransactions();
  }

  async function handleDelete(id: string) {
    if (selectedTransaction?.recurrenceId && !isChoosingRecurringDelete) {
      setIsChoosingRecurringDelete(true);
      return;
    }

    if (deleteConfirmationId !== id) {
      setDeleteConfirmationId(id);
      return;
    }

    await deleteTransaction(id);

    closeTransaction();
    await reloadTransactions();
  }

  async function handleDeleteCurrentMonth(id: string) {
    if (deleteConfirmationId !== id) {
      setDeleteConfirmationId(id);
      return;
    }

    await deleteTransaction(id);

    closeTransaction();
    await reloadTransactions();
  }

  async function handleDeleteCurrentAndNext(transaction: Transaction) {
    if (deleteConfirmationId !== transaction.id) {
      setDeleteConfirmationId(transaction.id);
      return;
    }

    if (!transaction.recurrenceId) {
      return;
    }

    await deleteRecurringTransactionsFrom(
      transaction.recurrenceId,
      transaction.dueDate
    );

    closeTransaction();
    await reloadTransactions();
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">
        {page('allTransactions')}
      </h2>

      <div className="space-y-3">
        {visibleTransactions.length > 0 ? (
          visibleTransactions.map((transaction) => (
            <TransactionListItem
              key={transaction.id}
              title={transaction.description}
              subtitle={`${transaction.category} • ${formatTransactionDate(
                transaction.dueDate,
                locale
              )} • ${page(transaction.status)}`}
              amount={formatTransactionAmount(
                transaction.amount,
                transaction.type,
                locale
              )}
              type={transaction.type}
              onClick={() => openTransaction(transaction)}
            />
          ))
        ) : (
          <p className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-500">
            {page('empty')}
          </p>
        )}
      </div>

      {selectedTransaction && editState && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-[2rem] border border-zinc-800 bg-zinc-950 p-5 shadow-2xl shadow-black/60">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-500">{page('edit')}</p>

                <h3 className="mt-1 text-xl font-semibold">
                  {selectedTransaction.description}
                </h3>
              </div>

              <button
                type="button"
                aria-label={page('cancel')}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-zinc-800 bg-black text-zinc-400 transition hover:bg-zinc-900"
                onClick={closeTransaction}
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {(['income', 'expense', 'benefit'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={
                      editState.type === type
                        ? 'rounded-2xl border border-white bg-white px-3 py-2 text-xs font-semibold text-black'
                        : 'rounded-2xl border border-zinc-800 bg-black px-3 py-2 text-xs font-semibold text-zinc-400'
                    }
                    onClick={() => updateEditState('type', type)}
                  >
                    {add(type)}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {(['pending', 'confirmed'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={
                      editState.status === status
                        ? 'rounded-2xl border border-white bg-white px-3 py-2 text-xs font-semibold text-black'
                        : 'rounded-2xl border border-zinc-800 bg-black px-3 py-2 text-xs font-semibold text-zinc-400'
                    }
                    onClick={() => updateEditState('status', status)}
                  >
                    {add(status)}
                  </button>
                ))}
              </div>

              <label className="block space-y-2">
                <span className="text-xs font-medium text-zinc-500">
                  {add('description')}
                </span>
                <input
                  className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm text-zinc-200 outline-none"
                  value={editState.description}
                  onChange={(event) =>
                    updateEditState('description', event.target.value)
                  }
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-2">
                  <span className="text-xs font-medium text-zinc-500">
                    {add('amount')}
                  </span>
                  <input
                    className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm text-zinc-200 outline-none"
                    inputMode="decimal"
                    value={editState.amount}
                    onChange={(event) =>
                      updateEditState('amount', event.target.value)
                    }
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-xs font-medium text-zinc-500">
                    {add('date')}
                  </span>
                  <input
                    className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm text-zinc-200 outline-none"
                    type="date"
                    value={editState.date}
                    onChange={(event) =>
                      updateEditState('date', event.target.value)
                    }
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-2">
                  <span className="text-xs font-medium text-zinc-500">
                    {add('category')}
                  </span>
                  <input
                    className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm text-zinc-200 outline-none"
                    value={editState.category}
                    onChange={(event) =>
                      updateEditState('category', event.target.value)
                    }
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-xs font-medium text-zinc-500">
                    {add('account')}
                  </span>
                  <input
                    className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm text-zinc-200 outline-none"
                    value={editState.account}
                    onChange={(event) =>
                      updateEditState('account', event.target.value)
                    }
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                {!isChoosingRecurringUpdate && (
                  <Button
                    type="button"
                    className="px-3 text-sm"
                    onClick={() => handleUpdate(selectedTransaction.id)}
                  >
                    <Pencil size={16} />
                    {page('update')}
                  </Button>
                )}

                {!isChoosingRecurringDelete && (
                  <Button
                    type="button"
                    variant="secondary"
                    className="px-3 text-sm"
                    onClick={() => handleDelete(selectedTransaction.id)}
                  >
                    <Trash2 size={16} />
                    {deleteConfirmationId === selectedTransaction.id
                      ? page('deleteConfirmation')
                      : page('delete')}
                  </Button>
                )}
              </div>

              {isChoosingRecurringUpdate && (
                <div className="space-y-2 rounded-3xl border border-zinc-800 bg-black p-3">
                  <p className="text-sm text-zinc-500">
                    {page('recurringUpdateQuestion')}
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      className="px-3 text-sm"
                      onClick={() =>
                        handleUpdateCurrentMonth(selectedTransaction.id)
                      }
                    >
                      <Pencil size={16} />
                      {page('updateOnlyThisMonth')}
                    </Button>

                    <Button
                      type="button"
                      className="px-3 text-sm"
                      onClick={() =>
                        handleUpdateCurrentAndNext(selectedTransaction)
                      }
                    >
                      <Pencil size={16} />
                      {page('updateThisAndNext')}
                    </Button>
                  </div>
                </div>
              )}

              {isChoosingRecurringDelete && (
                <div className="space-y-2 rounded-3xl border border-zinc-800 bg-black p-3">
                  <p className="text-sm text-zinc-500">
                    {page('recurringDeleteQuestion')}
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="px-3 text-sm"
                      onClick={() =>
                        handleDeleteCurrentMonth(selectedTransaction.id)
                      }
                    >
                      <Trash2 size={16} />
                      {deleteConfirmationId === selectedTransaction.id
                        ? page('deleteConfirmation')
                        : page('deleteOnlyThisMonth')}
                    </Button>

                    <Button
                      type="button"
                      variant="secondary"
                      className="px-3 text-sm"
                      onClick={() =>
                        handleDeleteCurrentAndNext(selectedTransaction)
                      }
                    >
                      <Trash2 size={16} />
                      {deleteConfirmationId === selectedTransaction.id
                        ? page('deleteConfirmation')
                        : page('deleteThisAndNext')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
