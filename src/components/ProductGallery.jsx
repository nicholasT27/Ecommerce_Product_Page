import { useState } from 'react';

import product1Thumbnail from "../assets/image-product-1-thumbnail.jpg";
import product2Thumbnail from "../assets/image-product-2-thumbnail.jpg";
import product3Thumbnail from "../assets/image-product-3-thumbnail.jpg";
import product4Thumbnail from "../assets/image-product-4-thumbnail.jpg";
import productimg1 from "../assets/image-product-1.jpg";
import productimg2 from "../assets/image-product-2.jpg";
import productimg3 from "../assets/image-product-3.jpg";
import productimg4 from "../assets/image-product-4.jpg";
import prevIcon from "../assets/icon-previous.svg";
import nextIcon from "../assets/icon-next.svg";

const images = [productimg1, productimg2, productimg3, productimg4]
const thumbs = [product1Thumbnail, product2Thumbnail, product3Thumbnail, product4Thumbnail];

function ProductGallery() {
    const [active, setActive] = useState(0);

    const prev = () => setActive((active - 1 + images.length) % images.length);

    const next = () => setActive((active + 1) % images.length);

    return (
        <div>
            {/* Main image + mobile arrows */}
            <div className="relative">
                <img
                    className="w-full rounded-2xl"
                    src={images[active]}
                    alt={`Product ${active + 1}`}
                />

            {/* Mobile-only arrows */}
            <button
                onClick={prev}
                aria-label="Previous image"
                className="lg:hidden absolute top-1/2 left-4 -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center hover:opacity-80">

                    <img src={prevIcon} alt="" className="w-2" />
            </button>

            <button
                onClick={next}
                aria-label="Next image"
                className="lg:hidden absolute top-1/2 right-4 -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center hover:opacity-80"
            >
              <img src={nextIcon} alt="" className="w-2" />
            </button>
            </div>
            
            {/* Thumbnails — hidden on mobile */}
            <div className="hidden lg:grid grid-cols-4 gap-7 mt-8">
                {thumbs.map((thumb, i) => {
                    const isActive = i === active;

                    return (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className={`rounded-xl overflow-hidden transition ${isActive ? 'ring-2 ring-orange' : ''}`}    
                        >
                            <img 
                                src={thumb}
                                alt={`Thumbnail ${i + 1}`}
                                className={`w-full transition ${
                                    isActive ? 'opacity-50' : 'hover:opacity-70'
                                }`}
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    )
}

export default ProductGallery;

