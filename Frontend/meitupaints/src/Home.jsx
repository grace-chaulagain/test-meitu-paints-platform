import React, { useEffect, useMemo, useRef, useState } from "react";
import NavBar from "./components/NavBar";
import Carousel from "./components/Carousel";
import { Link } from "react-router-dom";

const PREVIEW_MATRIX_COLORS = [
  "rgb(244,236,207)",
  "rgb(244,231,183)",
  "rgb(240,220,151)",
  "rgb(239,215,137)",
  "rgb(234,210,127)",
  "rgb(219,188,87)",
  "rgb(185,155,48)",
  "rgb(246,242,223)",
  "rgb(248,240,207)",
  "rgb(250,235,183)",
  "rgb(251,231,161)",
  "rgb(255,226,130)",
  "rgb(255,213,75)",
  "rgb(250,193,0)",
  "rgb(246,243,226)",
  "rgb(247,240,212)",
  "rgb(250,234,188)",
  "rgb(254,226,157)",
  "rgb(255,223,140)",
  "rgb(255,201,72)",
  "rgb(255,178,0)",
  "rgb(248,240,217)",
  "rgb(252,235,197)",
  "rgb(255,226,170)",
  "rgb(255,218,143)",
  "rgb(255,208,111)",
  "rgb(255,186,58)",
  "rgb(255,166,0)",
  "rgb(248,241,220)",
  "rgb(250,235,203)",
  "rgb(253,226,174)",
  "rgb(254,210,136)",
  "rgb(252,199,113)",
  "rgb(242,176,69)",
  "rgb(229,158,47)",
  "rgb(248,238,217)",
  "rgb(248,232,201)",
  "rgb(249,219,169)",
  "rgb(246,202,135)",
  "rgb(241,189,113)",
  "rgb(227,167,79)",
  "rgb(218,157,69)",
  "rgb(246,234,212)",
  "rgb(248,230,200)",
  "rgb(242,211,166)",
  "rgb(235,196,141)",
  "rgb(222,171,105)",
  "rgb(216,160,91)",
  "rgb(194,138,71)",
  "rgb(250,236,206)",
  "rgb(254,228,183)",
  "rgb(255,220,163)",
  "rgb(255,206,127)",
  "rgb(255,200,113)",
  "rgb(255,174,66)",
  "rgb(246,158,38)",
  "rgb(245,238,223)",
  "rgb(249,229,202)",
  "rgb(247,213,173)",
  "rgb(243,195,144)",
  "rgb(238,181,124)",
  "rgb(221,151,90)",
  "rgb(196,124,67)",
  "rgb(247,237,215)",
];

export default function Home() {
  const pageRef = useRef(null);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const els = root.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("is-in");
        });
      },
      { threshold: 0.12 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const options = document.querySelectorAll(".preview-option");
    const layers = document.querySelectorAll(".preview-layer");

    options.forEach((btn) => {
      btn.addEventListener("mouseenter", () => {
        const key = btn.dataset.finish;

        options.forEach((o) => o.classList.remove("active"));
        btn.classList.add("active");

        layers.forEach((l) => {
          l.classList.toggle("active", l.dataset.layer === key);
        });
      });
    });
  }, []);

  // Tiny “stat ticker” polish (optional, no libs)

  // Reveal animation (your current system)
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const els = root.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("is-in"),
        ),
      { threshold: 0.12 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Subtle parallax (Apple-clean): set CSS vars on root
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY || 0;
        root.style.setProperty("--scrollY", String(y));
        root.style.setProperty("--par1", String(y * 0.06)); // ambient drift
        root.style.setProperty("--par2", String(y * 0.035));
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const stats = useMemo(
    () => [
      { k: "China–German", v: "Technology" },
      { k: "Low-odor", v: "Eco Friendly" },
      { k: "Resistant", v: "Weather" },
      { k: "Bhimsengola", v: "Location" },
    ],
    [],
  );

  const families = useMemo(
    () => [
      [
        "Regular Paints",
        "Interior & exterior excellence",
        "/regular",
        "/Regular.svg",
      ],
      ["Granite & Stone", "Architectural textures", "/granite", "/Granite.svg"],
      ["Primer", "Surface preparation systems", "/primer", "/Primer.svg"],
      ["RealStone", "Authentic stone systems", "/realstone", "/Realstone.svg"],
      [
        "Specialty",
        "Specialty & supporting layers",
        "/specialty",
        "/specialty.svg",
      ],
      ["Utilities", "Professional tools", "/utilities", "/Utilities.svg"],
    ],
    [],
  );

  return (
    <>
      <NavBar />

      <div ref={pageRef} className="home-root">
        {/* CAROUSEL */}
        <section className="carousel-section" data-reveal>
          <Carousel />
        </section>

        {/* INTRO STATEMENT */}
        <section className="intro-section">
          <div className="intro-ambient" aria-hidden="true" />
          <div className="intro-shell" data-reveal>
            <span className="intro-eyebrow">MEITU PAINTS</span>
            <h1>
              Granite paint company based in
              <span className="headline-accent"> Nepal</span>
            </h1>
            <p>
              Meitu Paints delivers high-performance coating systems designed
              for longevity, aesthetics, and architectural integrity trusted
              across residential, commercial, and landmark projects.
            </p>

            {/* Premium mini-stats */}
            <div className="mini-stats" data-reveal>
              {stats.map((s) => (
                <div key={s.k} className="mini-stat">
                  <div className="mini-val">{s.v}</div>
                  <div className="mini-key">{s.k}</div>
                </div>
              ))}
            </div>

            {/* Primary actions */}
            <div className="intro-actions" data-reveal>
              <Link to="/products" className="pill solid">
                Explore Products
              </Link>
              <Link to="/colors" className="pill glass">
                Explore Colors
              </Link>
            </div>
          </div>
        </section>

        <div className="apple-gallery">
          <div className="gallery-card">
            <img src="HomePage1.webp" alt="Premium Finish" />
            <span>Premium Finish</span>
          </div>

          <div className="gallery-card">
            <img src="HomePage2.webp" alt="Granite Texture" />
            <span>Granite Texture</span>
          </div>

          <div className="gallery-card">
            <img src="HomePage3.webp" alt="Liquid Paint" />
            <span>Liquid Smoothness</span>
          </div>
        </div>

        <style>{`
.apple-gallery{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
  gap:32px;
  padding: 0px 50px;
}

.gallery-card{
  position:relative;
  border-radius:26px;
  overflow:hidden;
  background:#fff;
  box-shadow:0 40px 90px rgba(0,0,0,.15);
  transition:transform .45s cubic-bezier(.22,.61,.36,1),
             box-shadow .45s ease;
}

.gallery-card img{
  width:100%;
  height:340px;
  object-fit:cover;
  transform:scale(1.05);
  transition:transform 1.2s ease;
}

.gallery-card span{
  position:absolute;
  left:20px;
  bottom:20px;
  padding:10px 20px;
  background:rgba(255,255,255,.75);
  backdrop-filter:blur(12px);
  border-radius:999px;
  font-weight:600;
  font-size:14px;
}

.gallery-card:hover{
  transform:translateY(-6px);
  box-shadow:0 70px 160px rgba(0,0,0,.25);
}

.gallery-card:hover img{
  transform:scale(1);
}

.gallery-overlay{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  object-fit:cover;
  opacity:.25;
  pointer-events:none;
}

`}</style>

        {/* QUICK ACTIONS */}
        <section className="quick-actions">
          <div className="container" data-reveal>
            <div className="row g-4">
              {[
                {
                  title: "Become a Dealer",
                  desc: "Join our nationwide professional network",
                  link: "/dealership",
                },
              ].map((item) => (
                <div key={item.title} className="w-100" data-reveal>
                  <Link to={item.link} className="action-glass p-4">
                    <div className="action-top">
                      <h4>{item.title}</h4>
                      <span className="action-chip">New</span>
                    </div>
                    <p>
                      {item.desc} <span className="action-arrow">→</span>
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* HERO STATEMENT (Dense) */}
        <section className="intro-section">
          <div className="intro-ambient" aria-hidden="true" />
          <div className="intro-grid container">
            <div className="intro-left" data-reveal>
              <span className="intro-eyebrow">MEITU PAINTS • NEPAL</span>
              <h1 className="intro-title">
                Premium coating systems <br />
                built for <span className="headline-accent">real surfaces</span>
                .
              </h1>
              <p className="intro-lead">
                Meitu Construction Materials is a high-tech company
                manufacturing interior and exterior wall paints, wall putty,
                Granite Paints (2D), granite imitation stone paints (3D), floor
                paints, enamel, and supporting tools.
              </p>

              <div className="intro-actions" data-reveal>
                <Link to="/products" className="pill solid">
                  Explore Products
                </Link>
                <Link to="/colors" className="pill glass">
                  Explore Colors
                </Link>
                <Link to="/inquiry" className="pill glass">
                  Talk to an Expert
                </Link>
              </div>

              <div className="mini-stats" data-reveal>
                {stats.map((s) => (
                  <div key={s.k} className="mini-stat">
                    <div className="mini-val">{s.v}</div>
                    <div className="mini-key">{s.k}</div>
                  </div>
                ))}
              </div>

              <div className="trustbar" data-reveal>
                <div className="trust-chip">
                  <span className="trust-dot" />
                  Color stability
                </div>
                <div className="trust-chip">
                  <span className="trust-dot" />
                  Washable finishes
                </div>
                <div className="trust-chip">
                  <span className="trust-dot" />
                  Professional guidance
                </div>
                <div className="trust-chip">
                  <span className="trust-dot" />
                  System-first approach
                </div>
              </div>
            </div>

            {/* HERO VISUAL CLUSTER */}
            <div className="intro-right" data-reveal>
              <div className="hero-stack">
                <div className="hero-card hero-card-xl">
                  <img src="/HomePage1.webp" alt="Premium Finish" />
                  <div className="hero-cap">
                    <div className="hero-cap-sub">
                      Clean sheen • refined texture
                    </div>
                  </div>
                </div>

                <div className="hero-row">
                  <div className="hero-card hero-card-sm">
                    <img src="/HomePage2.webp" alt="Granite Texture" />
                    <div className="hero-cap">
                      <div className="hero-cap-sub">Architectural depth</div>
                    </div>
                  </div>
                  <div className="hero-card hero-card-sm">
                    <img src="/HomePage3.webp" alt="Liquid Smoothness" />
                    <div className="hero-cap">
                      <div className="hero-cap-sub">Flow • uniform finish</div>
                    </div>
                  </div>
                </div>

                <div className="hero-strip">
                  <div className="hero-strip-left">
                    <div className="hs-title">
                      Need a system recommendation?
                    </div>
                    <div className="hs-sub">
                      Tell us your surface + location we’ll guide the right
                      build.
                    </div>
                  </div>
                  <div className="hero-strip-actions">
                    <Link to="/inquiry" className="pill solid">
                      Contact Team
                    </Link>
                    <Link to="/ratecalculator" className="pill glass">
                      Estimate Cost
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT FAMILIES */}
        <section className="families-section">
          <div className="families-ambient" aria-hidden="true" />

          <div className="container">
            <div className="section-head" data-reveal>
              <h2 className="section-title">Product Families</h2>
              <p className="section-sub">
                Engineered systems tailored for every surface and condition.
              </p>
            </div>

            <div className="row g-4 mt-4">
              {[
                [
                  "Regular Paints",
                  "Interior & exterior excellence",
                  "/regular",
                  "Regular.svg",
                ],
                [
                  "Granite & Stone",
                  "Architectural textures",
                  "/granite",
                  "Granite.svg",
                ],
                ["Primer", "Smooth flow finishes", "/primer", "Primer.svg"],
                [
                  "Putting",
                  "Create smoother walls",
                  "/putting",
                  "Wall Putting.svg",
                ],
                [
                  "Specialty",
                  "Specialty & primers",
                  "/specialty",
                  "Specialty.svg",
                ],
                [
                  "Utilities",
                  "Professional tools",
                  "/utilities",
                  "Utilities.svg",
                ],
              ].map(([name, desc, link, src]) => (
                <div key={name} className="col-sm-6 col-lg-4" data-reveal>
                  <Link to={link} className="family-card">
                    {/* ICON SLOT */}

                    {/* IMAGE SLOT */}
                    <div className="family-image">
                      <img src={src} alt={src} className="family-image" />
                    </div>

                    <div className="family-body">
                      <div className="family-top">
                        <h5>{name}</h5>
                        <span className="family-dot" />
                      </div>

                      <p>{desc}</p>
                      <span className="family-cta">Explore →</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <style>
          {`/* ================= PRODUCT FAMILIES ================= */

.families-section{
  position:relative;
  padding:120px 0;
  overflow:hidden;
}

.families-ambient{
  position:absolute;
  inset:-20%;
  background:
    radial-gradient(600px 300px at 20% 10%, rgba(193,18,31,.14), transparent 60%),
    radial-gradient(700px 360px at 85% 80%, rgba(0,0,0,.08), transparent 60%);
  pointer-events:none;
}

/* SECTION HEAD */
.section-head{
  text-align:center;
  max-width:680px;
  margin:0 auto 20px;
}

.section-title{
  font-size:42px;
  font-weight:600;
  letter-spacing:-.6px;
}

.section-sub{
  font-size:17px;
  color:var(--ink70);
  margin-top:12px;
}

/* CARD */
.family-card{
  position:relative;
  height:100%;
  display:flex;
  flex-direction:column;
  gap:18px;
  padding:28px;
  border-radius:28px;
  background:rgba(255,255,255,.82);
  backdrop-filter:blur(18px);
  text-decoration:none;
  color:inherit;
  border:1px solid rgba(0,0,0,.08);
  box-shadow:0 28px 60px rgba(0,0,0,.12);
  transition:
    transform .35s cubic-bezier(.22,.61,.36,1),
    box-shadow .35s cubic-bezier(.22,.61,.36,1);
}

.family-card:hover{
  transform:translateY(-6px);
  box-shadow:0 50px 100px rgba(0,0,0,.18);
}

/* ICON */
.family-icon{
  width:44px;
  height:44px;
  border-radius:14px;
  background:rgba(193,18,31,.1);
  display:grid;
  place-items:center;
}

.icon-placeholder{
  width:18px;
  height:18px;
  border-radius:6px;
  background:var(--red);
}

/* IMAGE SLOT */
.family-image{
  width:100%;
  height:120px;
  border-radius:18px;
  background:
    linear-gradient(180deg, rgba(0,0,0,.04), rgba(0,0,0,.08));
  overflow:hidden;
}

/* TEXT */
.family-body{
  display:flex;
  flex-direction:column;
  gap:10px;
}

.family-top{
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.family-top h5{
  font-size:18px;
  font-weight:600;
}

.family-dot{
  width:8px;
  height:8px;
  border-radius:50%;
  background:var(--red);
}

.family-body p{
  font-size:15px;
  color:var(--ink70);
  line-height:1.6;
}

.family-cta{
  margin-top:auto;
  font-size:14px;
  font-weight:600;
  color:var(--red);
}

/* REVEAL ANIMATION */
[data-reveal]{
  opacity:0;
  transform:translateY(14px);
  transition:
    opacity .75s cubic-bezier(.22,.61,.36,1),
    transform .75s cubic-bezier(.22,.61,.36,1);
}

[data-reveal].is-in{
  opacity:1;
  transform:translateY(0);
}
`}
        </style>

        {/* COLOR LIBRARY (dense + premium) */}
        <section className="color-lab">
          <div className="cl-ambient" aria-hidden="true" />
          <div className="container">
            <div className="cl-grid">
              <div className="cl-left" data-reveal>
                <div className="cl-kicker">MEITU COLOR LIBRARY</div>
                <h2 className="cl-title">
                  1008 shades, built as a system not just “pretty colors”.
                </h2>
                <p className="cl-sub">
                  Search by name or code. Filter by Light / Neutral / Dark.
                  Explore curated categories designed for architecture, mood,
                  and longevity.
                </p>

                <div className="cl-actions">
                  <Link to="/colors" className="pill solid">
                    Open Color Library
                  </Link>
                  <Link to="/horoscope" className="pill glass">
                    Zodiac Palettes
                  </Link>
                </div>

                <div className="cl-bullets">
                  <div className="cl-bullet">
                    <span className="cl-bullet-dot" />
                    Reds • Oranges • Yellows • Greens • Blues
                  </div>
                  <div className="cl-bullet">
                    <span className="cl-bullet-dot" />
                    Earth tones • Classic neutrals • Dark accents
                  </div>
                  <div className="cl-bullet">
                    <span className="cl-bullet-dot" />
                    Whispering whites • Soft modern palettes
                  </div>
                </div>
              </div>

              <div className="cl-right" data-reveal>
                <div className="cl-card">
                  <div className="cl-card-top">
                    <div className="cl-card-title">Preview Matrix</div>
                  </div>

                  <div className="cl-matrix" aria-label="Color matrix">
                    {PREVIEW_MATRIX_COLORS.map((hex, i) => (
                      <div
                        key={i}
                        className="cl-swatch"
                        style={{ backgroundColor: hex }}
                        aria-label={`Swatch ${i + 1}: ${hex}`}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="home-zodiac" data-reveal>
          <div className="hz-shell">
            <div className="hz-copy">
              <span className="hz-eyebrow">ASTRO × COLOR SCIENCE</span>
              <h2>Colors That Match You</h2>
              <p>
                Discover zodiac palettes to influence mood, behavior, and
                overall harmony.
              </p>
              <Link to="/horoscope" className="hz-cta">
                Explore Zodiac Palettes →
              </Link>
              <br />
            </div>

            <div className="hz-visual">
              {/* SVG / abstract zodiac wheel */}
              <img src="zodiac-wheel.webp" alt="Zodiac Color System" />
            </div>
          </div>
        </section>

        {/* SYSTEM METHOD (very Apple) */}
        <section className="system-method">
          <div className="container">
            <div className="section-head" data-reveal>
              <h2 className="section-title">The Meitu System Method</h2>
              <p className="section-sub">
                Premium results aren’t accidental. They’re engineered through
                preparation + compatible layers + disciplined application.
              </p>
            </div>

            <div className="row g-4 mt-4">
              {[
                [
                  "01",
                  "Surface Prep",
                  "Clean • repair • prime  the foundation that decides everything.",
                ],
                [
                  "02",
                  "System Match",
                  "Choose the right family for climate, substrate, and finish goals.",
                ],
                [
                  "03",
                  "Application",
                  "Correct tools • coats • dry time  engineered behavior, not guesses.",
                ],
                [
                  "04",
                  "Protection",
                  "Washability • UV stability • longevity  performance that lasts.",
                ],
              ].map(([n, t, d]) => (
                <div key={n} className="col-md-3" data-reveal>
                  <div className="step-card">
                    <div className="step-no">{n}</div>
                    <div className="step-title">{t}</div>
                    <div className="step-desc">{d}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="method-strip" data-reveal>
              <div className="ms-left">
                <div className="ms-title">Want a precise recommendation?</div>
                <div className="ms-sub">
                  Share your surface + location we’ll propose a clean system
                  build.
                </div>
              </div>
              <div className="ms-actions">
                <Link to="/inquiry" className="pill solid">
                  Ask an Expert
                </Link>
                <Link to="/support" className="pill glass">
                  Support
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="apple-split">
          <div className="split-text">
            <span>ENGINEERED SYSTEMS</span>
            <h2>Precision Built for Real Surfaces</h2>
            <p>
              Every Meitu coating is formulated to perform across climate,
              substrate, and architectural demands without compromise.
            </p>
          </div>

          <div className="split-image">
            <img src="HomePage4.webp" alt="Surface system" />
          </div>
        </div>

        <style>{`
.apple-split{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:60px;
  align-items:center;
  padding: 0px 50px;
}

.split-text span{
  letter-spacing:.3em;
  font-size:12px;
  font-weight:700;
  color:#c1121f;
}

.split-text h2{
  font-size:40px;
  font-weight:800;
  margin:18px 0;
  letter-spacing:-.03em;
}

.split-text p{
  font-size:17px;
  color:rgba(0,0,0,.7);
  max-width:480px;
}

.split-image{
  border-radius:32px;
  overflow:hidden;
  box-shadow:0 50px 120px rgba(0,0,0,.2);
}

.split-image img{
  width:100%;
  height:420px;
  object-fit:cover;
  transition:transform 1.6s ease;
}

.apple-split:hover img{
  transform:scale(1.04);
}

@media(max-width:900px){
  .apple-split{
    grid-template-columns:1fr;
  }
}
`}</style>

        <section className="philosophy-section">
          <div className="philo-shell" data-reveal>
            <span className="philo-eyebrow">OUR PHILOSOPHY</span>
            <h2>
              Paint is not colour.
              <br />
              <span>It is behaviour.</span>
            </h2>

            <div className="philo-columns">
              <p>
                Every surface speaks. Before furniture, before lighting, before
                decor colour defines perception. At Meitu Paints, we believe
                coatings are not cosmetic layers, but{" "}
                <strong>functional systems</strong> that interact with light,
                climate, and human experience.
              </p>

              <p>
                That belief drives everything we formulate. From pigment loading
                to resin balance, from sheen control to long-term stability our
                paints are engineered to behave predictably in real
                environments, not just in brochures.
              </p>

              <p>
                This is why Meitu does not sell “shades”. We deliver
                <strong> surface intelligence</strong> coatings designed to age
                gracefully, protect relentlessly, and elevate architecture
                without distraction.
              </p>
            </div>
          </div>
        </section>

        {/* WHY MEITU */}
        <section className="why-section">
          <div className="container">
            <div className="section-head" data-reveal>
              <h2 className="section-title">Why Meitu</h2>
              <p className="section-sub">
                Precision chemistry, refined finishes, and professional
                execution.
              </p>
            </div>

            <div className="row g-5 mt-4">
              {[
                [
                  "Low-VOC & Eco safe",
                  "Health-conscious systems with minimal odour and safer indoor air quality.",
                ],
                [
                  "Professional Network",
                  "Trained applicators, nationwide dealers, and expert technical support.",
                ],
                [
                  "Made in Nepal",
                  "High pigment, long-term durability tested for extreme climates, all made in Nepal.",
                ],
              ].map(([title, text]) => (
                <div key={title} className="col-md-4" data-reveal>
                  <div className="why-card">
                    <h5>{title}</h5>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Wide premium strip */}
            <div className="why-strip" data-reveal>
              <div>
                <div className="strip-title">Need expert guidance?</div>
                <div className="strip-sub">
                  Get a precise system recommendation based on surface +
                  climate.
                </div>
              </div>
              <div className="strip-actions">
                <Link to="/inquiry" className="pill solid">
                  Talk to an Expert
                </Link>
                <Link to="/dealership" className="pill glass">
                  Dealer Network
                </Link>
              </div>
            </div>
          </div>
        </section>

        <style>{`
.philosophy-section{
  padding:60px 24px;
  background:
    radial-gradient(800px 500px at 20% 0%, rgba(193,18,31,.08), transparent 60%),
    #fff;
}

.philo-shell{
  max-width:1000px;
  margin:auto;
}

.philo-eyebrow{
  font-size:12px;
  letter-spacing:.34em;
  font-weight:800;
  color:var(--red);
}

.philo-shell h2{
  font-size:52px;
  font-weight:880;
  letter-spacing:-.04em;
  margin:24px 0 36px;
}

.philo-shell h2 span{
  color:var(--red);
}

.philo-columns{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:32px;
}

.philo-columns p{
  font-size:16px;
  line-height:1.8;
  color:var(--ink70);
}

@media(max-width:900px){
  .philo-columns{ grid-template-columns:1fr; }
}

`}</style>

        <style>{`.chemistry-section{
  padding:140px 24px;
  background:#fafafa;
}

.chemistry-grid{
  margin-top:48px;
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:28px;
}

.chem-card{
  background:#fff;
  border-radius:26px;
  padding:36px;
  box-shadow:0 40px 100px rgba(0,0,0,.1);
  border:1px solid rgba(0,0,0,.06);
}

.chem-card h4{
  font-weight:820;
  margin-bottom:12px;
}

.chem-card p{
  color:var(--ink70);
  line-height:1.7;
}
`}</style>

        {/* FINAL CTA */}
        <section className="final-cta">
          <div className="cta-ambient" aria-hidden="true" />
          <div className="cta-shell" data-reveal>
            <h2>Design With Confidence</h2>
            <p>
              Speak with Meitu experts, plan your surfaces, and experience
              premium coatings engineered to last.
            </p>
            <div className="cta-actions">
              <Link to="/ratecalculator" className="pill solid">
                Estimate Cost
              </Link>
              <Link to="/inquiry" className="pill glass on-dark">
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* ================= STYLES (Apple-like, dense) ================= */}
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
  --ease:cubic-bezier(.22,.61,.36,1);
}

.home-root{
  --scrollY: 0;
  --par1: 0;
  --par2: 0;
  background:
    radial-gradient(1200px 700px at 20% 0%, rgba(193,18,31,.10), transparent 55%),
    radial-gradient(900px 700px at 85% 18%, rgba(193,18,31,.08), transparent 55%),
    #fff;
}

.carousel-section{ padding:0 !important; }
section{ padding:120px 24px; }
.container{ max-width:1200px; }

/* Reveal */
[data-reveal]{
  opacity:0;
  transform:translateY(14px);
  transition:opacity .75s var(--ease), transform .75s var(--ease);
  will-change:transform, opacity;
}
.is-in{ opacity:1; transform:translateY(0); }

/* Headings */
.section-head{
  text-align:center;
  max-width:820px;
  margin:0 auto 18px;
}
.section-title{
  font-size:44px;
  font-weight:780;
  letter-spacing:-.04em;
  color:var(--black);
  margin:0;
}
.section-sub{
  color:var(--ink70);
  margin-top:12px;
  font-size:16px;
  line-height:1.6;
}

/* Pills */
.pill{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:14px 34px;
  border-radius:999px;
  font-weight:760;
  font-size:14px;
  text-decoration:none;
  letter-spacing:.01em;
  user-select:none;
  transition:transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease;
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
.pill.on-dark{
  background:rgba(255,255,255,.14);
  border:1px solid rgba(255,255,255,.22);
  color:#fff;
}
.pill:hover{
  transform:translateY(-2px);
  box-shadow:0 28px 80px rgba(0,0,0,.14);
}

/* ================= HERO ================= */
.intro-section{
  position:relative;
  overflow:hidden;
  padding:70px 24px 120px;
}
.intro-ambient{
  position:absolute;
  inset:-220px -180px auto -180px;
  height:540px;
  background:
    radial-gradient(closest-side at 50% 50%, rgba(193,18,31,.20), transparent 70%),
    radial-gradient(closest-side at 20% 40%, rgba(225,29,46,.14), transparent 65%),
    radial-gradient(closest-side at 85% 60%, rgba(0,0,0,.10), transparent 70%);
  filter: blur(10px);
  pointer-events:none;
  transform: translate3d(0, calc(var(--par1) * -1px), 0);
}
.intro-grid{
  display:grid;
  grid-template-columns:1.05fr .95fr;
  gap:64px;
  align-items:start;
  position:relative;
}
.intro-eyebrow{
  font-size:12px;
  letter-spacing:.32em;
  color:var(--red);
  font-weight:860;
}
.intro-title{
  font-size:56px;
  margin:18px 0 14px;
  letter-spacing:-.05em;
  font-weight:860;
  color:var(--black);
  line-height:1.02;
}
.headline-accent{ color:var(--red); }
.intro-lead{
  font-size:18px;
  color:var(--ink70);
  line-height:1.75;
  max-width:720px;
}
.intro-actions{
  margin-top:20px;
  display:flex;
  gap:12px;
  flex-wrap:wrap;
}
.mini-stats{
  margin-top:22px;
  display:grid;
  grid-template-columns:repeat(2, 1fr);
  gap:12px;
  max-width:520px;
}
.mini-stat{
  background:rgba(255,255,255,.70);
  border:1px solid rgba(0,0,0,.06);
  border-radius:20px;
  padding:16px 14px;
  box-shadow:0 22px 60px rgba(0,0,0,.06);
  backdrop-filter: blur(14px);
}
.mini-val{
  font-size:18px;
  font-weight:860;
  letter-spacing:-.02em;
  color:var(--black);
}
.mini-key{
  margin-top:6px;
  font-size:12px;
  letter-spacing:.14em;
  text-transform:uppercase;
  color:var(--ink55);
  font-weight:860;
}
.trustbar{
  margin-top:18px;
  display:flex;
  flex-wrap:wrap;
  gap:10px;
}
.trust-chip{
  display:inline-flex;
  align-items:center;
  gap:10px;
  padding:10px 14px;
  border-radius:999px;
  background:rgba(255,255,255,.74);
  border:1px solid rgba(0,0,0,.08);
  backdrop-filter: blur(14px);
  color:var(--ink70);
  font-weight:700;
  font-size:13px;
}
.trust-dot{
  width:8px;height:8px;border-radius:50%;
  background:var(--red);
  box-shadow:0 0 0 6px rgba(193,18,31,.12);
}

/* Hero visuals */
.hero-stack{ display:flex; flex-direction:column; gap:16px; }
.hero-card{
  position:relative;
  border-radius:28px;
  overflow:hidden;
  background:#fff;
  border:1px solid rgba(0,0,0,.06);
  box-shadow:0 40px 120px rgba(0,0,0,.14);
}
.hero-card img{
  width:100%;
  display:block;
  height:360px;
  object-fit:cover;
  transform:scale(1.04);
  transition:transform 1.2s var(--ease);
}
.hero-card:hover img{ transform:scale(1.0); }
.hero-card-xl img{ height:420px; }
.hero-row{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:16px;
}
.hero-card-sm img{ height:240px; }

.hero-cap{
  position:absolute;
  left:18px;
  bottom:18px;
  padding:12px 16px;
  border-radius:999px;
  background:rgba(255,255,255,.72);
  border:1px solid rgba(0,0,0,.08);
  backdrop-filter: blur(14px);
}
.hero-cap-title{ font-weight:860; letter-spacing:-.01em; }
.hero-cap-sub{ font-size:12px; color:var(--ink55); margin-top:2px; font-weight:760; }

.hero-strip{
  margin-top:8px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:14px;
  padding:18px 18px;
  border-radius:26px;
  background:rgba(11,11,12,.92);
  border:1px solid rgba(255,255,255,.10);
  box-shadow:0 44px 140px rgba(0,0,0,.20);
  color:#fff;
}
.hs-title{ font-weight:900; letter-spacing:-.02em; }
.hs-sub{ color:rgba(255,255,255,.70); font-size:13px; margin-top:4px; }
.hero-strip-actions{ display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end; }

/* ================= QUICK ACTIONS ================= */
.quick-actions{
  background:
    radial-gradient(900px 460px at 20% 50%, rgba(193,18,31,.10), transparent 60%),
    #fafafa;
}
.action-glass{
  display:block;
  background:var(--glass);
  backdrop-filter:blur(18px);
  border-radius:28px;
  padding:32px;
  text-decoration:none;
  color:inherit;
  box-shadow:var(--shadow);
  border:1px solid rgba(0,0,0,.06);
  transition:transform .22s var(--ease), box-shadow .22s var(--ease);
  position:relative;
  overflow:hidden;
  height:100%;
}
.action-glass::before{
  content:"";
  position:absolute;
  inset:-60px -80px auto auto;
  width:260px;
  height:260px;
  background:radial-gradient(circle, rgba(193,18,31,.14), transparent 62%);
  filter: blur(2px);
}
.action-glass:hover{
  transform:translateY(-6px);
  box-shadow:0 70px 160px rgba(0,0,0,.16);
}
.action-top{ display:flex; align-items:center; justify-content:space-between; gap:12px; }
.action-glass h4{ margin:0 0 12px; font-weight:900; letter-spacing:-.02em; }
.action-chip{
  font-size:11px;
  font-weight:900;
  letter-spacing:.18em;
  text-transform:uppercase;
  color:var(--red);
  background:rgba(193,18,31,.10);
  border:1px solid rgba(193,18,31,.22);
  padding:7px 10px;
  border-radius:999px;
}
.action-glass p{
  color:var(--ink70);
  line-height:1.65;
  margin:0 0 18px;
}
.action-arrow{ font-size:20px; color:var(--red); font-weight:900; margin-left:6px; }
.action-bottom{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  margin-top:auto;
  padding-top:18px;
  border-top:1px solid rgba(0,0,0,.06);
}
.action-micro{ font-size:12px; color:var(--ink55); font-weight:800; letter-spacing:.02em; }
.action-ghost{
  font-size:12px;
  font-weight:900;
  color:var(--black);
  padding:8px 12px;
  border-radius:999px;
  border:1px solid rgba(0,0,0,.10);
  background:rgba(255,255,255,.7);
}

/* ================= FAMILIES ================= */
.families-section{
  position:relative;
  overflow:hidden;
  padding:120px 24px;
}
.families-ambient{
  position:absolute;
  inset:auto -220px -220px -220px;
  height:620px;
  background:
    radial-gradient(closest-side at 50% 40%, rgba(193,18,31,.16), transparent 68%),
    radial-gradient(closest-side at 70% 55%, rgba(0,0,0,.08), transparent 66%);
  pointer-events:none;
  filter: blur(12px);
  transform: translate3d(0, calc(var(--par2) * -1px), 0);
}
.family-card{
  display:block;
  padding:28px;
  border-radius:26px;
  border:1px solid rgba(0,0,0,.08);
  text-decoration:none;
  color:inherit;
  background:rgba(255,255,255,.80);
  backdrop-filter: blur(16px);
  transition:transform .24s var(--ease), box-shadow .24s var(--ease), border-color .24s ease;
  height:100%;
  box-shadow:0 30px 90px rgba(0,0,0,.10);
}
.family-card:hover{
  transform:translateY(-6px);
  box-shadow:0 60px 140px rgba(0,0,0,.14);
  border-color:rgba(193,18,31,.20);
}
.family-media{
  display:grid;
  grid-template-columns:56px 1fr;
  gap:14px;
  align-items:stretch;
  margin-bottom:18px;
}
.family-icon{
  width:56px;height:56px;border-radius:18px;
  background:linear-gradient(180deg, rgba(193,18,31,.16), rgba(193,18,31,.06));
  border:1px solid rgba(193,18,31,.18);
  box-shadow:0 22px 60px rgba(193,18,31,.14);
  display:grid; place-items:center;
}
.family-icon img{ width:26px; height:26px; object-fit:contain; opacity:.95; }
.family-image{
  border-radius:18px;
  background:linear-gradient(180deg, rgba(0,0,0,.03), rgba(0,0,0,.06));
  border:1px solid rgba(0,0,0,.05);
  overflow:hidden;
  position:relative;
}
.family-image-placeholder{
  height:100%;
  padding:18px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  gap:10px;
}
.fip-line{
  height:10px;
  border-radius:999px;
  background:rgba(0,0,0,.10);
}
.fip-line.short{ width:60%; }

.family-top{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
}
.family-card h5{
  margin:0 0 10px;
  font-weight:900;
  letter-spacing:-.02em;
}
.family-card p{ margin:0 0 16px; color:var(--ink70); line-height:1.65; }
.family-dot{
  width:10px;height:10px;border-radius:999px;
  background:var(--red);
  box-shadow:0 0 0 6px rgba(193,18,31,.12);
}
.family-cta{ color:var(--red); font-weight:900; }

/* ================= FinishPreview V2 styles (component uses these classnames) ================= */
.finish-preview-v2{
  position:relative;
  padding:160px 24px;
  overflow:hidden;
}
.fp-ambient{
  position:absolute;
  inset:-30%;
  background:
    radial-gradient(900px 520px at 18% 25%, rgba(193,18,31,.26), transparent 65%),
    radial-gradient(1000px 620px at 82% 70%, rgba(0,0,0,.18), transparent 65%);
  pointer-events:none;
  filter: blur(12px);
  transform: translate3d(0, calc(var(--par1) * -1px), 0);
}
.fp-grid{
  margin-top:70px;
  display:grid;
  grid-template-columns:1fr 1.55fr;
  gap:72px;
  align-items:start;
}
.fp-panel{
  background:rgba(255,255,255,.86);
  border:1px solid rgba(0,0,0,.08);
  border-radius:30px;
  padding:28px;
  box-shadow:0 60px 150px rgba(0,0,0,.14);
  backdrop-filter: blur(18px);
  overflow:hidden;
  position:relative;
}
.fp-panel::after{
  content:"";
  position:absolute;
  inset:-120px -140px auto auto;
  width:340px;height:340px;
  background:radial-gradient(circle, rgba(193,18,31,.16), transparent 65%);
  pointer-events:none;
}
.fp-kicker{
  font-size:12px;
  font-weight:950;
  letter-spacing:.30em;
  color:var(--red);
}
.fp-mini{
  margin-top:10px;
  color:var(--ink70);
  line-height:1.7;
  font-weight:650;
}
.fp-options{ margin-top:18px; display:flex; flex-direction:column; gap:12px; }
.fp-option{
  width:100%;
  display:flex;
  align-items:center;
  gap:14px;
  padding:16px 16px;
  border-radius:18px;
  border:1px solid rgba(0,0,0,.10);
  background:rgba(255,255,255,.72);
  cursor:pointer;
  transition:transform .20s var(--ease), box-shadow .20s var(--ease), border-color .20s ease, background .20s ease;
  text-align:left;
}
.fp-option:hover{
  transform:translateY(-2px);
  box-shadow:0 26px 70px rgba(0,0,0,.14);
}
.fp-option.active{
  border-color:rgba(193,18,31,.55);
  box-shadow:0 30px 90px rgba(193,18,31,.24);
  background:rgba(193,18,31,.06);
}
.fp-dot{
  width:12px;height:12px;border-radius:50%;
  background:var(--red);
  box-shadow:0 0 0 8px rgba(193,18,31,.14);
  flex:0 0 auto;
}
.fp-opt-copy{ display:flex; flex-direction:column; gap:4px; flex:1; }
.fp-opt-name{ font-weight:950; letter-spacing:-.01em; color:var(--black); }
.fp-opt-desc{ font-size:13px; color:var(--ink70); line-height:1.55; font-weight:650; }
.fp-tag{
  margin-left:10px;
  font-style:normal;
  font-weight:950;
  font-size:11px;
  letter-spacing:.20em;
  text-transform:uppercase;
  color:var(--red);
  background:rgba(193,18,31,.10);
  border:1px solid rgba(193,18,31,.20);
  padding:6px 10px;
  border-radius:999px;
}
.fp-arrow{ font-weight:950; color:var(--red); }
.fp-ctas{ margin-top:16px; display:flex; gap:10px; flex-wrap:wrap; }
.fp-foot{ margin-top:16px; display:flex; gap:8px; flex-wrap:wrap; }
.fp-foot-chip{
  font-size:11px;
  font-weight:950;
  letter-spacing:.12em;
  text-transform:uppercase;
  color:var(--ink55);
  padding:8px 10px;
  border-radius:999px;
  border:1px solid rgba(0,0,0,.08);
  background:rgba(255,255,255,.70);
}

.fp-visual{
  --mx:0;
  --my:0;
  --glowX:50%;
  --glowY:50%;
  position:relative;
  border-radius:42px;
  overflow:hidden;
  box-shadow:0 110px 240px rgba(0,0,0,.30);
  border:1px solid rgba(255,255,255,.18);
  transform: translateZ(0);
  background:#0b0b0c;
}
.fp-visual.fp-has-mouse{
  transform:
    perspective(1100px)
    rotateX(calc(var(--my) * -7deg))
    rotateY(calc(var(--mx) * 7deg))
    translateZ(0);
  transition:transform .10s linear;
}
.fp-glow{
  position:absolute;
  inset:-50%;
  background:
    radial-gradient(circle at var(--glowX) var(--glowY), rgba(193,18,31,.38), transparent 55%),
    radial-gradient(circle at 30% 70%, rgba(255,255,255,.08), transparent 60%);
  filter: blur(40px);
  opacity:.75;
  pointer-events:none;
}
.fp-frame{
  position:absolute;
  inset:0;
  border-radius:42px;
  pointer-events:none;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.12);
}
.fp-base{
  width:100%;
  height:560px;
  object-fit:cover;
  display:block;
  opacity:.95;
  transform:scale(1.06);
}
.fp-layer{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  object-fit:cover;
  opacity:0;
}
.fp-layer-active{
  opacity:1;
  animation: fpIn .55s var(--ease);
}
.fp-layer-prev{
  opacity:1;
  animation: fpOut .55s var(--ease) forwards;
}
@keyframes fpIn{
  from{ opacity:0; filter:blur(10px); transform:scale(1.02); }
  to{ opacity:1; filter:blur(0); transform:scale(1); }
}
@keyframes fpOut{
  from{ opacity:1; filter:blur(0); transform:scale(1); }
  to{ opacity:0; filter:blur(14px); transform:scale(1.01); }
}
.fp-placeholder{
  display:grid;
  place-items:center;
  color:rgba(255,255,255,.82);
  background:linear-gradient(180deg, rgba(193,18,31,.18), rgba(0,0,0,.85));
  border:1px solid rgba(255,255,255,.14);
}
.fp-ph-title{ font-weight:950; letter-spacing:-.02em; }
.fp-ph-sub{ font-size:13px; opacity:.8; margin-top:6px; }
.fp-badge{
  position:absolute;
  left:18px;
  top:18px;
  display:inline-flex;
  align-items:center;
  gap:10px;
  padding:10px 14px;
  border-radius:999px;
  background:rgba(11,11,12,.55);
  border:1px solid rgba(255,255,255,.14);
  color:#fff;
  backdrop-filter: blur(12px);
  font-weight:900;
}
.fp-badge-dot{
  width:10px;height:10px;border-radius:50%;
  background:var(--red);
  box-shadow:0 0 0 6px rgba(193,18,31,.18);
}
.fp-meta{
  margin-top:16px;
  display:grid;
  grid-template-columns:repeat(3, 1fr);
  gap:12px;
}
.fp-meta-card{
  background:rgba(255,255,255,.78);
  border:1px solid rgba(0,0,0,.08);
  border-radius:18px;
  padding:14px;
  backdrop-filter: blur(14px);
  box-shadow:0 26px 70px rgba(0,0,0,.10);
}
.fp-meta-k{
  font-size:11px;
  font-weight:950;
  letter-spacing:.22em;
  text-transform:uppercase;
  color:var(--red);
}
.fp-meta-v{
  margin-top:8px;
  color:var(--ink70);
  font-weight:650;
  line-height:1.6;
  font-size:13px;
}

/* ================= COLOR LAB ================= */
.color-lab{
  position:relative;
  overflow:hidden;
  background:#fafafa;
}
.cl-ambient{
  position:absolute;
  inset:-30%;
  background:
    radial-gradient(800px 520px at 25% 30%, rgba(193,18,31,.14), transparent 65%),
    radial-gradient(900px 620px at 80% 70%, rgba(0,0,0,.10), transparent 65%);
  pointer-events:none;
  filter: blur(12px);
  transform: translate3d(0, calc(var(--par2) * -1px), 0);
}
.cl-grid{
  position:relative;
  display:grid;
  grid-template-columns:1.05fr .95fr;
  gap:48px;
  align-items:center;
}
.cl-kicker{
  font-size:12px;
  font-weight:950;
  letter-spacing:.30em;
  color:var(--red);
}
.cl-title{
  font-size:44px;
  font-weight:900;
  letter-spacing:-.04em;
  margin:16px 0 10px;
  line-height:1.05;
}
.cl-sub{
  color:var(--ink70);
  line-height:1.8;
  font-size:16px;
  max-width:650px;
}
.cl-actions{ margin-top:18px; display:flex; gap:10px; flex-wrap:wrap; }
.cl-bullets{ margin-top:18px; display:flex; flex-direction:column; gap:10px; }
.cl-bullet{
  display:flex; align-items:center; gap:10px;
  color:var(--ink70);
  font-weight:700;
}
.cl-bullet-dot{
  width:10px;height:10px;border-radius:50%;
  background:var(--red);
  box-shadow:0 0 0 6px rgba(193,18,31,.12);
}
.cl-card{
  background:rgba(255,255,255,.82);
  border:1px solid rgba(0,0,0,.08);
  border-radius:28px;
  padding:22px;
  backdrop-filter: blur(16px);
  box-shadow:0 60px 160px rgba(0,0,0,.14);
}
.cl-card-top{ display:flex; align-items:baseline; justify-content:space-between; gap:12px; }
.cl-card-title{ font-weight:950; letter-spacing:-.02em; }
.cl-card-sub{ color:var(--ink55); font-weight:750; font-size:12px; }
.cl-matrix{
  margin-top:14px;
  display:grid;
  grid-template-columns:repeat(8, 1fr);
  gap:10px;
}
.cl-swatch{
  aspect-ratio:1/1;
  border-radius:10px;
  border:1px solid rgba(0,0,0,.08);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.65),
    0 10px 26px rgba(0,0,0,.10);
  position:relative;
  transform: translateZ(0);
  transition: transform .22s var(--ease), box-shadow .22s var(--ease);
  overflow:hidden;
}
.cl-swatch::after{
  content:"";
  position:absolute;
  inset:0;
  background:
    radial-gradient(circle at 30% 25%, rgba(255,255,255,.40), transparent 55%),
    linear-gradient(180deg, rgba(255,255,255,.18), rgba(0,0,0,.06));
  opacity:.55;
  pointer-events:none;
}
.cl-swatch:hover{ transform:translateY(-2px) scale(1.02); }
.cl-card-foot{
  margin-top:14px;
  display:flex;
  gap:8px;
  flex-wrap:wrap;
}
.cl-chip{
  font-size:11px;
  font-weight:950;
  letter-spacing:.12em;
  text-transform:uppercase;
  color:var(--ink55);
  padding:8px 10px;
  border-radius:999px;
  border:1px solid rgba(0,0,0,.08);
  background:rgba(255,255,255,.70);
}

/* ================= SYSTEM METHOD ================= */
.system-method{
  background:
    radial-gradient(900px 520px at 80% 30%, rgba(193,18,31,.10), transparent 60%),
    #fff;
}
.step-card{
  background:#fff;
  border:1px solid rgba(0,0,0,.08);
  border-radius:26px;
  padding:26px;
  box-shadow:0 40px 110px rgba(0,0,0,.10);
  height:100%;
  transition:transform .22s var(--ease), box-shadow .22s var(--ease);
  position:relative;
  overflow:hidden;
}
.step-card::after{
  content:"";
  position:absolute;
  inset:-120px -120px auto auto;
  width:240px;height:240px;
  background:radial-gradient(circle, rgba(193,18,31,.12), transparent 60%);
}
.step-card:hover{
  transform:translateY(-6px);
  box-shadow:0 70px 160px rgba(0,0,0,.14);
}
.step-no{
  font-weight:950;
  color:var(--red);
  letter-spacing:.22em;
  font-size:12px;
}
.step-title{
  margin-top:10px;
  font-weight:950;
  letter-spacing:-.02em;
  font-size:18px;
}
.step-desc{
  margin-top:10px;
  color:var(--ink70);
  line-height:1.75;
  font-weight:650;
}

.method-strip{
  margin-top:36px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:16px;
  padding:22px 22px;
  border-radius:26px;
  background:rgba(11,11,12,.92);
  border:1px solid rgba(255,255,255,.10);
  box-shadow:0 44px 140px rgba(0,0,0,.20);
  color:#fff;
}
.ms-title{ font-weight:950; letter-spacing:-.02em; }
.ms-sub{ color:rgba(255,255,255,.70); font-size:13px; margin-top:4px; }
.ms-actions{ display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end; }

/* ================= FINAL CTA ================= */
.final-cta{
  position:relative;
  overflow:hidden;
  color:#fff;
  text-align:center;
  background:linear-gradient(180deg, rgba(193,18,31,.16), rgba(11,11,12,.94));
}
.cta-ambient{
  position:absolute;
  inset:-160px -120px auto -120px;
  height:520px;
  background:
    radial-gradient(closest-side at 50% 40%, rgba(193,18,31,.32), transparent 70%),
    radial-gradient(closest-side at 70% 55%, rgba(193,18,31,.18), transparent 66%);
  filter: blur(10px);
  pointer-events:none;
  transform: translate3d(0, calc(var(--par1) * -1px), 0);
}
.cta-shell{
  position:relative;
  max-width:860px;
  margin:0 auto;
}
.cta-shell h2{
  font-size:46px;
  letter-spacing:-.04em;
  font-weight:950;
  margin:0 0 14px;
}
.cta-shell p{
  color:rgba(255,255,255,.72);
  font-size:16px;
  line-height:1.8;
  margin:0 auto;
  max-width:720px;
}
.cta-actions{
  display:flex;
  justify-content:center;
  gap:12px;
  flex-wrap:wrap;
  margin-top:26px;
}

/* Responsive */
@media(max-width:1100px){
  .intro-grid{ grid-template-columns:1fr; }
  .hero-row{ grid-template-columns:1fr; }
  .fp-grid{ grid-template-columns:1fr; }
  .fp-meta{ grid-template-columns:1fr; }
  .cl-grid{ grid-template-columns:1fr; }
  .method-strip{ flex-direction:column; align-items:flex-start; text-align:left; }
  .ms-actions{ width:100%; justify-content:flex-start; }
  .hero-strip{ flex-direction:column; align-items:flex-start; text-align:left; }
  .hero-strip-actions{ width:100%; justify-content:flex-start; }
}
@media(max-width:768px){
  section{ padding:96px 18px; }
  .intro-title{ font-size:40px; }
  .section-title{ font-size:34px; }
  .fp-base{ height:420px; }
  .cl-title{ font-size:34px; }
  .cta-shell h2{ font-size:34px; }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce){
  [data-reveal]{ transition:none; transform:none; opacity:1; }
  .pill, .action-glass, .family-card, .step-card, .fp-option{ transition:none; }
  .fp-layer-active, .fp-layer-prev{ animation:none; opacity:1; filter:none; transform:none; }
  .fp-visual.fp-has-mouse{ transform:none; }
}
      `}</style>
      </div>

      {/* ================= STYLES ================= */}
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
        }

        .home-root{
          background:
            radial-gradient(1200px 700px at 20% 0%, rgba(193,18,31,.10), transparent 55%),
            radial-gradient(900px 700px at 85% 18%, rgba(193,18,31,.08), transparent 55%),
            #fff;
        }

        .carousel-section{
          padding:0 !important;
        }

        section{ padding:110px 24px; }
        .container{ max-width:1200px; }

        /* Reveal animation */
        [data-reveal]{
          opacity:0;
          transform:translateY(14px);
          transition:opacity .75s ease, transform .75s ease;
          will-change:transform, opacity;
        }
        .is-in{
          opacity:1;
          transform:translateY(0);
        }

        /* Section headings */
        .section-head{
          text-align:center;
          max-width:820px;
          margin:0 auto 18px;
        }

        .section-title{
          font-size:40px;
          font-weight:760;
          letter-spacing:-.03em;
          color:var(--black);
          margin:0;
        }

        .section-sub{
          color:var(--ink70);
          margin-top:12px;
          font-size:16px;
          line-height:1.6;
        }

        /* INTRO */
        .intro-section{
          position:relative;
          padding:50px 24px 110px;
          text-align:center;
          overflow:hidden;
        }

        .intro-ambient{
          position:absolute;
          inset:-160px -140px auto -140px;
          height:420px;
          background:
            radial-gradient(closest-side at 50% 50%, rgba(193,18,31,.18), transparent 70%),
            radial-gradient(closest-side at 20% 40%, rgba(225,29,46,.14), transparent 65%);
          filter: blur(10px);
          pointer-events:none;
        }

        .intro-shell{
          position:relative;
          max-width:920px;
          margin:0 auto;
        }

        .intro-eyebrow{
          font-size:12px;
          letter-spacing:.32em;
          color:var(--red);
          font-weight:800;
        }

        .intro-shell h1{
          font-size:54px;
          margin:22px 0 14px;
          letter-spacing:-.04em;
          font-weight:820;
          color:var(--black);
        }

        .headline-accent{
          color:var(--red);
        }

        .intro-shell p{
          font-size:18px;
          color:var(--ink70);
          line-height:1.7;
          margin:0 auto;
          max-width:760px;
        }

        .mini-stats{
          margin:34px auto 0;
          display:grid;
          grid-template-columns:repeat(4, 1fr);
          gap:14px;
          max-width:760px;
        }

        .mini-stat{
          background:rgba(255,255,255,.65);
          border:1px solid rgba(0,0,0,.06);
          border-radius:18px;
          padding:16px 14px;
          box-shadow:0 22px 50px rgba(0,0,0,.06);
          backdrop-filter: blur(14px);
        }

        .mini-val{
          font-size:18px;
          font-weight:820;
          letter-spacing:-.02em;
          color:var(--black);
        }

        .mini-key{
          margin-top:6px;
          font-size:12px;
          letter-spacing:.14em;
          text-transform:uppercase;
          color:var(--ink55);
          font-weight:800;
        }

        .intro-actions{
          margin-top:28px;
          display:flex;
          justify-content:center;
          gap:14px;
          flex-wrap:wrap;
        }

        /* Pills */
        .pill{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding:14px 34px;
          border-radius:999px;
          font-weight:750;
          font-size:14px;
          text-decoration:none;
          letter-spacing:.01em;
          transition:transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease;
          user-select:none;
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

        .pill.on-dark{
          background:rgba(255,255,255,.14);
          border:1px solid rgba(255,255,255,.22);
          color:#fff;
        }

        .pill:hover{
          transform:translateY(-2px);
          box-shadow:0 28px 80px rgba(0,0,0,.14);
        }

        /* QUICK ACTIONS */
        .quick-actions{
          background:
            radial-gradient(900px 460px at 20% 50%, rgba(193,18,31,.10), transparent 60%),
            #fafafa;
        }

        .action-glass{
          display:block;
          background:var(--glass);
          backdrop-filter:blur(18px);
          border-radius:28px;
          padding:40px;
          text-decoration:none;
          color:inherit;
          box-shadow:var(--shadow);
          border:1px solid rgba(0,0,0,.06);
          transition:transform .22s ease, box-shadow .22s ease;
          position:relative;
          overflow:hidden;
        }

        .action-glass::before{
          content:"";
          position:absolute;
          inset:-60px -80px auto auto;
          width:220px;
          height:220px;
          background:radial-gradient(circle, rgba(193,18,31,.14), transparent 62%);
          transform:translate3d(0,0,0);
          filter: blur(2px);
        }

        .action-glass:hover{
          transform:translateY(-5px);
          box-shadow:0 60px 130px rgba(0,0,0,.16);
        }

        .action-top{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:14px;
        }

        .action-glass h4{
          margin:0 0 14px;
          font-weight:820;
          letter-spacing:-.02em;
        }

        .action-chip{
          font-size:11px;
          font-weight:800;
          letter-spacing:.18em;
          text-transform:uppercase;
          color:var(--red);
          background:rgba(193,18,31,.10);
          border:1px solid rgba(193,18,31,.22);
          padding:7px 10px;
          border-radius:999px;
        }

        .action-glass p{
          color:var(--ink70);
          line-height:1.6;
          margin:0 0 18px;
          max-width:320px;
        }

        .action-arrow{
          font-size:22px;
          color:var(--red);
          font-weight:700;
        }

        /* FAMILIES */
        .families-section{
          position:relative;
          overflow:hidden;
          padding: 50px 24px;
        }

        .families-ambient{
          position:absolute;
          inset:auto -220px -220px -220px;
          height:520px;
          background:
            radial-gradient(closest-side at 50% 40%, rgba(193,18,31,.14), transparent 68%),
            radial-gradient(closest-side at 70% 55%, rgba(193,18,31,.10), transparent 66%);
          pointer-events:none;
          filter: blur(10px);
        }

        .family-card{
          display:block;
          padding:34px;
          border-radius:24px;
          border:1px solid rgba(0,0,0,.08);
          text-decoration:none;
          color:inherit;
          background:rgba(255,255,255,.78);
          backdrop-filter: blur(14px);
          transition:transform .2s ease, box-shadow .2s ease, border-color .2s ease;
          height:100%;
        }

        .family-card:hover{
          transform:translateY(-4px);
          box-shadow:0 44px 100px rgba(0,0,0,.14);
          border-color:rgba(193,18,31,.18);
        }

        .family-top{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
        }

        .family-card h5{
          margin:0 0 10px;
          font-weight:820;
          letter-spacing:-.02em;
        }

        .family-card p{
          margin:0 0 16px;
          color:var(--ink70);
        }

        .family-dot{
          width:10px;
          height:10px;
          border-radius:999px;
          background:var(--red);
          box-shadow:0 0 0 6px rgba(193,18,31,.12);
        }

        .family-cta{
          color:var(--red);
          font-weight:800;
        }

        /* WHY */
        .why-section{
          background:
            radial-gradient(1000px 520px at 80% 40%, rgba(193,18,31,.10), transparent 60%),
            #fff;
            padding: 40px;
        }

        .why-card{
          background:#fff;
          padding:30px;
          border-radius:26px;
          box-shadow:0 40px 100px rgba(0,0,0,.10);
          border:1px solid rgba(0,0,0,.06);
          height:100%;
          transition:transform .2s ease, box-shadow .2s ease;
          position:relative;
          overflow:hidden;
        }

        .why-card::after{
          content:"";
          position:absolute;
          inset:-120px -120px auto auto;
          width:240px;
          height:240px;
          background:radial-gradient(circle, rgba(193,18,31,.12), transparent 60%);
        }

        .why-card:hover{
          transform:translateY(-4px);
          box-shadow:0 60px 130px rgba(0,0,0,.14);
        }

        .why-icon{
          width:42px;
          height:42px;
          border-radius:14px;
          background:linear-gradient(180deg, rgba(193,18,31,.18), rgba(193,18,31,.06));
          border:1px solid rgba(193,18,31,.18);
          box-shadow:0 20px 44px rgba(193,18,31,.14);
          margin-bottom:16px;
        }

        .why-card h5{
          font-weight:820;
          letter-spacing:-.02em;
          margin-bottom:10px;
        }

        .why-card p{
          color:var(--ink70);
          margin:0;
          line-height:1.65;
        }

        .why-strip{
          margin-top:44px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:18px;
          padding:26px 26px;
          border-radius:26px;
          background:rgba(11,11,12,.92);
          color:#fff;
          box-shadow:0 40px 110px rgba(0,0,0,.20);
          border:1px solid rgba(255,255,255,.10);
        }

        .strip-title{
          font-weight:860;
          letter-spacing:-.02em;
          font-size:18px;
        }

        .strip-sub{
          color:rgba(255,255,255,.70);
          margin-top:6px;
          font-size:14px;
        }

        .strip-actions{
          display:flex;
          gap:12px;
          flex-wrap:wrap;
          justify-content:flex-end;
        }

        /* TESTIMONIAL */
        .testimonial-section{
          background:
            radial-gradient(1000px 520px at 20% 60%, rgba(193,18,31,.10), transparent 60%),
            #fff;
            padding: 40px;
        }

        .testimonial-card{
          background:#0b0b0c;
          color:#fff;
          padding:30px;
          border-radius:28px;
          border:1px solid rgba(255,255,255,.10);
          box-shadow:0 44px 120px rgba(0,0,0,.22);
          height:100%;
        }

        .testimonial-card p{
          font-size:16px;
          line-height:1.7;
          margin:0;
        }

        .testimonial-card footer{
          margin-top:14px;
          color:rgba(255,255,255,.65);
          font-weight:700;
          letter-spacing:.02em;
        }

        /* FINAL CTA */
        .final-cta{
          position:relative;
          overflow:hidden;
          color:#fff;
          text-align:center;
          background:linear-gradient(180deg, rgba(193,18,31,.14), rgba(11,11,12,.94));
        }

        .cta-ambient{
          position:absolute;
          inset:-160px -120px auto -120px;
          height:520px;
          background:
            radial-gradient(closest-side at 50% 40%, rgba(193,18,31,.30), transparent 70%),
            radial-gradient(closest-side at 70% 55%, rgba(193,18,31,.18), transparent 66%);
          filter: blur(10px);
          pointer-events:none;
        }

        .cta-shell{
          position:relative;
          max-width:820px;
          margin:0 auto;
        }

        .cta-shell h2{
          font-size:44px;
          letter-spacing:-.03em;
          font-weight:860;
          margin:0 0 14px;
        }

        .cta-shell p{
          color:rgba(255,255,255,.72);
          font-size:16px;
          line-height:1.7;
          margin:0 auto;
          max-width:720px;
        }

        .cta-actions{
          display:flex;
          justify-content:center;
          gap:14px;
          flex-wrap:wrap;
          margin-top:28px;
        }

        /* Responsive */
        @media(max-width:992px){
          section{ padding:92px 18px; }
          .intro-shell h1{ font-size:42px; }
          .section-title{ font-size:34px; }
          .mini-stats{ grid-template-columns:repeat(2, 1fr); }
          .why-strip{ flex-direction:column; text-align:left; align-items:flex-start; }
          .strip-actions{ width:100%; justify-content:flex-start; }
        }

        @media(max-width:768px){
          .intro-section{ padding:50px 18px 90px; }
          .intro-shell p{ font-size:16px; }
          .cta-shell h2{ font-size:34px; }
        }

        @media (prefers-reduced-motion: reduce){
          [data-reveal]{ transition:none; transform:none; opacity:1; }
          .pill, .action-glass, .family-card, .why-card{ transition:none; }
        }
        /* =========================
   HOME – PREMIUM SECTIONS
   ========================= */

:root{
  --red:#c1121f;
  --black:#0b0b0c;
  --ink70:rgba(11,11,12,.7);
  --ink55:rgba(11,11,12,.55);
  --glass:rgba(255,255,255,.85);
  --ease:cubic-bezier(.22,.61,.36,1);
}

/* ---------- ZODIAC SECTION ---------- */
.home-zodiac{
  padding:80px 24px;
  background:
    radial-gradient(700px 420px at 15% 30%, rgba(193,18,31,.12), transparent 60%),
    #fff;
}

.hz-shell{
  max-width:1100px;
  margin:auto;
  display:grid;
  grid-template-columns:1.1fr .9fr;
  gap:80px;
  align-items:center;
}

.hz-eyebrow{
  font-size:12px;
  letter-spacing:.32em;
  font-weight:700;
  color:var(--red);
}

.hz-copy h2{
  font-size:44px;
  font-weight:700;
  letter-spacing:-.03em;
  margin:18px 0 14px;
}

.hz-copy p{
  font-size:17px;
  color:var(--ink70);
  max-width:520px;
  line-height:1.7;
}

.hz-cta{
  display:inline-block;
  margin-top:26px;
  font-weight:600;
  color:var(--red);
  text-decoration:none;
  position:relative;
}

.hz-cta::after{
  content:"";
  position:absolute;
  left:0;
  bottom:-4px;
  width:0;
  height:2px;
  background:var(--red);
  transition:width .3s var(--ease);
}

.hz-cta:hover::after{ width:100%; }

.hz-visual img{
  width:100%;
  max-width:420px;
  margin:auto;
  display:block;
  opacity:.95;
}

/* ---------- COLOR LIBRARY ---------- */
.home-colors{
  padding:140px 24px;
  background:#fafafa;
}

.hc-grid{
  max-width:1100px;
  margin:auto;
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:80px;
  align-items:center;
}

.hc-left h2{
  font-size:42px;
  font-weight:700;
  letter-spacing:-.03em;
}

.hc-left p{
  margin-top:12px;
  font-size:17px;
  color:var(--ink70);
  max-width:520px;
}

.color-matrix{
  display:grid;
  grid-template-columns:repeat(6,1fr);
  gap:10px;
}

.color-matrix div{
  aspect-ratio:1/1;
  border-radius:6px;
  background:#ddd; /* replace dynamically */
  transition:transform .3s var(--ease);
}

.color-matrix div:hover{
  transform:scale(1.05);
}

/* ---------- PRODUCT ECOSYSTEM ---------- */
.home-ecosystem{
  padding:140px 24px;
  background:#fff;
  text-align:center;
}

.home-ecosystem h2{
  font-size:44px;
  font-weight:700;
  margin-bottom:60px;
}

.eco-cards{
  max-width:1100px;
  margin:auto;
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:32px;
}

.eco-card{
  background:var(--glass);
  backdrop-filter:blur(16px);
  border-radius:26px;
  padding:40px;
  text-decoration:none;
  color:inherit;
  box-shadow:0 30px 70px rgba(0,0,0,.12);
  transition:transform .3s var(--ease), box-shadow .3s var(--ease);
}

.eco-card:hover{
  transform:translateY(-4px);
  box-shadow:0 50px 110px rgba(0,0,0,.18);
}

.eco-card img{
  width:44px;
  margin-bottom:18px;
}

.eco-card h4{
  font-size:20px;
  margin-bottom:10px;
}

.eco-card p{
  font-size:15px;
  color:var(--ink70);
  line-height:1.6;
}

/* ---------- GUIDANCE CTA ---------- */
.home-guidance{
  padding:140px 24px;
  background:
    radial-gradient(600px 360px at 50% 20%, rgba(193,18,31,.15), transparent 60%),
    #0b0b0c;
  color:#fff;
}

.hg-card{
  max-width:900px;
  margin:auto;
  text-align:center;
}

.hg-card h2{
  font-size:42px;
  font-weight:700;
}

.hg-card p{
  margin-top:14px;
  font-size:17px;
  color:rgba(255,255,255,.75);
}

.hg-actions{
  margin-top:36px;
  display:flex;
  justify-content:center;
  gap:18px;
  flex-wrap:wrap;
}

/* ---------- DEALER STRIP ---------- */
.home-dealer-strip{
  padding:80px 24px;
  background:#111;
  color:#fff;
}

.strip-shell{
  max-width:1000px;
  margin:auto;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:32px;
}

.strip-shell h3{
  font-size:28px;
  font-weight:600;
}

.strip-shell p{
  color:rgba(255,255,255,.7);
  max-width:420px;
}

.strip-cta{
  color:#fff;
  text-decoration:none;
  font-weight:600;
  border-bottom:2px solid rgba(255,255,255,.4);
  padding-bottom:4px;
}

/* ---------- SUPPORT ---------- */
.home-support{
  padding:120px 24px;
  background:#fafafa;
}

.hs-grid{
  max-width:900px;
  margin:auto;
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:60px;
}

.hs-grid h4{
  font-size:18px;
  font-weight:600;
}

.hs-grid p{
  font-size:15px;
  color:var(--ink70);
  margin:10px 0 12px;
}

.hs-grid a{
  color:var(--red);
  font-weight:600;
  text-decoration:none;
}

/* ---------- RESPONSIVE ---------- */
@media(max-width:900px){
  .hz-shell,
  .hc-grid,
  .eco-cards,
  .hs-grid{
    grid-template-columns:1fr;
  }

  .strip-shell{
    flex-direction:column;
    text-align:center;
  }
}

      `}</style>
    </>
  );
}
