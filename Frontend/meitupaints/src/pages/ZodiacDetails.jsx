import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import ZODIACS from "../ProductsList/ZodiacList.json";

function ZodiacDetails() {
  const { zodiac } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const rootRef = useRef(null);

  // Prevent browser from restoring previous scroll position on SPA navigation
  useLayoutEffect(() => {
    try {
      window.history.scrollRestoration = "manual";
    } catch {
      // ignore
    }
  }, []);

  // Always jump to the top on route entry + reload (NO animation)
  useLayoutEffect(() => {
    const jumpTop = () => {
      // iOS Safari sometimes needs all of these
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);

      // ensure the page root is the top target (extra insurance)
      rootRef.current?.scrollIntoView?.({ block: "start" });
    };

    // Run immediately + repeat to beat late restoration/layout shifts
    jumpTop();
    const raf = requestAnimationFrame(jumpTop);
    const t0 = setTimeout(jumpTop, 0);
    const t50 = setTimeout(jumpTop, 50);
    const t150 = setTimeout(jumpTop, 150);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t0);
      clearTimeout(t50);
      clearTimeout(t150);
    };
  }, [location.pathname]);

  const z = useMemo(() => {
    return ZODIACS.find((x) => x.id === zodiac) || null;
  }, [zodiac]);

  // Subtle Apple-like scroll reveal
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      el.querySelectorAll("[data-reveal]").forEach((n) =>
        n.classList.add("in")
      );
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        });
      },
      { threshold: 0.12 }
    );

    el.querySelectorAll("[data-reveal]").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [z]);

  if (!z) {
    return (
      <>
        <NavBar />
        <div className="container py-5 text-center">
          <h2 className="mb-2">Zodiac not found</h2>
          <p className="text-muted">
            We couldn’t locate that sign. Please return and select a zodiac.
          </p>
          <Link
            className="btn btn-danger rounded-pill px-4 mt-3"
            to="/horoscope"
          >
            Back to Zodiac
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main ref={rootRef} className="zdx">
        {/* Top back + crumbs */}
        <section className="zdx-top">
          <div className="zdx-shell">
            <button
              type="button"
              className="zdx-back"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <span className="zdx-back-ic">‹</span>
              <span>Back</span>
            </button>

            <div className="zdx-crumbs">
              <Link to="/" className="zdx-crumb">
                Home
              </Link>
              <span className="zdx-dot">•</span>
              <Link to="/horoscope" className="zdx-crumb">
                Horoscope
              </Link>
              <span className="zdx-dot">•</span>
              <span className="zdx-crumb active">{z.name}</span>
            </div>
          </div>
        </section>

        {/* HERO */}
        <header className="zdx-hero">
          <div className="zdx-shell">
            <div className="zdx-hero-grid">
              {/* LEFT: Copy */}
              <div className="zdx-hero-copy" data-reveal>
                <span className="zdx-eyebrow">
                  MEITU • ZODIAC COLOUR SYSTEM
                </span>

                <h1 className="zdx-title">
                  <span className="zdx-title-soft">
                    The Signature Palette of
                  </span>{" "}
                  <span className="zdx-title-strong">{z.name}</span>
                </h1>

                <p className="zdx-hook">{z.hook}</p>

                {/* Extra verbose content (beyond dataset) */}
                <div className="zdx-copy-block">
                  <p>
                    Colour isn’t decoration it’s perception. It shapes how a
                    space feels before a single word is spoken. Your zodiac
                    archetype hints at what you naturally seek: calm, intensity,
                    focus, warmth, clarity, or confidence.
                  </p>
                  <p>
                    This page translates <strong>{z.name}</strong> into a
                    refined, usable colour direction six carefully paired tones
                    that can lead a full interior story: base walls, feature
                    surfaces, trims, accents, and high-impact highlights.
                  </p>
                  <p className="zdx-muted">
                    Tip: Start with one “foundation shade”, then choose one
                    accent colour for depth and identity. Use the remaining
                    colours for balance and contrast.
                  </p>
                </div>

                {/* Quick actions */}
                <div className="zdx-actions" data-reveal>
                  <Link to="/products" className="zdx-btn primary">
                    Explore Products <span className="arr">→</span>
                  </Link>
                  <Link to="/ratecalculator" className="zdx-btn ghost">
                    Estimate Cost <span className="arr">→</span>
                  </Link>
                  <Link to="/inquiry" className="zdx-btn outline">
                    Ask an Expert <span className="arr">→</span>
                  </Link>
                </div>

                {/* Metrics strip */}
                <div className="zdx-metrics" data-reveal>
                  <div className="metric">
                    <div className="metric-k">6</div>
                    <div className="metric-v">Curated colours</div>
                  </div>
                  <div className="metric">
                    <div className="metric-k">3</div>
                    <div className="metric-v">Use cases per colour</div>
                  </div>
                  <div className="metric">
                    <div className="metric-k">∞</div>
                    <div className="metric-v">Combinations</div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Big bold symbol */}
              <div className="zdx-hero-art" data-reveal>
                <div className="zdx-art-glass">
                  <img className="zdx-symbol" src={z.imgSrc} alt={z.name} />
                  <div className="zdx-art-ring" />
                  <div className="zdx-art-ring r2" />
                  <div className="zdx-art-ring r3" />
                </div>

                <div className="zdx-art-caption">
                  <div className="cap-title">Zodiac Mark</div>
                  <div className="cap-sub">
                    "Zodiac" comes from the Greek for "circle of animals," and
                    while we know 12 signs, there were originally 13.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* PALETTE (6 in one line on desktop) */}
        <section className="zdx-palette">
          <div className="zdx-shell">
            <div className="zdx-section-head" data-reveal>
              <h2>Official Palette</h2>
              <p>
                Six tones designed to express the <strong>{z.name}</strong>{" "}
                temperament in real spaces from minimal modern rooms to
                expressive feature walls.
              </p>
            </div>

            <div className="zdx-palette-row" data-reveal>
              {z.bestColors.map((c) => (
                <div key={c.name} className="zdx-color-card">
                  <div className="zdx-swatch" style={{ background: c.rgb }} />
                  <div className="zdx-color-meta">
                    <div className="zdx-color-name">{c.name}</div>
                    <div className="zdx-color-rgb">{c.rgb}</div>
                  </div>

                  {/* Extra content (beyond dataset) */}
                  <div className="zdx-color-uses">
                    <span className="use">Walls</span>
                    <span className="use">Accents</span>
                    <span className="use">Trim</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Guidance cards */}
            <div className="zdx-guides" data-reveal>
              <div className="zdx-guide-card">
                <h3>How to Use This Palette</h3>
                <p>
                  Choose <strong>1 foundation colour</strong> (your main wall
                  tone), then select
                  <strong> 1 signature accent</strong> (feature wall or
                  highlight). Use the remaining shades to balance brightness,
                  warmth, and contrast.
                </p>
                <ul>
                  <li>
                    Foundation: large surfaces (living, bedrooms, hallways)
                  </li>
                  <li>Accent: one wall, niche, arch, or texture panel</li>
                  <li>Trim: doors, skirting, cornices, railings</li>
                </ul>
              </div>

              <div className="zdx-guide-card">
                <h3>Finish Recommendations</h3>
                <p>
                  Your palette becomes truly premium when finish is chosen
                  correctly it controls light. If you want that
                  “architect-designed” feel, finish is not optional.
                </p>
                <ul>
                  <li>
                    Matte: soft, calm, minimal reflection (most premium
                    interiors)
                  </li>
                  <li>Eggshell: easy-clean + subtle sheen (family rooms)</li>
                  <li>Satin: modern, crisp, durable (doors & trims)</li>
                </ul>
              </div>

              <div className="zdx-guide-card">
                <h3>Space Mood Tuning</h3>
                <p>
                  If the room gets strong sunlight, choose deeper tones for
                  stability. If the room is shaded, choose brighter and warmer
                  tones to prevent dullness.
                </p>
                <ul>
                  <li>Sunny rooms → deeper tones feel grounded</li>
                  <li>Shaded rooms → brighter tones lift mood</li>
                  <li>Small rooms → lighter base + bold accent</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* STORY / BRAND PANEL */}
        <section className="zdx-story">
          <div className="zdx-shell">
            <div className="zdx-story-grid">
              <div className="zdx-story-card" data-reveal>
                <h2>Why Zodiac Colour Works</h2>
                <p>
                  People don’t just choose paint they choose an identity for
                  their space. Zodiac colour systems provide a structured,
                  emotionally aligned way to decide, especially when you’re
                  overwhelmed by endless shade options.
                </p>
                <p>
                  Your <strong>{z.name}</strong> palette is designed to be
                  “complete”: it contains a foundation option, supporting tones,
                  and statement accents. It’s not random it’s composition.
                </p>
              </div>

              <div className="zdx-story-card spotlight" data-reveal>
                <h2>Meitu’s Design Standard</h2>
                <p>
                  Premium isn’t a look it’s a discipline: clean geometry,
                  refined contrast, and predictable behaviour under real light.
                  We build coating systems to support that discipline.
                </p>
                <div className="zdx-mini-pills">
                  <span>Low-odour</span>
                  <span>High coverage</span>
                  <span>Stable colour</span>
                  <span>Durable finish</span>
                  <span>Architect-ready</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="zdx-final">
          <div className="zdx-shell">
            <div className="zdx-final-card" data-reveal>
              <div className="zdx-final-left">
                <h2>Ready to apply {z.name} to your home?</h2>
                <p>
                  Tell us your room size, lighting, and surface condition we’ll
                  recommend a system, estimate the cost, and help you pick the
                  closest Meitu shades for this palette.
                </p>
              </div>

              <div className="zdx-final-actions">
                <Link className="zdx-btn primary" to="/inquiry">
                  Enquire About This Palette <span className="arr">→</span>
                </Link>
                <button className="zdx-btn ghost" onClick={() => navigate(-1)}>
                  Back to Collection <span className="arr">→</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* INLINE STYLES */}
        <style>{`
          :root{
            --red:#c1121f;
            --black:#0b0b0c;
            --ink70:rgba(11,11,12,.72);
            --ink55:rgba(11,11,12,.55);
            --glass:rgba(255,255,255,.84);
            --glass2:rgba(255,255,255,.72);
          }

          .zdx{
            background:
              radial-gradient(circle at 10% 0%, rgba(193,18,31,.10), transparent 45%),
              radial-gradient(circle at 85% 18%, rgba(0,0,0,.06), transparent 50%),
              linear-gradient(180deg, #ffffff, #fbfbfb 55%, #ffffff);
          }

          .zdx-shell{
            max-width:1200px;
            margin:auto;
            padding:0 24px;
          }

          /* ===== TOP ===== */
          .zdx-top{
            padding:96px 0 0; /* keeps space under fixed navbar */
          }

          .zdx-top .zdx-shell{
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:18px;
          }

          .zdx-back{
            display:inline-flex;
            align-items:center;
            gap:10px;
            border:none;
            background:var(--glass);
            backdrop-filter:blur(18px);
            border:1px solid rgba(0,0,0,.07);
            padding:10px 14px;
            border-radius:999px;
            color:var(--black);
            font-weight:600;
            box-shadow:0 14px 40px rgba(0,0,0,.12);
            transition:transform .18s ease, box-shadow .18s ease;
          }

          .zdx-back:hover{
            transform:translateY(-2px);
            box-shadow:0 20px 60px rgba(0,0,0,.16);
          }

          .zdx-back-ic{
            font-size:20px;
            line-height:1;
            transform:translateY(-1px);
          }

          .zdx-crumbs{
            display:flex;
            align-items:center;
            gap:10px;
            color:var(--ink55);
            font-size:13px;
          }

          .zdx-crumb{
            color:inherit;
            text-decoration:none;
            padding:6px 10px;
            border-radius:999px;
            transition:background .15s ease, color .15s ease;
          }

          .zdx-crumb:hover{
            background:rgba(0,0,0,.04);
            color:var(--black);
          }

          .zdx-crumb.active{
            color:var(--black);
            font-weight:600;
            background:rgba(193,18,31,.08);
          }

          .zdx-dot{ opacity:.6; }

          /* ===== HERO ===== */
          .zdx-hero{
            padding:40px 0 90px;
          }

          .zdx-hero-grid{
            display:grid;
            grid-template-columns:1.2fr .8fr;
            gap:48px;
            align-items:start;
          }

          .zdx-eyebrow{
            display:inline-block;
            font-size:12px;
            font-weight:800;
            letter-spacing:.26em;
            color:var(--red);
            margin-bottom:16px;
          }

          .zdx-title{
            font-size:54px;
            line-height:1.05;
            letter-spacing:-.03em;
            margin:0 0 16px;
            color:var(--black);
          }

          .zdx-title-soft{
            font-weight:600;
            color:rgba(11,11,12,.62);
          }

          .zdx-title-strong{
            font-weight:800;
          }

          .zdx-hook{
            font-size:18px;
            color:var(--ink70);
            line-height:1.7;
            margin-bottom:22px;
          }

          .zdx-copy-block{
            background:var(--glass2);
            border:1px solid rgba(0,0,0,.06);
            border-radius:28px;
            padding:26px 26px;
            box-shadow:0 30px 80px rgba(0,0,0,.10);
          }

          .zdx-copy-block p{
            margin:0 0 14px;
            color:var(--ink70);
            line-height:1.75;
            font-size:15.5px;
          }

          .zdx-copy-block p:last-child{ margin-bottom:0; }
          .zdx-muted{ color:var(--ink55) !important; }

          /* Actions */
          .zdx-actions{
            display:flex;
            flex-wrap:wrap;
            gap:12px;
            margin-top:18px;
          }

          .zdx-btn{
            display:inline-flex;
            align-items:center;
            gap:10px;
            text-decoration:none;
            border-radius:999px;
            padding:12px 18px;
            font-weight:650;
            font-size:14px;
            transition:transform .18s ease, box-shadow .18s ease, background .18s ease;
            user-select:none;
          }

          .zdx-btn .arr{
            opacity:.85;
            transition:transform .18s ease;
          }

          .zdx-btn:hover .arr{
            transform:translateX(2px);
          }

          .zdx-btn.primary{
            background:var(--red);
            color:#fff;
            box-shadow:0 22px 60px rgba(193,18,31,.35);
          }

          .zdx-btn.primary:hover{
            transform:translateY(-2px);
            box-shadow:0 28px 72px rgba(193,18,31,.45);
          }

          .zdx-btn.ghost{
            background:rgba(11,11,12,.92);
            color:#fff;
            box-shadow:0 22px 60px rgba(0,0,0,.25);
          }

          .zdx-btn.ghost:hover{
            transform:translateY(-2px);
            box-shadow:0 30px 90px rgba(0,0,0,.32);
          }

          .zdx-btn.outline{
            border:2px solid rgba(193,18,31,.9);
            color:rgba(193,18,31,.95);
            background:rgba(255,255,255,.7);
            box-shadow:0 18px 50px rgba(0,0,0,.10);
          }

          .zdx-btn.outline:hover{
            transform:translateY(-2px);
            box-shadow:0 24px 70px rgba(0,0,0,.14);
          }

          /* Metrics */
          .zdx-metrics{
            margin-top:18px;
            display:flex;
            gap:10px;
          }

          .metric{
            flex:1;
            background:rgba(255,255,255,.70);
            border:1px solid rgba(0,0,0,.06);
            border-radius:22px;
            padding:14px 16px;
            box-shadow:0 20px 60px rgba(0,0,0,.08);
          }

          .metric-k{
            font-size:22px;
            font-weight:800;
            color:var(--black);
            letter-spacing:-.02em;
          }

          .metric-v{
            font-size:13px;
            color:var(--ink55);
          }

          /* Right art */
          .zdx-art-glass{
            position:relative;
            background:rgba(255,255,255,.75);
            border:1px solid rgba(0,0,0,.06);
            border-radius:34px;
            padding:34px;
            overflow:hidden;
            box-shadow:0 50px 120px rgba(0,0,0,.16);
          }

          .zdx-symbol{
            width:100%;
            max-width:360px;
            height:auto;
            display:block;
            margin:auto;
            transform:translateY(2px);
            filter:drop-shadow(0 30px 60px rgba(0,0,0,.18));
          }

          .zdx-art-ring{
            position:absolute;
            inset:-60px;
            border-radius:999px;
            border:1px solid rgba(193,18,31,.18);
            transform:rotate(12deg);
            pointer-events:none;
          }

          .zdx-art-ring.r2{
            inset:-120px;
            border-color:rgba(0,0,0,.10);
            transform:rotate(-6deg);
          }

          .zdx-art-ring.r3{
            inset:-180px;
            border-color:rgba(193,18,31,.10);
            transform:rotate(24deg);
          }

          .zdx-art-caption{
            margin-top:14px;
            padding:14px 16px;
            border-radius:22px;
            background:rgba(255,255,255,.72);
            border:1px solid rgba(0,0,0,.06);
            box-shadow:0 24px 70px rgba(0,0,0,.10);
          }

          .cap-title{
            font-weight:700;
            color:var(--black);
            margin-bottom:4px;
          }

          .cap-sub{
            color:var(--ink55);
            font-size:13px;
            line-height:1.5;
          }

          /* ===== PALETTE ===== */
          .zdx-palette{
            padding:90px 0;
          }

          .zdx-section-head{
            text-align:center;
            max-width:820px;
            margin:0 auto 34px;
          }

          .zdx-section-head h2{
            font-size:38px;
            font-weight:800;
            letter-spacing:-.02em;
            color:var(--black);
            margin-bottom:10px;
          }

          .zdx-section-head p{
            color:var(--ink70);
            line-height:1.7;
            margin:0;
            font-size:16px;
          }

          /* 6 in one line on desktop */
          .zdx-palette-row{
            display:grid;
            grid-template-columns:repeat(6, 1fr);
            gap:14px;
          }

          .zdx-color-card{
            background:rgba(255,255,255,.78);
            border:1px solid rgba(0,0,0,.06);
            border-radius:22px;
            padding:14px;
            box-shadow:0 26px 70px rgba(0,0,0,.10);
            transition:transform .18s ease, box-shadow .18s ease;
          }

          .zdx-color-card:hover{
            transform:translateY(-3px);
            box-shadow:0 34px 95px rgba(0,0,0,.14);
          }

          .zdx-swatch{
            width:100%;
            height:84px;
            border-radius:16px;
            box-shadow:inset 0 1px 0 rgba(255,255,255,.35);
          }

          .zdx-color-meta{
            margin-top:10px;
          }

          .zdx-color-name{
            font-weight:700;
            font-size:14px;
            color:var(--black);
          }

          .zdx-color-rgb{
            font-size:12px;
            color:var(--ink55);
          }

          .zdx-color-uses{
            display:flex;
            gap:8px;
            margin-top:10px;
            flex-wrap:wrap;
          }

          .use{
            font-size:11px;
            font-weight:700;
            color:rgba(193,18,31,.92);
            background:rgba(193,18,31,.08);
            border:1px solid rgba(193,18,31,.14);
            padding:6px 8px;
            border-radius:999px;
          }

          /* Guides */
          .zdx-guides{
            margin-top:28px;
            display:grid;
            grid-template-columns:repeat(3, 1fr);
            gap:18px;
          }

          .zdx-guide-card{
            background:rgba(255,255,255,.80);
            border:1px solid rgba(0,0,0,.06);
            border-radius:28px;
            padding:26px;
            box-shadow:0 30px 80px rgba(0,0,0,.12);
          }

          .zdx-guide-card h3{
            font-size:18px;
            font-weight:800;
            margin-bottom:10px;
            color:var(--black);
            letter-spacing:-.01em;
          }

          .zdx-guide-card p{
            color:var(--ink70);
            line-height:1.7;
            margin:0 0 12px;
            font-size:14.8px;
          }

          .zdx-guide-card ul{
            margin:0;
            padding-left:18px;
            color:var(--ink70);
            line-height:1.7;
            font-size:14px;
          }

          /* ===== STORY ===== */
          .zdx-story{
            padding:60px 0 20px;
          }

          .zdx-story-grid{
            display:grid;
            grid-template-columns:1.2fr .8fr;
            gap:18px;
          }

          .zdx-story-card{
            background:rgba(255,255,255,.82);
            border:1px solid rgba(0,0,0,.06);
            border-radius:32px;
            padding:34px;
            box-shadow:0 40px 100px rgba(0,0,0,.12);
          }

          .zdx-story-card h2{
            font-size:22px;
            font-weight:900;
            margin-bottom:12px;
            letter-spacing:-.02em;
            color:var(--black);
          }

          .zdx-story-card p{
            color:var(--ink70);
            line-height:1.8;
            font-size:15px;
            margin:0 0 12px;
          }

          .zdx-story-card p:last-child{ margin-bottom:0; }

          .zdx-story-card.spotlight{
            background:
              radial-gradient(circle at 20% 0%, rgba(193,18,31,.14), transparent 52%),
              rgba(255,255,255,.84);
          }

          .zdx-mini-pills{
            display:flex;
            flex-wrap:wrap;
            gap:10px;
            margin-top:14px;
          }

          .zdx-mini-pills span{
            padding:8px 10px;
            border-radius:999px;
            background:rgba(0,0,0,.04);
            border:1px solid rgba(0,0,0,.06);
            font-size:12px;
            font-weight:700;
            color:var(--black);
          }

          /* ===== FINAL CTA ===== */
          .zdx-final{
            padding:90px 0 120px;
          }

          .zdx-final-card{
            background:
              radial-gradient(circle at 0% 0%, rgba(193,18,31,.20), transparent 55%),
              rgba(11,11,12,.92);
            color:#fff;
            border-radius:36px;
            padding:46px;
            box-shadow:0 60px 140px rgba(0,0,0,.30);
            border:1px solid rgba(255,255,255,.10);
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:22px;
          }

          .zdx-final-card h2{
            font-size:30px;
            font-weight:900;
            letter-spacing:-.02em;
            margin:0 0 10px;
          }

          .zdx-final-card p{
            margin:0;
            color:rgba(255,255,255,.72);
            line-height:1.7;
            max-width:680px;
          }

          .zdx-final-actions{
            display:flex;
            flex-direction:column;
            gap:10px;
            min-width:280px;
          }

          .zdx-final-actions .zdx-btn{
            justify-content:center;
          }

          .zdx-final-actions .zdx-btn.primary{
            box-shadow:0 28px 80px rgba(193,18,31,.35);
          }

          .zdx-final-actions .zdx-btn.ghost{
            background:rgba(255,255,255,.10);
            border:1px solid rgba(255,255,255,.14);
            box-shadow:none;
          }

          .zdx-final-actions .zdx-btn.ghost:hover{
            background:rgba(255,255,255,.14);
            transform:translateY(-2px);
          }

          /* ===== REVEAL ANIMATIONS ===== */
          [data-reveal]{
            opacity:0;
            transform:translateY(14px);
            filter:saturate(.95);
            transition:opacity .7s ease, transform .7s ease, filter .7s ease;
          }

          [data-reveal].in{
            opacity:1;
            transform:translateY(0);
            filter:saturate(1);
          }

          /* ===== RESPONSIVE ===== */
          @media(max-width:1100px){
            .zdx-hero-grid{ grid-template-columns:1fr; }
            .zdx-metrics{ max-width:520px; }
            .zdx-story-grid{ grid-template-columns:1fr; }
          }

          @media(max-width:992px){
            .zdx-title{ font-size:42px; }
            .zdx-palette-row{ grid-template-columns:repeat(3, 1fr); }
            .zdx-guides{ grid-template-columns:1fr; }
            .zdx-final-card{
              flex-direction:column;
              align-items:flex-start;
            }
            .zdx-final-actions{ width:100%; min-width:auto; }
          }

          @media(max-width:640px){
            .zdx-top .zdx-shell{ flex-direction:column; align-items:flex-start; }
            .zdx-title{ font-size:36px; }
            .zdx-copy-block{ padding:20px; }
            .zdx-palette-row{ grid-template-columns:repeat(2, 1fr); }
            .zdx-final-card{ padding:28px; }
          }

          @media (prefers-reduced-motion: reduce){
            *{ transition:none !important; animation:none !important; }
          }
        `}</style>
      </main></>
  );
}

export default ZodiacDetails;
