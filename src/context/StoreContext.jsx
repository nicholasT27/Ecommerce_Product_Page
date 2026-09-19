import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

const StoreContext = createContext(null);
export function StoreProvider({ children }) {
  const { configured, user, loading } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const refresh = useCallback(async () => {
    if (configured && !user) { setCart([]); setWishlist([]); return; }
    const [cartData, wishlistData] = await Promise.all([api('/cart'), api('/wishlist')]);
    setCart(cartData); setWishlist(wishlistData);
  }, [configured, user]);
  useEffect(() => {
    if (loading) return;
    Promise.resolve().then(refresh).catch(() => setNotice('Could not connect to the store.'));
  }, [loading, refresh]);
  const addToCart = async (productId, quantity = 1) => {
    if (configured && !user) throw new Error('Please sign in before adding items to your cart.');
    setCart(await api('/cart', { method: 'POST', body: JSON.stringify({ productId, quantity }) }));
    setCartOpen(true); setNotice('Added to your cart.');
  };
  const updateCart = async (productId, quantity) => setCart(await api(`/cart/${productId}`, { method: 'PATCH', body: JSON.stringify({ quantity }) }));
  const removeCart = async (productId) => setCart(await api(`/cart/${productId}`, { method: 'DELETE' }));
  const toggleWishlist = async (product) => {
    if (configured && !user) { setNotice('Please sign in before saving products.'); return; }
    const saved = wishlist.some((item) => item.id === product.id);
    await api(`/wishlist/${product.id}`, { method: saved ? 'DELETE' : 'POST' });
    setWishlist(saved ? wishlist.filter((item) => item.id !== product.id) : [...wishlist, product]);
    setNotice(saved ? 'Removed from wishlist.' : 'Saved to wishlist.');
  };
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return <StoreContext.Provider value={{ cart, wishlist, cartOpen, setCartOpen, notice, setNotice, cartCount, subtotal, addToCart, updateCart, removeCart, toggleWishlist, refresh }}>{children}</StoreContext.Provider>;
}
export const useStore = () => useContext(StoreContext);
