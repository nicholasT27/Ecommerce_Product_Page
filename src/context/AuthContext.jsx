import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const userId = session?.user?.id;

  const refreshAvatar = useCallback(async () => {
    if (!supabase || !userId) { setAvatarUrl(null); return; }
    const { data, error } = await supabase.from('profiles').select('avatar_path, updated_at').eq('id', userId).maybeSingle();
    if (error || !data?.avatar_path) { setAvatarUrl(null); return; }
    const { data: publicData } = supabase.storage.from('avatars').getPublicUrl(data.avatar_path);
    const version = encodeURIComponent(data.updated_at || Date.now());
    setAvatarUrl(`${publicData.publicUrl}?v=${version}`);
  }, [userId]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => { Promise.resolve().then(refreshAvatar); }, [refreshAvatar]);

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };
  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
    return data;
  };
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return <AuthContext.Provider value={{ configured: isSupabaseConfigured, session, user: session?.user ?? null, avatarUrl, refreshAvatar, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
