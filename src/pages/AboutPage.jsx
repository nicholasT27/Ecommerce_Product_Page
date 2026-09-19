import { Link } from 'react-router-dom';
import heroImage from '../assets/image-product-2.jpg';
import detailImage from '../assets/image-product-3.jpg';

const values = [
  { number: '01', title: 'Comfort first', text: 'Every pair is selected with everyday movement in mind—from morning commutes to long weekends.' },
  { number: '02', title: 'Fewer, better choices', text: 'We keep the collection focused, making it easier to find versatile styles that earn their place.' },
  { number: '03', title: 'Built to be worn', text: 'Durable materials and timeless silhouettes mean your favorites stay in rotation for longer.' },
];

export default function AboutPage() {
  return <main>
    {/* Company introduction and primary shopping paths */}
    <section className="max-w-[1110px] mx-auto px-6 py-10 lg:py-20 grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
      <div>
        <p className="text-orange text-sm font-bold tracking-widest uppercase">Our story</p>
        <h1 className="text-4xl lg:text-6xl font-bold leading-tight mt-4">Good sneakers take you somewhere.</h1>
        <p className="text-dgblue leading-relaxed mt-6 max-w-xl">Founded in Portland in 2021, Sneakers Supply Co. began with a simple idea: finding an everyday pair should feel exciting, not overwhelming. We bring together comfortable classics and expressive limited editions designed for life in motion.</p>
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link to="/collections/collections" className="bg-orange text-vdblue rounded-xl px-7 py-4 text-center font-bold hover:bg-orange/70 transition">Explore the collection</Link>
          <Link to="/collections/men" className="border border-gblue rounded-xl px-7 py-4 text-center font-bold hover:border-orange hover:text-orange transition">Shop everyday styles</Link>
        </div>
      </div>
      <div className="relative">
        <div className="absolute -inset-3 bg-pale-orange rounded-[2rem] rotate-3" />
        <img src={heroImage} alt="Sneakers styled on warm-toned rocks" className="relative w-full aspect-square object-cover rounded-[2rem]" />
        <div className="absolute -bottom-5 -left-3 lg:-left-8 bg-white shadow-xl rounded-2xl p-5">
          <p className="text-3xl font-bold">2021</p><p className="text-dgblue text-sm">founded in Portland</p>
        </div>
      </div>
    </section>

    {/* Brand principles */}
    <section className="bg-vdblue text-white mt-8 lg:mt-12">
      <div className="max-w-[1110px] mx-auto px-6 py-14 lg:py-20">
        <p className="text-orange text-sm font-bold tracking-widest uppercase">What guides us</p>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-14 mt-9">{values.map((value) => <article key={value.number} className="border-t border-white/20 pt-6"><span className="text-orange font-bold">{value.number}</span><h2 className="text-2xl font-bold mt-4">{value.title}</h2><p className="text-gblue leading-relaxed mt-3">{value.text}</p></article>)}</div>
      </div>
    </section>

    {/* Founder story and company snapshot */}
    <section className="max-w-[1110px] mx-auto px-6 py-14 lg:py-24 grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
      <img src={detailImage} alt="Minimal sneaker balanced on stones" className="w-full aspect-[4/3] object-cover rounded-2xl" />
      <div><p className="text-orange text-sm font-bold tracking-widest uppercase">Who we are</p><h2 className="text-3xl lg:text-4xl font-bold mt-3">A small team with a big love for everyday footwear.</h2><p className="text-dgblue leading-relaxed mt-5">Co-founders Maya Chen and Daniel Brooks met while working in independent retail. Together they built Sneakers Supply Co. around thoughtful curation, friendly service, and the belief that the best shoes are the ones you actually wear.</p><dl className="grid grid-cols-2 gap-5 mt-8"><div className="bg-lgblue rounded-xl p-5"><dt className="text-dgblue text-sm">Headquarters</dt><dd className="font-bold mt-1">Portland, Oregon</dd></div><div className="bg-lgblue rounded-xl p-5"><dt className="text-dgblue text-sm">Team</dt><dd className="font-bold mt-1">12 sneaker people</dd></div></dl></div>
    </section>

    {/* Fictional contact and registration details used by this demo */}
    <section className="max-w-[1110px] mx-auto px-6 pb-14 lg:pb-24">
      <div className="bg-lgblue rounded-2xl p-6 lg:p-10 grid md:grid-cols-3 gap-8">
        <div><p className="text-orange text-xs font-bold tracking-widest uppercase">Visit our studio</p><address className="not-italic font-bold mt-3 leading-relaxed">1842 Alder Street<br />Portland, OR 97205<br />United States</address></div>
        <div><p className="text-orange text-xs font-bold tracking-widest uppercase">Talk to us</p><p className="font-bold mt-3 leading-relaxed">hello@sneakers-supply.example<br />+1 (503) 555-0148<br />Mon–Fri, 9am–5pm PT</p></div>
        <div><p className="text-orange text-xs font-bold tracking-widest uppercase">Company</p><p className="font-bold mt-3 leading-relaxed">Sneakers Supply Co., LLC<br />Oregon registry: 2021-SS-1842<br />Privately owned</p></div>
      </div>
      <p className="text-xs text-dgblue mt-4">Sneakers Supply Co. and all company details on this page are fictional and created for this ecommerce demonstration.</p>
    </section>

    <section className="bg-pale-orange"><div className="max-w-[1110px] mx-auto px-6 py-14 lg:py-18 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"><div><p className="text-orange text-sm font-bold tracking-widest uppercase">Find your pair</p><h2 className="text-3xl lg:text-4xl font-bold mt-2">Ready for the next step?</h2></div><Link to="/" className="bg-vdblue text-white rounded-xl px-8 py-4 font-bold hover:bg-vdblue/85 transition">Shop all sneakers</Link></div></section>
  </main>;
}
