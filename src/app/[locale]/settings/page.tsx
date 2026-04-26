import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionCard } from '@/components/ui/SectionCard';
import { FinanceSetup } from '@/features/settings/components/FinanceSetup';
import { SettingsItem } from '@/features/settings/components/SettingsItem';

export default async function SettingsPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  setRequestLocale(locale);

  return <SettingsContent />;
}

function SettingsContent() {
  const t = useTranslations('settings');

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
      />

      <SectionCard className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">{t('preferences')}</h2>

          <p className="mt-1 text-sm text-zinc-500">
            {t('preferencesDescription')}
          </p>
        </div>

        <SettingsItem
          title={t('language')}
          description={t('languageDescription')}
          action={<LanguageSwitcher />}
        />

        <SettingsItem
          title={t('appearance')}
          description={t('appearanceDescription')}
        />

        <SettingsItem
          title={t('data')}
          description={t('dataDescription')}
        />
      </SectionCard>

      <FinanceSetup />
    </div>
  );
}
