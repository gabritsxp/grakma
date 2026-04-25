import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

async function getMessages(locale: string) {
  switch (locale) {
    case 'en':
      return (await import('../messages/en.json')).default;

    case 'pt-BR':
    default:
      return (await import('../messages/pt-BR.json')).default;
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;

  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  return {
    locale,
    messages: await getMessages(locale),
  };
});