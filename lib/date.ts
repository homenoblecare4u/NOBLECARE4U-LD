/**
 * Date and timezone utility for Asia/Kolkata (IST = UTC + 5:30)
 * Ensures consistent, deterministic date calculation and display across server and client.
 */

export const TIMEZONE = 'Asia/Kolkata';

// Offset for Asia/Kolkata is +5 hours 30 minutes = 330 minutes = 19,800,000 ms
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/**
 * Returns start and end of day in UTC for a given calendar date in Asia/Kolkata
 */
export function getIstStartAndEndOfDay(date: Date = new Date()): { start: Date; end: Date } {
  // Convert current UTC time to IST shifted time
  const istTime = new Date(date.getTime() + IST_OFFSET_MS);

  const year = istTime.getUTCFullYear();
  const month = istTime.getUTCMonth();
  const day = istTime.getUTCDate();

  // Construct UTC timestamp corresponding to 00:00:00.000 IST
  const startUtcMs = Date.UTC(year, month, day, 0, 0, 0, 0) - IST_OFFSET_MS;
  // Construct UTC timestamp corresponding to 23:59:59.999 IST
  const endUtcMs = Date.UTC(year, month, day, 23, 59, 59, 999) - IST_OFFSET_MS;

  return {
    start: new Date(startUtcMs),
    end: new Date(endUtcMs),
  };
}

/**
 * Parses a date range preset into UTC bounds aligned with Asia/Kolkata
 */
export function getDateRangeBounds(
  range?: 'all' | 'today' | 'yesterday' | '7days' | '30days' | 'custom',
  customStartDate?: string,
  customEndDate?: string
): { start?: Date; end?: Date } {
  if (!range || range === 'all') {
    return {};
  }

  const now = new Date();

  if (range === 'today') {
    return getIstStartAndEndOfDay(now);
  }

  if (range === 'yesterday') {
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return getIstStartAndEndOfDay(yesterday);
  }

  if (range === '7days') {
    const { end } = getIstStartAndEndOfDay(now);
    const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000 + 1);
    return { start, end };
  }

  if (range === '30days') {
    const { end } = getIstStartAndEndOfDay(now);
    const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000 + 1);
    return { start, end };
  }

  if (range === 'custom' && customStartDate) {
    const start = new Date(customStartDate);
    const end = customEndDate ? new Date(customEndDate) : new Date();
    // If user entered YYYY-MM-DD strings, treat start as 00:00:00 IST and end as 23:59:59 IST
    const { start: boundedStart } = getIstStartAndEndOfDay(start);
    const { end: boundedEnd } = getIstStartAndEndOfDay(end);
    return { start: boundedStart, end: boundedEnd };
  }

  return {};
}

/**
 * Formats a Date or timestamp string into Asia/Kolkata readable format
 * e.g. "03 Sep 2026, 09:30 PM IST"
 */
export function formatIstDateTime(dateInput: string | Date | undefined): string {
  if (!dateInput) return '—';
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return '—';

    return new Intl.DateTimeFormat('en-IN', {
      timeZone: TIMEZONE,
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  } catch {
    return '—';
  }
}

/**
 * Formats a Date into short date format e.g. "03 Sep 2026"
 */
export function formatIstDate(dateInput: string | Date | undefined): string {
  if (!dateInput) return '—';
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return '—';

    return new Intl.DateTimeFormat('en-IN', {
      timeZone: TIMEZONE,
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return '—';
  }
}

/**
 * Masks phone numbers for privacy on overview and recent leads widgets.
 * e.g. "+91 9876543210" -> "+91 98XXX XX210" or "9876543210" -> "98XXXXX210"
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone) return '—';
  const clean = phone.trim();
  if (clean.length <= 4) return clean;

  if (clean.length === 10) {
    return `${clean.slice(0, 2)}XXXXX${clean.slice(-3)}`;
  }

  if (clean.startsWith('+91') && clean.length >= 13) {
    const digits = clean.replace(/\D/g, '');
    const national = digits.slice(-10);
    return `+91 ${national.slice(0, 2)}XXX XX${national.slice(-3)}`;
  }

  return `${clean.slice(0, 3)}***${clean.slice(-3)}`;
}
