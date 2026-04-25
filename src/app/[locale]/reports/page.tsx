import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/ui/PageHeader';
import { ReportsCategoryBreakdown } from '@/features/reports/components/ReportsCategoryBreakdown';
import { ReportsInsightList } from '@/features/reports/components/ReportsInsightList';
import { ReportsMonthlyOverview } from '@/features/reports/components/ReportsMonthlyOverview';

export default async function ReportsPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  setRequestLocale(locale);

  return <ReportsContent />;
}

function ReportsContent() {
  const t = useTranslations('reports');

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
      />

      <ReportsMonthlyOverview />

      <ReportsCategoryBreakdown />

      <ReportsInsightList />
    </div>
  );
}