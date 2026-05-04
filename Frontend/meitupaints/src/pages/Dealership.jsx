import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function DealershipPage() {
  const location = useLocation();

  // (stats, faq, openFAQ removed)
  // Always start at the top when arriving on this page (route enter / reload)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.key]);

  useEffect(() => {
    // Smooth fade-up reveal for all marked elements (Apple-clean)
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    // Ensure a deterministic stagger order
    els.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 70, 560)}ms`;
    });

    // Trigger on next frame to ensure initial styles are applied
    const raf = requestAnimationFrame(() => {
      els.forEach((el) => el.classList.add("reveal-in"));
    });

    return () => {
      cancelAnimationFrame(raf);
      els.forEach((el) => {
        el.classList.remove("reveal-in");
        el.style.transitionDelay = "";
      });
    };
  }, []);

  return (
    <>
      <NavBar />

      <section className="dealer-page">
        {/* Ambient (fixed, scroll-safe) */}
        <div className="dealer-ambient" aria-hidden="true">
          <div className="dealer-aurora a1" />
          <div className="dealer-aurora a2" />
          <div className="dealer-aurora a3" />
          <div className="dealer-grid" />
          <div className="dealer-noise" />
          <div className="dealer-vignette" />
        </div>

        {/* HERO */}
        <header className="dealer-hero">
          <div className="container dealer-shell">
            <div className="hero-top" data-reveal>
              <span className="hero-eyebrow">
                <span className="eyebrow-dot" aria-hidden="true" />
                Business Partnership
              </span>

              <div className="hero-links" data-reveal>
                <Link to="/products" className="link-pill">
                  Products <span aria-hidden="true">→</span>
                </Link>
                <Link to="/colors" className="link-pill ghost">
                  Shade Library <span aria-hidden="true">→</span>
                </Link>
                <Link to="/support" className="link-pill ghost">
                  Support <span aria-hidden="true">→</span>
                </Link>
                <Link to="/about" className="link-pill ghost">
                  About <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <div className="hero-grid">
              {/* Left narrative */}
              <div className="hero-copy" data-reveal>
                <h1 className="hero-title">
                  Build Your Business <br />
                  with <span className="hero-accent">Meitu Paints</span>
                </h1>

                <p className="hero-sub">
                  Join a growing national network of dealers delivering premium
                  paint systems trusted by professionals, architects, and
                  homeowners. We align on quality, service, and long-term growth
                  not short-term volume.
                </p>

                <div className="hero-cta">
                  <Link to="/dealership/register" className="primary-action">
                    <span className="btn-shine" aria-hidden="true" />
                    <span className="btn-content">
                      Apply for Dealership <span className="btn-arrow">→</span>
                    </span>
                  </Link>

                  <Link to="/inquiry" className="secondary-action">
                    Talk to Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* VALUE + PROCESS */}
        <section className="dealer-section">
          <div className="container">
            <div className="process-wrap" data-reveal>
              <div className="process-head">
                <h3>Dealer onboarding, simplified</h3>
                <p>
                  A clean path from application to activation designed to
                  minimize uncertainty and maximize clarity.
                </p>
              </div>

              <div className="process-grid">
                {[
                  ["1", "Apply", "Submit your details and location."],
                  ["2", "Review", "Territory evaluation + documentation."],
                  ["3", "Onboard", "Training + product system guidance."],
                  ["4", "Launch", "Dealer setup + activation support."],
                ].map(([n, t, d]) => (
                  <div className="step" key={n}>
                    <div className="step-n">{n}</div>
                    <div className="step-t">{t}</div>
                    <div className="step-d">{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* REQUIREMENTS + CTA STRIP */}
        <section className="dealer-section soft">
          <div className="container">
            <div className="split-grid">
              <div className="split-card" data-reveal>
                <h3>What we look for</h3>
                <p className="muted">
                  We keep the criteria realistic focused on service ability,
                  local reach, and long-term partnership.
                </p>

                <ul className="checklist">
                  <li>Local market presence and basic infrastructure</li>
                  <li>Commitment to customer service and consultation</li>
                  <li>Ability to stock core products reliably</li>
                  <li>Willingness to follow system-based selling</li>
                  <li>Interest in growth, not discount wars</li>
                </ul>

                <div className="mini-strip">
                  <div className="mini-strip-title">Not sure yet?</div>
                  <div className="mini-strip-sub">
                    Talk to our team and we’ll guide you based on your location.
                  </div>
                  <div className="mini-strip-actions">
                    <Link to="/inquiry" className="secondary-action">
                      Contact Team
                    </Link>
                    <Link to="/dealership/register" className="primary-action">
                      Apply Now <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="split-card" data-reveal>
                <h3>Why customers choose Meitu</h3>
                <p className="muted">
                  This is the story you’ll sell performance, finish, and
                  confidence.
                </p>

                <div className="feature-cards">
                  {[
                    ["Low-VOC options", "Health-conscious formulations."],
                    ["Coverage efficiency", "Less waste, better output."],
                    ["Finish consistency", "Reliable results across walls."],
                    ["Climate durability", "Monsoon + UV aware systems."],
                  ].map(([t, d]) => (
                    <div className="mini-feature" key={t}>
                      <div className="mini-feature-top">
                        <span className="mini-dot" aria-hidden="true" />
                        {t}
                      </div>
                      <div className="mini-feature-desc">{d}</div>
                    </div>
                  ))}
                </div>

                <div className="cta-strip" data-reveal>
                  <div>
                    <div className="cta-strip-title">
                      Want to explore the catalog?
                    </div>
                    <div className="cta-strip-sub">
                      Review product systems and shade options.
                    </div>
                  </div>
                  <div className="cta-strip-actions">
                    <Link to="/products" className="secondary-action on-dark">
                      Products
                    </Link>
                    <Link to="/colors" className="secondary-action on-dark">
                      Shades
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </section><style>{`
        /* Reveal (fade-up) – used across the page */
        [data-reveal]{
          opacity: 0;
          transform: translateY(14px);
          will-change: opacity, transform;
        }

        [data-reveal].reveal-in{
          opacity: 1;
          transform: translateY(0);
          transition:
            opacity 760ms var(--easeOut),
            transform 760ms var(--easeOut);
        }
        :root{
          --red:#c1121f;
          --red2:#e11d2e;
          --black:#0b0b0c;

          --ink70:rgba(11,11,12,.7);
          --ink55:rgba(11,11,12,.55);
          --line:rgba(0,0,0,.10);

          --glass:rgba(255,255,255,.74);
          --shadow1: 0 28px 60px rgba(0,0,0,.12);
          --shadow2: 0 40px 110px rgba(0,0,0,.18);

          --easeOut:cubic-bezier(.22,.61,.36,1);
        }

        /* scroll-safe global */
        html, body{ height:auto; }
        body{ overflow-x:hidden; }

        .dealer-page .container{ max-width:1200px; }

        /* Ambient */
        .dealer-page{
          position:relative;
          isolation:isolate;
          overflow:visible;
          background:#fff;
        }

        .dealer-ambient{
          position:fixed;
          inset:0;
          z-index:0;
          pointer-events:none;
        }

        .dealer-aurora{
          position:absolute;
          width:760px;
          height:540px;
          border-radius:999px;
          filter: blur(48px);
          opacity:.55;
          mix-blend-mode:multiply;
          transform: translate3d(0,0,0);
        }

        .dealer-aurora.a1{
          left:-160px; top:-160px;
          background:
            radial-gradient(circle at 30% 30%, rgba(225,29,46,.36), transparent 60%),
            radial-gradient(circle at 70% 70%, rgba(193,18,31,.28), transparent 62%);
          animation: float1 10s var(--easeOut) infinite alternate;
        }

        .dealer-aurora.a2{
          right:-220px; top:90px;
          background:
            radial-gradient(circle at 30% 30%, rgba(0,0,0,.14), transparent 62%),
            radial-gradient(circle at 70% 70%, rgba(193,18,31,.22), transparent 64%);
          animation: float2 12s var(--easeOut) infinite alternate;
        }

        .dealer-aurora.a3{
          left:18%; bottom:-300px;
          width:860px; height:620px;
          background:
            radial-gradient(circle at 30% 30%, rgba(193,18,31,.18), transparent 65%),
            radial-gradient(circle at 70% 70%, rgba(0,0,0,.10), transparent 65%);
          animation: float3 14s var(--easeOut) infinite alternate;
        }

        .dealer-grid{
          position:absolute;
          inset:-2px;
          background:
            linear-gradient(to right, rgba(0,0,0,.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,.06) 1px, transparent 1px);
          background-size:78px 78px;
          opacity:.08;
          mask-image: radial-gradient(closest-side at 50% 10%, #000 42%, transparent 75%);
        }

        .dealer-noise{
          position:absolute;
          inset:0;
          opacity:.06;
          background-image:url("noisetexture/2.svg");
          background-size: 420px 420px;
          mix-blend-mode:multiply;
        }

        .dealer-vignette{
          position:absolute;
          inset:-2px;
          background: radial-gradient(closest-side at 50% 10%, transparent 45%, rgba(0,0,0,.06) 92%);
          opacity:.9;
        }

        @keyframes float1{
          from{ transform: translate3d(0,0,0) scale(1); }
          to{ transform: translate3d(34px, 18px,0) scale(1.05); }
        }
        @keyframes float2{
          from{ transform: translate3d(0,0,0) scale(1); }
          to{ transform: translate3d(-26px, 24px,0) scale(1.04); }
        }
        @keyframes float3{
          from{ transform: translate3d(0,0,0) scale(1); }
          to{ transform: translate3d(22px, -18px,0) scale(1.03); }
        }

        /* Hero */
        .dealer-hero{
          position:relative;
          z-index:2;
          padding:110px 24px 50px;
          background:
            radial-gradient(900px 420px at 15% 10%, rgba(193,18,31,.10), transparent 60%),
            radial-gradient(700px 420px at 85% 30%, rgba(0,0,0,.06), transparent 55%),
            transparent;
        }

        .dealer-shell{ position:relative; }

        .hero-top{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:18px;
          flex-wrap:wrap;
          margin-bottom:28px;
        }

        .hero-eyebrow{
          display:inline-flex;
          align-items:center;
          gap:10px;
          padding:10px 16px;
          border-radius:999px;
          border:1px solid rgba(193,18,31,.35);
          background:rgba(255,255,255,.60);
          backdrop-filter: blur(14px);
          font-size:12px;
          font-weight:800;
          letter-spacing:.18em;
          text-transform:uppercase;
          color:var(--red);
          box-shadow:0 18px 44px rgba(0,0,0,.10);
        }

        .eyebrow-dot{
          width:8px;height:8px;border-radius:999px;
          background: linear-gradient(180deg, var(--red2), var(--red));
          box-shadow:0 0 0 6px rgba(193,18,31,.12);
        }

        .hero-links{
          display:flex;
          gap:12px;
          flex-wrap:wrap;
        }

        .link-pill{
          display:inline-flex;
          align-items:center;
          gap:10px;
          padding:12px 18px;
          border-radius:999px;
          border:1px solid rgba(0,0,0,.12);
          background:rgba(255,255,255,.78);
          backdrop-filter: blur(14px);
          text-decoration:none;
          color:var(--black);
          font-weight:750;
          transition: transform 160ms var(--easeOut), box-shadow 160ms ease, border-color 160ms ease;
          box-shadow:0 18px 46px rgba(0,0,0,.10);
        }

        .link-pill:hover{
          transform: translateY(-1px);
          box-shadow:0 26px 70px rgba(0,0,0,.14);
          border-color: rgba(193,18,31,.18);
        }

        .link-pill.ghost{ background: rgba(255,255,255,.55); }

        .hero-grid{
          display:grid;
          grid-template-columns: 1.15fr .85fr;
          gap:26px;
          align-items:stretch;
        }

        .hero-title{
          font-size:48px;
          font-weight:520;
          letter-spacing:-.7px;
          color:var(--black);
          margin:0;
          line-height:1.1;
        }

        .hero-accent{
          background: linear-gradient(180deg, var(--red2), var(--red));
          -webkit-background-clip:text;
          background-clip:text;
          color:transparent;
        }

        .hero-sub{
          margin-top:14px;
          font-size:17px;
          color:var(--ink70);
          line-height:1.75;
          max-width:720px;
        }

        .hero-cta{
          margin-top:20px;
          display:flex;
          gap:12px;
          flex-wrap:wrap;
          align-items:center;
        }

        .trust-row{
          margin-top:18px;
          display:flex;
          gap:10px;
          flex-wrap:wrap;
        }

        .trust-chip{
          display:inline-flex;
          align-items:center;
          gap:10px;
          padding:10px 14px;
          border-radius:999px;
          border:1px solid rgba(0,0,0,.10);
          background: rgba(255,255,255,.62);
          backdrop-filter: blur(14px);
          font-weight:750;
          font-size:12px;
          color: rgba(11,11,12,.78);
          box-shadow:0 14px 40px rgba(0,0,0,.10);
        }

        .chip-dot{
          width:8px;height:8px;border-radius:999px;
          background: var(--red);
          box-shadow:0 0 0 6px rgba(193,18,31,.10);
        }

        /* Shared "card" */
        .inq-card{
          background:rgba(255,255,255,.72);
          border-radius:28px;
          padding:38px;
          border:1px solid rgba(0,0,0,.08);
          box-shadow: var(--shadow1);
          backdrop-filter: blur(16px);
          position:relative;
          overflow:hidden;
        }
        .inq-card::before{
          content:"";
          position:absolute;
          inset:-120px -140px auto auto;
          width:240px;
          height:240px;
          background: radial-gradient(circle, rgba(193,18,31,.18), transparent 60%);
          filter: blur(2px);
          opacity:.9;
          pointer-events:none;
        }

        .panel-head{
          display:flex;
          align-items:flex-start;
          gap:14px;
          margin-bottom:18px;
        }

        .panel-icon{
          width:44px;height:44px;
          border-radius:14px;
          display:grid;
          place-items:center;
          color:var(--red);
          background: linear-gradient(180deg, rgba(193,18,31,.14), rgba(193,18,31,.06));
          border:1px solid rgba(193,18,31,.22);
          box-shadow:0 18px 44px rgba(193,18,31,.14);
          flex:0 0 auto;
        }
        .panel-svg{ width:22px;height:22px; }

        .panel-title{
          font-weight:800;
          letter-spacing:-.02em;
          color:var(--black);
        }

        .panel-sub{
          color:var(--ink55);
          margin-top:6px;
          font-size:13px;
          line-height:1.5;
        }

        .stats-grid{
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:12px;
          margin-top:10px;
        }

        .stat-card{
          background: rgba(255,255,255,.65);
          border:1px solid rgba(0,0,0,.08);
          border-radius:18px;
          padding:14px 14px;
          box-shadow:0 18px 46px rgba(0,0,0,.08);
        }

        .stat-val{
          font-size:18px;
          font-weight:860;
          color:var(--black);
          letter-spacing:-.02em;
        }

        .stat-key{
          margin-top:6px;
          font-size:12px;
          letter-spacing:.14em;
          text-transform:uppercase;
          color:var(--ink55);
          font-weight:800;
        }

        .panel-divider{
          height:1px;
          background: linear-gradient(to right, transparent, rgba(0,0,0,.14), transparent);
          margin:18px 0 14px;
        }

        .panel-note{
          font-size:14px;
          color:var(--ink70);
          line-height:1.65;
        }

        /* Sections */
        .dealer-section{
          position:relative;
          z-index:2;
          padding:70px 24px;
        }

        .dealer-section.soft{
          background: rgba(250,250,250,.60);
          backdrop-filter: blur(10px);
        }

        .section-head{
          text-align:center;
          max-width:820px;
          margin:0 auto 24px;
        }

        .section-title{
          font-size:38px;
          font-weight:520;
          letter-spacing:-.6px;
          color:var(--black);
          margin:0;
        }

        .section-sub{
          color:var(--ink70);
          margin-top:10px;
          font-size:16px;
          line-height:1.7;
        }

        .values-grid{
          max-width:1200px;
          margin:26px auto 0;
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:18px;
        }

        .value-card{
          background: rgba(255,255,255,.70);
          border:1px solid rgba(0,0,0,.08);
          border-radius:24px;
          padding:26px;
          box-shadow:0 20px 54px rgba(0,0,0,.12);
          backdrop-filter: blur(14px);
          transition: transform 160ms var(--easeOut), box-shadow 160ms ease, border-color 160ms ease;
        }

        .value-card:hover{
          transform: translateY(-2px);
          box-shadow:0 30px 78px rgba(0,0,0,.14);
          border-color: rgba(193,18,31,.12);
        }

        .value-top{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          margin-bottom:10px;
        }

        .value-card h4{
          font-size:16px;
          font-weight:800;
          color:var(--black);
          margin:0;
        }

        .value-tag{
          font-size:11px;
          font-weight:900;
          letter-spacing:.16em;
          text-transform:uppercase;
          color:var(--red);
          background: rgba(193,18,31,.08);
          border:1px solid rgba(193,18,31,.18);
          padding:8px 10px;
          border-radius:999px;
          white-space:nowrap;
        }

        .value-card p{
          font-size:14px;
          color:var(--ink70);
          line-height:1.7;
          margin:0;
        }

        /* Process */
        .process-wrap{
          margin-top:22px;
          max-width:1200px;
          margin-left:auto;
          margin-right:auto;
          background: rgba(11,11,12,.92);
          color:#fff;
          border-radius:28px;
          border:1px solid rgba(255,255,255,.10);
          padding:28px;
          box-shadow: var(--shadow2);
        }

        .process-head h3{
          margin:0;
          font-size:18px;
          font-weight:850;
          letter-spacing:-.02em;
        }

        .process-head p{
          margin:10px 0 0;
          color: rgba(255,255,255,.70);
          line-height:1.6;
          font-size:14px;
          max-width:780px;
        }

        .process-grid{
          margin-top:18px;
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:12px;
        }

        .step{
          background: rgba(255,255,255,.08);
          border:1px solid rgba(255,255,255,.10);
          border-radius:20px;
          padding:16px;
        }

        .step-n{
          width:32px;height:32px;border-radius:12px;
          display:grid; place-items:center;
          background: rgba(193,18,31,.22);
          border:1px solid rgba(193,18,31,.34);
          font-weight:900;
          margin-bottom:10px;
        }

        .step-t{ font-weight:900; letter-spacing:-.02em; }
        .step-d{ margin-top:8px; color: rgba(255,255,255,.70); font-size:13px; line-height:1.5; }

        /* Split */
        .split-grid{
          max-width:1200px;
          margin:0 auto;
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:18px;
        }

        .split-card{
          background: rgba(255,255,255,.72);
          border:1px solid rgba(0,0,0,.08);
          border-radius:28px;
          padding:30px;
          box-shadow: var(--shadow1);
          backdrop-filter: blur(16px);
          position:relative;
          overflow:hidden;
        }

        .split-card h3{
          margin:0 0 8px;
          font-size:18px;
          font-weight:850;
          letter-spacing:-.02em;
          color:var(--black);
        }

        .muted{
          margin:0 0 14px;
          color:var(--ink70);
          line-height:1.7;
        }

        .checklist{
          list-style:none;
          padding:0;
          margin:0;
          display:grid;
          gap:10px;
          color:var(--ink70);
        }

        .checklist li{
          padding-left:26px;
          position:relative;
        }

        .checklist li::before{
          content:"✔";
          position:absolute;
          left:0;
          color:var(--red);
        }

        .mini-strip{
          margin-top:18px;
          border-radius:22px;
          border:1px solid rgba(0,0,0,.10);
          background: rgba(255,255,255,.66);
          padding:18px;
        }

        .mini-strip-title{
          font-weight:900;
          color:var(--black);
        }

        .mini-strip-sub{
          margin-top:6px;
          color:var(--ink70);
          line-height:1.6;
          font-size:14px;
        }

        .mini-strip-actions{
          margin-top:12px;
          display:flex;
          gap:10px;
          flex-wrap:wrap;
        }

        .feature-cards{
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:12px;
          margin-top:14px;
        }

        .mini-feature{
          border-radius:20px;
          border:1px solid rgba(0,0,0,.08);
          background: rgba(255,255,255,.68);
          padding:14px;
          box-shadow:0 18px 44px rgba(0,0,0,.08);
        }

        .mini-feature-top{
          display:flex;
          align-items:center;
          gap:10px;
          font-weight:900;
          font-size:12px;
          letter-spacing:.12em;
          text-transform:uppercase;
          color: rgba(11,11,12,.75);
          margin-bottom:8px;
        }

        .mini-dot{
          width:8px;height:8px;border-radius:999px;
          background: var(--red);
          box-shadow:0 0 0 6px rgba(193,18,31,.10);
        }

        .mini-feature-desc{
          color:var(--ink70);
          font-size:13px;
          line-height:1.6;
        }

        .cta-strip{
          margin-top:16px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:16px;
          padding:18px;
          border-radius:22px;
          background: rgba(11,11,12,.92);
          color:#fff;
          border:1px solid rgba(255,255,255,.10);
          box-shadow: var(--shadow2);
        }

        .cta-strip-title{ font-weight:900; }
        .cta-strip-sub{ margin-top:6px; color: rgba(255,255,255,.70); font-size:13px; }

        .cta-strip-actions{
          display:flex;
          gap:10px;
          flex-wrap:wrap;
          justify-content:flex-end;
        }

        /* FAQ */
        .faq{
          max-width:980px;
          margin:20px auto 0;
          display:grid;
          gap:12px;
        }

        .faq-item{
          width:100%;
          text-align:left;
          border-radius:22px;
          border:1px solid rgba(0,0,0,.10);
          background: rgba(255,255,255,.72);
          box-shadow:0 18px 50px rgba(0,0,0,.10);
          padding:18px 18px 16px;
          cursor:pointer;
          transition: transform 160ms var(--easeOut), box-shadow 160ms ease, border-color 160ms ease;
        }

        .faq-item:hover{
          transform: translateY(-1px);
          box-shadow:0 26px 74px rgba(0,0,0,.12);
          border-color: rgba(193,18,31,.12);
        }

        .faq-q{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          font-weight:900;
          color:var(--black);
        }

        .faq-icon{
          width:34px;height:34px;border-radius:12px;
          display:grid; place-items:center;
          border:1px solid rgba(0,0,0,.10);
          background: rgba(255,255,255,.70);
          font-size:18px;
        }

        .faq-a{
          margin-top:10px;
          color:var(--ink70);
          line-height:1.7;
          font-size:14px;
          max-height:0;
          overflow:hidden;
          transition: max-height 220ms ease;
        }

        .faq-item.open .faq-a{
          max-height:220px;
        }

        /* Form shell */
        .dealer-form-shell{
          max-width:1100px;
          margin:0 auto;
        }

        .dealer-form-head{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:16px;
          flex-wrap:wrap;
          margin-bottom:18px;
        }

        .context-pill{
          display:inline-flex;
          align-items:center;
          gap:10px;
          padding:10px 18px;
          border-radius:999px;
          border:1px solid rgba(193,18,31,.35);
          background:rgba(255,255,255,.60);
          color:var(--red);
          font-size:12px;
          font-weight:800;
          letter-spacing:.14em;
          text-transform:uppercase;
          backdrop-filter: blur(14px);
          box-shadow: 0 18px 40px rgba(0,0,0,.08);
        }

        .form-title{
          margin:10px 0 0;
          font-size:26px;
          font-weight:850;
          letter-spacing:-.02em;
          color:var(--black);
        }

        .form-sub{
          margin-top:10px;
          color:var(--ink70);
          line-height:1.6;
          max-width:720px;
        }

        .status-chip{
          padding:10px 14px;
          border-radius:999px;
          border:1px solid rgba(0,0,0,.12);
          background: rgba(255,255,255,.66);
          font-weight:850;
          font-size:13px;
          color:var(--black);
          box-shadow:0 14px 40px rgba(0,0,0,.10);
        }
        .status-chip.busy{
          border-color: rgba(193,18,31,.22);
          box-shadow:0 16px 44px rgba(193,18,31,.14);
        }
        .status-chip.ok{
          border-color: rgba(193,18,31,.30);
          background: rgba(193,18,31,.06);
          color: var(--red);
        }

        .dealer-form .grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:18px;
        }

        .field{ display:flex; flex-direction:column; }
        .field.full{ grid-column: 1 / -1; }

        .dealer-page label{
          font-size:13px;
          font-weight:800;
          color:rgba(11,11,12,.70);
          margin-bottom:8px;
        }

        .dealer-page input, .dealer-page textarea, .dealer-page select{
          padding:14px 16px;
          border-radius:16px;
          border:1px solid rgba(0,0,0,.14);
          background: rgba(255,255,255,.82);
          font-size:15px;
          outline:none;
          transition:border-color .15s ease, box-shadow .15s ease, background .15s ease;
        }

        .dealer-page input:focus, .dealer-page textarea:focus{
          border-color:rgba(193,18,31,.55);
          box-shadow:0 0 0 4px rgba(193,18,31,.12);
          background:#fff;
        }

        .actions{
          margin-top:22px;
          display:grid;
          justify-items:center;
          gap:10px;
          text-align:center;
        }

        /* Buttons */
        .primary-action{
          position:relative;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding:16px 34px;
          border-radius:999px;
          background: linear-gradient(180deg, var(--red2), var(--red));
          color:#fff;
          font-weight:850;
          border:none;
          cursor:pointer;
          text-decoration:none;
          transition: transform 160ms var(--easeOut), box-shadow 160ms ease, filter 160ms ease;
          box-shadow: 0 22px 60px rgba(193,18,31,.32), inset 0 1px 0 rgba(255,255,255,.22);
          overflow:hidden;
        }

        .primary-action:hover{
          transform: translateY(-1px);
          box-shadow: 0 30px 90px rgba(193,18,31,.40), inset 0 1px 0 rgba(255,255,255,.22);
          filter:saturate(1.03);
        }

        .primary-action:active{ transform: translateY(0px); }
        .primary-action:disabled{ opacity:.75; cursor:not-allowed; transform:none !important; }

        .btn-content{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:10px;
          position:relative;
          z-index:2;
        }

        .btn-arrow{ transition: transform 160ms var(--easeOut); }
        .primary-action:hover .btn-arrow{ transform: translateX(2px); }

        .btn-shine{
          position:absolute;
          inset:-2px;
          background:
            radial-gradient(500px 120px at 20% 40%, rgba(255,255,255,.28), transparent 60%),
            radial-gradient(500px 120px at 80% 60%, rgba(255,255,255,.16), transparent 60%);
          opacity:.6;
          z-index:1;
        }

        .secondary-action{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding:14px 22px;
          border-radius:999px;
          border:1px solid rgba(0,0,0,.18);
          background:rgba(255,255,255,.72);
          backdrop-filter: blur(14px);
          font-weight:850;
          cursor:pointer;
          text-decoration:none;
          color: var(--black);
          transition: transform 160ms var(--easeOut), box-shadow 160ms ease, border-color 160ms ease;
          box-shadow:0 18px 50px rgba(0,0,0,.10);
        }

        .secondary-action:hover{
          transform: translateY(-1px);
          border-color: rgba(0,0,0,.32);
          box-shadow:0 26px 72px rgba(0,0,0,.14);
        }

        .secondary-action.on-dark{
          background: rgba(255,255,255,.14);
          border:1px solid rgba(255,255,255,.22);
          color:#fff;
          box-shadow:none;
        }

        .form-footnote{
          font-size:13px;
          color:var(--ink55);
        }

        .form-links{
          display:flex;
          gap:10px;
          flex-wrap:wrap;
          justify-content:center;
          margin-top:6px;
        }

        .tiny-link{
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding:10px 14px;
          border-radius:999px;
          border:1px solid rgba(0,0,0,.10);
          background: rgba(255,255,255,.66);
          text-decoration:none;
          color: var(--black);
          font-weight:850;
          font-size:12px;
          transition: transform 160ms var(--easeOut), box-shadow 160ms ease, border-color 160ms ease;
          box-shadow:0 14px 40px rgba(0,0,0,.10);
        }

        .tiny-link:hover{
          transform: translateY(-1px);
          border-color: rgba(193,18,31,.18);
          box-shadow:0 18px 52px rgba(0,0,0,.12);
        }

        /* Responsive */
        @media(max-width:1100px){
          .hero-grid{ grid-template-columns:1fr; }
        }

        @media(max-width:992px){
          .values-grid{ grid-template-columns:1fr; }
          .process-grid{ grid-template-columns:1fr 1fr; }
          .split-grid{ grid-template-columns:1fr; }
        }

        @media(max-width:768px){
          .dealer-hero{ padding:92px 18px 40px; }
          .hero-title{ font-size:38px; }
          .section-title{ font-size:32px; }
          .dealer-form .grid{ grid-template-columns:1fr; }
          .inq-card{ padding:26px; }
          .process-grid{ grid-template-columns:1fr; }
          .feature-cards{ grid-template-columns:1fr; }
          .cta-strip{ flex-direction:column; align-items:flex-start; }
        }

        @media (prefers-reduced-motion: reduce){
          .dealer-aurora{ animation:none; }
          .link-pill, .value-card, .faq-item, .primary-action, .secondary-action, .tiny-link{
            transition:none !important;
          }
          [data-reveal]{
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }

        .dealer-select{
          appearance:none;
          -webkit-appearance:none;
          background-image:
            linear-gradient(45deg, transparent 50%, rgba(11,11,12,.55) 50%),
            linear-gradient(135deg, rgba(11,11,12,.55) 50%, transparent 50%);
          background-position:
            calc(100% - 18px) calc(50% - 3px),
            calc(100% - 12px) calc(50% - 3px);
          background-size:6px 6px, 6px 6px;
          background-repeat:no-repeat;
          padding-right:42px;
        }
      `}</style>
    </>
  );
}
