import { describe, expect, it } from 'vitest';
import { formatOrderDate } from './dates';

describe('order date formatting', () => {
  it('formats a Supabase timestamp that already includes an offset', () => {
    expect(formatOrderDate('2026-09-22T12:13:37.972928+00:00')).toBe('Sep 22, 2026');
  });

  it('formats a SQLite UTC timestamp', () => {
    expect(formatOrderDate('2026-09-22 12:13:37')).toBe('Sep 22, 2026');
  });

  it('does not display an invalid date for missing or malformed data', () => {
    expect(formatOrderDate(null)).toBe('Date unavailable');
    expect(formatOrderDate('not-a-date')).toBe('Date unavailable');
  });
});
