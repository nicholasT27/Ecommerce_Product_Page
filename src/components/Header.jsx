import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.svg';
import cartIcon from '../assets/icon-cart.svg';
import avatar from '../assets/image-avatar.png';
import menuIcon from '../assets/icon-menu.svg';
import closeIcon from '../assets/icon-close.svg';
import CartDrawer from './CartDrawer';
import { useStore } from '../context/StoreContext';

const navLinks = [['Collections', '/collections/collections'], ['Men', '/collections/men'], ['Women', '/collections/women'], ['Wishlist', '/wishlist'], ['About', '/#about']];
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, cartOpen, setCartOpen } = useStore();
  return <header className="relative z-30 bg-white">
    <div className="max-w-[1110px] mx-auto flex items-center border-b border-gblue/40 px-6 min-h-17 lg:min-h-0">
      <div className="flex items-center gap-4 lg:gap-14">
        <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="lg:hidden"><img src={menuIcon} alt="" className="w-4" /></button>
        <Link to="/" aria-label="Sneakers home"><img src={logo} alt="Sneakers" /></Link>
        <nav className="hidden lg:flex gap-8">{navLinks.map(([label, to]) => <NavLink key={label} to={to} className="text-dgblue py-10 border-b-4 border-transparent hover:text-vdblue hover:border-orange transition-colors">{label}</NavLink>)}</nav>
      </div>
      <div className="ml-auto flex items-center gap-6 lg:gap-11">
        <button onClick={() => setCartOpen(!cartOpen)} aria-label={`Cart with ${cartCount} items`} className="relative text-dgblue hover:text-vdblue transition-colors">
          <img src={cartIcon} alt="" className="w-6" />
          {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-orange text-white text-[10px] font-bold rounded-full min-w-5 h-4 px-1 flex items-center justify-center">{cartCount}</span>}
        </button>
        <Link to="/account"><img src={avatar} alt="Demo account" className="w-6 h-6 lg:w-12 lg:h-12 rounded-full hover:ring-2 hover:ring-orange transition" /></Link>
      </div>
    </div>
    {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    {menuOpen && <div className="fixed inset-0 z-40 bg-black75 lg:hidden" onClick={() => setMenuOpen(false)}>
      <div className="bg-white w-[70%] max-w-80 h-full p-6 flex flex-col" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="self-start mb-10"><img src={closeIcon} alt="" className="w-4" /></button>
        <nav className="flex flex-col gap-6">{navLinks.map(([label, to]) => <Link onClick={() => setMenuOpen(false)} key={label} to={to} className="text-vdblue font-bold text-lg hover:text-orange transition-colors">{label}</Link>)}</nav>
      </div>
    </div>}
  </header>;
}
