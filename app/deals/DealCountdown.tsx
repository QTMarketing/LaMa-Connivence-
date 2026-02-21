'use client';

import { useEffect, useState } from 'react';

interface DealCountdownProps {
  target: string;
}

export function DealCountdown({ target }: DealCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{ h: string; m: string; s: string }>({
    h: '00',
    m: '00',
    s: '00',
  });

  useEffect(() => {
    const targetDate = new Date(target).getTime();

    const tick = () => {
      const diff = targetDate - Date.now();
      if (diff <= 0) {
        setTimeLeft({ h: '00', m: '00', s: '00' });
        return;
      }
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft({
        h: h.toString().padStart(2, '0'),
        m: m.toString().padStart(2, '0'),
        s: s.toString().padStart(2, '0'),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
      <span className="typography-caption text-orange-200 uppercase tracking-[0.2em]">
        Ends in
      </span>
      <div className="flex items-center gap-2 font-mono text-sm sm:text-base text-white">
        <span>{timeLeft.h}</span>
        <span>:</span>
        <span>{timeLeft.m}</span>
        <span>:</span>
        <span>{timeLeft.s}</span>
      </div>
    </div>
  );
}

