import { Link } from 'react-router-dom';
import deleteIcon from '../assets/icon-delete.svg';
import { useStore } from '../context/StoreContext';
import { money, productCover } from '../lib/assets';
export default function CartDrawer({ onClose }) {
  const { cart, subtotal, removeCart } = useStore();
  return <div className="absolute top-18 right-3 lg:top-23 lg:right-[max(24px,calc((100%-1110px)/2))] w-[calc(100%-24px)] max-w-90 bg-white rounded-xl shadow-2xl border border-gblue/20 z-40">
    <div className="p-6 border-b border-gblue/30 font-bold">Cart</div><div className="p-6">
      {!cart.length ? <p className="text-dgblue font-bold text-center py-12">Your cart is empty.</p> : <><div className="space-y-4">{cart.map((item) => <div key={item.id} className="flex gap-3 items-center"><img src={productCover(item)} alt="" className="w-12 h-12 object-cover rounded" /><div className="min-w-0 flex-1"><p className="truncate text-dgblue">{item.name}</p><p>{money(item.price)} × {item.quantity} <b>{money(item.price * item.quantity)}</b></p></div><button onClick={() => removeCart(item.id)} aria-label={`Remove ${item.name}`}><img src={deleteIcon} alt="" /></button></div>)}</div><p className="flex justify-between font-bold mt-5"><span>Subtotal</span><span>{money(subtotal)}</span></p><Link onClick={onClose} to="/checkout" className="block text-center bg-orange text-vdblue rounded-xl py-4 font-bold mt-5 hover:bg-orange/70">Checkout</Link></>}
    </div>
  </div>;
}
