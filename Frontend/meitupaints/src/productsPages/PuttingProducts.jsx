import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import ProductDetails from "./ProductDetails";
import interiorPutting from "../ProductsList/interiorPutting.json";
import exteriorPutting from "../ProductsList/exteriorPutting.json";
import roadMarking from "../ProductsList/roadmarking.json";

const allProducts = [...interiorPutting, ...exteriorPutting, ...roadMarking];

export default function PuttingProducts() {
  const { id } = useParams();
  const product = allProducts.find((p) => p.id === id);

  if (!product) return null;

  return (
    <>
      <NavBar />
      <ProductDetails
        product={product}
        backLink="/putting"
        contextLabel="Putting Series"
        heroCaption="Crafted for performance. Designed for longevity."
        leadText={product.leadtext}
        whyTitle="Why this product exists"
        whyText="Designed for professionals and homeowners who demand reliability, surface integrity, and visual consistency."
        benefits={[
          "Uniform, streak-free finish",
          "Long-term color stability",
          "Low-odor eco-conscious formulation",
          "Adaptable across environments",
        ]}
        features={product.features}
        detailNote="For best results, follow recommended surface preparation guidelines."
        warranty={product.warranty}
        nscertified={product.nscertified}
      /></>
  );
}
