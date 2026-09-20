import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profileName, setProfileName] = useState('');
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const userId = session?.user?.id;

  const refreshProfile = useCallback(async () => {
    if (!supabase || !userId) { setProfileName(''); return; }
    const { data } = await supabase.from('profiles').select('full_name').eq('id', userId).maybeSingle();
    setProfileName(data?.full_name || session?.user?.user_metadata?.full_name || '');
  }, [session?.user?.user_metadata?.full_name, userId]);

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

  useEffect(() => { Promise.resolve().then(refreshProfile); }, [refreshProfile]);

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

  return <AuthContext.Provider value={{ configured: isSupabaseConfigured, session, user: session?.user ?? null, profileName, refreshProfile, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
