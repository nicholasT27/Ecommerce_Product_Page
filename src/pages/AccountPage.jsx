import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import { api } from '../lib/api';
import { money } from '../lib/assets';
export default function AccountPage() {
  const [account, setAccount] = useState(null); useEffect(() => { api('/account').then(setAccount); }, []);
  if (!account) return <p className="text-center py-24">Loading account…</p>;
  return <main><PageTitle eyebrow="Demo account" title={`Hello, ${account.name}`} >Signed in as {account.email}. Authentication is intentionally simulated for this prototype.</PageTitle><div className="max-w-[1110px] mx-auto px-6 py-10"><h2 className="text-2xl font-bold mb-5">Order history</h2>{account.orders.length ? <div className="overflow-x-auto border border-gblue/40 rounded-2xl"><table className="w-full text-left"><thead className="bg-lgblue"><tr><th className="p-4">Order</th><th className="p-4">Date</th><th className="p-4">Status</th><th className="p-4">Total</th></tr></thead><tbody>{account.orders.map((o) => <tr key={o.id} className="border-t border-gblue/30"><td className="p-4"><Link to={`/order/${o.order_number}`} className="text-orange font-bold">{o.order_number}</Link></td><td className="p-4">{new Date(`${o.created_at}Z`).toLocaleDateString()}</td><td className="p-4 capitalize">{o.status}</td><td className="p-4 font-bold">{money(o.total)}</td></tr>)}</tbody></table></div> : <div className="bg-lgblue rounded-2xl p-10"><p className="text-dgblue">No orders yet.</p><Link to="/" className="text-orange font-bold inline-block mt-3">Start shopping</Link></div>}</div></main>;
}
