// src/productsPages/MeituTextures.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import graniteTexturesRaw from "../ProductsList/graniteTextures.json";

function normalize(s = "") {
  return String(s).trim().toLowerCase();
}

export default function MeituTextures() {
  const pageRef = useRef(null);
  const modalRef = useRef(null);

  const [query, setQuery] = useState("");
  const [active, setActive] = useState(null);

  // Reveal polish (load-time, not scroll-triggered)
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const applyReveal = () => {
      const els = Array.from(root.querySelectorAll("[data-reveal]"));

      // Stagger via CSS variable so the grid feels premium on first paint
      els.forEach((el, i) => {
        const existing = el.style.getPropertyValue("--rd");
        if (!existing) {
          const d = Math.min(i * 70, 700);
          el.style.setProperty("--rd", `${d}ms`);
        }
      });

      // Next frame: add the class so transitions run reliably
      window.requestAnimationFrame(() => {
        els.forEach((el) => el.classList.add("is-in"));
      });
    };

    applyReveal();
  }, []);

  // ESC closes modal
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock scroll + focus modal when open, also disable background interaction and mark inert
  useEffect(() => {
    if (!active) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Disable clicks on fixed UI (e.g., NavBar) while modal is open
    document.body.classList.add("mtx-modal-open");

    // Make this page content non-interactive while the portal modal is open
    const root = pageRef.current;
    const prevAria = root?.getAttribute("aria-hidden");
    if (root) {
      root.setAttribute("aria-hidden", "true");
      // `inert` is supported in modern browsers; safe to set even if ignored
      root.setAttribute("inert", "");
    }

    const t = window.setTimeout(() => {
      modalRef.current?.focus?.();
    }, 0);

    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove("mtx-modal-open");

      if (root) {
        if (prevAria === null) root.removeAttribute("aria-hidden");
        else root.setAttribute("aria-hidden", prevAria);
        root.removeAttribute("inert");
      }
    };
  }, [active]);

  const textures = useMemo(() => {
    const list = Array.isArray(graniteTexturesRaw) ? graniteTexturesRaw : [];
    return list
      .map((t, idx) => {
        const code = String(t.textureCode ?? t.code ?? "").trim();
        const filename = String(t.filename ?? `${code}.webp`).trim();
        const src = String(t.src ?? `Granite Textures/${filename}`).trim();
        const id = String(t.id ?? `tex-${code || idx + 1}`).trim();
        const _q = normalize(`${code} ${id} ${filename}`);
        return { ...t, id, code, filename, src, _q };
      })
      .sort((a, b) => a.code.localeCompare(b.code) || a.id.localeCompare(b.id));
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return textures;
    return textures.filter((t) => t._q.includes(q));
  }, [textures, query]);

  // When searching/filtering, new cards mount with data-reveal but may not have `is-in` yet.
  // Ensure newly rendered items animate in instead of staying hidden.
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const els = Array.from(root.querySelectorAll("[data-reveal]"));
    window.requestAnimationFrame(() => {
      els.forEach((el) => el.classList.add("is-in"));
    });
  }, [query, filtered.length]);

  // Close only when clicking the dim background (not the card)
  const onOverlayMouseDown = (e) => {
    if (e.target === e.currentTarget) setActive(null);
  };

  return (
    <>
      <NavBar />

      <div ref={pageRef} className={`tex-root ${active ? "modal-open" : ""}`}>
        {/* HERO */}
        <header className="tex-hero" data-reveal>
          <div className="tex-ambient" aria-hidden="true" />
          <div className="tex-shell">
            <div className="tex-left">
              <span className="tex-eyebrow">MEITU • GRANITE TEXTURES</span>
              <h1 className="tex-title">
                Texture Library
                <span className="tex-accent"> • Code-first</span>
              </h1>
              <p className="tex-sub">
                Search granite texture codes and preview finishes instantly.
                Click any texture to expand it in a premium preview with inquiry
                access.
              </p>

              <div className="tex-actions">
                <Link to="/products" className="pill glass">
                  Browse Products
                </Link>
                <Link to="/granite" className="pill glass">
                  Granite Series
                </Link>
              </div>
            </div>

            <div className="tex-right" data-reveal>
              <div className="searchCard">
                <div className="searchTop">
                  <div className="searchBadge">Search by code</div>
                  <div className="searchHint">Example: 201, 6004, 7019</div>
                </div>

                <div className="searchBar">
                  <span className="sicon" aria-hidden="true">
                    ⌕
                  </span>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search texture code…"
                    aria-label="Search texture code"
                  />
                  {query ? (
                    <button
                      type="button"
                      className="clear"
                      onClick={() => setQuery("")}
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  ) : null}
                </div>

                <div className="searchMeta">
                  Showing <strong>{filtered.length}</strong> of{" "}
                  <strong>{textures.length}</strong>
                </div>
              </div>

              <div className="previewNote" data-reveal>
                <div className="pTitle">Premium Preview</div>
                <div className="pSub">
                  Click a texture card to enlarge it, view the code, and jump to
                  inquiry.
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* GRID */}
        <section className="tex-gridWrap" data-reveal>
          <div className="gridShell">
            {filtered.length === 0 ? (
              <div className="empty">
                <div className="emptyTitle">No textures found.</div>
                <div className="emptySub">
                  Try a different code (e.g., 201 / 6004 / 7019).
                </div>
              </div>
            ) : (
              <div className="tex-grid" aria-label="Granite textures grid">
                {filtered.map((t, idx) => (
                  <button
                    key={t.id}
                    type="button"
                    className="tex-card"
                    data-reveal
                    style={{ "--rd": `${Math.min(idx * 35, 560)}ms` }}
                    onClick={() => setActive(t)}
                    aria-label={`Open texture ${t.code}`}
                    title={`Texture ${t.code}`}
                  >
                    <div className="tex-media">
                      <img
                        src={t.src}
                        alt={`Texture ${t.code}`}
                        loading="lazy"
                        onError={(e) => (e.currentTarget.style.opacity = "0")}
                      />
                      <div className="tex-gloss" aria-hidden="true" />
                    </div>

                    <div className="tex-foot">
                      <div className="tex-code">{t.code}</div>
                      <div className="tex-subcode">Granite Texture</div>
                      <div className="tex-cta">
                        <span className="cta-pill">Preview</span>
                        <span className="cta-arrow">→</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* MODAL OVERLAY (ENLARGED CARD) */}
        {active &&
          createPortal(
            <div
              className="mtx-overlay"
              role="dialog"
              aria-modal="true"
              aria-label={`Texture preview ${active.code}`}
              onPointerDown={(e) => {
                // Close ONLY when clicking the dim background (not the card)
                if (e.target === e.currentTarget) setActive(null);
              }}
            >
              <div
                className="mtx-modal"
                tabIndex={-1}
                ref={modalRef}
                onPointerDown={(e) => {
                  // Prevent overlay close when interacting inside the card
                  e.stopPropagation();
                }}
                onMouseMove={(e) => {
                  const el = e.currentTarget;
                  const r = el.getBoundingClientRect();
                  const x = (e.clientX - r.left) / r.width;
                  const y = (e.clientY - r.top) / r.height;
                  const rx = (y - 0.5) * -6;
                  const ry = (x - 0.5) * 8;
                  el.style.setProperty("--rx", `${rx}deg`);
                  el.style.setProperty("--ry", `${ry}deg`);
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.setProperty("--rx", "0deg");
                  el.style.setProperty("--ry", "0deg");
                }}
              >
                <button
                  type="button"
                  className="mtx-close"
                  onClick={() => setActive(null)}
                  aria-label="Close preview"
                >
                  ×
                </button>

                <div className="modalTop">
                  <div className="badge">Texture Code</div>
                </div>

                <div className="modalMedia">
                  <img
                    src={active.src}
                    alt={`Texture ${active.code}`}
                    onError={(e) => (e.currentTarget.style.opacity = "0")}
                  />
                </div>

                <div className="modalBottom">
                  <div className="mLeft">
                    <div className="mTitle">Granite Texture {active.code}</div>
                    <div className="mSub">
                      Use this code during selection and inquiry for accurate
                      matching across granite finishes.
                    </div>
                  </div>

                  <div className="mActions">
                    <Link to="/inquiry" className="pill solid">
                      Enquire with this code
                    </Link>
                    <button
                      type="button"
                      className="pill glass"
                      onClick={() => {
                        try {
                          navigator.clipboard.writeText(active.code);
                        } catch {}
                      }}
                    >
                      Copy code
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}
      </div><style>{`
      {/* ================= STYLES ================= */}
        :root{
          --red:#c1121f;
          --red2:#e11d2e;
          --black:#0b0b0c;

          --ink70:rgba(11,11,12,.70);
          --ink55:rgba(11,11,12,.55);

          --glass:rgba(255,255,255,.86);
          --glass2:rgba(255,255,255,.72);

          --shadow: 0 50px 120px rgba(0,0,0,.14);
          --shadow2: 0 30px 80px rgba(0,0,0,.10);

          --ease: cubic-bezier(.22,.61,.36,1);
        }

        .tex-root{
          background:
            radial-gradient(1200px 700px at 18% 0%, rgba(193,18,31,.10), transparent 55%),
            radial-gradient(1000px 700px at 85% 18%, rgba(0,0,0,.06), transparent 55%),
            #fff;
          min-height:100vh;
        }

        /* Blur + disable interactions behind the portal modal */
        .tex-root.modal-open{
          overflow: hidden;
          pointer-events: none; /* critical: prevents clicking blurred content */
        }
        .tex-root.modal-open .tex-hero,
        .tex-root.modal-open .tex-gridWrap{
          filter: blur(8px) saturate(.95);
          transform: translateZ(0);
        }

        /* Reveal animation */
        [data-reveal]{
          opacity:0;
          transform:translateY(14px);
          transition:opacity .75s ease, transform .75s ease;
          transition-delay: var(--rd, 0ms);
          will-change:transform, opacity;
        }
        .is-in{
          opacity:1;
          transform:translateY(0);
        }

        /* Pills */
        .pill{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:10px;
          padding:14px 26px;
          border-radius:999px;
          font-weight:760;
          font-size:14px;
          text-decoration:none;
          letter-spacing:.01em;
          transition:transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease;
          user-select:none;
          border:none;
          cursor:pointer;
          white-space:nowrap;
        }
        .pill.solid{
          background:linear-gradient(180deg, var(--red2), var(--red));
          color:#fff;
          box-shadow:0 22px 60px rgba(193,18,31,.35), inset 0 1px 0 rgba(255,255,255,.25);
          border:1px solid rgba(255,255,255,.22);
        }
        .pill.glass{
          background:rgba(255,255,255,.78);
          border:1px solid rgba(0,0,0,.10);
          color:var(--black);
          backdrop-filter: blur(14px);
          box-shadow:0 20px 55px rgba(0,0,0,.10);
        }
        .pill:hover{
          transform:translateY(-2px);
          box-shadow:0 28px 80px rgba(0,0,0,.14);
        }

        /* HERO */
        .tex-hero{
          position:relative;
          padding: 140px 24px 44px;
          overflow:hidden;
        }
        .tex-ambient{
          position:absolute;
          inset:-180px -200px auto -200px;
          height:520px;
          background:
            radial-gradient(closest-side at 50% 45%, rgba(193,18,31,.20), transparent 72%),
            radial-gradient(closest-side at 22% 38%, rgba(225,29,46,.15), transparent 70%);
          filter: blur(10px);
          pointer-events:none;
        }
        .tex-shell{
          position:relative;
          max-width:1280px;
          margin:0 auto;
          display:grid;
          grid-template-columns: 1.1fr .9fr;
          gap:28px;
          align-items:start;
        }

        .tex-eyebrow{
          font-size:12px;
          letter-spacing:.34em;
          color:var(--red);
          font-weight:900;
        }
        .tex-title{
          font-size:54px;
          margin:18px 0 12px;
          letter-spacing:-.05em;
          font-weight:880;
          color:var(--black);
          line-height:1.06;
        }
        .tex-accent{ color:var(--red); }
        .tex-sub{
          font-size:17px;
          color:var(--ink70);
          line-height:1.75;
          max-width:760px;
        }

        .tex-actions{
          margin-top:18px;
          display:flex;
          gap:12px;
          flex-wrap:wrap;
        }

        .tex-mini{
          margin-top:22px;
          display:grid;
          grid-template-columns:repeat(3, 1fr);
          gap:12px;
          max-width:640px;
        }
        .mini-card{
          background:rgba(255,255,255,.65);
          border:1px solid rgba(0,0,0,.06);
          border-radius:18px;
          padding:14px 14px;
          box-shadow:0 22px 50px rgba(0,0,0,.06);
          backdrop-filter: blur(14px);
        }
        .mini-val{
          font-size:18px;
          font-weight:880;
          letter-spacing:-.02em;
          color:var(--black);
        }
        .mini-key{
          margin-top:6px;
          font-size:11px;
          letter-spacing:.16em;
          text-transform:uppercase;
          color:var(--ink55);
          font-weight:900;
        }

        .tex-right{
          display:flex;
          flex-direction:column;
          gap:12px;
        }

        .searchCard{
          border-radius:28px;
          background:rgba(255,255,255,.76);
          border:1px solid rgba(0,0,0,.08);
          backdrop-filter: blur(18px);
          box-shadow:var(--shadow);
          padding:18px;
          overflow:hidden;
        }
        .searchTop{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:10px;
          margin-bottom:12px;
        }
        .searchBadge{
          font-size:11px;
          letter-spacing:.18em;
          text-transform:uppercase;
          font-weight:900;
          color:var(--red);
          background:rgba(193,18,31,.10);
          border:1px solid rgba(193,18,31,.20);
          padding:7px 10px;
          border-radius:999px;
          white-space:nowrap;
        }
        .searchHint{
          color:var(--ink55);
          font-size:12px;
          line-height:1.4;
          text-align:right;
        }

        .searchBar{
          display:flex;
          align-items:center;
          gap:10px;
          padding:12px 14px;
          border-radius:18px;
          background:rgba(255,255,255,.78);
          border:1px solid rgba(0,0,0,.10);
          box-shadow:0 18px 50px rgba(0,0,0,.06);
          backdrop-filter: blur(14px);
          position:relative;
        }
        .sicon{ color:var(--ink55); }
        .searchBar input{
          border:none;
          outline:none;
          width:100%;
          background:transparent;
          font-size:14px;
        }
        .clear{
          border:none;
          background:rgba(0,0,0,.06);
          color:var(--black);
          width:30px;
          height:30px;
          border-radius:999px;
          cursor:pointer;
          transition:transform .16s ease, background .16s ease;
        }
        .clear:hover{
          transform:scale(1.04);
          background:rgba(193,18,31,.12);
        }

        .searchMeta{
          margin-top:12px;
          color:var(--ink70);
          font-size:13px;
        }

        .previewNote{
          border-radius:26px;
          padding:18px;
          background:rgba(11,11,12,.92);
          color:#fff;
          border:1px solid rgba(255,255,255,.10);
          box-shadow:0 44px 120px rgba(0,0,0,.18);
          overflow:hidden;
          position:relative;
        }
        .previewNote::after{
          content:"";
          position:absolute;
          inset:-120px -120px auto auto;
          width:260px;
          height:260px;
          background:radial-gradient(circle, rgba(193,18,31,.22), transparent 60%);
          pointer-events:none;
        }
        .pTitle{
          font-weight:900;
          letter-spacing:-.02em;
          font-size:16px;
        }
        .pSub{
          margin-top:8px;
          color:rgba(255,255,255,.70);
          font-size:13px;
          line-height:1.6;
        }

        /* GRID */
        .tex-gridWrap{
          padding: 22px 24px 110px;
        }
        .gridShell{
          max-width:1280px;
          margin:0 auto;
        }

        .tex-grid{
          display:grid;
          grid-template-columns:repeat(4, minmax(0, 1fr));
          gap:16px;
        }

        .tex-card{
          text-align:left;
          border:none;
          padding:0;
          cursor:pointer;
          border-radius:22px;
          background:rgba(255,255,255,.80);
          border:1px solid rgba(0,0,0,.08);
          backdrop-filter: blur(14px);
          box-shadow:0 16px 44px rgba(0,0,0,.08);
          overflow:hidden;
          transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease;
          will-change:transform;
          transform: translateZ(0);
          outline:none;
          position:relative;
        }
        .tex-card:focus-visible{
          outline:3px solid rgba(193,18,31,.30);
          outline-offset:3px;
        }
        .tex-card::before{
          content:"";
          position:absolute;
          inset:0;
          background:linear-gradient(180deg, rgba(255,255,255,.16), rgba(255,255,255,0));
          pointer-events:none;
          opacity:.9;
        }
        .tex-card:hover{
          transform:translateY(-3px);
          box-shadow:0 26px 70px rgba(0,0,0,.12);
          border-color:rgba(193,18,31,.14);
        }

        .tex-media{
          position:relative;
          aspect-ratio:1 / 1;
          background:#fff;
        }
        .tex-media img{
          width:100%;
          height:100%;
          object-fit:cover;
          display:block;
          filter: drop-shadow(0 22px 44px rgba(0,0,0,.14));
          transform:scale(1.02);
          transition:transform .25s var(--ease);
        }
        .tex-card:hover .tex-media img{
          transform:scale(1.06);
        }
        .tex-gloss{
          position:absolute;
          inset:-40% -40% auto auto;
          width:220px;
          height:220px;
          background:radial-gradient(circle, rgba(255,255,255,.45), transparent 60%);
          transform:rotate(12deg);
          pointer-events:none;
        }

        .tex-foot{
          padding:14px 14px 16px;
          display:flex;
          flex-direction:column;
          gap:6px;
          background:rgba(255,255,255,.74);
          border-top:1px solid rgba(0,0,0,.06);
        }
        .tex-code{
          font-size:16px;
          font-weight:920;
          letter-spacing:-.02em;
          color:var(--black);
        }
        .tex-subcode{
          font-size:11px;
          letter-spacing:.18em;
          text-transform:uppercase;
          font-weight:900;
          color:var(--ink55);
        }
        .tex-cta{
          margin-top:6px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
        }
        .cta-pill{
          padding:8px 14px;
          border-radius:999px;
          border:1px solid rgba(193,18,31,.35);
          color:var(--red);
          font-weight:800;
          font-size:12px;
          background:transparent;
          transition:background .16s ease, color .16s ease, border-color .16s ease;
        }
        .cta-arrow{
          width:36px;
          height:36px;
          border-radius:999px;
          display:grid;
          place-items:center;
          border:1px solid rgba(0,0,0,.10);
          background:rgba(0,0,0,.03);
          color:rgba(0,0,0,.50);
          font-weight:900;
          transition:background .18s ease, color .18s ease, transform .18s ease;
        }
        .tex-card:hover .cta-pill{
          background:var(--red);
          color:#fff;
          border-color:var(--red);
        }
        .tex-card:hover .cta-arrow{
          background:var(--red);
          color:#fff;
          transform:translateX(2px);
        }

        .empty{
          text-align:center;
          padding:18px 14px;
          border-radius:22px;
          background:rgba(255,255,255,.70);
          border:1px solid rgba(0,0,0,.08);
          backdrop-filter: blur(14px);
          box-shadow:0 18px 50px rgba(0,0,0,.06);
          max-width:640px;
          margin:0 auto;
        }
        .emptyTitle{
          font-weight:880;
          letter-spacing:-.02em;
          color:var(--black);
        }
        .emptySub{
          margin-top:8px;
          color:var(--ink70);
          line-height:1.6;
          font-size:14px;
        }

        /* MODAL OVERLAY */
        .mtx-overlay{
          position:fixed;
          inset:0;
          z-index:2147483647;
          background:rgba(11,11,12,.44);
          backdrop-filter: blur(10px);
          display:grid;
          place-items:center;
          padding:18px;
          animation: overlayIn .22s var(--ease);
        }
        /* Overlay must remain interactive even if the page root is pointer-events:none */
        .mtx-overlay,
        .mtx-overlay *{
          pointer-events: auto;
        }

        /* If NavBar is outside .tex-root, disable it while modal is open */
        body.mtx-modal-open nav,
        body.mtx-modal-open .navbar{
          pointer-events: none;
        }
        @keyframes overlayIn{
          from{ opacity:0; }
          to{ opacity:1; }
        }

        .mtx-modal{
          display:flex;
          flex-direction:column;
          position:relative;
          width:min(720px, 90vw);
          max-height:86vh;
          border-radius:26px;
          background:rgba(255,255,255,.86);
          border:1px solid rgba(255,255,255,.40);
          box-shadow:0 60px 140px rgba(0,0,0,.26);
          backdrop-filter: blur(18px);
          overflow:hidden;
          transform: perspective(1100px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
          transition: transform .18s ease;
          animation: modalIn .34s var(--ease);
          outline:none;
        }
        @keyframes modalIn{
          from{ opacity:0; transform: perspective(1100px) translateY(10px) scale(.96); }
          to{ opacity:1; transform: perspective(1100px) translateY(0) scale(1); }
        }

        .mtx-close{
          position:absolute;
          right:12px;
          top:10px;
          width:40px;
          height:40px;
          border-radius:999px;
          border:1px solid rgba(0,0,0,.10);
          background:rgba(255,255,255,.76);
          cursor:pointer;
          font-size:24px;
          line-height:0;
          display:grid;
          place-items:center;
          color:rgba(0,0,0,.60);
          transition:transform .16s ease, background .16s ease;
          z-index:3;
        }
        .mtx-close:hover{
          transform:scale(1.03);
          background:rgba(193,18,31,.10);
        }

        .modalTop{
          padding:18px 18px 10px;
          display:flex;
          align-items:center;
          justify-content:flex-start;
          gap:10px;
        }
        .badge{
          font-size:11px;
          letter-spacing:.18em;
          text-transform:uppercase;
          font-weight:900;
          color:var(--red);
          background:rgba(193,18,31,.10);
          border:1px solid rgba(193,18,31,.20);
          padding:7px 10px;
          border-radius:999px;
          white-space:nowrap;
        }
        .code{
          font-size:18px;
          font-weight:920;
          letter-spacing:-.02em;
          color:var(--black);
        }

        .modalMedia{
          position:relative;
          margin:14px auto 10px;
          border-radius:20px;
          overflow:hidden;
          background:#fff;
          border:1px solid rgba(0,0,0,.08);
          box-shadow:0 22px 60px rgba(0,0,0,.12);

          /* Perfect square, sized to available viewport so CTAs remain visible */
          --mediaSize: min(
            520px,
            calc(90vw - 56px),
            max(260px, calc(86vh - 260px))
          );
          width: var(--mediaSize);
          height: var(--mediaSize);
        }
        .modalMedia img{
          width:100%;
          height:100%;
          object-fit:cover;
          display:block;
          transform:scale(1.01);
        }

        .modalBottom{
          flex:0 0 auto;
          padding:14px 18px 18px;
          display:flex;
          align-items:flex-end;
          justify-content:space-between;
          gap:14px;
          flex-wrap:wrap;
        }
        .mLeft{
          flex: 1 1 420px;
          min-width:240px;
        }
        .mTitle{
          font-size:18px;
          font-weight:920;
          letter-spacing:-.02em;
          color:var(--black);
        }
        .mSub{
          margin-top:8px;
          color:var(--ink70);
          line-height:1.6;
          font-size:14px;
          max-width:560px;
        }
        .mActions{
          display:flex;
          gap:10px;
          flex-wrap:wrap;
          justify-content:flex-end;
        }

        /* Responsive */
        @media (max-width: 1100px){
          .tex-shell{ grid-template-columns: 1fr; }
          .tex-title{ font-size:46px; }
          .tex-mini{ grid-template-columns:repeat(3, 1fr); }
        }
        @media (max-width: 920px){
          .tex-grid{ grid-template-columns:repeat(3, minmax(0, 1fr)); }
        }
        @media (max-width: 680px){
          .tex-grid{ grid-template-columns:repeat(2, minmax(0, 1fr)); }
          .tex-title{ font-size:38px; }
          .tex-gridWrap{ padding: 18px 16px 90px; }
          .tex-hero{ padding: 124px 16px 38px; }
        }
        @media (max-width: 420px){
          .tex-grid{ grid-template-columns:1fr; }
        }

        @media (prefers-reduced-motion: reduce){
          [data-reveal]{ transition:none; transform:none; opacity:1; }
          .pill, .tex-card{ transition:none; }
          .mtx-overlay{ animation:none; }
          .mtx-modal{ animation:none; transform:none !important; }
          .tex-media img{ transition:none; }
        }
        @media (max-width: 520px){
          .mtx-modal{ width:min(640px, 92vw); }
          .modalMedia{
            --mediaSize: min(
              440px,
              calc(92vw - 48px),
              max(240px, calc(86vh - 280px))
            );
          }
        }
      `}</style>
    </>
  );
}
