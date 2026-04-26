import type { Transaction, TransactionType } from '@/lib/db/database';

export type TransactionSummary = {
  income: number;
  expenses: number;
  benefit: number;
  balance: number;
  confirmedIncome: number;
  confirmedExpenses: number;
  confirmedBenefit: number;
  confirmedBalance: number;
  pendingIncome: number;
  pendingExpenses: number;
  pendingBenefit: number;
};

export type CategorySummary = {
  category: string;
  total: number;
  percent: number;
};

export type AccountForecast = {
  accountId: string;
  account: string;
  income: number;
  expenses: number;
  balance: number;
  confirmedBalance: number;
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

        if (transaction.status === 'confirmed') {
          summary.confirmedIncome += transaction.amount;
          summary.confirmedBalance += transaction.amount;
        } else {
          summary.pendingIncome += transaction.amount;
        }
      }

      if (transaction.type === 'expense') {
        summary.expenses += transaction.amount;
        summary.balance -= transaction.amount;

        if (transaction.status === 'confirmed') {
          summary.confirmedExpenses += transaction.amount;
          summary.confirmedBalance -= transaction.amount;
        } else {
          summary.pendingExpenses += transaction.amount;
        }
      }

      if (transaction.type === 'benefit') {
        summary.benefit += transaction.amount;
        summary.balance += transaction.amount;

        if (transaction.status === 'confirmed') {
          summary.confirmedBenefit += transaction.amount;
          summary.confirmedBalance += transaction.amount;
        } else {
          summary.pendingBenefit += transaction.amount;
        }
      }

      return summary;
    },
    {
      income: 0,
      expenses: 0,
      benefit: 0,
      balance: 0,
      confirmedIncome: 0,
      confirmedExpenses: 0,
      confirmedBenefit: 0,
      confirmedBalance: 0,
      pendingIncome: 0,
      pendingExpenses: 0,
      pendingBenefit: 0,
    }
  );
}

export function getMonthTransactions(transactions: Transaction[], monthDate: Date) {
  const month = monthDate.getMonth();
  const year = monthDate.getFullYear();
 
  return transactions.filter((transaction) => {
    const date = new Date(`${transaction.dueDate}T00:00:00`);

    return date.getMonth() === month && date.getFullYear() === year;
  });
}

export function getCurrentMonthTransactions(transactions: Transaction[]) {
  return getMonthTransactions(transactions, new Date());
}

export function getMonthLabel(locale: string, monthDate: Date) {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(monthDate);
}

export function getCurrentMonthLabel(locale: string) {
  return getMonthLabel(locale, new Date());
}

export function addCalendarMonths(date: Date, months: number) {
  const nextDate = new Date(date);

  nextDate.setMonth(nextDate.getMonth() + months);

  return nextDate;
}

export function getTransactionsUntilMonth(
  transactions: Transaction[],
  monthDate: Date
) {
  const endOfMonth = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth() + 1,
    0
  )
    .toISOString()
    .slice(0, 10);

  return transactions.filter((transaction) => transaction.dueDate <= endOfMonth);
}

export function summarizeAccounts(transactions: Transaction[]): AccountForecast[] {
  const accounts = new Map<string, AccountForecast>();

  function getAccount(accountId: string, account: string) {
    const key = accountId || account;
    const current = accounts.get(key);

    if (current) {
      return current;
    }

    const nextAccount = {
      accountId,
      account,
      income: 0,
      expenses: 0,
      balance: 0,
      confirmedBalance: 0,
    };

    accounts.set(key, nextAccount);

    return nextAccount;
  }

  for (const transaction of transactions) {
    if (transaction.type === 'income') {
      const account = getAccount(
        transaction.accountId ?? '',
        transaction.account
      );

      account.income += transaction.amount;
      account.balance += transaction.amount;

      if (transaction.status === 'confirmed') {
        account.confirmedBalance += transaction.amount;
      }
    }

    if (transaction.type === 'expense') {
      const account = getAccount(
        transaction.fundingAccountId ?? transaction.accountId ?? '',
        transaction.fundingAccount ?? transaction.account
      );

      account.expenses += transaction.amount;
      account.balance -= transaction.amount;

      if (transaction.status === 'confirmed') {
        account.confirmedBalance -= transaction.amount;
      }
    }
  }

  return Array.from(accounts.values()).sort((a, b) =>
    a.account.localeCompare(b.account)
  );
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
