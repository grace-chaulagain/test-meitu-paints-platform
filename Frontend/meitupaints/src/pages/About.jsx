// About.jsx (updated copy — same layout/design, Meitu-specific content integrated)
import React, { useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
import { Link, useLocation } from "react-router-dom";

function About() {
  const pageRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.key]);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const els = root.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("is-in")
        ),
      { threshold: 0.12 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <NavBar />

      <main ref={pageRef} className="about-root">
        {/* HERO */}
        <header className="about-hero">
          <div className="hero-ambient" aria-hidden="true" />
          <div className="hero-shell" data-reveal>
            <span className="eyebrow">MEITU PAINTS • KATHMANDU</span>

            <h1 className="hero-title">
              Innovation-led coatings,
              <br />
              <span className="accent">
                engineered for Nepal’s real climate.
              </span>
            </h1>

            <p className="hero-sub">
              Meitu Construction Materials is a high-tech company manufacturing
              interior and exterior wall paints, wall putty, Granite Paints
              (2D), granite imitation stone paints (3D), floor paints, enamel,
              and supporting tools. We adopt China–German technology and follow
              the philosophy of{" "}
              <span className="quote">
                “Bringing new innovations and moving forward together.”
              </span>{" "}
              Our products are high-quality, eco-friendly, safe, and weather
              resistant and we help customers choose the right system with the
              right service. Our office is located in Bhimsengola, Kathmandu.
            </p>

            <div className="hero-cta" data-reveal></div>

            <div className="hero-metrics" data-reveal>
              {[
                { k: "Technology", v: "China–German" },
                { k: "Eco Friendly", v: "Low-odor" },
                { k: "Weather", v: "Resistant" },
                { k: "Location", v: "Bhimsengola" },
              ].map((m) => (
                <div key={m.k} className="metric">
                  <div className="metric-v">{m.v}</div>
                  <div className="metric-k">{m.k}</div>
                </div>
              ))}
            </div>

            {/* Inline editorial nav (Apple style, not blue links) */}
            <div className="hero-inline" data-reveal>
              <span className="inline-label">Explore:</span>
              <Link to="/dealership" className="inline-action">
                Dealership <span className="inline-arrow">→</span>
              </Link>
              <span className="dot" aria-hidden="true" />
              <Link to="/products" className="inline-action">
                Products <span className="inline-arrow">→</span>
              </Link>
              <span className="dot" aria-hidden="true" />
              <Link to="/support" className="inline-action">
                Support <span className="inline-arrow">→</span>
              </Link>
            </div>
          </div>
        </header>

        {/* SECTION DIVIDER */}
        <section className="section-divider" aria-hidden="true">
          <span className="divider-line" />
        </section>

        {/* STORY (now tied to your actual range) */}
        <section className="about-section">
          <div className="container">
            <div className="section-head" data-reveal>
              <h2 className="section-title">Built as a complete wall system</h2>
              <p className="section-sub">
                Meitu isn’t “just paint.” We manufacture the layers that make a
                finish last from putty and primers to interior, exterior,
                granite textures, enamels, and floor coatings. The goal is
                predictable performance: adhesion, smoothness, cleanability,
                durability, and consistent color under real light.
              </p>
            </div>
          </div>
        </section>

        {/* STRATEGIC PANEL: Vision / Mission (fits your existing dark strip vibe) */}
        <section className="about-strip">
          <div className="strip-ambient" aria-hidden="true" />
          <div className="strip-shell" data-reveal>
            <div className="strip-left">
              <span className="eyebrow">VISION</span>
              <h2>Lead Nepal in innovative, sustainable paint solutions.</h2>
              <p>
                To be the leader of Nepal in innovative, sustainable, and
                high-quality paint solutions transforming spaces and enriching
                lives with vibrant colors and exceptional durability. We strive
                to inspire creativity, foster environmental responsibility, and
                deliver unparalleled customer satisfaction through continuous
                innovation and excellence in every can of paint.
              </p>

              <div className="strip-actions">
                <Link to="/ratecalculator" className="pill solid">
                  Estimate Cost <span className="btn-arrow">→</span>
                </Link>
                <Link to="/products" className="pill glass on-dark">
                  Explore Products <span className="btn-arrow">→</span>
                </Link>
              </div>
            </div>

            <div className="strip-right">
              <div className="img-card">
                <img
                  src="About Us Image.webp"
                  alt="Meitu Paints — premium finish texture (placeholder)"
                />
                <div className="img-badge">
                  Quiet premium. Strong durability.
                </div>
              </div>

              {/* Mission block as a compact dark card */}
              <div className="mission-card" data-reveal>
                <span className="mission-eyebrow">MISSION</span>
                <p className="mission-text">
                  Our mission is to provide superior paint products that meet
                  the diverse needs of our customers, combining China–German
                  technology with environmentally friendly practices. We are
                  committed to delivering exceptional quality, fostering
                  creativity, and ensuring customer satisfaction by continually
                  innovating and adhering to the highest standards of integrity
                  and service.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* NAV FOOTER CTA (keep, just make copy Meitu-specific) */}
        <section className="about-final">
          <div className="final-ambient" aria-hidden="true" />
          <div className="final-shell" data-reveal>
            <h2>Ready to start your next paint project?</h2>
            <p>
              From Bhimsengola to sites across Nepal Meitu supports homeowners,
              contractors, and dealers with eco-friendly systems, reliable
              performance, and guidance to match the right product to the right
              surface.
            </p>

            <div className="final-actions">
              <Link to="/dealership" className="pill solid">
                Become a Dealer <span className="btn-arrow">→</span>
              </Link>
              <Link to="/support" className="pill glass on-dark">
                Support <span className="btn-arrow">→</span>
              </Link>
              <Link to="/products" className="pill ghost on-dark">
                Browse Products <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>{/* ================= STYLES ================= */}
      <style>{`
        :root{
          --red:#c1121f;
          --red2:#e11d2e;
          --black:#0b0b0c;
          --ink70:rgba(11,11,12,.70);
          --ink55:rgba(11,11,12,.55);
          --glass:rgba(255,255,255,.86);
          --glass2:rgba(255,255,255,.72);
          --shadow: 0 50px 120px rgba(0,0,0,.14);

          /* Motion tokens */
          --ease-out: cubic-bezier(.22,.61,.36,1);
          --ease-in: cubic-bezier(.4,0,.2,1);
          --hover-lift: translateY(-2px);
          --press: translateY(1px);
        }

        .about-root{
          padding-top:76px;
          background:
            radial-gradient(1200px 700px at 20% 0%, rgba(193,18,31,.10), transparent 55%),
            radial-gradient(900px 700px at 85% 18%, rgba(193,18,31,.08), transparent 55%),
            #fff;
        }

        /* Reveal */
        [data-reveal]{
          opacity:0;
          transform:translateY(14px);
          transition:opacity .75s var(--ease-out), transform .75s var(--ease-out);
          will-change:transform, opacity;
        }
        .is-in{ opacity:1; transform:translateY(0); }

        /* HERO */
        .about-hero{
          position:relative;
          padding:110px 24px 60px;
          overflow:hidden;
        }
        .hero-ambient{
          position:absolute;
          inset:-140px -120px auto -120px;
          height:520px;
          background:
            radial-gradient(closest-side at 50% 45%, rgba(193,18,31,.18), transparent 72%),
            radial-gradient(closest-side at 20% 40%, rgba(225,29,46,.12), transparent 68%);
          filter: blur(10px);
          pointer-events:none;
        }
        .hero-shell{
          position:relative;
          max-width:1000px;
          margin:0 auto;
          text-align:center;
        }

        .quote{
          font-weight:780;
          color:rgba(11,11,12,.80);
        }

        .eyebrow{
          display:inline-block;
          font-size:25px;
          letter-spacing:.34em;
          color:var(--red);
          font-weight:850;
        }

        .hero-title{
          margin:22px 0 14px;
          font-size:54px;
          font-weight:880;
          letter-spacing:-.04em;
          color:var(--black);
          line-height:1.06;
        }
        .accent{ color:var(--red); }

        .hero-sub{
          margin:0 auto;
          max-width:900px;
          font-size:18px;
          color:var(--ink70);
          line-height:1.75;
        }

        .hero-cta{
          margin-top:26px;
          display:flex;
          justify-content:center;
          gap:12px;
          flex-wrap:wrap;
        }

        /* ===== Apple-grade Buttons / Pills ===== */
        .pill{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:10px;
          padding:14px 34px;
          border-radius:999px;
          font-weight:760;
          font-size:14px;
          text-decoration:none;
          letter-spacing:.01em;
          user-select:none;
          transform:translateZ(0);
          transition:
            transform .18s var(--ease-out),
            box-shadow .18s var(--ease-out),
            background .18s var(--ease-out),
            border-color .18s var(--ease-out),
            filter .18s var(--ease-out);
          position:relative;
          isolation:isolate;
        }

        .pill::before{
          content:"";
          position:absolute;
          inset:0;
          border-radius:inherit;
          background:radial-gradient(120px 60px at 30% 25%, rgba(255,255,255,.28), transparent 60%);
          opacity:.0;
          transition:opacity .2s var(--ease-out);
          z-index:-1;
        }
        .pill:hover::before{ opacity:1; }

        .btn-arrow{
          display:inline-block;
          transform:translateX(0);
          transition:transform .22s var(--ease-out);
          font-size:16px;
          line-height:1;
        }
        .pill:hover .btn-arrow{ transform:translateX(4px); }
        .pill:active{ transform:var(--press); filter:saturate(1.05); }

        .pill.solid{
          background:linear-gradient(180deg, var(--red2), var(--red));
          color:#fff;
          box-shadow:0 22px 60px rgba(193,18,31,.35), inset 0 1px 0 rgba(255,255,255,.22);
          border:1px solid rgba(255,255,255,.20);
        }
        .pill.solid:hover{
          transform:var(--hover-lift);
          box-shadow:0 28px 80px rgba(193,18,31,.42), inset 0 1px 0 rgba(255,255,255,.28);
        }

        .pill.glass{
          background:rgba(255,255,255,.78);
          border:1px solid rgba(0,0,0,.10);
          color:var(--black);
          backdrop-filter: blur(14px);
          box-shadow:0 20px 55px rgba(0,0,0,.10);
        }
        .pill.glass:hover{ transform:var(--hover-lift); box-shadow:0 28px 80px rgba(0,0,0,.14); }

        .pill.ghost{
          background:rgba(255,255,255,.0);
          border:1px solid rgba(0,0,0,.18);
          color:var(--black);
        }
        .pill.ghost:hover{
          transform:var(--hover-lift);
          border-color:rgba(193,18,31,.28);
          box-shadow:0 28px 80px rgba(0,0,0,.10);
        }

        .pill.on-dark{
          color:#fff;
          border-color:rgba(255,255,255,.20);
        }
        .pill.glass.on-dark{
          background:rgba(255,255,255,.12);
          border:1px solid rgba(255,255,255,.22);
          box-shadow:0 24px 70px rgba(0,0,0,.25);
        }

        /* Focus-visible */
        .pill:focus-visible,
        .inline-action:focus-visible{
          outline:none;
          box-shadow:0 0 0 4px rgba(193,18,31,.18), 0 0 0 1px rgba(193,18,31,.55);
        }

        /* Metrics */
        .hero-metrics{
          margin:34px auto 0;
          display:grid;
          grid-template-columns:repeat(4, 1fr);
          gap:14px;
          max-width:880px;
        }
        .metric{
          background:rgba(255,255,255,.65);
          border:1px solid rgba(0,0,0,.06);
          border-radius:18px;
          padding:16px 14px;
          box-shadow:0 22px 50px rgba(0,0,0,.06);
          backdrop-filter: blur(14px);
        }
        .metric-v{
          font-size:16px;
          font-weight:860;
          letter-spacing:-.02em;
          color:var(--black);
          line-height:1.2;
        }
        .metric-k{
          margin-top:6px;
          font-size:12px;
          letter-spacing:.14em;
          text-transform:uppercase;
          color:var(--ink55);
          font-weight:820;
        }

        /* Inline links */
        .hero-inline{
          margin-top:18px;
          display:flex;
          justify-content:center;
          align-items:center;
          gap:10px;
          flex-wrap:wrap;
          color:var(--ink55);
          font-size:14px;
        }
        .inline-label{
          font-weight:750;
          letter-spacing:.08em;
          text-transform:uppercase;
          font-size:11px;
          color:rgba(11,11,12,.55);
        }
        .dot{
          width:4px; height:4px; border-radius:999px;
          background:rgba(11,11,12,.25);
        }
        .inline-action{
          display:inline-flex;
          align-items:center;
          gap:8px;
          font-size:14px;
          font-weight:700;
          color:var(--red);
          text-decoration:none;
          letter-spacing:.01em;
          position:relative;
          transition:color .25s var(--ease-out);
        }
        .inline-action::after{
          content:"";
          position:absolute;
          left:0;
          bottom:-4px;
          width:100%;
          height:1px;
          background:linear-gradient(90deg, rgba(193,18,31,0), rgba(193,18,31,.45), rgba(193,18,31,0));
          transform:scaleX(0);
          transition:transform .28s var(--ease-out);
        }
        .inline-action:hover{ color:var(--red2); }
        .inline-action:hover::after{ transform:scaleX(1); }
        .inline-arrow{
          display:inline-block;
          font-size:16px;
          transform:translateX(0);
          transition:transform .25s var(--ease-out);
        }
        .inline-action:hover .inline-arrow{ transform:translateX(4px); }

        /* Divider */
        .section-divider{ padding:0 24px 0; }
        .divider-line{
          display:block;
          height:1px;
          max-width:1100px;
          margin:0 auto;
          background:linear-gradient(
            90deg,
            rgba(0,0,0,0),
            rgba(0,0,0,.10),
            rgba(193,18,31,.14),
            rgba(0,0,0,.10),
            rgba(0,0,0,0)
          );
        }

        /* Shared */
        .container{ max-width:1200px; margin:0 auto; }
        .about-section{ padding:92px 24px; }
        .section-head{
          text-align:center;
          max-width:900px;
          margin:0 auto 18px;
        }
        .section-title{
          font-size:40px;
          font-weight:820;
          letter-spacing:-.03em;
          color:var(--black);
          margin:0;
        }
        .section-sub{
          color:var(--ink70);
          margin-top:12px;
          font-size:16px;
          line-height:1.7;
        }

        /* Cards */
        .story-grid{
          margin-top:34px;
          display:grid;
          grid-template-columns:repeat(3, 1fr);
          gap:18px;
        }
        .glass-card{
          background:var(--glass);
          border:1px solid rgba(0,0,0,.06);
          border-radius:26px;
          padding:34px;
          box-shadow:var(--shadow);
          backdrop-filter: blur(18px);
          position:relative;
          overflow:hidden;
          transition:transform .22s var(--ease-out), box-shadow .22s var(--ease-out);
        }
        .glass-card::before{
          content:"";
          position:absolute;
          inset:-80px -100px auto auto;
          width:240px;
          height:240px;
          background:radial-gradient(circle, rgba(193,18,31,.12), transparent 62%);
          filter: blur(2px);
          pointer-events:none;
        }
        .glass-card:hover{
          transform:translateY(-4px);
          box-shadow:0 60px 140px rgba(0,0,0,.16);
        }
        .icon-chip{
          width:44px; height:44px;
          border-radius:14px;
          display:flex; align-items:center; justify-content:center;
          background:linear-gradient(180deg, rgba(193,18,31,.18), rgba(193,18,31,.06));
          border:1px solid rgba(193,18,31,.18);
          box-shadow:0 20px 44px rgba(193,18,31,.14);
          margin-bottom:14px;
          font-size:18px;
        }
        .glass-card h3{
          font-size:18px;
          font-weight:850;
          letter-spacing:-.02em;
          margin:0 0 10px;
          color:var(--black);
        }
        .glass-card p{
          margin:0 0 14px;
          color:var(--ink70);
          line-height:1.7;
        }

        /* Strip */
        .about-strip{
          position:relative;
          padding:92px 24px;
          color:#fff;
          overflow:hidden;
          background:linear-gradient(180deg, rgba(193,18,31,.14), rgba(11,11,12,.94));
        }
        .strip-ambient{
          position:absolute;
          inset:-160px -120px auto -120px;
          height:520px;
          background:
            radial-gradient(closest-side at 50% 40%, rgba(193,18,31,.30), transparent 70%),
            radial-gradient(closest-side at 70% 55%, rgba(193,18,31,.18), transparent 66%);
          filter: blur(10px);
          pointer-events:none;
        }
        .strip-shell{
          position:relative;
          max-width:1200px;
          margin:0 auto;
          display:grid;
          grid-template-columns:1.05fr .95fr;
          gap:18px;
          align-items:start;
        }
        .strip-left h2{
          margin:12px 0 10px;
          font-size:44px;
          letter-spacing:-.03em;
          font-weight:880;
        }
        .strip-left p{
          margin:0;
          color:rgba(255,255,255,.74);
          line-height:1.7;
          max-width:640px;
        }
        .strip-actions{
          margin-top:18px;
          display:flex;
          gap:12px;
          flex-wrap:wrap;
        }

        .img-card{
          border-radius:28px;
          overflow:hidden;
          border:1px solid rgba(255,255,255,.10);
          box-shadow:0 44px 120px rgba(0,0,0,.22);
          position:relative;
          transform:translateZ(0);
        }
        .img-card img{
          width:100%;
          height:320px;
          object-fit:cover;
          transform:scale(1.02);
          transition:transform 1.2s var(--ease-out);
          display:block;
        }
        .img-card:hover img{ transform:scale(1.06); }
        .img-badge{
          position:absolute;
          left:18px;
          bottom:18px;
          padding:10px 18px;
          border-radius:999px;
          background:rgba(255,255,255,.14);
          border:1px solid rgba(255,255,255,.18);
          backdrop-filter: blur(12px);
          font-weight:750;
          font-size:13px;
        }

        .mission-card{
          margin-top:14px;
          border-radius:24px;
          border:1px solid rgba(255,255,255,.14);
          background:rgba(255,255,255,.08);
          backdrop-filter: blur(14px);
          padding:18px 18px 18px;
          box-shadow:0 34px 90px rgba(0,0,0,.20);
        }
        .mission-eyebrow{
          display:inline-block;
          font-size:20px;
          letter-spacing:.34em;
          text-transform:uppercase;
          font-weight:850;
          color:rgba(255,255,255,.75);
          margin-bottom:10px;
        }
        .mission-text{
          margin:0;
          color:rgba(255,255,255,.76);
          line-height:1.7;
          font-size:14px;
        }

        /* Product list grid (new, but matches your glass/Apple tone) */
        .productlist-grid{
          margin-top:34px;
          display:grid;
          grid-template-columns:repeat(2, 1fr);
          gap:14px;
        }
        .plist-card{
          background:rgba(255,255,255,.86);
          border:1px solid rgba(0,0,0,.06);
          border-radius:26px;
          padding:22px 22px 20px;
          box-shadow:0 34px 90px rgba(0,0,0,.10);
          position:relative;
          overflow:hidden;
          transition:transform .22s var(--ease-out), box-shadow .22s var(--ease-out);
        }
        .plist-card::before{
          content:"";
          position:absolute;
          inset:-90px -110px auto auto;
          width:260px;
          height:260px;
          background:radial-gradient(circle, rgba(193,18,31,.12), transparent 62%);
          pointer-events:none;
        }
        .plist-card:hover{
          transform:translateY(-3px);
          box-shadow:0 54px 130px rgba(0,0,0,.14);
        }

        .plist-top{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:12px;
          margin-bottom:12px;
        }
        .plist-title{
          font-weight:900;
          letter-spacing:-.02em;
          color:var(--black);
          line-height:1.2;
          font-size:16px;
        }
        .plist-tag{
          white-space:nowrap;
          font-size:11px;
          font-weight:850;
          letter-spacing:.12em;
          text-transform:uppercase;
          color:rgba(11,11,12,.55);
          border:1px solid rgba(0,0,0,.08);
          background:rgba(0,0,0,.03);
          padding:7px 10px;
          border-radius:999px;
        }

        .plist-bullets{
          margin:0 0 12px;
          padding-left:18px;
          color:var(--ink70);
          line-height:1.75;
          font-size:14px;
        }
        .plist-bullets li{ margin:6px 0; }

        /* Center actions already exist in your sheet, reused */
        .center-actions{
          margin-top:22px;
          display:flex;
          justify-content:center;
          gap:12px;
          flex-wrap:wrap;
        }

        /* Final */
        .about-final{
          position:relative;
          padding:92px 24px;
          text-align:center;
          color:#fff;
          overflow:hidden;
          background:linear-gradient(180deg, rgba(193,18,31,.10), rgba(11,11,12,.96));
        }
        .final-ambient{
          position:absolute;
          inset:-160px -120px auto -120px;
          height:520px;
          background:
            radial-gradient(closest-side at 50% 40%, rgba(193,18,31,.26), transparent 70%),
            radial-gradient(closest-side at 70% 55%, rgba(193,18,31,.16), transparent 66%);
          filter: blur(10px);
          pointer-events:none;
        }
        .final-shell{
          position:relative;
          max-width:900px;
          margin:0 auto;
        }
        .final-shell h2{
          margin:0 0 12px;
          font-size:44px;
          font-weight:880;
          letter-spacing:-.03em;
        }
        .final-shell p{
          margin:0 auto;
          max-width:760px;
          color:rgba(255,255,255,.72);
          line-height:1.7;
          font-size:16px;
        }
        .final-actions{
          margin-top:22px;
          display:flex;
          justify-content:center;
          gap:12px;
          flex-wrap:wrap;
        }

        /* Responsive */
        @media(max-width:1100px){
          .hero-title{ font-size:44px; }
          .section-title{ font-size:34px; }
          .hero-metrics{ grid-template-columns:repeat(2,1fr); }
          .story-grid{ grid-template-columns:1fr; }
          .strip-shell{ grid-template-columns:1fr; }
          .productlist-grid{ grid-template-columns:1fr; }
          .img-card img{ height:300px; }
        }
        @media(max-width:768px){
          .about-root{ padding-top:72px; }
          .hero-title{ font-size:36px; }
          .hero-sub{ font-size:16px; }
          .strip-left h2{ font-size:34px; }
          .final-shell h2{ font-size:34px; }
        }

        @media (prefers-reduced-motion: reduce){
          [data-reveal]{ transition:none; transform:none; opacity:1; }
          .pill, .inline-action, .glass-card, .plist-card, .img-card img{
            transition:none !important;
          }
          .pill:hover, .glass-card:hover, .plist-card:hover{ transform:none; }
        }
      `}</style>
    </>
  );
}

export default About;
