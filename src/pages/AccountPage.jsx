import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import PageTitle from '../components/PageTitle';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { money } from '../lib/assets';

const blankProfile = { fullName: '', phone: '', address: '', city: '', postalCode: '' };

export default function AccountPage() {
  const { configured, user, loading, refreshProfile, signOut } = useAuth();
  const [account, setAccount] = useState(null);
  const [profile, setProfile] = useState(blankProfile);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (loading || (configured && !user)) return;

    setError(null);

    api('/account')
      .then((data) => {
        setAccount(data);
        setProfile({
          fullName: data.name || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          postalCode: data.postalCode || '',
        });
      })
      .catch((err) => {
        setError(err.message || 'Failed to load your account.');
      });
  }, [configured, loading, user, retryCount]);

  if (loading) return <p className="text-center py-24">Loading account…</p>;

  if (configured && !user) {
    return (
      <div className="flex-1">
        <PageTitle centered eyebrow="Your account" title="Sign in to Sneakers">
          Create an account to keep your cart, wishlist, details, and orders securely connected.
        </PageTitle>
        <div className="max-w-md mx-auto px-6 py-12">
          <AuthForm />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <p role="alert" className="text-dgblue font-bold mb-2">
          Couldn't load your account
        </p>
        <p className="text-sm text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => setRetryCount((c) => c + 1)}
          className="bg-orange rounded-xl px-6 py-3 font-bold"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!account) return <p className="text-center py-24">Loading account…</p>;

  const saveProfile = async (event) => {
    event.preventDefault();
    try {
      const updated = await api('/account', { method: 'PATCH', body: JSON.stringify(profile) });
      setAccount((current) => ({ ...current, ...updated }));
      await refreshProfile();
      setMessage('Details saved.');
    } catch (err) {
      setMessage('');
      setError(err.message || 'Failed to save your details.');
    }
  };

  return (
    <div>
      <PageTitle eyebrow={configured ? 'Your account' : 'Demo account'} title={`Hello, ${account.name || 'Sneaker fan'}`}>
        {configured ? `Signed in as ${account.email}.` : `Signed in as ${account.email}. Authentication uses the local demo while Supabase is not configured.`}
      </PageTitle>
      <div className="max-w-[1110px] mx-auto px-6 py-10 grid lg:grid-cols-[1fr_1.2fr] gap-10">
        <section>
          <div className="flex items-center justify-between gap-4 mb-5">
            <h2 className="text-2xl font-bold">Your details</h2>
            {configured && <button onClick={signOut} className="text-dgblue underline text-sm">Sign out</button>}
          </div>
          <form onSubmit={saveProfile} className="bg-lgblue rounded-2xl p-6 space-y-4">
            {[['fullName', 'Full name'], ['phone', 'Phone'], ['address', 'Address'], ['city', 'City'], ['postalCode', 'Postal code']].map(([name, label]) => (
              <label key={name} className="block">
                <span className="font-bold text-sm block mb-2">{label}</span>
                <input
                  value={profile[name]}
                  onChange={(e) => setProfile({ ...profile, [name]: e.target.value })}
                  className="w-full bg-white border border-gblue rounded-xl px-4 py-3"
                />
              </label>
            ))}
            <button className="bg-orange rounded-xl px-6 py-3 font-bold">Save details</button>
            {message && (
              <p role="status" aria-live="polite" className="text-green-700 text-sm">
                {message}
              </p>
            )}
          </form>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-5">Order history</h2>
          {account.orders.length ? (
            <div className="overflow-x-auto border border-gblue/40 rounded-2xl">
              <table className="w-full text-left">
                <thead className="bg-lgblue">
                  <tr>
                    <th className="p-4">Order</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {account.orders.map((order) => (
                    <tr key={order.id} className="border-t border-gblue/30">
                      <td className="p-4">
                        <Link to={`/order/${order.order_number}`} className="text-orange font-bold">{order.order_number}</Link>
                      </td>
                      <td className="p-4">{new Date(order.created_at.endsWith?.('Z') ? order.created_at : `${order.created_at}Z`).toLocaleDateString()}</td>
                      <td className="p-4 capitalize">{order.status}</td>
                      <td className="p-4 font-bold">{money(order.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-lgblue rounded-2xl p-10">
              <p className="text-dgblue">No orders yet.</p>
              <Link to="/" className="text-orange font-bold inline-block mt-3">Start shopping</Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}