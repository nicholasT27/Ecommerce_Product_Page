import logo from "../assets/logo.svg";
import cartIcon from "../assets/icon-cart.svg";
import avatar from "../assets/image-avatar.png";

const navLinks = ['Collections', 'Men', 'Women', 'About', 'Contact'];

function Header() {

    return (
        <header>
            <div className="max-w-[1110px] mx-auto flex items-center border-b border-gblue/40 px-6">

                {/* Left: logo + nav */}
                <div className="flex items-center gap-14">
                    <img src={logo} alt="Sneakers" />
                    <nav className="flex gap-8">
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
                <div className="ml-auto flex items-center gap-11">
                    <button
                        aria-label="Cart"
                        className="text-dgblue hover:text-vdblue transition-colors"
                    >
                        <img src={cartIcon} alt="" className="w-6" />
                    </button>
                    <img 
                        src={avatar}
                        alt="Profile"
                        className="w-12 h-12 rounded-full cursor-pointer hover:ring-2 hover:ring-orange transition"
                    />
                </div>
            </div>
        </header>
    )
}

export default Header;