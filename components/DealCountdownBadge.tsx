'use client';

import { useEffect, useState } from 'react';

const CHIP = 'inline-flex items-center px-3 py-1 typography-caption font-semibold';

interface DealCountdownBadgeProps {
  target: string;
  compact?: boolean;
}

export function DealCountdownBadge({ target, compact = false }: DealCountdownBadgeProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ h: number; m: number; d: number }>({
    h: 0,
    m: 0,
    d: 0,
  });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const targetDate = new Date(target).getTime();

    const tick = () => {
      const diff = targetDate - Date.now();
      if (diff <= 0) {
        setExpired(true);
        setTimeLeft({ h: 0, m: 0, d: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft({ d: days, h: hours, m: minutes });
    };

    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [target, mounted]);

  if (!mounted) {
    return null;
  }

  if (expired) {
    return <span className={`badge-meta ${CHIP}`}>Expired</span>;
  }

  const urgent = timeLeft.d <= 7;
  const tone = urgent ? 'badge-urgency' : 'badge-notice';
  const label =
    timeLeft.d > 0
      ? `${timeLeft.d}d left`
      : timeLeft.h > 0
        ? `${timeLeft.h}h left`
        : `${timeLeft.m}m left`;

  return (
    <span className={`${tone} ${CHIP}`} data-compact={compact ? 'true' : undefined}>
      {label}
    </span>
  );
}
