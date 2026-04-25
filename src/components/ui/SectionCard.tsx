import type { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

type SectionCardProps = HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
};

export function SectionCard({
  children,
  className,
  ...props
}: SectionCardProps) {
  return (
    <section
      className={clsx(
        'rounded-[2rem] border border-zinc-800 bg-zinc-950 p-5',
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}