import { useEffect, useRef } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
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

function RouteAnnouncer() {
    const location = useLocation();
    const mainRef = useRef(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        // Don't steal focus on the very first page load — only on navigation
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Move focus to the main content landmark so screen reader/keyboard
        // users land somewhere sensible instead of staying on the old page
        mainRef.current?.focus();
    }, [location.pathname]);

    return mainRef;
}

function Shell() {
    const { notice, setNotice } = useStore();
    const location = useLocation();
    const mainRef = useRef(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        mainRef.current?.focus();
    }, [location.pathname]);

    return <div className="font-kumbh text-vdblue min-h-screen bg-white flex flex-col">
        <Header />

        {notice && (
            <div
                role="status"
                aria-live="polite"
                className="fixed z-50 bottom-5 left-1/2 -translate-x-1/2 bg-vdblue text-white pl-5 pr-3 py-3 rounded-xl shadow-xl text-sm flex items-center gap-3"
            >
                <span>{notice}</span>
                <button
                    onClick={() => setNotice('')}
                    aria-label="Dismiss notification"
                    className="opacity-80 hover:opacity-100 leading-none text-lg px-1"
                >
                    ×
                </button>
            </div>
        )}

        <main
            id="main-content"
            ref={mainRef}
            tabIndex={-1}
            className="flex-1 outline-none"
        >
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
        </main>

        <Footer />
    </div>;
}

export default function App() {
    return <BrowserRouter><AuthProvider><StoreProvider><Shell /></StoreProvider></AuthProvider></BrowserRouter>;
}