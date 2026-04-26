'use client';

import { liveQuery } from 'dexie';
import { useEffect, useState } from 'react';
import type { Account, Category, PaymentMethod } from './database';
import { listAccounts, listCategories, listPaymentMethods } from './transactions';

export function useFinanceData() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    const subscription = liveQuery(async () => {
      const [categoryData, accountData, paymentMethodData] = await Promise.all([
        listCategories(),
        listAccounts(),
        listPaymentMethods(),
      ]);

      return {
        categories: categoryData,
        accounts: accountData,
        paymentMethods: paymentMethodData,
      };
    }).subscribe((data) => {
      setCategories(data.categories);
      setAccounts(data.accounts);
      setPaymentMethods(data.paymentMethods);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    categories,
    accounts,
    paymentMethods,
  };
}
