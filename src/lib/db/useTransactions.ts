'use client';

import { useEffect, useState } from 'react';
import type { Transaction } from './database';
import { listTransactions } from './transactions';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadTransactions() {
      const data = await listTransactions();

      if (isMounted) {
        setTransactions(data);
        setIsLoading(false);
      }
    }

    loadTransactions();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    transactions,
    isLoading,
  };
}
