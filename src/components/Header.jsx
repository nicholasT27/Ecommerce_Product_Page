import logo from "../assets/logo.svg";
import cartIcon from "../assets/icon-cart.svg";
import avatar from "../assets/image-avatar.png";

function Header() {

    return (
        <header className="flex items-center justify-between px-6 max-w-6xl mx-auto border-b border-[#E4E9F2] h-[83px] mt-8 pb-10">
            <div className="flex items-center gap-[56px]">

                <img className="w-[137.5px] h-auto" src={logo} alt="logo" />
                
                <div className="flex items-center gap-[32px] font-kumbh text-[15px] font-normal leading-[26px] tracking-[0px] text-[#69707D]">
                    <a href="#">Collections</a>
                    <a href="#">Men</a>
                    <a href="#">Women</a>
                    <a href="#">About</a>
                    <a href="#">Contact</a>
                </div>
    
            </div>
            <div className="flex items-center gap-[48px]">
                <img src={cartIcon} alt="cart image" />
                <img className="w-[50px] h-[50px]" src={avatar} alt="avatar image" />
            </div>
        </header>
    )
}

export default Header;