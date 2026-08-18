/**
 * timeUtils.js — Single source of truth for time/date formatting across PortfolioOS.
 * All components import from here instead of doing their own toLocaleTimeString.
 */

/**
 * Format a Date object into a time string respecting system settings.
 * @param {Date} date
 * @param {Object} settings - from useStore().settings
 * @returns {string}
 */
export function formatTime(date, settings = {}) {
  const opts = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: settings.clockFormat !== '24h',
  };
  if (settings.showSeconds) {
    opts.second = '2-digit';
  }
  if (settings.timezone) {
    opts.timeZone = settings.timezone;
  }
  try {
    return date.toLocaleTimeString('en-US', opts);
  } catch {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
}

/**
 * Format a Date object into a date string respecting system settings.
 * @param {Date} date
 * @param {Object} settings - from useStore().settings
 * @returns {string}
 */
export function formatDate(date, settings = {}) {
  const tz = settings.timezone || undefined;
  const fmt = settings.dateFormat || 'MMM DD, YYYY';

  try {
    // Get parts in the user's timezone
    const parts = {};
    const partFormatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'short', day: '2-digit',
      weekday: 'short', timeZone: tz,
    });
    partFormatter.formatToParts(date).forEach(p => {
      parts[p.type] = p.value;
    });

    // Also get numeric month
    const numMonth = new Intl.DateTimeFormat('en-US', {
      month: '2-digit', timeZone: tz,
    }).format(date);

    const day = parts.day || '01';
    const monthShort = parts.month || 'Jan';
    const year = parts.year || '2024';
    const weekday = parts.weekday || 'Mon';

    switch (fmt) {
      case 'DD/MM/YYYY':
        return `${day}/${numMonth}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${numMonth}-${day}`;
      case 'MM/DD/YYYY':
        return `${numMonth}/${day}/${year}`;
      case 'MMM DD, YYYY':
      default:
        return `${weekday}, ${monthShort} ${day}`;
    }
  } catch {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
}

/**
 * Format date for long display (Desktop clock overlay)
 */
export function formatDateLong(date, settings = {}) {
  const tz = settings.timezone || undefined;
  try {
    return date.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
      timeZone: tz,
    });
  } catch {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }
}

/**
 * Format for terminal `date` command — full system date string
 */
export function formatFullDate(date, settings = {}) {
  const tz = settings.timezone || undefined;
  try {
    return date.toLocaleString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: settings.clockFormat !== '24h',
      timeZone: tz,
      timeZoneName: 'short',
    });
  } catch {
    return date.toString();
  }
}
