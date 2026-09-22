// Supabase includes a timezone offset while SQLite returns a space-separated
// UTC timestamp. Normalize both formats before presenting an order date.
export function formatOrderDate(value) {
  if (!value) return 'Date unavailable';

  let normalized = String(value).trim().replace(/^(\d{4}-\d{2}-\d{2})\s/, '$1T');
  normalized = normalized.replace(/(\.\d{3})\d+(?=Z|[+-]\d{2})/i, '$1');
  if (!/(?:Z|[+-]\d{2}(?::?\d{2})?)$/i.test(normalized)) normalized += 'Z';

  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
