import { useState } from 'react';
import QuantitySelector from './QuantitySelector';
import { useStore } from '../context/StoreContext';
import { money } from '../lib/assets';

export default function ProductDetails({ product }) {
  const [qty, setQty] = useState(product.stock ? 1 : 0);
  const [error, setError] = useState('');
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const saved = wishlist.some((item) => item.id === product.id);
  const discount = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : null;
  const add = async () => { try { setError(''); await addToCart(product.id, qty); } catch (e) { setError(e.message); } };
  return <div className="flex flex-col justify-center">
    <p className="text-orange text-sm font-bold tracking-widest uppercase">{product.brand}</p>
    <h1 className="text-3xl lg:text-5xl font-bold mt-4 leading-tight">{product.name}</h1>
    <p className="text-dgblue mt-6 lg:mt-8 leading-relaxed">{product.description}</p>
    <div className="mt-6"><div className="flex items-center gap-4"><span className="text-3xl font-bold">{money(product.price)}</span>{discount && <span className="bg-pale-orange text-orange px-2 py-0.5 rounded font-bold">{discount}%</span>}</div>{product.compareAtPrice && <p className="line-through text-gblue font-bold mt-2">{money(product.compareAtPrice)}</p>}<p className={`text-sm font-bold mt-3 ${product.stock ? 'text-green-700' : 'text-red-600'}`}>{product.stock ? `${product.stock} in stock` : 'Currently sold out'}</p></div>
    <div className="flex flex-col sm:flex-row gap-4 mt-8"><div className="sm:w-2/5"><QuantitySelector value={qty} onChange={setQty} max={product.stock}/></div><button onClick={add} disabled={!product.stock} className="flex-1 bg-orange text-vdblue rounded-xl py-4 font-bold hover:bg-orange/70 transition disabled:bg-gblue disabled:cursor-not-allowed">Add to cart</button></div>
    <button onClick={() => toggleWishlist(product)} className="mt-4 border border-gblue/60 rounded-xl py-3 font-bold hover:border-orange hover:text-orange">{saved ? '♥ Saved to wishlist' : '♡ Add to wishlist'}</button>
    {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}
  </div>;
}
