import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import ProductDetails from "./ProductDetails";
import paintsSpecialty from "../ProductsList/paintsSpecialty.json";

export default function SpecialtyProducts() {
  const { id } = useParams();
  const product = paintsSpecialty.find((p) => p.id === id);

  if (!product) return null;

  return (
    <>
      <NavBar />
      <ProductDetails
        product={product}
        backLink="/specialty"
        contextLabel="Supporting & Specialty Series"
        heroCaption="Supporting layers. Professional results."
        leadText={product.leadtext}
        whyTitle="Why this product exists"
        whyText="High-quality finishes depend on what lies beneath. These formulations ensure system compatibility, protection, and surface readiness."
        benefits={[
          "Enhances surface performance",
          "Improves topcoat adhesion",
          "Protects underlying substrates",
          "Compatible with multiple systems",
        ]}
        features={product.features}
        detailNote="Ideal for primers, sealers, protective layers, and specialty coatings."
        warranty={product.warranty}
        nscertified={product.nsnscertified}
      /></>
  );
}
