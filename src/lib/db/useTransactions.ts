'use client';

import { liveQuery } from 'dexie';
import { useCallback, useEffect, useState } from 'react';
import type { Transaction } from './database';
import { listTransactions } from './transactions';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const reloadTransactions = useCallback(async () => {
    const data = await listTransactions();

    setTransactions(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const subscription = liveQuery(() => listTransactions()).subscribe({
      next: (data) => {
        setTransactions(data);
        setIsLoading(false);
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    transactions,
    isLoading,
    reloadTransactions,
  };
}
