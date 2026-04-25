'use client';

import { Languages } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

const locales = [
  {
    labelKey: 'ptBR',
    value: 'pt-BR',
  },
  {
    labelKey: 'en',
    value: 'en',
  },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('language');

  return (
    <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-3 py-2">
      <Languages size={16} className="text-zinc-500" />

      <label htmlFor="language" className="sr-only">
        {t('label')}
      </label>

      <select
        id="language"
        value={locale}
        onChange={(event) => {
          router.replace(pathname, {
            locale: event.target.value,
          });
        }}
        className="bg-transparent text-sm font-medium text-zinc-300 outline-none"
      >
        {locales.map((item) => (
          <option key={item.value} value={item.value} className="bg-black">
            {t(item.labelKey)}
          </option>
        ))}
      </select>
    </div>
  );
}