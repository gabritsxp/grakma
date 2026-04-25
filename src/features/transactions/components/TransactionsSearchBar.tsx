import { Filter, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { IconButton } from '@/components/ui/IconButton';
import { TextInput } from '@/components/ui/TextInput';

export function TransactionsSearchBar() {
  const t = useTranslations('transactionsPage');

  return (
    <section className="flex gap-3">
      <div className="flex-1">
        <TextInput
          label={t('search')}
          icon={Search}
          placeholder={t('searchPlaceholder')}
        />
      </div>

      <div className="flex items-end">
        <IconButton
          icon={Filter}
          label={t('filter')}
          className="h-12 w-12 rounded-2xl border border-zinc-800 bg-zinc-950"
        />
      </div>
    </section>
  );
}