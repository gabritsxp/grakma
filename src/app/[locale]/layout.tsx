import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { BottomNavbar } from '@/components/layout/BottomNavbar';
import { routing } from '@/i18n/routing';

async function getMessages(locale: string) {
  switch (locale) {
    case 'en':
      return (await import('@/messages/en.json')).default;

    case 'pt-BR':
    default:
      return (await import('@/messages/pt-BR.json')).default;
  }
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <main className="mx-auto min-h-screen max-w-md px-4 pb-28 pt-6">
        {children}
      </main>

      <BottomNavbar />
    </NextIntlClientProvider>
  );
}