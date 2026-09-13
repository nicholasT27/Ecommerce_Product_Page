import QuantitySelector from "./QuantitySelector";

function ProductDetails() {

    return (
        <div>
            <p>SNEAKER COMPANY</p>

            <h1>Fall Limited Edition Sneakers</h1>

            <p>
                These low-profile sneakers are your perfect casual wear companion.
                Featuring a durable rubber outer sole, they'll withstand everything
                the weather can offer.
            </p>

            <p>$125.00</p>
            <span>50%</span>
            <p>$250.00</p>
            <QuantitySelector />
        </div>
        
    )
}

export default ProductDetails;
 
