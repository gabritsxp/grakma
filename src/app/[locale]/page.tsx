import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { BalanceCard } from '@/components/home/BalanceCard';
import { BalanceVisibilityButton } from '@/components/ui/BalanceVisibilityButton';
import { RecentTransactions } from '@/components/home/RecentTransactions';
import { SummaryCards } from '@/components/home/SummaryCards';

export default async function HomePage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations('home');

  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-zinc-500">{t('welcomeBack')}</p>

            <h1 className="text-2xl font-semibold tracking-tight">
              Grakma
            </h1>
          </div>

          <BalanceVisibilityButton />
        </div>
      </header>

      <BalanceCard />

      <SummaryCards />

      <RecentTransactions />
    </div>
  );
}