import { useState } from "react";
import QuantitySelector from "./QuantitySelector";

function ProductDetails() {

    const [qty, setQty] = useState(0);
    
    return (
        <div className="flex flex-col justify-center">
            <p className="text-orange text-sm font-bold tracking-widest uppercase">SNEAKER COMPANY</p>

            <h1 className="text-5xl font-bold mt-4 leading-tight">Fall Limited Edition Sneakers</h1>

            <p className="text-dgblue mt-8 leading-relaxed">
                These low-profile sneakers are your perfect casual wear companion.
                Featuring a durable rubber outer sole, they'll withstand everything
                the weather can offer.
            </p>

            <div className="mt-6">
                <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold">$125.00</span>
                    <span className="bg-pale-orange text-orange px-2 py-0.5 rounded font-bold">50%</span>
                </div>
                <p className="line-through text-gblue font-bold mt-2">$250.00</p>
            </div>

            <div className="flex gap-4 mt-8">
                <div className="w-2/5">
                    <QuantitySelector value={qty} onChange={setQty}/>
                </div>
                <button className="flex-1 bg-orange text-white rounded-xl py-4 font-bold hover:bg-orange/70 transition">Add to cart</button>
            </div>
        </div>
        
    )
}

export default ProductDetails;
 
