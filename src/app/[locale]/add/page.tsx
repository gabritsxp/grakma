import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/ui/PageHeader';
import { AddTransactionForm } from '@/features/transactions/components/AddTransactionForm';

export default async function AddPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  setRequestLocale(locale);

  return <AddContent />;
}

function AddContent() {
  const t = useTranslations('add');

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
      />

      <AddTransactionForm />
    </div>
  );
}
