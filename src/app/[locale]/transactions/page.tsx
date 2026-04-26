import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/ui/PageHeader';
import { TransactionsMonthView } from '@/features/transactions/components/TransactionsMonthView';
import { TransactionsSearchBar } from '@/features/transactions/components/TransactionsSearchBar';

export default async function TransactionsPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  setRequestLocale(locale);

  return <TransactionsContent />;
}

function TransactionsContent() {
  const t = useTranslations('transactionsPage');

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
      />

      <TransactionsSearchBar />

      <TransactionsMonthView />
    </div>
  );
}
