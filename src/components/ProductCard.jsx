import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { money, productCover } from '../lib/assets';
export default function ProductCard({ product }) {
  const { wishlist, toggleWishlist } = useStore();
  const saved = wishlist.some((item) => item.id === product.id);
  return <article className="group"><div className="relative rounded-2xl overflow-hidden bg-lgblue aspect-square"><Link to={`/product/${product.slug}`}><img src={productCover(product)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" /></Link><button onClick={() => toggleWishlist(product)} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'} className={`absolute top-3 right-3 w-10 h-10 rounded-full shadow flex items-center justify-center text-xl ${saved ? 'bg-orange text-white' : 'bg-white'}`}>{saved ? '♥' : '♡'}</button>{!product.stock && <span className="absolute bottom-3 left-3 bg-vdblue text-white rounded-full px-3 py-1 text-xs font-bold">Sold out</span>}</div><p className="text-orange text-xs font-bold tracking-widest uppercase mt-4">{product.brand}</p><Link to={`/product/${product.slug}`}><h2 className="font-bold text-lg mt-1 hover:text-orange">{product.name}</h2></Link><div className="flex gap-2 mt-1"><span className="font-bold">{money(product.price)}</span>{product.compareAtPrice && <span className="text-gblue line-through">{money(product.compareAtPrice)}</span>}</div></article>;
}
