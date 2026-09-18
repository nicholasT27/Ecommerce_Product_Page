import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
export default function WishlistPage() { const { wishlist } = useStore(); return <main><PageTitle eyebrow="Saved for later" title="Wishlist" /><div className="max-w-[1110px] mx-auto px-6 py-10">{wishlist.length ? <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-7">{wishlist.map((p) => <ProductCard key={p.id} product={p} />)}</div> : <div className="bg-lgblue rounded-2xl p-12 text-center"><p className="text-dgblue">Save a product and it will appear here.</p><Link to="/" className="inline-block bg-orange rounded-xl px-6 py-3 font-bold mt-5">Explore products</Link></div>}</div></main>; }
