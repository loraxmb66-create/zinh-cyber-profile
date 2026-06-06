import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: ReactNode;
};

export function Button({ variant = 'primary', className = '', children, ...props }: Props) {
  const variants = {
    primary: 'border-cyan-300/60 bg-cyan-300 text-black shadow-[0_0_26px_rgba(0,229,255,.28)]',
    secondary: 'border-white/15 bg-white/10 text-white hover:border-cyan-300/45',
    ghost: 'border-transparent bg-transparent text-slate-300 hover:bg-white/10'
  };

  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
