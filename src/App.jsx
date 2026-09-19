import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import { StoreProvider, useStore } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import AccountPage from './pages/AccountPage';
import AboutPage from './pages/AboutPage';

function Shell() {
  const { notice, setNotice } = useStore();
  return <div className="font-kumbh text-vdblue min-h-screen bg-white">
    <Header />
    {notice && <button onClick={() => setNotice('')} className="fixed z-50 bottom-5 left-1/2 -translate-x-1/2 bg-vdblue text-white px-5 py-3 rounded-xl shadow-xl text-sm">{notice}</button>}
    <Routes>
      <Route path="/" element={<CatalogPage />} />
      <Route path="/collections/:category" element={<CatalogPage />} />
      <Route path="/product/:slug" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order/:orderNumber" element={<ConfirmationPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </div>;
}
export default function App() { return <BrowserRouter><AuthProvider><StoreProvider><Shell /></StoreProvider></AuthProvider></BrowserRouter>; }
