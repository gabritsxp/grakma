import type { ButtonHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: LucideIcon;
  label: string;
  variant?: 'default' | 'light';
};

export function IconButton({
  icon: Icon,
  label,
  variant = 'default',
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={clsx(
        'flex h-10 w-10 items-center justify-center rounded-full transition',
        variant === 'default' && 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800',
        variant === 'light' && 'bg-white text-black hover:bg-zinc-200',
        className
      )}
      {...props}
    >
      <Icon size={18} />
    </button>
  );
}