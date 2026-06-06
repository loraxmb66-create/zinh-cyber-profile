import type { HTMLAttributes, ReactNode } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className = '', ...props }: CardProps) {
  return <div className={`glass-panel ${className}`} {...props}>{children}</div>;
}

export function CardHeader({ title, eyebrow, children }: { title: string; eyebrow?: string; children?: ReactNode }) {
  return (
    <div className="mb-5">
      {eyebrow && <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-cyan-300">{eyebrow}</p>}
      <h2 className="text-xl font-black text-white md:text-2xl">{title}</h2>
      {children}
    </div>
  );
}
