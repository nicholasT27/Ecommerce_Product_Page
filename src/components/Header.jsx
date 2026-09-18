import { useState } from "react";
import logo from "../assets/logo.svg";
import cartIcon from "../assets/icon-cart.svg";
import avatar from "../assets/image-avatar.png";
import menuIcon from "../assets/icon-menu.svg";
import closeIcon from "../assets/icon-close.svg";

const navLinks = ['Collections', 'Men', 'Women', 'About', 'Contact'];

function Header() {

    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header>
            <div className="max-w-[1110px] mx-auto flex items-center border-b border-gblue/40 px-6">

                {/* Left: hamburger (mobile) + logo + nav */}
                <div className="flex items-center gap-4 lg:gap-14">

                    {/* Hamburger button - mobile only */}
                    <button 
                        onClick={() => setMenuOpen(true)}
                        aria-label="Open menu"
                        className="lg:hidden"
                    >
                        <img src={menuIcon} alt="" className="w-4" />
                    </button>

                    <img src={logo} alt="Sneakers" />
                    
                    {/* Desktop nav - hidden on mobile */}
                    <nav className="hidden lg:flex gap-8">
                        {navLinks.map((link) => (
                            <a key={link}
                               href="#"
                               className="text-dgblue py-10 border-b-4 border-transparent hover:text-vdblue hover:border-orange transition-colors"
                            >
                                {link}
                            </a>
                        ))}
                    </nav>
                </div>
    
                {/* Right: cart + avatar */}
                <div className="ml-auto flex items-center gap-6 lg:gap-11">
                    <button
                        aria-label="Cart"
                        className="text-dgblue hover:text-vdblue transition-colors"
                    >
                        <img src={cartIcon} alt="" className="w-6" />
                    </button>
                    <img 
                        src={avatar}
                        alt="Profile"
                        className="w-6 h-6 lg:w-12 lg:h-12 rounded-full cursor-pointer hover:ring-2 hover:ring-orange transition"
                    />
                </div>
            </div>

            {/* Mobile menu overlay + drawer */}
            {menuOpen && (
                <div className="fixed inset-0 z-40 bg-black75 lg:hidden">

                    {/* Slide-in drawer */}
                    <div className="bg-white w-[70%] h-full p-6 flex flex-col">

                        {/* Close button */}
                        <button
                            onClick={() => setMenuOpen(false)}
                            aria-label="Close menu"
                            className="self-start mb-10">

                            <img src={closeIcon} alt="" className="w-4" />
                        </button>

                        {/* Nav links stacked */}
                        <nav className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <a 
                                    key={link}
                                    href="#"
                                    className="text-vdblue font-bold text-lg hover:text-orange transition-colors">
                                        {link}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Click backdrop to close */}
                    <div
                        onClick={() => setMenuOpen(false)}
                        className="absolute inset-0 -z-10">
                    </div>

                </div>
            )}
        </header>
    )
}

export default Header;