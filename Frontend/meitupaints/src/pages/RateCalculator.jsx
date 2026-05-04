import { useEffect, useMemo, useRef, useState } from "react";
import NavBar from "../components/NavBar";
import paintRates from "../ProductsList/ratesData.json";
import { useLocation } from "react-router-dom";

import SYSTEMS from "../ProductsList/ratecalculatorSystems.json";

const CATEGORIES = [
  "All",
  "Exterior",
  "Interior",
  "Granite (Exterior and Interior)",
  "Specialty",
  "RealStone",
  "Enamel",
];

const formatSystemLabel = (key) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

const RateCalculator = () => {
  const location = useLocation();
  const [area, setArea] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeProductId, setActiveProductId] = useState(null);
  const [activeSystemKey, setActiveSystemKey] = useState("");

  const systemsRef = useRef(null);

  const activeProduct = useMemo(
    () => paintRates.find((p) => p.id === activeProductId) || null,
    [activeProductId]
  );

  const visibleProducts = useMemo(() => {
    if (activeCategory === "All") return paintRates;
    return paintRates.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const availableSystems = useMemo(() => {
    if (!activeProduct) return [];
    return SYSTEMS.filter((s) => activeProduct.rates?.[s.key] != null);
  }, [activeProduct]);

  useEffect(() => {
    if (!activeProductId) return;
    // Wait for the Systems section to render before scrolling
    const t = setTimeout(() => {
      const systemsEl = systemsRef.current;
      if (!systemsEl) return;

      const isMobile = window.matchMedia("(max-width: 640px)").matches;

      if (isMobile) {
        // Mobile: bottom of viewport lands exactly at the bottom of the Systems section
        const systemsBottom =
          systemsEl.getBoundingClientRect().bottom + window.pageYOffset;
        const target = Math.max(systemsBottom - window.innerHeight, 0);

        window.scrollTo({
          top: target,
          behavior: "smooth",
        });
        return;
      }

      // Desktop/tablet: bottom of viewport lands exactly at the top of the footer
      const footerEl = document.querySelector("footer.meitu-footer");
      if (!footerEl) return;

      const footerTop =
        footerEl.getBoundingClientRect().top + window.pageYOffset;
      const target = Math.max(footerTop - window.innerHeight, 0);

      window.scrollTo({
        top: target,
        behavior: "smooth",
      });
    }, 0);

    return () => clearTimeout(t);
  }, [activeProductId]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.key]);

  const ratePerSqft = activeProduct?.rates?.[activeSystemKey] ?? null;
  const total =
    area && ratePerSqft != null ? Number(area) * Number(ratePerSqft) : null;

  const canCalculate =
    Boolean(area) && Boolean(activeProduct) && Boolean(activeSystemKey);

  return (
    <>
      <NavBar />

      <div className="container py-5">
        <div className="row g-4">
          {/* LEFT: Main selection */}
          <div className="col-lg-8">
            <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm">
              <div>
                <h1 className="fw-bold mb-2">Paint Cost Estimator</h1>
                <p className="text-muted mb-0">
                  Choose a category, pick a product, then select a system.
                </p>

                {/* Area Input (prominent, Apple-like) */}
                <div className="area-row mt-4">
                  <div className="area-input-wrap">
                    <label className="form-label fw-semibold mb-2">
                      Area (Sq. Ft)
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      className="form-control form-control-lg premium-input area-input"
                      placeholder="e.g. 1200"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    />
                  </div>

                  <div
                    className="area-hint"
                    role="note"
                    aria-label="Area input guidance"
                  >
                    <div className="area-hint-pill">Step 1</div>
                    <div className="area-hint-title">
                      Enter your total area first
                    </div>
                  </div>
                </div>
              </div>

              {/* Category segmented control */}
              <div className="mt-4">
                <div className="d-flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const active = cat === activeCategory;
                    return (
                      <button
                        key={cat}
                        type="button"
                        className={`seg-btn ${active ? "active" : ""}`}
                        onClick={() => {
                          setActiveCategory(cat);
                          setActiveProductId(null);
                          setActiveSystemKey("");
                        }}
                      >
                        {cat == "Granite (Exterior and Interior)"
                          ? "Granite"
                          : cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Product grid */}
              <div className="mt-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="fw-semibold mb-0">Select Product</h5>
                  <span className="text-muted small">
                    {visibleProducts.length} options
                  </span>
                </div>

                <div className="row g-3">
                  {visibleProducts.map((p) => {
                    const isActive = p.id === activeProductId;
                    return (
                      <div className="col-md-6" key={p.id}>
                        <button
                          type="button"
                          className={`product-card w-100 text-start ${
                            isActive ? "active" : ""
                          }`}
                          onClick={() => {
                            setActiveProductId(p.id);
                            setActiveSystemKey("");
                          }}
                        >
                          <div className="d-flex align-items-start gap-3">
                            <div className="pc-thumb" aria-hidden="true">
                              {p.src ? (
                                <img
                                  src={p.src}
                                  alt=""
                                  loading="lazy"
                                  className="pc-thumb-img"
                                />
                              ) : (
                                <div className="pc-thumb-placeholder" />
                              )}
                            </div>

                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start gap-3">
                                <div>
                                  <div className="small text-muted mb-1">
                                    {p.category}
                                  </div>
                                  <div className="fw-semibold product-title">
                                    {p.name}
                                  </div>
                                </div>
                                <div className="pill">
                                  #{String(p.id).padStart(2, "0")}
                                </div>
                              </div>

                              <div className="mt-3 d-flex flex-wrap gap-2">
                                {Object.values(p.rates)
                                  .slice(0, 3)
                                  .map((r, idx) => (
                                    <span key={idx} className="rate-chip">
                                      Rs.{r}/sqft
                                    </span>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Systems */}
              <div className="mt-5" ref={systemsRef}>
                <h5 className="fw-semibold mb-3">Select System</h5>

                {!activeProduct ? (
                  <div className="empty-state rounded-4 p-4">
                    <div className="fw-semibold mb-1">Pick a product first</div>
                    <div className="text-muted small">
                      System options will appear here based on the selected
                      product.
                    </div>
                  </div>
                ) : (
                  <div className="row g-3">
                    {availableSystems.map((s) => {
                      const active = s.key === activeSystemKey;
                      const price = activeProduct.rates[s.key];

                      return (
                        <div className="col-md-6" key={s.key}>
                          <button
                            type="button"
                            className={`system-card w-100 text-start ${
                              active ? "active" : ""
                            }`}
                            onClick={() => setActiveSystemKey(s.key)}
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <div className="fw-semibold">{s.title}</div>
                                <div className="text-muted small">{s.desc}</div>
                              </div>
                              <div className="fw-bold">Rs.{price}</div>
                            </div>
                            <div className="text-muted small mt-2">
                              {formatSystemLabel(s.key)} rate per sqft
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="mt-4">
                <button
                  type="button"
                  className={`btn btn-lg w-100 fw-semibold ${
                    canCalculate ? "btn-primary" : "btn-secondary"
                  }`}
                  onClick={() => {
                    // We calculate live, but CTA keeps the "tool" feel
                    if (!canCalculate) return;
                    const el = document.getElementById("result-panel");
                    el?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  disabled={!canCalculate}
                >
                  {canCalculate
                    ? "View Estimate"
                    : "Enter area + choose product + system"}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Result panel */}
          <div className="col-lg-4">
            <div id="result-panel" className="sticky-top" style={{ top: 90 }}>
              <div className="result-card rounded-4 shadow-sm p-4">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div>
                    <div className="text-muted small">Estimate</div>
                    <div className="fw-bold fs-5">Quotation Preview</div>
                  </div>
                  <span className="badge text-bg-light border">Rs./sqft</span>
                </div>

                <div className="mb-3">
                  <div className="text-muted small">Area</div>
                  <div className="fw-semibold">
                    {area ? `${area} sqft` : ""}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-muted small">Product</div>
                  <div className="fw-semibold">{activeProduct?.name || ""}</div>
                  <div className="text-muted small">
                    {activeProduct?.category || ""}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-muted small">System</div>
                  <div className="fw-semibold">
                    {activeSystemKey ? formatSystemLabel(activeSystemKey) : ""}
                  </div>
                </div>

                <div className="divider my-4" />

                <div className="d-flex justify-content-between align-items-end">
                  <div>
                    <div className="text-muted small">Rate</div>
                    <div className="fw-bold">
                      {ratePerSqft != null ? `Rs.${ratePerSqft}/sqft` : ""}
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="text-muted small">Total</div>
                    <div className="total">
                      {total != null ? `Rs. ${total.toLocaleString()}` : ""}
                    </div>
                  </div>
                </div>

                <p className="small text-muted mt-3 mb-0">
                  *Final price may vary based on surface condition & site
                  requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>{/* Premium UI Styles */}
      <style>
        {`:root{
  --red:#c1121f;
  --red-soft:rgba(193,18,31,.12);
  --red-faint:rgba(193,18,31,.08);
}

/* GLASS */
.glass-card {
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0,0,0,0.06);
  animation: fadeUp 420ms ease;
}


/* INPUT */
.premium-input {
  border-radius: 14px;
  padding: 14px 16px;
  border: 1px solid rgba(0,0,0,0.12);
  font-size: 15px;
}
.premium-input:focus {
  border-color: var(--red);
  box-shadow: 0 0 0 0.22rem var(--red-soft);
}

/* AREA (APPLE-LIKE PROMINENCE) */
.area-row{
  display:flex;
  align-items:stretch;
  gap:14px;
}

.area-input-wrap{
  flex: 1 1 auto;
  min-width: 260px;
}

.area-input{
  font-weight: 700;
  letter-spacing: -0.2px;
}

.area-hint{
  flex: 0 0 320px;
  border-radius: 16px;
  padding: 14px 14px;
  background: rgba(0,0,0,0.02);
  border: 1px solid rgba(0,0,0,0.08);
  position: relative;
  overflow: hidden;
}

.area-hint::before{
  content:"";
  position:absolute;
  inset:-40px;
  background: radial-gradient(circle at 20% 30%, rgba(193,18,31,.18), transparent 55%);
  opacity:.85;
  pointer-events:none;
}

.area-hint-pill{
  position: relative;
  z-index: 1;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--red);
  background: rgba(193,18,31,.10);
  border: 1px solid rgba(193,18,31,.18);
}

.area-hint-title{
  position: relative;
  z-index: 1;
  margin-top: 10px;
  font-weight: 800;
  color: #111;
  letter-spacing: -0.2px;
}

.area-hint-sub{
  position: relative;
  z-index: 1;
  margin-top: 6px;
  font-size: 13px;
  color: rgba(11,11,12,.65);
  line-height: 1.35;
}

@media (max-width: 992px){
  .area-hint{ flex-basis: 280px; }
}

@media (max-width: 640px){
  .area-row{ flex-direction: column; }
  .area-hint{ flex-basis: auto; }
}

/* SEGMENTED BUTTONS */
.seg-btn {
  border: 1px solid rgba(0,0,0,0.10);
  background: #fff;
  color: #111;
  border-radius: 999px;
  padding: 10px 14px;
  font-weight: 600;
  font-size: 14px;
  transition: transform 120ms ease, background 120ms ease, border-color 120ms ease, box-shadow 120ms ease;
}
.seg-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(0,0,0,0.08);
}
.seg-btn.active {
  background: var(--red);
  color: #fff;
  border-color: var(--red);
}

/* PRODUCT CARDS */
.product-card {
  border: 1px solid rgba(0,0,0,0.10);
  background: #fff;
  border-radius: 18px;
  padding: 16px;
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
  min-height: 132px;
}
.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 36px rgba(0,0,0,0.10);
}
.product-card.active {
  border-color: var(--red);
  box-shadow: 0 18px 42px rgba(193,18,31,0.18);
}

.product-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.25;
  min-height: 2.6em;
}

/* PRODUCT THUMB (bucket preview) */
.pc-thumb{
  width:68px;
  height:68px;
  border-radius:18px;
  background: linear-gradient(180deg, rgba(193,18,31,.10), rgba(0,0,0,.03));
  border: 1px solid rgba(0,0,0,0.08);
  box-shadow: 0 18px 40px rgba(0,0,0,0.08);
  display:flex;
  align-items:center;
  justify-content:center;
  flex: 0 0 auto;
  overflow:hidden;
  position:relative;
}

.pc-thumb::after{
  content:"";
  position:absolute;
  inset:-30px;
  background: radial-gradient(circle at 30% 30%, rgba(193,18,31,.18), transparent 55%);
  opacity:.8;
  pointer-events:none;
  transform: translateZ(0);
}

.pc-thumb-img{
  width: 86%;
  height: 86%;
  object-fit: contain;
  position:relative;
  z-index: 1;
  filter: drop-shadow(0 14px 24px rgba(0,0,0,0.12));
}

.pc-thumb-placeholder{
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: rgba(0,0,0,0.06);
  border: 1px solid rgba(0,0,0,0.08);
  position:relative;
  z-index: 1;
}

/* Enhance active/hover state subtly */
.product-card:hover .pc-thumb{
  box-shadow: 0 22px 50px rgba(0,0,0,0.10);
  border-color: rgba(193,18,31,0.18);
}

.product-card.active .pc-thumb{
  border-color: rgba(193,18,31,0.38);
  box-shadow: 0 26px 60px rgba(193,18,31,0.14);
}

/* ID PILL */
.pill {
  border: 1px solid rgba(0,0,0,0.10);
  background: rgba(0,0,0,0.03);
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

/* RATE CHIPS */
.rate-chip {
  border-radius: 999px;
  background: var(--red-faint);
  border: 1px solid var(--red-soft);
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 700;
  color: var(--red);
}

/* SYSTEM CARDS */
.system-card {
  border: 1px solid rgba(0,0,0,0.10);
  background: #fff;
  border-radius: 18px;
  padding: 16px;
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
}
.system-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 36px rgba(0,0,0,0.10);
}
.system-card.active {
  border-color: var(--red);
  box-shadow: 0 18px 42px rgba(193,18,31,0.18);
}

/* EMPTY STATE */
.empty-state {
  background: rgba(0,0,0,0.03);
  border: 1px dashed rgba(0,0,0,0.14);
}

/* CTA BUTTON */
.btn-primary {
  background: var(--red);
  border-color: var(--red);
}
.btn-primary:hover {
  background: #a50f1a;
  border-color: #a50f1a;
}
.btn-secondary {
  background: #111;
  border-color: #111;
}

/* RESULT PANEL */
.result-card {
  background: #0b0b0c;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: inset 0 0 0 1px rgba(193,18,31,.12);
  animation: fadeUp 420ms ease;
}
.result-card .text-muted {
  color: rgba(255,255,255,0.65) !important;
}
.divider {
  height: 1px;
  background: rgba(255,255,255,0.12);
}
.total {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.3px;
  color: #fff;
}

/* ANIMATION */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
`}
      </style>
    </>
  );
};

export default RateCalculator;
