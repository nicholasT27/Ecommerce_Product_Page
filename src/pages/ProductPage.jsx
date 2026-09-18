import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import ProductDetails from '../components/ProductDetails';
import ProductGallery from '../components/ProductGallery';
export default function ProductPage() {
  const { slug } = useParams(); const [product, setProduct] = useState(null); const [error, setError] = useState('');
  useEffect(() => { api(`/products/${slug}`).then(setProduct).catch((e) => setError(e.message)); }, [slug]);
  if (error) return <main className="max-w-[1110px] mx-auto px-6 py-20"><h1 className="text-3xl font-bold">Product not found</h1><Link to="/" className="text-orange font-bold mt-4 inline-block">Back to the shop</Link></main>;
  if (!product) return <p className="text-center py-24 text-dgblue">Loading product…</p>;
  return <main className="lg:max-w-[1110px] mx-auto grid grid-cols-1 lg:grid-cols-2 lg:gap-[125px] lg:px-6 lg:py-24"><ProductGallery product={product} /><div className="px-6 py-8 lg:p-0 flex"><ProductDetails product={product} /></div></main>;
}
