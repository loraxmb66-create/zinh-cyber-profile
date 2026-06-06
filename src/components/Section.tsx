import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export function Section({ id, eyebrow, title, children }: Props) {
  return (
    <motion.section
      id={id}
      className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-90px' }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
    >
      <div className="mb-9">
        <p className="mb-3 font-display text-xs uppercase tracking-[0.34em] text-neon-cyan">{eyebrow}</p>
        <h2 className="text-3xl font-black text-white sm:text-4xl">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}
