import { nanoid } from 'nanoid';
import {
  db,
  type Account,
  type AccountType,
  type Category,
  type PaymentMethod,
  type PaymentMethodType,
  type Transaction,
  type TransactionStatus,
  type TransactionType,
} from './database';

export type CreateTransactionInput = {
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  amount: number;
  dueDate: string;
  paidAt?: string;
  category: string;
  categoryId?: string;
  account: string;
  accountId?: string;
  chargedAccount?: string;
  chargedAccountId?: string;
  fundingAccount?: string;
  fundingAccountId?: string;
  paymentMethod?: string;
  paymentMethodId?: string;
  recurrenceId?: string;
  installmentGroupId?: string;
  installmentNumber?: number;
  installmentTotal?: number;
};

export type UpdateTransactionInput = Partial<CreateTransactionInput>;
export type CreateCategoryInput = {
  name: string;
  type: TransactionType | 'all';
};
export type CreateAccountInput = {
  name: string;
  type: AccountType;
  closingDay?: number;
  dueDay?: number;
};
export type CreatePaymentMethodInput = {
  name: string;
  type: PaymentMethodType;
};

// Cria uma nova transação no banco local.
export async function createTransaction(
  input: CreateTransactionInput
): Promise<Transaction> {
  const now = new Date().toISOString();

  const transaction: Transaction = {
    // Gera um id único para o registro.
    id: nanoid(),
    type: input.type,
    status: input.status,
    description: input.description.trim(),
    amount: input.amount,
    dueDate: input.dueDate,
    paidAt: input.status === 'confirmed' ? input.paidAt ?? input.dueDate : undefined,
    category: input.category.trim(),
    categoryId: input.categoryId,
    account: input.account.trim(),
    accountId: input.accountId,
    chargedAccount: input.chargedAccount?.trim(),
    chargedAccountId: input.chargedAccountId,
    fundingAccount: input.fundingAccount?.trim(),
    fundingAccountId: input.fundingAccountId,
    paymentMethod: input.paymentMethod?.trim(),
    paymentMethodId: input.paymentMethodId,
    recurrenceId: input.recurrenceId,
    installmentGroupId: input.installmentGroupId,
    installmentNumber: input.installmentNumber,
    installmentTotal: input.installmentTotal,
    createdAt: now,
    updatedAt: now,
  };

  // Salva o registro na tabela de transações.
  await db.transactions.add(transaction);

  return transaction;
}

// Lista as transações mais recentes primeiro.
export async function listTransactions(): Promise<Transaction[]> {
  return db.transactions.orderBy('dueDate').reverse().toArray();
}

// Busca uma transação pelo id.
export async function getTransactionById(
  id: string
): Promise<Transaction | undefined> {
  return db.transactions.get(id);
}

// Atualiza apenas os campos enviados.
export async function updateTransaction(
  id: string,
  input: UpdateTransactionInput
): Promise<void> {
  await db.transactions.update(id, {
    ...input,

    // Remove espaços extras dos campos de texto enviados.
    description: input.description?.trim(),
    category: input.category?.trim(),
    account: input.account?.trim(),
    chargedAccount: input.chargedAccount?.trim(),
    fundingAccount: input.fundingAccount?.trim(),
    paymentMethod: input.paymentMethod?.trim(),
    paidAt:
      input.status === 'confirmed'
        ? input.paidAt ?? input.dueDate
        : input.status === 'pending'
          ? undefined
          : input.paidAt,

    // Registra quando a transação foi alterada.
    updatedAt: new Date().toISOString(),
  });
}

// Atualiza esta transação recorrente e todas as próximas.
export async function updateRecurringTransactionsFrom(
  recurrenceId: string,
  dueDate: string,
  input: UpdateTransactionInput
): Promise<void> {
  const transactions = await db.transactions
    .where('recurrenceId')
    .equals(recurrenceId)
    .toArray();
  const now = new Date().toISOString();

  await db.transaction('rw', db.transactions, async () => {
    await Promise.all(
      transactions
        .filter((transaction) => transaction.dueDate >= dueDate)
        .map((transaction) =>
          db.transactions.update(transaction.id, {
            ...input,
            description: input.description?.trim(),
            category: input.category?.trim(),
            account: input.account?.trim(),
            chargedAccount: input.chargedAccount?.trim(),
            fundingAccount: input.fundingAccount?.trim(),
            paymentMethod: input.paymentMethod?.trim(),
            dueDate:
              input.dueDate && transaction.dueDate === dueDate
                ? input.dueDate
                : transaction.dueDate,
            paidAt:
              input.status === 'confirmed'
                ? transaction.paidAt ?? transaction.dueDate
                : input.status === 'pending'
                  ? undefined
                  : transaction.paidAt,
            updatedAt: now,
          })
        )
    );
  });
}

// Remove uma transação pelo id.
export async function deleteTransaction(id: string): Promise<void> {
  await db.transactions.delete(id);
}

// Remove esta transação recorrente e todas as próximas.
export async function deleteRecurringTransactionsFrom(
  recurrenceId: string,
  dueDate: string
): Promise<void> {
  const transactions = await db.transactions
    .where('recurrenceId')
    .equals(recurrenceId)
    .toArray();
  const transactionIds = transactions
    .filter((transaction) => transaction.dueDate >= dueDate)
    .map((transaction) => transaction.id);

  await db.transactions.bulkDelete(transactionIds);
}

// Apaga todas as transações.
export async function clearTransactions(): Promise<void> {
  await db.transactions.clear();
}

export async function createCategory(
  input: CreateCategoryInput
): Promise<Category> {
  const category: Category = {
    id: nanoid(),
    name: input.name.trim(),
    type: input.type,
    createdAt: new Date().toISOString(),
  };

  await db.categories.add(category);

  return category;
}

export async function listCategories(): Promise<Category[]> {
  return db.categories.orderBy('name').toArray();
}

export async function createAccount(input: CreateAccountInput): Promise<Account> {
  const account: Account = {
    id: nanoid(),
    name: input.name.trim(),
    type: input.type,
    closingDay: input.closingDay,
    dueDay: input.dueDay,
    createdAt: new Date().toISOString(),
  };

  await db.accounts.add(account);

  return account;
}

export async function listAccounts(): Promise<Account[]> {
  return db.accounts.orderBy('name').toArray();
}

export async function createPaymentMethod(
  input: CreatePaymentMethodInput
): Promise<PaymentMethod> {
  const paymentMethod: PaymentMethod = {
    id: nanoid(),
    name: input.name.trim(),
    type: input.type,
    createdAt: new Date().toISOString(),
  };

  await db.paymentMethods.add(paymentMethod);

  return paymentMethod;
}

export async function listPaymentMethods(): Promise<PaymentMethod[]> {
  return db.paymentMethods.orderBy('name').toArray();
}

export function addMonths(dateValue: string, months: number) {
  const date = new Date(`${dateValue}T00:00:00`);
  const originalDay = date.getDate();

  date.setMonth(date.getMonth() + months);

  if (date.getDate() < originalDay) {
    date.setDate(0);
  }

  return date.toISOString().slice(0, 10);
}

export async function createRecurringTransactions(
  input: CreateTransactionInput,
  endsAt?: string
) {
  const now = new Date().toISOString();
  const recurrenceId = nanoid();
  const endDate = endsAt
    ? new Date(`${endsAt}T00:00:00`)
    : new Date(`${addMonths(input.dueDate, 11)}T00:00:00`);

  await db.recurringRules.add({
    id: recurrenceId,
    type: input.type,
    description: input.description.trim(),
    amount: input.amount,
    dayOfMonth: new Date(`${input.dueDate}T00:00:00`).getDate(),
    categoryId: input.categoryId ?? '',
    accountId: input.accountId ?? '',
    paymentMethodId: input.paymentMethodId,
    startsAt: input.dueDate,
    endsAt,
    isActive: true,
    createdAt: now,
  });

  return db.transaction('rw', db.transactions, async () => {
    let index = 0;
    let nextDueDate = input.dueDate;

    while (new Date(`${nextDueDate}T00:00:00`) <= endDate) {
      await createTransaction({
        ...input,
        dueDate: nextDueDate,
        paidAt:
          index === 0 && input.status === 'confirmed'
            ? input.paidAt ?? input.dueDate
            : undefined,
        status: index === 0 ? input.status : 'pending',
        recurrenceId,
      });

      index += 1;
      nextDueDate = addMonths(input.dueDate, index);
    }
  });
}

export async function createInstallmentTransactions(
  input: CreateTransactionInput,
  installmentTotal: number
) {
  const groupId = nanoid();
  const installmentAmount = input.amount / installmentTotal;

  await db.installmentGroups.add({
    id: groupId,
    description: input.description.trim(),
    totalAmount: input.amount,
    installmentAmount,
    installmentTotal,
    firstDueDate: input.dueDate,
    categoryId: input.categoryId ?? '',
    accountId: input.accountId ?? '',
    paymentMethodId: input.paymentMethodId,
    createdAt: new Date().toISOString(),
  });

  return db.transaction('rw', db.transactions, async () => {
    for (let index = 0; index < installmentTotal; index += 1) {
      await createTransaction({
        ...input,
        description: `${input.description.trim()} ${index + 1}/${installmentTotal}`,
        amount: installmentAmount,
        dueDate: addMonths(input.dueDate, index),
        paidAt:
          index === 0 && input.status === 'confirmed'
            ? input.paidAt ?? input.dueDate
            : undefined,
        status: index === 0 ? input.status : 'pending',
        installmentGroupId: groupId,
        installmentNumber: index + 1,
        installmentTotal,
      });
    }
  });
}
