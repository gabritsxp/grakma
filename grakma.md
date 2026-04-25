# Grakma - Project handoff

Grakma is a mobile-first personal finance organizer built with Next.js.

## Current status

- The app has a complete mobile UI shell.
- PT-BR is the default locale, with EN also supported.
- Transactions are now stored locally with Dexie and IndexedDB.
- The add transaction flow saves real local data.
- Home, transactions and reports read from IndexedDB instead of mock arrays.
- There is no backend, authentication, sync or cloud backup yet.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- next-intl for i18n
- Dexie for IndexedDB
- lucide-react icons
- clsx
- tailwind-merge
- nanoid
- @radix-ui/react-slot for Button asChild
- TanStack Form installed, not wired yet
- Zod installed, not wired yet
- Zustand installed, not wired yet

## Product goal

Grakma should replace a personal finance spreadsheet.

The app should let the user register:

- salary and income
- benefits like Swile, meal voucher and transport voucher
- expenses
- later: accounts, categories, monthly reports, import/export and backups

## Style

- Mobile-first
- Dark mode / black mode by default
- Designed for mobile browser resolution
- Bottom navigation
- Modern rounded UI
- Reusable components whenever possible
- PT-BR is the default language
- EN is also supported

## Routing

The app uses localized routes:

- `/pt-BR`
- `/pt-BR/add`
- `/pt-BR/transactions`
- `/pt-BR/reports`
- `/pt-BR/settings`
- `/en`
- `/en/add`
- `/en/transactions`
- `/en/reports`
- `/en/settings`

`src/app/page.tsx` renders a static link to `/pt-BR` for GitHub Pages compatibility.

Locale pages use this pattern:

```tsx
import { setRequestLocale } from 'next-intl/server';

export default async function Page({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  setRequestLocale(locale);

  return <PageContent />;
}
```

## Local database

Dexie is configured in:

- `src/lib/db/database.ts`
- `src/lib/db/transactions.ts`
- `src/lib/db/useTransactions.ts`

The first persisted model is `Transaction`:

```ts
type Transaction = {
  id: string;
  type: 'income' | 'expense' | 'benefit';
  description: string;
  amount: number;
  date: string;
  category: string;
  account: string;
  createdAt: string;
  updatedAt: string;
};
```

Data is stored in the browser IndexedDB. Stopping the local Next.js server does not delete transactions.

## Real data flow

- `/add` uses `AddTransactionForm` to save transactions with Dexie.
- `/transactions` lists transactions from IndexedDB.
- The home balance and summary cards are calculated from transactions.
- Reports calculate monthly overview, category breakdown and simple insights from transactions.

Shared calculations live in:

- `src/lib/transactions/summary.ts`

## Useful commands

```bash
npm run dev
npm run lint
npm run build
npm run build:pages
```

Default local URL:

```txt
http://localhost:3000/pt-BR
```

## Static hosting

The project is configured for static export:

- `next.config.ts` uses `output: 'export'`.
- Locale routes are generated with `generateStaticParams`.
- The root page uses a static relative link to `/pt-BR`.
- `.github/workflows/pages.yml` can publish `out/` to GitHub Pages.
- `public/.nojekyll` keeps GitHub Pages from ignoring `_next` assets.

For project pages, set `NEXT_PUBLIC_BASE_PATH` to the repository path:

```bash
NEXT_PUBLIC_BASE_PATH=/grakma npm run build
```

For a user site like `username.github.io`, no base path is needed:

```bash
npm run build
```

## Next steps

- Add inline validation messages to the add transaction form.
- Replace simple form state with TanStack Form.
- Add Zod schemas for transaction validation.
- Add transaction delete and edit actions.
- Add filters and search using real data.
- Add account and category management.
- Add export/import backup flow.
