import { Link } from 'react-router-dom';

const footerLinks = [
  ['Collections', '/collections/collections'],
  ['Men', '/collections/men'],
  ['Women', '/collections/women'],
  ['About', '/about'],
  ['Account', '/account'],
];

export default function Footer() {
  return <footer className="mt-auto bg-vdblue text-white">
    <div className="max-w-[1110px] mx-auto px-6 py-10 lg:py-12">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
        <div className="max-w-md">
          <Link to="/" className="text-2xl font-bold tracking-tight">sneakers</Link>
          <p className="text-gblue text-sm leading-relaxed mt-3">A fictional ecommerce experience for discovering everyday sneakers and limited collections. No real payment is collected.</p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3">
          {footerLinks.map(([label, to]) => <Link key={label} to={to} className="text-sm text-gblue hover:text-orange transition-colors">{label}</Link>)}
        </nav>
      </div>
      <div className="border-t border-white/15 mt-8 pt-6 flex flex-col sm:flex-row sm:justify-between gap-2 text-xs text-gblue">
        <p>© {new Date().getFullYear()} Sneakers demo store.</p>
        <p>Built for portfolio demonstration.</p>
      </div>
    </div>
  </footer>;
}
