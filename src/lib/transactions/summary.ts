import type { Transaction, TransactionType } from '@/lib/db/database';

export type TransactionSummary = {
  income: number;
  expenses: number;
  benefit: number;
  balance: number;
};

export type CategorySummary = {
  category: string;
  total: number;
  percent: number;
};

export function formatCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatTransactionAmount(
  value: number,
  type: TransactionType,
  locale: string
) {
  const sign = type === 'expense' ? '-' : '+';

  return `${sign}${formatCurrency(value, locale)}`;
}

export function formatTransactionDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
}

export function parseCurrencyInput(value: string) {
  const normalized = value
    .replace(/\s/g, '')
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');

  const amount = Number(normalized);

  return Number.isFinite(amount) ? amount : 0;
}

export function summarizeTransactions(
  transactions: Transaction[]
): TransactionSummary {
  return transactions.reduce(
    (summary, transaction) => {
      if (transaction.type === 'income') {
        summary.income += transaction.amount;
        summary.balance += transaction.amount;
      }

      if (transaction.type === 'expense') {
        summary.expenses += transaction.amount;
        summary.balance -= transaction.amount;
      }

      if (transaction.type === 'benefit') {
        summary.benefit += transaction.amount;
        summary.balance += transaction.amount;
      }

      return summary;
    },
    {
      income: 0,
      expenses: 0,
      benefit: 0,
      balance: 0,
    }
  );
}

export function getCurrentMonthTransactions(transactions: Transaction[]) {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  return transactions.filter((transaction) => {
    const date = new Date(`${transaction.date}T00:00:00`);

    return date.getMonth() === month && date.getFullYear() === year;
  });
}

export function getCurrentMonthLabel(locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(new Date());
}

export function summarizeExpenseCategories(
  transactions: Transaction[]
): CategorySummary[] {
  const expenses = transactions.filter(
    (transaction) => transaction.type === 'expense'
  );
  const total = expenses.reduce((sum, transaction) => sum + transaction.amount, 0);
  const categoryTotals = new Map<string, number>();

  for (const transaction of expenses) {
    const currentTotal = categoryTotals.get(transaction.category) ?? 0;

    categoryTotals.set(transaction.category, currentTotal + transaction.amount);
  }

  return Array.from(categoryTotals.entries())
    .map(([category, categoryTotal]) => ({
      category,
      total: categoryTotal,
      percent: total > 0 ? Math.round((categoryTotal / total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

export function getHighestExpense(transactions: Transaction[]) {
  return transactions
    .filter((transaction) => transaction.type === 'expense')
    .sort((a, b) => b.amount - a.amount)[0];
}

export function getMostUsedCategory(transactions: Transaction[]) {
  const categoryCounts = new Map<string, number>();

  for (const transaction of transactions) {
    const currentCount = categoryCounts.get(transaction.category) ?? 0;

    categoryCounts.set(transaction.category, currentCount + 1);
  }

  return Array.from(categoryCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
}
