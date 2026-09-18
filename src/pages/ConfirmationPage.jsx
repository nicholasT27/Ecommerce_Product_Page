import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { money } from '../lib/assets';
export default function ConfirmationPage() {
  const { orderNumber } = useParams(); const [order, setOrder] = useState(null);
  useEffect(() => { api(`/orders/${orderNumber}`).then(setOrder); }, [orderNumber]);
  if (!order) return <p className="text-center py-24">Loading order…</p>;
  return <main className="max-w-2xl mx-auto px-6 py-16 lg:py-24 text-center"><div className="w-16 h-16 mx-auto rounded-full bg-orange flex items-center justify-center text-3xl">✓</div><p className="text-orange uppercase tracking-widest font-bold text-sm mt-6">Order confirmed</p><h1 className="text-4xl font-bold mt-2">Thanks, {order.customer_name}!</h1><p className="text-dgblue mt-4">Your demo order <b>{order.order_number}</b> has been created. No payment was taken.</p><div className="bg-lgblue rounded-2xl p-6 mt-8 text-left">{order.items.map((item) => <p key={item.id} className="flex justify-between gap-4 py-2"><span>{item.product_name} × {item.quantity}</span><b>{money(item.unit_price_cents / 100 * item.quantity)}</b></p>)}<p className="flex justify-between border-t border-gblue/40 mt-3 pt-4 text-xl font-bold"><span>Total</span><span>{money(order.total)}</span></p></div><div className="flex flex-col sm:flex-row gap-3 justify-center mt-8"><Link to="/" className="bg-orange rounded-xl px-6 py-3 font-bold">Keep shopping</Link><Link to="/account" className="border border-gblue rounded-xl px-6 py-3 font-bold">View account</Link></div></main>;
}
