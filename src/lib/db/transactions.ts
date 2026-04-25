import { nanoid } from 'nanoid';
import { db, type Transaction, type TransactionType } from './database';

export type CreateTransactionInput = {
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  category: string;
  account: string;
};

export type UpdateTransactionInput = Partial<CreateTransactionInput>;

// Cria uma nova transação no banco local.
export async function createTransaction(
  input: CreateTransactionInput
): Promise<Transaction> {
  const now = new Date().toISOString();

  const transaction: Transaction = {
    // Gera um id único para o registro.
    id: nanoid(),
    type: input.type,
    description: input.description.trim(),
    amount: input.amount,
    date: input.date,
    category: input.category.trim(),
    account: input.account.trim(),
    createdAt: now,
    updatedAt: now,
  };

  // Salva o registro na tabela de transações.
  await db.transactions.add(transaction);

  return transaction;
}

// Lista as transações mais recentes primeiro.
export async function listTransactions(): Promise<Transaction[]> {
  return db.transactions.orderBy('date').reverse().toArray();
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

    // Registra quando a transação foi alterada.
    updatedAt: new Date().toISOString(),
  });
}

// Remove uma transação pelo id.
export async function deleteTransaction(id: string): Promise<void> {
  await db.transactions.delete(id);
}

// Apaga todas as transações.
export async function clearTransactions(): Promise<void> {
  await db.transactions.clear();
}
