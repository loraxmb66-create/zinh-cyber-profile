import type { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`glass-panel ${className}`}>{children}</div>;
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
