import { useMemo, useState } from "react";
import NavBar from "../components/NavBar";
import Carousel from "../components/Carousel";
import { Link, useNavigate } from "react-router-dom";
import paints3D from "../ProductsList/paint3D.json";
import paintsLiquid from "../ProductsList/paintsLiquid.json";
import floorPaints from "../ProductsList/floorPaints.json";
import realstonePaints from "../ProductsList/realstonePaints.json";

function Granite() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("3D");
  const [query, setQuery] = useState("");

  const productsToDisplay = useMemo(() => {
    let source;

    if (selectedCategory === "3D") source = paints3D;
    else if (selectedCategory === "Liquid") source = paintsLiquid;
    else if (selectedCategory === "Floor") source = floorPaints;
    else if (selectedCategory === "RealStone") source = realstonePaints;

    if (Array.isArray(source)) return source;
    return Object.values(source || {});
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
          {/* Header  IDENTICAL */}
          <div className="d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-3 mb-4">
            <div>
              <div className="kicker">Granite Series</div>
              <h1 className="title fw-bold mb-2">Granite & Liquid Paints</h1>
              <p className="text-muted mb-0">
                Choose a category, browse products, and view details.
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

          {/* Control Bar  IDENTICAL */}
          <div className="control-bar glass-card rounded-4 p-3 p-md-4 shadow-sm mb-4">
            <div className="row g-3 align-items-center">
              <div className="col-lg-6">
                <div className="segmented" role="tablist">
                  <button
                    type="button"
                    className={`seg-btn ${
                      selectedCategory === "3D" ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory("3D")}
                    aria-pressed={selectedCategory === "3D"}
                  >
                    3D Paints
                  </button>

                  <button
                    type="button"
                    className={`seg-btn ${
                      selectedCategory === "Liquid" ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory("Liquid")}
                    aria-pressed={selectedCategory === "Liquid"}
                  >
                    2D Paints
                  </button>

                  <button
                    type="button"
                    className={`seg-btn ${
                      selectedCategory === "Floor" ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory("Floor")}
                    aria-pressed={selectedCategory === "Floor"}
                  >
                    Floor Paints
                  </button>
                  <button
                    type="button"
                    className={`seg-btn ${
                      selectedCategory === "RealStone" ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory("RealStone")}
                    aria-pressed={selectedCategory === "RealStone"}
                  >
                    RealStone
                  </button>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="search-wrap">
                  <span className="search-icon">⌕</span>
                  <input
                    className="form-control form-control-lg search-input"
                    placeholder="Search products…"
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

          {/* Product Grid  IDENTICAL */}
          <div className="row g-4">
            {filtered.map((product) => (
              <div key={product.id} className="col-12 col-sm-6">
                <Link
                  to={`/granite/${product.id}`}
                  className="text-decoration-none"
                >
                  <div className="product-tile">
                    {product.sale && <div className="sale-pill">SALE</div>}

                    <div className="tile-head">
                      <div className="tile-meta">
                        <span className="meta-chip">{selectedCategory}</span>
                      </div>
                      <div className="tile-arrow">→</div>
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
                          Details • Finish • System
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Empty State  IDENTICAL */}
          {filtered.length === 0 && (
            <div className="empty-state rounded-4 p-4 mt-4">
              <div className="fw-semibold mb-1">No products found</div>
              <div className="text-muted small">
                Try a different keyword or switch category.
              </div>
            </div>
          )}
        </div>
      </div><style>
        {`
          :root{
  --brand-red: #c1121f;
  --brand-red-hover: #a50f1a;
  --brand-black: #0b0b0c;

  --ink-70: rgba(11,11,12,0.70);
  --ink-55: rgba(11,11,12,0.55);
  --line: rgba(0,0,0,0.10);
}

/* ===== Page Background ===== */
.regular-hero{
  background:
    radial-gradient(900px 420px at 10% 10%, rgba(193,18,31,0.10), transparent 60%),
    radial-gradient(800px 420px at 90% 20%, rgba(0,0,0,0.06), transparent 55%),
    radial-gradient(900px 520px at 30% 95%, rgba(0,0,0,0.04), transparent 60%),
    #ffffff;
  animation: fadeUp 420ms ease;
}

/* ===== Header ===== */
.kicker{
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-55);
  margin-bottom: 10px;
}

.title{
  letter-spacing: -0.6px;
  color: var(--brand-black);
}

/* ===== Glass Card ===== */
.glass-card{
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0,0,0,0.06);
}

/* ===== Buttons ===== */
.btn-dark{
  background: var(--brand-black);
  border-color: var(--brand-black);
}
.btn-dark:hover{
  background: var(--brand-red);
  border-color: var(--brand-red);
}

/* ===== Segmented Control ===== */
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
  padding: 10px 16px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 14px;
  color: var(--ink-70);
  transition: background 160ms ease, color 160ms ease, box-shadow 160ms ease;
}

.seg-btn.active{
  background: var(--brand-red);
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(193,18,31,0.22);
}

/* ===== Search ===== */
.search-wrap{
  position: relative;
}
.search-icon{
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-weight: 900;
  color: rgba(0,0,0,0.45);
}
.search-input{
  border-radius: 16px;
  padding: 14px 16px 14px 42px;
  border: 1px solid var(--line);
  font-size: 15px;
}
.search-input:focus{
  border-color: rgba(193,18,31,0.5);
  box-shadow: 0 0 0 0.22rem rgba(193,18,31,0.10);
}

/* ===== Product Tile ===== */
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

/* ===== Sale Pill ===== */
.sale-pill{
  position: absolute;
  top: 14px;
  left: 14px;
  padding: 7px 10px;
  border-radius: 999px;
  background: var(--brand-red);
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  box-shadow: 0 12px 26px rgba(193,18,31,0.22);
}

/* ===== Tile Head ===== */
.tile-head{
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
}

.tile-meta{
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.meta-chip{
  border-radius: 999px;
  padding: 7px 10px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(193,18,31,0.35);
  background: rgba(193,18,31,0.06);
  color: var(--brand-red);
}

.meta-chip.soft{
  background: rgba(0,0,0,0.03);
  border-color: rgba(0,0,0,0.10);
  color: rgba(0,0,0,0.60);
}

/* ===== Arrow ===== */
.tile-arrow{
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(0,0,0,0.10);
  background: rgba(0,0,0,0.03);
  color: rgba(0,0,0,0.45);
  font-size: 18px;
  font-weight: 900;
  transition: background 180ms ease, color 180ms ease, transform 180ms ease;
}

.product-tile:hover .tile-arrow{
  background: var(--brand-red);
  color: #ffffff;
  transform: translateX(2px);
}

/* ===== Image ===== */
.tile-imageWrap{
  width: 100%;
  border-radius: 18px;
  padding: 14px;
  border: 1px solid rgba(0,0,0,0.06);
  background: rgba(0,0,0,0.02);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 190px;
}

.tile-image{
  max-height: 155px;
  object-fit: contain;
  filter: drop-shadow(0 20px 32px rgba(0,0,0,0.14));
  transition: transform 220ms ease;
}

/* ===== Body ===== */
.tile-body{
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tile-title{
  font-size: 17px;
  font-weight: 650;
  line-height: 1.32;
  letter-spacing: -0.2px;
  color: var(--brand-black);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.8em;
}

/* ===== CTA ===== */
.tile-cta{
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 600;
}

.cta-pill{
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(193,18,31,0.35);
  background: transparent;
  color: var(--brand-red);
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

/* ===== Empty State ===== */
.empty-state{
  background: rgba(0,0,0,0.03);
  border: 1px dashed rgba(0,0,0,0.14);
}

/* ===== Animation ===== */
@keyframes fadeUp{
  from{
    opacity: 0;
    transform: translateY(10px);
  }
  to{
    opacity: 1;
    transform: translateY(0);
  }
}

          `}
      </style>
    </>
  );
}

export default Granite;
