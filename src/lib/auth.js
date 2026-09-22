export const DUPLICATE_EMAIL_MESSAGE = 'This email is already used. Please sign in instead.';

export const normalizeEmail = (email) => email.trim().toLowerCase();

export function isDuplicateSignUp(data, error) {
  return error?.code === 'user_already_exists'
    || /already (registered|exists)/i.test(error?.message || '')
    || Boolean(data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0);
}
