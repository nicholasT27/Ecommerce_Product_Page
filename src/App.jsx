import Header from "./components/Header";
import ProductDetails from "./components/ProductDetails";
import ProductGallery from "./components/ProductGallery";

function App() {

  return (
    <div className="font-kumbh text-vdblue min-h-screen">
        <Header />
        <main className="lg:max-w-[1110px] mx-auto grid grid-cols-1 lg:grid-cols-2 lg:gap-[125px] lg:px-6 lg:py-24">
          <ProductGallery />
          <div className="px-6 py-6 lg:p-0">
             <ProductDetails />
          </div>
        </main>
    </div>
  )
}

export default App