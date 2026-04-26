'use client';

import { useState } from 'react';
import { TransactionsList } from './TransactionsList';
import { TransactionsMonthSummary } from './TransactionsMonthSummary';

export function TransactionsMonthView() {
  const [monthDate, setMonthDate] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  return (
    <>
      <TransactionsMonthSummary
        monthDate={monthDate}
        onMonthChange={setMonthDate}
      />

      <TransactionsList monthDate={monthDate} />
    </>
  );
}
