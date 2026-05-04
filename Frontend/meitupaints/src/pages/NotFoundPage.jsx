// src/pages/NotFoundPage.jsx (or wherever yours lives)
import React, { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Always start at top (works across devices)
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.key]);

  // Show a clean “requested path” (no query noise)
  const requested = useMemo(() => {
    const p = location?.pathname || "/";
    return p.length > 42 ? p.slice(0, 42) + "…" : p;
  }, [location.pathname]);

  return (
    <>
      <NavBar />

      <main className="nf-root" aria-label="Page not found">
        <section className="nf-shell">
          {/* Ambient */}
          <div className="nf-ambient" aria-hidden="true" />
          <div className="nf-grid">
            {/* Left */}
            <div className="nf-left">
              <div className="nf-kicker">ERROR 404</div>
              <h1 className="nf-title">
                This page <span className="nf-accent">doesn’t exist</span>.
              </h1>
              <p className="nf-sub">
                The link may be broken, or the page may have been moved. Don’t
                worry your session is fine.
              </p>

              <div className="nf-path" title={location.pathname}>
                <span className="nf-path-label">Requested</span>
                <span className="nf-path-value">{requested}</span>
              </div>

              <div className="nf-actions">
                <button
                  type="button"
                  className="nf-btn primary"
                  onClick={() => navigate("/")}
                >
                  Go Home
                </button>

                <button
                  type="button"
                  className="nf-btn glass"
                  onClick={() => navigate(-1)}
                >
                  Go Back
                </button>

                <Link className="nf-btn ghost" to="/products">
                  Browse Products
                </Link>
              </div>

              <div className="nf-links">
                <Link to="/colors">Colors</Link>
                <Link to="/textures">Textures</Link>
                <Link to="/ratecalculator">Estimator</Link>
                <Link to="/support">Support</Link>
              </div>
            </div>

            {/* Right */}
            <div className="nf-right" aria-hidden="true">
              <div className="nf-card">
                <div className="nf-card-top">
                  <div className="nf-dot" />
                  <div className="nf-card-title">Meitu Paint System</div>
                </div>

                <div className="nf-visual">
                  <div className="nf-stroke s1" />
                  <div className="nf-stroke s2" />
                  <div className="nf-stroke s3" />
                  <div className="nf-stroke s4" />

                  <div className="nf-badge">
                    Precision · Finish · Durability
                  </div>

                  <div className="nf-code">
                    <div className="nf-code-row">
                      <span>Status</span>
                      <span className="ok">Safe</span>
                    </div>
                    <div className="nf-code-row">
                      <span>Route</span>
                      <span>Not Found</span>
                    </div>
                    <div className="nf-code-row">
                      <span>Action</span>
                      <span>Choose a destination</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main><style>{`
        :root{
          --red:#b3121b;
          --red2:#ff3b30;
          --black:#0b0b0c;
          --ink70:rgba(11,11,12,.70);
          --ink55:rgba(11,11,12,.55);
          --glass:rgba(255,255,255,.86);
        }

        .nf-root{
          min-height: calc(100vh - 80px);
          background:
            radial-gradient(1200px 700px at 18% 0%, rgba(193,18,31,.10), transparent 56%),
            radial-gradient(1000px 700px at 85% 18%, rgba(193,18,31,.08), transparent 58%),
            #fff;
          padding: 120px 24px 60px;
        }

        .nf-shell{
          max-width: 1180px;
          margin: 0 auto;
          position: relative;
        }

        .nf-ambient{
          position:absolute;
          inset:-220px -240px auto -240px;
          height:520px;
          background:
            radial-gradient(closest-side at 50% 45%, rgba(193,18,31,.20), transparent 72%),
            radial-gradient(closest-side at 22% 38%, rgba(255,59,48,.12), transparent 70%);
          filter: blur(10px);
          pointer-events:none;
        }

        .nf-grid{
          position: relative;
          display:grid;
          grid-template-columns: 1.1fr .9fr;
          gap: 26px;
          align-items: start;
        }

        /* LEFT */
        .nf-kicker{
          font-size: 12px;
          letter-spacing: .34em;
          font-weight: 900;
          color: var(--red);
        }

        .nf-title{
          margin: 14px 0 10px;
          font-size: 56px;
          line-height: 1.05;
          letter-spacing: -.05em;
          font-weight: 900;
          color: var(--black);
        }

        .nf-accent{
          color: var(--red);
        }

        .nf-sub{
          margin: 0;
          max-width: 560px;
          font-size: 16px;
          line-height: 1.75;
          color: var(--ink70);
        }

        .nf-path{
          margin-top: 18px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap: 14px;
          padding: 12px 14px;
          border-radius: 16px;
          background: rgba(255,255,255,.76);
          border: 1px solid rgba(0,0,0,.08);
          box-shadow: 0 18px 50px rgba(0,0,0,.06);
          backdrop-filter: blur(14px);
        }

        .nf-path-label{
          font-size: 11px;
          letter-spacing: .18em;
          text-transform: uppercase;
          font-weight: 900;
          color: var(--ink55);
          white-space: nowrap;
        }

        .nf-path-value{
          font-size: 13px;
          font-weight: 800;
          color: rgba(11,11,12,.78);
          text-align:right;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          max-width: 64%;
        }

        .nf-actions{
          margin-top: 18px;
          display:flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .nf-btn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding: 12px 18px;
          border-radius: 999px;
          font-weight: 850;
          font-size: 14px;
          letter-spacing: .01em;
          border: 1px solid rgba(0,0,0,.10);
          background: transparent;
          color: var(--black);
          cursor: pointer;
          text-decoration: none;
          transition: transform .16s ease, box-shadow .16s ease, background .16s ease, border-color .16s ease;
          user-select:none;
        }

        .nf-btn:hover{
          transform: translateY(-2px);
          box-shadow: 0 26px 70px rgba(0,0,0,.10);
        }

        .nf-btn.primary{
          background: linear-gradient(180deg, var(--red2), var(--red));
          color: #fff;
          border-color: rgba(255,255,255,.18);
          box-shadow: 0 22px 60px rgba(193,18,31,.28), inset 0 1px 0 rgba(255,255,255,.22);
        }

        .nf-btn.glass{
          background: rgba(255,255,255,.78);
          backdrop-filter: blur(14px);
        }

        .nf-btn.ghost{
          border-color: rgba(193,18,31,.20);
          background: rgba(193,18,31,.06);
        }

        .nf-links{
          margin-top: 18px;
          display:flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .nf-links a{
          color: rgba(11,11,12,.70);
          text-decoration:none;
          font-weight: 750;
          font-size: 13px;
          border-bottom: 1px solid transparent;
          transition: border-color .15s ease, color .15s ease;
        }
        .nf-links a:hover{
          color: var(--black);
          border-color: rgba(193,18,31,.40);
        }

        /* RIGHT CARD */
        .nf-card{
          border-radius: 28px;
          background: rgba(11,11,12,.92);
          color: #fff;
          border: 1px solid rgba(255,255,255,.10);
          box-shadow: 0 44px 120px rgba(0,0,0,.18);
          overflow:hidden;
          position: relative;
        }

        .nf-card::after{
          content:"";
          position:absolute;
          inset:-160px -160px auto auto;
          width: 360px;
          height: 360px;
          background: radial-gradient(circle, rgba(193,18,31,.22), transparent 62%);
          pointer-events:none;
        }

        .nf-card-top{
          display:flex;
          align-items:center;
          gap: 10px;
          padding: 18px 18px 0;
          position: relative;
          z-index: 1;
        }

        .nf-dot{
          width:10px;
          height:10px;
          border-radius: 999px;
          background: var(--red2);
          box-shadow: 0 0 0 8px rgba(255,59,48,.18);
        }

        .nf-card-title{
          font-size: 12px;
          letter-spacing: .22em;
          text-transform: uppercase;
          font-weight: 900;
          color: rgba(255,255,255,.75);
        }

        .nf-visual{
          margin: 16px;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,.10);
          background:
            radial-gradient(900px 420px at 20% 0%, rgba(255,255,255,.10), transparent 60%),
            linear-gradient(180deg, rgba(255,59,48,.08), rgba(255,255,255,0));
          padding: 18px;
          position: relative;
          z-index: 1;
          overflow:hidden;
        }

        .nf-stroke{
          position:absolute;
          left:-30%;
          right:-30%;
          height: 1px;
          background: rgba(255,255,255,.10);
          transform: rotate(-12deg);
        }
        .nf-stroke.s1{ top: 18%; }
        .nf-stroke.s2{ top: 36%; }
        .nf-stroke.s3{ top: 54%; }
        .nf-stroke.s4{ top: 72%; }

        .nf-badge{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,.14);
          background: rgba(255,255,255,.06);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .06em;
        }

        .nf-code{
          margin-top: 14px;
          display:flex;
          flex-direction: column;
          gap: 10px;
        }
        .nf-code-row{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 16px;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.10);
          font-size: 13px;
          color: rgba(255,255,255,.78);
        }
        .nf-code-row span:first-child{
          font-size: 11px;
          letter-spacing: .18em;
          text-transform: uppercase;
          font-weight: 900;
          color: rgba(255,255,255,.62);
        }
        .ok{
          color: rgba(255,255,255,.88);
          font-weight: 900;
        }

        .nf-card-foot{
          padding: 0 18px 18px;
          color: rgba(255,255,255,.65);
          font-size: 12px;
          line-height: 1.6;
          position: relative;
          z-index: 1;
        }

        /* RESPONSIVE */
        @media (max-width: 980px){
          .nf-grid{ grid-template-columns: 1fr; }
          .nf-title{ font-size: 46px; }
        }
        @media (max-width: 520px){
          .nf-root{ padding: 110px 14px 50px; }
          .nf-title{ font-size: 38px; }
          .nf-path-value{ max-width: 58%; }
        }

        @media (prefers-reduced-motion: reduce){
          .nf-btn{ transition:none; }
        }
      `}</style>
    </>
  );
}

export default NotFoundPage;
