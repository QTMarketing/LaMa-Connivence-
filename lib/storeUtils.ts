import { Store } from './storeData';

/**
 * Parse store hours string and check if store is currently open
 * Format: "Mon-Sun: 6:00 AM - 11:00 PM" or "Mon-Fri: 6:00 AM - 11:00 PM, Sat-Sun: 7:00 AM - 9:00 PM"
 */
export function isStoreOpen(hours: string): boolean {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes since midnight

  // Handle 24-hour stores
  if (hours.toLowerCase().includes('24 hours') || hours.toLowerCase().includes('24/7')) {
    return true;
  }

  // Parse hours string
  const parts = hours.split(',');
  
  for (const part of parts) {
    const trimmed = part.trim();
    const dayMatch = trimmed.match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun)(?:-(Mon|Tue|Wed|Thu|Fri|Sat|Sun))?/i);
    if (!dayMatch) continue;

    const startDay = dayMatch[1];
    const endDay = dayMatch[2] || startDay;

    const dayRange = getDayRange(startDay, endDay);
    if (!dayRange.includes(currentDay)) continue;

    // Extract time range
    const timeMatch = trimmed.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!timeMatch) continue;

    const openHour = parseInt(timeMatch[1]);
    const openMin = parseInt(timeMatch[2]);
    const openPeriod = timeMatch[3].toUpperCase();
    const closeHour = parseInt(timeMatch[4]);
    const closeMin = parseInt(timeMatch[5]);
    const closePeriod = timeMatch[6].toUpperCase();

    const openTime = convertToMinutes(openHour, openMin, openPeriod);
    const closeTime = convertToMinutes(closeHour, closeMin, closePeriod);

    if (currentTime >= openTime && currentTime <= closeTime) {
      return true;
    }
  }

  return false;
}

function getDayRange(startDay: string, endDay: string): number[] {
  const days: { [key: string]: number } = {
    'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6
  };

  const start = days[startDay];
  const end = days[endDay];
  const range: number[] = [];

  if (start <= end) {
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
  } else {
    // Handle wrap-around (e.g., Fri-Mon)
    for (let i = start; i <= 6; i++) {
      range.push(i);
    }
    for (let i = 0; i <= end; i++) {
      range.push(i);
    }
  }

  return range;
}

function convertToMinutes(hour: number, minute: number, period: string): number {
  if (period === 'AM') {
    if (hour === 12) return minute; // 12:XX AM = 0:XX
    return hour * 60 + minute;
  } else { // PM
    if (hour === 12) return 12 * 60 + minute; // 12:XX PM = 12:XX
    return (hour + 12) * 60 + minute;
  }
}

/**
 * Get "Open Now" status badge for a store
 */
export function getStoreStatusBadge(store: Store): { text: string; color: string; bgColor: string } {
  const isOpen = isStoreOpen(store.hours);
  
  if (isOpen) {
    return {
      text: 'Open Now',
      color: '#10B981', // green
      bgColor: '#D1FAE5'
    };
  } else {
    return {
      text: 'Closed',
      color: '#EF4444', // red
      bgColor: '#FEE2E2'
    };
  }
}
