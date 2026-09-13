import product1Thumbnail from "../assets/image-product-1-thumbnail.jpg";
import product2Thumbnail from "../assets/image-product-2-thumbnail.jpg";
import product3Thumbnail from "../assets/image-product-3-thumbnail.jpg";
import product4Thumbnail from "../assets/image-product-4-thumbnail.jpg";
import productimg1 from "../assets/image-product-1.jpg";
import productimg2 from "../assets/image-product-2.jpg";
import productimg3 from "../assets/image-product-3.jpg";
import productimg4 from "../assets/image-product-4.jpg";


function ProductGallery() {
    return (
        <div className="w-[50%] mt-20">
            <img
                className="w-full rounded-[15px]"
                src={productimg1}
                alt="Product image 1"
            />

            <div className="flex gap-[32px] mt-6">
                <img className="w-[80px] rounded-[10px]" src={product1Thumbnail} alt="Thumbnail 1" />
                <img className="w-[80px] rounded-[10px]" src={product2Thumbnail} alt="Thumbnail 2" />
                <img className="w-[80px] rounded-[10px]" src={product3Thumbnail} alt="Thumbnail 3" />
                <img className="w-[80px] rounded-[10px]" src={product4Thumbnail} alt="Thumbnail 4" />
            </div>
        </div>
    )
}

export default ProductGallery;

