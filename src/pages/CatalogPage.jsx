import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import ProductCard from '../components/ProductCard';
import PageTitle from '../components/PageTitle';

export default function CatalogPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [inStock, setInStock] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (sort !== 'featured') params.set('sort', sort);
    if (inStock) params.set('inStock', 'true');
    const timer = setTimeout(() => { setLoading(true); api(`/products?${params}`).then(setProducts).finally(() => setLoading(false)); }, 180);
    return () => clearTimeout(timer);
  }, [category, search, sort, inStock]);
  const title = category ? `${category[0].toUpperCase()}${category.slice(1)} sneakers` : 'Find your next favorite pair';
  return <main>
    <PageTitle eyebrow={category ? 'Shop collection' : 'Sneaker Company'} title={title}>Everyday sneakers, limited drops, and reliable classics—all in one demo storefront.</PageTitle>
    <section className="max-w-[1110px] mx-auto px-6 py-8 lg:py-12">
      <div className="bg-lgblue rounded-2xl p-4 flex flex-col md:flex-row gap-3 md:items-center mb-8">
        <label className="flex-1"><span className="sr-only">Search products</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search sneakers…" className="w-full bg-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange" /></label>
        <select aria-label="Sort products" value={sort} onChange={(e) => setSort(e.target.value)} className="bg-white rounded-xl px-4 py-3"><option value="featured">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select>
        <label className="flex items-center gap-2 px-2 font-bold text-sm"><input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="accent-orange w-4 h-4" /> In stock only</label>
      </div>
      {loading ? <p className="text-dgblue py-20 text-center">Loading the collection…</p> : products.length ? <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-7">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p className="text-dgblue py-20 text-center">No sneakers match those filters.</p>}
    </section>
    {!category && <section id="about" className="bg-vdblue text-white"><div className="max-w-[1110px] mx-auto px-6 py-14 lg:py-20 grid lg:grid-cols-2 gap-6"><h2 className="text-3xl font-bold">Built for the everyday.</h2><p className="text-gblue leading-relaxed">Sneakers is a fictional demo shop showcasing a complete browse-to-order experience. No real payment is collected.</p></div></section>}
  </main>;
}
