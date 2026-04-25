'use client';

import {
  ChartSpline,
  Home,
  PlusCircle,
  Settings,
  Wallet,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { clsx } from 'clsx';
import { Link, usePathname } from '@/i18n/navigation';

const navItems = [
  {
    labelKey: 'home',
    href: '/',
    icon: Home,
  },
  {
    labelKey: 'transactions',
    href: '/transactions',
    icon: Wallet,
  },
  {
    labelKey: 'add',
    href: '/add',
    icon: PlusCircle,
    isPrimary: true,
  },
  {
    labelKey: 'reports',
    href: '/reports',
    icon: ChartSpline,
  },
  {
    labelKey: 'settings',
    href: '/settings',
    icon: Settings,
  },
];

export function BottomNavbar() {
  const pathname = usePathname();
  const t = useTranslations('navigation');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-black/95 px-3 pb-4 pt-2 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5 text-xs transition',
                isActive ? 'text-white' : 'text-zinc-500',
                item.isPrimary && '-mt-7'
              )}
            >
              <div
                className={clsx(
                  'flex items-center justify-center rounded-full transition',
                  item.isPrimary
                    ? 'h-14 w-14 bg-white text-black shadow-lg shadow-white/10'
                    : 'h-8 w-8',
                  !item.isPrimary && isActive && 'bg-zinc-900'
                )}
              >
                <Icon
                  size={item.isPrimary ? 28 : 20}
                  strokeWidth={item.isPrimary ? 2.4 : 2}
                />
              </div>

              {!item.isPrimary && (
                <span className="truncate text-[11px] font-medium">
                  {t(item.labelKey)}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}