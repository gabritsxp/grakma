import Dexie, { type EntityTable } from 'dexie';

export type TransactionType = 'income' | 'expense' | 'benefit';
export type TransactionStatus = 'pending' | 'confirmed';
export type AccountType =
  | 'checking'
  | 'savings'
  | 'cash'
  | 'credit_card'
  | 'benefit_card';
export type PaymentMethodType =
  | 'pix'
  | 'debit'
  | 'credit'
  | 'cash'
  | 'bank_slip'
  | 'transfer'
  | 'benefit';

export type Category = {
  id: string;
  name: string;
  type: TransactionType | 'all';
  createdAt: string;
};

export type Account = {
  id: string;
  name: string;
  type: AccountType;
  closingDay?: number;
  dueDay?: number;
  createdAt: string;
};

export type PaymentMethod = {
  id: string;
  name: string;
  type: PaymentMethodType;
  createdAt: string;
};

export type RecurringRule = {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  dayOfMonth: number;
  categoryId: string;
  accountId: string;
  paymentMethodId?: string;
  startsAt: string;
  endsAt?: string;
  isActive: boolean;
  createdAt: string;
};

export type InstallmentGroup = {
  id: string;
  description: string;
  totalAmount: number;
  installmentAmount: number;
  installmentTotal: number;
  firstDueDate: string;
  categoryId: string;
  accountId: string;
  paymentMethodId?: string;
  createdAt: string;
};

export type Transaction = {
  id: string;
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
  paymentMethodId?: string;
  paymentMethod?: string;
  recurrenceId?: string;
  installmentGroupId?: string;
  installmentNumber?: number;
  installmentTotal?: number;
  createdAt: string;
  updatedAt: string;
};

export class GrakmaDatabase extends Dexie {
  // Representa a tabela de transações e usa "id" como chave primária.
  transactions!: EntityTable<Transaction, 'id'>;
  categories!: EntityTable<Category, 'id'>;
  accounts!: EntityTable<Account, 'id'>;
  paymentMethods!: EntityTable<PaymentMethod, 'id'>;
  recurringRules!: EntityTable<RecurringRule, 'id'>;
  installmentGroups!: EntityTable<InstallmentGroup, 'id'>;

  constructor() {
    // Nome do banco que aparece no IndexedDB do navegador.
    super('grakma');

    // Define a primeira versão do banco e seus índices.
    this.version(1).stores({
      // "id" é a chave primária; os outros campos ajudam em buscas e ordenações.
      transactions: 'id, type, date, category, account, createdAt, updatedAt',
    });

    // Adiciona cadastros, status, vencimento, recorrência e parcelas.
    this.version(2)
      .stores({
        transactions:
          'id, type, status, dueDate, paidAt, categoryId, accountId, paymentMethodId, recurrenceId, installmentGroupId, createdAt, updatedAt',
        categories: 'id, name, type, createdAt',
        accounts: 'id, name, type, createdAt',
        paymentMethods: 'id, name, type, createdAt',
        recurringRules: 'id, type, dayOfMonth, categoryId, accountId, isActive, createdAt',
        installmentGroups: 'id, categoryId, accountId, firstDueDate, createdAt',
      })
      .upgrade((transaction) =>
        transaction
          .table('transactions')
          .toCollection()
          .modify((item) => {
            const legacyDate = item.date as string | undefined;

            item.status = item.status ?? 'confirmed';
            item.dueDate = item.dueDate ?? legacyDate ?? new Date().toISOString().slice(0, 10);
            item.paidAt = item.paidAt ?? item.dueDate;
            delete item.date;
          })
      );

    // Separa onde a cobrança acontece de qual conta paga a cobrança.
    this.version(3)
      .stores({
        transactions:
          'id, type, status, dueDate, paidAt, categoryId, accountId, chargedAccountId, fundingAccountId, paymentMethodId, recurrenceId, installmentGroupId, createdAt, updatedAt',
        categories: 'id, name, type, createdAt',
        accounts: 'id, name, type, createdAt',
        paymentMethods: 'id, name, type, createdAt',
        recurringRules: 'id, type, dayOfMonth, categoryId, accountId, isActive, createdAt',
        installmentGroups: 'id, categoryId, accountId, firstDueDate, createdAt',
      })
      .upgrade((transaction) =>
        transaction
          .table('transactions')
          .toCollection()
          .modify((item) => {
            if (item.type === 'expense') {
              item.chargedAccount = item.chargedAccount ?? item.account;
              item.chargedAccountId = item.chargedAccountId ?? item.accountId;
              item.fundingAccount = item.fundingAccount ?? item.account;
              item.fundingAccountId = item.fundingAccountId ?? item.accountId;
            }
          })
      );
  }
}

// Mantém uma única conexão do app com o banco local.
export const db = new GrakmaDatabase();
