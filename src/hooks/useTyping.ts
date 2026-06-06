import { useEffect, useState } from 'react';

export function useTyping(words: string[], speed = 78, pause = 1100) {
  const [index, setIndex] = useState(0);
  const [slice, setSlice] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index] ?? '';
    const delay = deleting ? speed / 1.7 : speed;
    const timer = window.setTimeout(() => {
      if (!deleting && slice < word.length) setSlice((value) => value + 1);
      if (!deleting && slice === word.length) window.setTimeout(() => setDeleting(true), pause);
      if (deleting && slice > 0) setSlice((value) => value - 1);
      if (deleting && slice === 0) {
        setDeleting(false);
        setIndex((value) => (value + 1) % words.length);
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [deleting, index, pause, slice, speed, words]);

  return (words[index] ?? '').slice(0, slice);
}
