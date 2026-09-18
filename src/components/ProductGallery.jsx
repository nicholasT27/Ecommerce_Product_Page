import { useState } from 'react';

import { productImages, productThumbs } from '../lib/assets';
import prevIcon from "../assets/icon-previous.svg";
import nextIcon from "../assets/icon-next.svg";

function ProductGallery({ product }) {
    const [active, setActive] = useState(0);
    const images = productImages(product.imageSet);
    const thumbs = productThumbs(product.imageSet);

    const prev = () => setActive((active - 1 + images.length) % images.length);

    const next = () => setActive((active + 1) % images.length);

    return (
        <div>
            {/* Main image + mobile arrows */}
            <div className="relative">
                <img
                    className="w-full lg:rounded-2xl"
                    src={images[active]}
                    alt={`${product.name}, view ${active + 1}`}
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
