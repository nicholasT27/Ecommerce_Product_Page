import { useEffect, useState } from 'react';

import { productImages, productThumbs } from '../lib/assets';
import prevIcon from "../assets/icon-previous.svg";
import nextIcon from "../assets/icon-next.svg";

const AUTO_ADVANCE_MS = 4500;

function ProductGallery({ product }) {
    const [active, setActive] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const images = productImages(product.imageSet);
    const thumbs = productThumbs(product.imageSet);

    // Move through every thumbnail automatically, restarting the timer after
    // someone selects an image manually. Hovering or focusing pauses movement.
    useEffect(() => {
        if (isPaused || images.length < 2) return undefined;
        const timer = window.setTimeout(() => {
            setActive((current) => (current + 1) % images.length);
        }, AUTO_ADVANCE_MS);
        return () => window.clearTimeout(timer);
    }, [active, images.length, isPaused]);

    const prev = () => setActive((current) => (current - 1 + images.length) % images.length);

    const next = () => setActive((current) => (current + 1) % images.length);

    return (
        <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={() => setIsPaused(false)}
        >
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
                            aria-label={`Show image ${i + 1} of ${thumbs.length}`}
                            aria-current={isActive ? 'true' : undefined}
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
