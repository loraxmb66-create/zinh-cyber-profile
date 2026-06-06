import { useEffect, useState } from 'react';

export function CursorAura() {
  const [point, setPoint] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const move = (event: PointerEvent) => setPoint({ x: event.clientX, y: event.clientY });
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  return (
    <div
      className="pointer-events-none fixed z-50 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neon-cyan/60 mix-blend-screen shadow-neon md:block"
      style={{ left: point.x, top: point.y }}
    />
  );
}
