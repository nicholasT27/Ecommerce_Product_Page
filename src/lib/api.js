import { supabase } from './supabase';

export async function api(path, options = {}) {
  const { data } = supabase ? await supabase.auth.getSession() : { data: null };
  const authorization = data?.session?.access_token ? { Authorization: `Bearer ${data.session.access_token}` } : {};

  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...authorization, ...options.headers },
  });

  const body = await safeParseBody(response);

  if (!response.ok) {
    throw new Error(friendlyErrorMessage(response.status, body));
  }

  return body;
}

async function safeParseBody(response) {
  if (response.status === 204) return null;

  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();

  if (!text) return null;

  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  return null;
}

function friendlyErrorMessage(status, body) {
  // Prefer the server's own message when it gave us one
  const serverMessage = (body && typeof body === 'object' && body.error) || null;
  if (serverMessage) return serverMessage;

  // Otherwise fall back to a friendly message based on the status code
  if (status === 401) return 'You need to sign in to continue.';
  if (status === 403) return "You don't have permission to do that.";
  if (status === 404) return "We couldn't find what you were looking for.";
  if (status === 429) return 'Too many requests. Please wait a moment and try again.';
  if (status >= 500) return 'Server is currently unavailable. Please try again shortly.';

  return `Something went wrong (${status}). Please try again.`;
}
