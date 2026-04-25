# Grakma

Grakma is a mobile-first personal finance organizer built with Next.js. It is designed to replace a personal spreadsheet for tracking income, benefits and expenses.

The app currently stores data locally in the browser with IndexedDB through Dexie.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- next-intl
- Dexie
- lucide-react
- clsx
- tailwind-merge
- nanoid
- Radix Slot

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

## Local Data

Transactions are saved in the browser IndexedDB database named `grakma`.

Stopping the local server does not delete transactions. Data can be lost if the browser site data is cleared, a different browser/profile is used, or the app is opened from a different origin such as another port.

