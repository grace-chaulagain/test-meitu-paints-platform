import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import ProductDetails from "./ProductDetails";
import interiorPaints from "../ProductsList/interiorPaints.json";
import exteriorPaints from "../ProductsList/exteriorPaints.json";
import distemperPaints from "../ProductsList/distemperPaints.json";

const allProducts = [...interiorPaints, ...exteriorPaints, ...distemperPaints];

export default function RegularProducts() {
  const { id } = useParams();
  const product = allProducts.find((p) => p.id === id);

  if (!product) return null;

  return (
    <>
      <NavBar />
      <ProductDetails
        product={product}
        backLink="/regular"
        contextLabel="Regular Paint Series"
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
