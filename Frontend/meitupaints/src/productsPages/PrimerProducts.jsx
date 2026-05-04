import { useLayoutEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import ProductDetails from "./ProductDetails";
import primerPaints from "../ProductsList/primerPaints.json";

export default function PrimerProducts() {
  const { id } = useParams();
  const location = useLocation();
  const topRef = useRef(null);

  // Prevent the browser from restoring previous scroll position on SPA navigation
  useLayoutEffect(() => {
    try {
      window.history.scrollRestoration = "manual";
    } catch {
      // ignore
    }
  }, []);

  // Always jump to the top on route entry + reload (no animation)
  useLayoutEffect(() => {
    // Force instant (non-smooth) scroll for this jump, then restore.
    const prevScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";

    const jumpTop = () => {
      // Cover most browsers + iOS quirks
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      } catch {
        window.scrollTo(0, 0);
      }
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      topRef.current?.scrollIntoView?.({ block: "start" });
    };

    // Run immediately, then repeat after layout/paint (mobile Safari can restore scroll late)
    jumpTop();
    const raf1 = requestAnimationFrame(jumpTop);
    const raf2 = requestAnimationFrame(() => requestAnimationFrame(jumpTop));

    const t0 = window.setTimeout(jumpTop, 0);
    const t50 = window.setTimeout(jumpTop, 50);
    const t150 = window.setTimeout(jumpTop, 150);
    const t350 = window.setTimeout(jumpTop, 350);
    const t650 = window.setTimeout(jumpTop, 650);

    // Handle bfcache restores on iOS/Safari (pageshow fires after back/forward cache)
    const onPageShow = () => jumpTop();
    window.addEventListener("pageshow", onPageShow);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.clearTimeout(t0);
      window.clearTimeout(t50);
      window.clearTimeout(t150);
      window.clearTimeout(t350);
      window.clearTimeout(t650);
      window.removeEventListener("pageshow", onPageShow);
      document.documentElement.style.scrollBehavior = prevScrollBehavior;
    };
  }, [location.pathname]);

  const product = primerPaints.find((p) => p.id === id);

  if (!product) return null;

  return (
    <>
      <div ref={topRef} style={{ height: 0, overflow: "hidden" }} />
      <NavBar />
      <ProductDetails
        product={product}
        backLink="/primer"
        contextLabel="Primer & Base Coat Series"
        heroCaption="Engineered foundations for flawless finishes."
        leadText={product.leadtext}
        whyTitle="Why this product exists"
        whyText="Surface preparation defines longevity. This primer system was engineered to stabilize substrates and optimize topcoat bonding."
        benefits={[
          "Improves adhesion dramatically",
          "Seals porous surfaces",
          "Enhances topcoat uniformity",
          "Extends finish lifespan",
        ]}
        features={product.features}
        detailNote="Recommended for new walls, repaints, high-absorption surfaces, and professional projects."
        warranty={product.warranty}
        nscertified={product.nscertified}
      /></>
  );
}
