'use client';

import { useEffect, useState } from 'react';

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

  // Only render after mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Handle both date strings and Date objects
    const targetDate = typeof target === 'string' ? new Date(target).getTime() : new Date(target).getTime();

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
    const id = setInterval(tick, 60000); // Update every minute
    return () => clearInterval(id);
  }, [target, mounted]);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  if (expired) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-500 text-white typography-caption font-semibold">
        Expired
      </span>
    );
  }

  if (compact) {
    // Compact version for cards
    if (timeLeft.d > 0) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-600 text-white typography-caption font-semibold">
          {timeLeft.d}d left
        </span>
      );
    } else if (timeLeft.h > 0) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-600 text-white typography-caption font-semibold">
          {timeLeft.h}h left
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-600 text-white typography-caption font-semibold">
          {timeLeft.m}m left
        </span>
      );
    }
  }

  // Full version
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-black/80 text-white typography-caption backdrop-blur-sm">
      {timeLeft.d > 0 && `${timeLeft.d}d `}
      {timeLeft.h > 0 && `${timeLeft.h}h `}
      {timeLeft.m}m left
    </span>
  );
}
