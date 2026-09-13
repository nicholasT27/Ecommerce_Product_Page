import Header from "./components/Header";
import ProductDetails from "./components/ProductDetails";
import ProductGallery from "./components/ProductGallery";

function App() {

  return (
    <div>
        <Header />
        <div className="flex max-w-6xl mx-auto gap-16">
          <ProductGallery />
          <ProductDetails />
        </div>
    </div>
  )
}

export default App