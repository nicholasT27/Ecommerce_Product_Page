import { supabase } from './supabase';

export async function api(path, options = {}) {
  const { data } = supabase ? await supabase.auth.getSession() : { data: null };
  const authorization = data?.session?.access_token ? { Authorization: `Bearer ${data.session.access_token}` } : {};
  const response = await fetch(`/api${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...authorization, ...options.headers } });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || 'Something went wrong.');
  return body;
}
