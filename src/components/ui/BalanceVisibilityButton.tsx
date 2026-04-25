'use client';

import { Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { IconButton } from '@/components/ui/IconButton';

export function BalanceVisibilityButton() {
  const t = useTranslations('common');

  return (
    <IconButton
      icon={Eye}
      label={t('hideBalance')}
    />
  );
}