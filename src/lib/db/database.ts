import Dexie, { type EntityTable } from 'dexie';

export type TransactionType = 'income' | 'expense' | 'benefit';

export type Transaction = {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  category: string;
  account: string;
  createdAt: string;
  updatedAt: string;
};

export class GrakmaDatabase extends Dexie {
  // Representa a tabela de transações e usa "id" como chave primária.
  transactions!: EntityTable<Transaction, 'id'>;

  constructor() {
    // Nome do banco que aparece no IndexedDB do navegador.
    super('grakma');

    // Define a primeira versão do banco e seus índices.
    this.version(1).stores({
      // "id" é a chave primária; os outros campos ajudam em buscas e ordenações.
      transactions: 'id, type, date, category, account, createdAt, updatedAt',
    });
  }
}

// Mantém uma única conexão do app com o banco local.
export const db = new GrakmaDatabase();
