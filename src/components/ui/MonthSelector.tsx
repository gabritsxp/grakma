'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLocale } from 'next-intl';

type MonthSelectorProps = {
  value: Date;
  onChange: (date: Date) => void;
};

function createMonthDate(year: number, month: number) {
  return new Date(year, month, 1, 12);
}

function isSameMonth(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth()
  );
}

export function MonthSelector({ value, onChange }: MonthSelectorProps) {
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [visibleYear, setVisibleYear] = useState(value.getFullYear());

  const selectedLabel = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(value);

  const months = Array.from({ length: 12 }, (_, month) => {
    const date = createMonthDate(visibleYear, month);

    return {
      date,
      label: new Intl.DateTimeFormat(locale, {
        month: 'long',
      }).format(date),
    };
  });

  useEffect(() => {
    setVisibleYear(value.getFullYear());
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative flex justify-end">
      <button
        type="button"
        className="flex h-12 min-w-40 items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-black px-4 text-sm font-semibold text-zinc-100 outline-none transition hover:bg-zinc-900 sm:min-w-48"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="capitalize">{selectedLabel}</span>
        <span className="text-zinc-500">▾</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed left-1/2 top-1/2 z-[80] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-5 shadow-2xl shadow-black/80 sm:absolute sm:bottom-auto sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-80 sm:max-w-none sm:translate-x-0 sm:translate-y-0 sm:rounded-3xl sm:p-4">
            <div className="mb-5 flex items-center justify-between gap-3">
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-black text-zinc-400 transition hover:bg-zinc-900 hover:text-white sm:h-10 sm:w-10"
                onClick={() => setVisibleYear((year) => year - 1)}
              >
                <ChevronLeft size={18} />
              </button>

              <div className="text-center">
                <p className="text-xs text-zinc-500">Selecionar mês</p>
                <strong className="text-lg text-zinc-100">{visibleYear}</strong>
              </div>

              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-black text-zinc-400 transition hover:bg-zinc-900 hover:text-white sm:h-10 sm:w-10"
                onClick={() => setVisibleYear((year) => year + 1)}
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-2">
              {months.map((month) => {
                const selected = isSameMonth(month.date, value);

                return (
                  <button
                    key={month.date.toISOString()}
                    type="button"
                    className={
                      selected
                        ? 'rounded-2xl border border-white bg-white px-4 py-4 text-sm font-semibold text-black capitalize sm:px-3 sm:py-3'
                        : 'rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-sm font-semibold text-zinc-300 capitalize transition hover:bg-zinc-900 hover:text-white sm:px-3 sm:py-3'
                    }
                    onClick={() => {
                      onChange(month.date);
                      setIsOpen(false);
                    }}
                  >
                    {month.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-black text-sm font-semibold text-zinc-300 transition hover:bg-zinc-900 hover:text-white sm:hidden"
              onClick={() => setIsOpen(false)}
            >
              <X size={16} />
              Fechar
            </button>
          </div>
        </>
      )}
    </div>
  );
}