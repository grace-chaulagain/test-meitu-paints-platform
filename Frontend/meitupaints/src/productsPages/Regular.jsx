import { useMemo, useState } from "react";
import NavBar from "../components/NavBar";
import Carousel from "../components/Carousel";
import exteriorPaints from "../ProductsList/exteriorPaints.json";
import interiorPaints from "../ProductsList/interiorPaints.json";
import distemperPaints from "../ProductsList/distemperPaints.json";
import { Link, useNavigate } from "react-router-dom";

function Regular() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Exterior");
  const [query, setQuery] = useState("");

  const productsToDisplay = useMemo(() => {
    if (selectedCategory === "Exterior") return exteriorPaints;
    if (selectedCategory === "Interior") return interiorPaints;
    return distemperPaints;
  }, [selectedCategory]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return productsToDisplay;
    return productsToDisplay.filter((p) =>
      (p.name || "").toLowerCase().includes(q)
    );
  }, [productsToDisplay, query]);

  return (
    <>
      <NavBar />
      <div className="regular-hero">
        <div className="container py-5">
          {/* Header */}
          <div className="d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-3 mb-4">
            <div>
              <div className="kicker">Regular Series</div>
              <h1 className="title fw-bold mb-2">Interior & Exterior Paints</h1>
              <p className="text-muted mb-0">
                Choose a category, browse products, and open the details page.
              </p>
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-dark btn-lg px-4 rounded-pill"
                onClick={() => navigate(-1)}
              >
                ← Back
              </button>
              <Link
                to="/ratecalculator"
                className="btn btn-dark btn-lg px-4 rounded-pill"
              >
                Rate Calculator
              </Link>
            </div>
          </div>

          {/* Control Bar */}
          <div className="control-bar glass-card rounded-4 p-3 p-md-4 shadow-sm mb-4">
            <div className="row g-3 align-items-center">
              <div className="col-lg-6">
                {/* Segmented Category Control */}
                <div className="segmented" role="tablist" aria-label="Category">
                  <button
                    type="button"
                    className={`seg-btn ${
                      selectedCategory === "Exterior" ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory("Exterior")}
                  >
                    Exterior
                  </button>
                  <button
                    type="button"
                    className={`seg-btn ${
                      selectedCategory === "Interior" ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory("Interior")}
                  >
                    Interior
                  </button>
                  <button
                    type="button"
                    className={`seg-btn ${
                      selectedCategory === "Distemper" ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory("Distemper")}
                  >
                    Distemper
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="col-lg-6">
                <div className="search-wrap">
                  <span className="search-icon" aria-hidden="true">
                    ⌕
                  </span>
                  <input
                    className="form-control form-control-lg search-input"
                    placeholder="Search products… (e.g. glossy, primer)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <span className="small text-muted">
                Showing <span className="fw-semibold">{filtered.length}</span>{" "}
                products
              </span>
              <span className="small text-muted">
                Category:{" "}
                <span className="fw-semibold">{selectedCategory}</span>
              </span>
            </div>
          </div>

          {/* Product Grid */}
          <div className="row g-2">
            {filtered.map((product) => (
              <div key={product.id} className="col-12 col-sm-6">
                <Link
                  to={`/regular/${product.id}`}
                  className="text-decoration-none"
                >
                  <div className="product-tile">
                    {/* Abstract accent layer */}
                    <div className="tile-accent" aria-hidden="true" />

                    {/* Sale badge (optional) */}
                    {product.sale && <div className="sale-pill">SALE</div>}

                    <div className="tile-head">
                      <div className="tile-meta">
                        <span className="meta-chip">{selectedCategory}</span>
                      </div>
                      <div className="tile-arrow" aria-hidden="true">
                        →
                      </div>
                    </div>

                    <div className="tile-imageWrap">
                      <img
                        src={product.src}
                        alt={product.name}
                        className="tile-image"
                        loading="lazy"
                      />
                    </div>

                    <div className="tile-body">
                      <h6 className="tile-title">{product.name}</h6>
                      <div className="tile-cta">
                        <span className="cta-pill">View Product</span>
                        <span className="cta-text">
                          Details • Sizes • Stock
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="empty-state rounded-4 p-4 mt-4">
              <div className="fw-semibold mb-1">No products found</div>
              <div className="text-muted small">
                Try a different keyword or switch category.
              </div>
            </div>
          )}
        </div>
      </div>{/* Premium Styles (Red primary + black hints) */}
      <style>{`
        :root{
          --brand-red: #c1121f;
          --brand-red-hover: #a50f1a;
          --brand-red-soft: rgba(193, 18, 31, 0.16);
          --brand-red-glow: rgba(193, 18, 31, 0.28);
          --brand-black: #0b0b0c;
          --ink-70: rgba(11,11,12,0.70);
          --ink-55: rgba(11,11,12,0.55);
          --line: rgba(0,0,0,0.10);
        }

        .regular-hero{
          background:
            radial-gradient(900px 420px at 10% 10%, var(--brand-red-soft), transparent 60%),
            radial-gradient(800px 420px at 90% 20%, rgba(0,0,0,0.06), transparent 55%),
            radial-gradient(900px 520px at 30% 95%, rgba(0,0,0,0.04), transparent 60%),
            #fff;
          animation: fadeUp 420ms ease;
        }

        .kicker{
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: var(--ink-55);
          margin-bottom: 10px;
        }

        .title{
          letter-spacing: -0.6px;
          color: var(--brand-black);
        }

        .glass-card{
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0,0,0,0.06);
        }

        .btn-dark{
          background: var(--brand-black);
          border-color: var(--brand-black);
        }
        .btn-dark:hover{
          background: var(--brand-red);
          border-color: var(--brand-red);
        }

        .segmented{
          display: inline-flex;
          padding: 6px;
          border-radius: 999px;
          border: 1px solid var(--line);
          background: rgba(0,0,0,0.03);
          gap: 6px;
        }

        .seg-btn{
          border: 0;
          background: transparent;
          padding: 10px 14px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 14px;
          color: var(--ink-70);
          transition: background 160ms ease, color 160ms ease, transform 160ms ease, box-shadow 160ms ease;
        }

        .seg-btn:hover{
          transform: translateY(-1px);
        }

        .seg-btn.active{
  background: var(--brand-red);
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(193,18,31,0.22);
}

.seg-btn:hover:not(.active){
  background: rgba(193,18,31,0.06);
}



        .search-wrap{
          position: relative;
        }
        .search-icon{
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(0,0,0,0.40);
          font-weight: 900;
        }
        .search-input{
          border-radius: 16px;
          padding: 14px 16px 14px 42px;
          border: 1px solid var(--line);
          font-size: 15px;
        }
        .search-input:focus{
          border-color: rgba(193, 18, 31, 0.5);
          box-shadow: 0 0 0 0.22rem rgba(193, 18, 31, 0.10);
        }


        .product-tile{
  position: relative;
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.08);
  background: #ffffff;
  box-shadow: 0 10px 28px rgba(0,0,0,0.06);
  padding: 16px;
  min-height: 330px;
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
}

.product-tile:hover{
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.10);
  border-color: rgba(0,0,0,0.14);
}


        .sale-pill{
          position:absolute;
          top: 14px;
          left: 14px;
          padding: 7px 10px;
          border-radius: 999px;
          background: var(--brand-red);
          color:#fff;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.06em;
          z-index: 3;
          box-shadow: 0 12px 26px rgba(193,18,31,0.22);
        }

        .tile-head{
          position: relative;
          z-index: 2;
          display:flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 12px;
        }

        .tile-meta{
          display:flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .meta-chip{
          border-radius: 999px;
          padding: 7px 10px;
          font-size: 12px;
          font-weight: 800;
          border: 1px solid rgba(0,0,0,0.10);
          background: rgba(255,255,255,0.75);
          color: var(--ink-70);
        }

        .meta-chip.soft{
          background: rgba(0,0,0,0.03);
        }

        .tile-arrow{
          width: 42px;
          height: 42px;
          border-radius: 999px;
          display: grid;
          place-items:center;
          border: 1px solid rgba(0,0,0,0.10);
          background: rgba(0,0,0,0.03);
          color: rgba(0,0,0,0.60);
          font-size: 18px;
          font-weight: 900;
          transition: transform 200ms ease, background 200ms ease, color 200ms ease;
        }

        .product-tile:hover .tile-arrow{
          transform: translateX(2px);
          background: var(--brand-red);
          color: #fff;
        }

        .tile-imageWrap{
          position: relative;
          z-index: 2;
          width: 100%;
          border-radius: 18px;
          padding: 18px;
          border: 1px solid rgba(0,0,0,0.06);
          background: rgba(0,0,0,0.02);
          display:flex;
          align-items:center;
          justify-content:center;
          min-height: 190px;
        }

        .tile-image{
          max-height: 155px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 18px 26px rgba(0,0,0,0.12));
          transition: transform 220ms ease;
        }

        .product-tile:hover .tile-image{
          transform: scale(1.03);
        }

        .tile-body{
          position: relative;
          z-index: 2;
          margin-top: 14px;
          display:flex;
          flex-direction: column;
          gap: 10px;
        }

        .tile-title{
          color: #0b0b0c;
          font-weight: 650;
          letter-spacing: -0.25px;
          line-height: 1.3;
          margin: 0;
          font-size: 17px;
        }


        .tile-cta{
          display:flex;
          align-items:center;
          gap: 10px;
          color: rgba(0,0,0,0.55);
          font-size: 13px;
          font-weight: 700;
        }

        .cta-pill{
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(193,18,31,0.35);
  background: transparent;
  color: var(--brand-red);
  font-size: 13px;
  font-weight: 600;
  transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
}

.product-tile:hover .cta-pill{
  background: var(--brand-red);
  color: #ffffff;
  border-color: var(--brand-red);
}


        .cta-text{
          color: rgba(0,0,0,0.50);
        }

        .empty-state{
          background: rgba(0,0,0,0.03);
          border: 1px dashed rgba(0,0,0,0.14);
        }

        @keyframes fadeUp{
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

export default Regular;
