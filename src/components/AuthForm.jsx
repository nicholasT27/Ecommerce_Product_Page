import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthForm() {
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { signIn, signUp } = useAuth();
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      if (mode === 'signin') await signIn(form.email, form.password);
      else {
        const data = await signUp(form.email, form.password, form.fullName);
        if (!data.session) setMessage('Check your email to confirm your account, then sign in.');
      }
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  return <div className="w-full max-w-md mx-auto bg-lgblue rounded-2xl p-6 lg:p-8">
    <div className="grid grid-cols-2 bg-white rounded-xl p-1 mb-6"><button type="button" onClick={() => setMode('signin')} className={`rounded-lg py-2 font-bold ${mode === 'signin' ? 'bg-vdblue text-white' : ''}`}>Sign in</button><button type="button" onClick={() => setMode('signup')} className={`rounded-lg py-2 font-bold ${mode === 'signup' ? 'bg-vdblue text-white' : ''}`}>Create account</button></div>
    <form onSubmit={submit} className="space-y-4">
      {mode === 'signup' && <label className="block"><span className="font-bold text-sm block mb-2">Full name</span><input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="w-full border border-gblue rounded-xl px-4 py-3" /></label>}
      <label className="block"><span className="font-bold text-sm block mb-2">Email</span><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-gblue rounded-xl px-4 py-3" /></label>
      <label className="block"><span className="font-bold text-sm block mb-2">Password</span><input required minLength="8" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border border-gblue rounded-xl px-4 py-3" /></label>
      <button disabled={busy} className="w-full bg-orange rounded-xl py-4 font-bold disabled:opacity-60">{busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}</button>
      {error && <p className="text-red-600 text-sm">{error}</p>}{message && <p className="text-green-700 text-sm">{message}</p>}
    </form>
  </div>;
}
