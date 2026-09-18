import image1 from '../assets/image-product-1.jpg';
import image2 from '../assets/image-product-2.jpg';
import image3 from '../assets/image-product-3.jpg';
import image4 from '../assets/image-product-4.jpg';
import thumb1 from '../assets/image-product-1-thumbnail.jpg';
import thumb2 from '../assets/image-product-2-thumbnail.jpg';
import thumb3 from '../assets/image-product-3-thumbnail.jpg';
import thumb4 from '../assets/image-product-4-thumbnail.jpg';

const images = [image1, image2, image3, image4];
const thumbs = [thumb1, thumb2, thumb3, thumb4];
export const productImages = (set = 1) => images.map((_, i) => images[(i + set - 1) % images.length]);
export const productThumbs = (set = 1) => thumbs.map((_, i) => thumbs[(i + set - 1) % thumbs.length]);
export const productCover = (product) => productImages(product?.imageSet)[0];
export const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
