import { describe, expect, it } from 'vitest';
import { isDuplicateSignUp, normalizeEmail } from './auth';

describe('account registration helpers', () => {
  it('normalizes an email before registration', () => {
    expect(normalizeEmail('  Mark.Quan@Example.COM ')).toBe('mark.quan@example.com');
  });

  it('detects the explicit duplicate-user error', () => {
    expect(isDuplicateSignUp(null, { code: 'user_already_exists' })).toBe(true);
  });

  it('detects Supabase duplicate-account obfuscation', () => {
    expect(isDuplicateSignUp({ user: { identities: [] } }, null)).toBe(true);
  });

  it('allows a newly created identity', () => {
    expect(isDuplicateSignUp({ user: { identities: [{ id: 'new-identity' }] } }, null)).toBe(false);
  });
});
