import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import ProductDetails from "./ProductDetails";
import paintsUtilities from "../ProductsList/paintsUtilities.json";

export default function UtilitiesProducts() {
  const { id } = useParams();
  const product = paintsUtilities.find((p) => p.id === id);

  if (!product) return null;

  return (
    <>
      <NavBar />
      <ProductDetails
        product={product}
        backLink="/utilities"
        contextLabel="Supporting & Specialty Series"
        heroCaption="Supporting layers. Professional results."
        leadText="These products form the invisible foundation of professional paint systems, ensuring adhesion, durability, and long-term surface integrity."
        whyTitle="Why this product exists"
        whyText="High-quality finishes depend on what lies beneath. These formulations ensure system compatibility, protection, and surface readiness."
        benefits={[
          "Enhances surface performance",
          "Improves topcoat adhesion",
          "Protects underlying substrates",
          "Compatible with multiple systems",
        ]}
        features={[
          "Professional-grade formulation",
          "Reliable application behavior",
          "Residential & commercial use",
          "Surface-prep optimized",
        ]}
        detailNote="Ideal for primers, sealers, protective layers, and specialty coatings."
      /></>
  );
}
