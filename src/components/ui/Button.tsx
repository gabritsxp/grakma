import type { ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  asChild?: boolean;
};

export function Button({
  variant = 'primary',
  asChild = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : 'button';

  return (
    <Component
      className={clsx(
        'flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold transition',
        variant === 'primary' && 'bg-white text-black hover:bg-zinc-200',
        variant === 'secondary' &&
          'border border-zinc-800 bg-zinc-950 text-zinc-200 hover:bg-zinc-900',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}