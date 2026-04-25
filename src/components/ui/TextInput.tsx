import type { InputHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: LucideIcon;
};

export function TextInput({
  label,
  icon: Icon,
  className,
  ...props
}: TextInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-400">
        {label}
      </label>

      <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-black px-4 py-3">
        <Icon size={18} className="text-zinc-500" />

        <input
          className={clsx(
            'w-full bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-600',
            className
          )}
          {...props}
        />
      </div>
    </div>
  );
}