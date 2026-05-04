import NavBar from "../components/NavBar";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import horoscopeList from "../ProductsList/horoscopeList.json";

function HoroscopeDesign() {
  const location = useLocation();
  const ZODIACS = useMemo(() => horoscopeList, []);

  const [active, setActive] = useState("all");
  const [q, setQ] = useState("");

  // Always start at the top when arriving on this page (route enter / reload)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.key]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return ZODIACS.filter((z) => {
      const matchTab = active === "all" ? true : z.id === active;
      const matchQ =
        !query ||
        z.name.toLowerCase().includes(query) ||
        z.desc.toLowerCase().includes(query);
      return matchTab && matchQ;
    });
  }, [ZODIACS, active, q]);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const nodes = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!nodes.length) return;

    // Reset (helps on fast route changes)
    nodes.forEach((el) => {
      el.classList.remove("hz-reveal-in");
    });

    const raf = requestAnimationFrame(() => {
      nodes.forEach((el, idx) => {
        el.style.setProperty("--reveal-delay", `${idx * 70}ms`);
        el.classList.add("hz-reveal-in");
      });
    });

    return () => cancelAnimationFrame(raf);
  }, [active, q]);

  return (
    <>
      <NavBar />

      {/* HERO */}
      <section className="hz-hero">
        <div className="hz-ambient" aria-hidden="true">
          <div className="hz-a a1" />
          <div className="hz-a a2" />
          <div className="hz-grid" />
          <div className="hz-vignette" />
        </div>

        <div className="container hz-heroShell">
          <div className="hz-top" data-reveal>
            <span className="hz-eyebrow">
              <span className="hz-dot" aria-hidden="true" />
              ASTRO • COLOR • DESIGN
            </span>
            <div className="hz-links" data-reveal>
              <Link className="hz-linkPill" to="/products">
                Products <span aria-hidden="true">→</span>
              </Link>
              <Link className="hz-linkPill ghost" to="/colors">
                Shades <span aria-hidden="true">→</span>
              </Link>
              <Link className="hz-linkPill ghost" to="/ratecalculator">
                Estimate <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div className="hz-heroGrid">
            <div className="hz-copy" data-reveal>
              <h1 className="hz-title">Where Astrology Meets Architecture</h1>
              <p className="hz-sub">
                Curated zodiac palettes that shape mood, energy, and spatial
                harmony.
              </p>

              <div className="hz-actions">
                <a className="hz-primary" href="#zodiac">
                  <span className="hz-shine" aria-hidden="true" />
                  Explore Zodiac Palettes <span className="hz-arrow">→</span>
                </a>
                <Link className="hz-secondary" to="/inquiry">
                  Talk to a specialist
                </Link>
              </div>
            </div>
            <div className="hz-panel" data-reveal>
              <div className="hz-panelHead">
                <div className="hz-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="hz-svg">
                    <path
                      d="M12 2l1.8 5.7L20 10l-6.2 2.2L12 18l-1.8-5.8L4 10l6.2-2.3L12 2z"
                      fill="currentColor"
                      opacity=".9"
                    />
                  </svg>
                </div>
                <div>
                  <div className="hz-panelTitle">Quick picker</div>
                  <div className="hz-panelSub">
                    Search by sign name or vibe keywords.
                  </div>
                </div>
              </div>

              <div className="hz-searchWrap">
                <input
                  className="hz-search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search: Aries, calm, bold, blue…"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section id="zodiac" className="container hz-gridSec">
        <div className="hz-secHead" data-reveal>
          <h2 className="hz-h2">Zodiac Palettes</h2>
          <p className="hz-p">
            Tap a card to explore the zodiac palette and recommended color mood.
          </p>
        </div>

        <div className="row g-4">
          {filtered.map((zodiac) => (
            <div key={zodiac.id} className="col-sm-6 col-lg-4 d-flex">
              <Link
                to={`/horoscope/${zodiac.id}`}
                className="hz-card flex-fill"
                style={{ "--accent": zodiac.accent }}
                data-reveal
              >
                <div className="hz-cardTop">
                  <div className="hz-media">
                    <img alt={zodiac.name} src={zodiac.src} />
                  </div>

                  <div className="hz-swatchRow" aria-hidden="true">
                    {zodiac.palette.slice(0, 4).map((c) => (
                      <span
                        key={c}
                        className="hz-swatch"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </div>

                <div className="hz-body">
                  <div className="hz-titleRow">
                    <h5>{zodiac.name}</h5>
                    <span className="hz-pill">Palette</span>
                  </div>
                  <p>{zodiac.desc}</p>

                  <div className="hz-chipRow">
                    {zodiac.chips.map((c) => (
                      <span key={c} className="hz-miniChip">
                        {c}
                      </span>
                    ))}
                  </div>

                  <span className="hz-cta">
                    Explore Palette <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="hz-philo">
        <div className="container hz-philoShell">
          <div className="hz-philoCard" data-reveal>
            <h2>Designed With Cosmic Intent</h2>
            <p>
              We blend symbolic mood + real-world finish logic to help you pick
              shades that feel right under daylight, warm LEDs, and mixed
              interiors with premium system recommendations.
            </p>
            <div className="hz-philoActions">
              <Link to="/products" className="hz-primary onDark">
                Browse Paint Systems <span aria-hidden="true">→</span>
              </Link>
              <Link to="/ratecalculator" className="hz-secondary onDark">
                Estimate Cost
              </Link>
            </div>
          </div>
        </div>
      </section><style>{`
        :root{
          --red:#c1121f;
          --red2:#e11d2e;
          --black:#0b0b0c;
          --ink70:rgba(11,11,12,.7);
          --ink55:rgba(11,11,12,.55);
          --glass:rgba(255,255,255,.78);
          --line:rgba(0,0,0,.10);
          --easeOut:cubic-bezier(.22,.61,.36,1);
        }

        body{ overflow-x:hidden; }

        /* ✅ Page reveal: Apple-like fade-up with stagger */
        [data-reveal]{
          opacity: 0;
          transform: translate3d(0, 14px, 0);
          filter: blur(6px);
          transition:
            opacity 700ms var(--easeOut),
            transform 700ms var(--easeOut),
            filter 700ms var(--easeOut);
          transition-delay: var(--reveal-delay, 0ms);
          will-change: opacity, transform, filter;
        }

        .hz-reveal-in{
          opacity: 1;
          transform: translate3d(0, 0, 0);
          filter: blur(0);
        }

        /* Slightly longer + cinematic for hero only */
        .hz-hero [data-reveal]{
          transition-duration: 820ms;
        }

        @media (prefers-reduced-motion: reduce){
          [data-reveal]{
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
            transition: none !important;
          }
        }

        /* HERO */
        .hz-hero{
          position:relative;
          padding:120px 24px 60px;
          background:
            radial-gradient(900px 420px at 15% 10%, rgba(193,18,31,.10), transparent 60%),
            radial-gradient(700px 420px at 85% 30%, rgba(0,0,0,.06), transparent 55%),
            #fff;
          overflow:hidden;
        }

        .hz-ambient{
          position:absolute;
          inset:0;
          pointer-events:none;
        }

        .hz-a{
          position:absolute;
          width:720px;
          height:520px;
          border-radius:999px;
          filter: blur(48px);
          opacity:.55;
          mix-blend-mode:multiply;
        }

        .hz-a.a1{
          left:-180px; top:-180px;
          background:
            radial-gradient(circle at 30% 30%, rgba(225,29,46,.38), transparent 60%),
            radial-gradient(circle at 70% 70%, rgba(193,18,31,.24), transparent 62%);
          animation:float1 10s var(--easeOut) infinite alternate;
        }

        .hz-a.a2{
          right:-220px; top:90px;
          background:
            radial-gradient(circle at 30% 30%, rgba(59,130,246,.24), transparent 62%),
            radial-gradient(circle at 70% 70%, rgba(0,0,0,.10), transparent 64%);
          animation:float2 12s var(--easeOut) infinite alternate;
        }

        .hz-grid{
          position:absolute;
          inset:-2px;
          background:
            linear-gradient(to right, rgba(0,0,0,.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,.06) 1px, transparent 1px);
          background-size:78px 78px;
          opacity:.07;
          mask-image: radial-gradient(closest-side at 50% 10%, #000 42%, transparent 75%);
        }

        .hz-vignette{
          position:absolute;
          inset:-2px;
          background: radial-gradient(closest-side at 50% 10%, transparent 45%, rgba(0,0,0,.06) 92%);
          opacity:.9;
        }

        @keyframes float1{
          from{ transform: translate3d(0,0,0) scale(1); }
          to{ transform: translate3d(28px, 18px,0) scale(1.05); }
        }
        @keyframes float2{
          from{ transform: translate3d(0,0,0) scale(1); }
          to{ transform: translate3d(-22px, 24px,0) scale(1.04); }
        }

        .hz-heroShell{ position:relative; z-index:2; max-width:1200px; }

        .hz-top{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:16px;
          flex-wrap:wrap;
          margin-bottom:22px;
        }

        .hz-eyebrow{
          display:inline-flex;
          align-items:center;
          gap:10px;
          padding:10px 16px;
          border-radius:999px;
          border:1px solid rgba(193,18,31,.35);
          background:rgba(255,255,255,.62);
          backdrop-filter: blur(14px);
          font-size:12px;
          font-weight:800;
          letter-spacing:.18em;
          text-transform:uppercase;
          color:var(--red);
          box-shadow:0 18px 44px rgba(0,0,0,.10);
        }

        .hz-dot{
          width:8px;height:8px;border-radius:999px;
          background: linear-gradient(180deg, var(--red2), var(--red));
          box-shadow:0 0 0 6px rgba(193,18,31,.12);
        }

        .hz-links{
          display:flex;
          gap:12px;
          flex-wrap:wrap;
        }

        .hz-linkPill{
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
          font-weight:800;
          transition: transform 160ms var(--easeOut), box-shadow 160ms ease, border-color 160ms ease;
          box-shadow:0 18px 46px rgba(0,0,0,.10);
        }

        .hz-linkPill:hover{
          transform: translateY(-1px);
          box-shadow:0 26px 70px rgba(0,0,0,.14);
          border-color: rgba(193,18,31,.18);
        }

        .hz-linkPill.ghost{ background: rgba(255,255,255,.55); }

        .hz-heroGrid{
          display:grid;
          grid-template-columns: 1.1fr .9fr;
          gap:22px;
          align-items:stretch;
        }

        .hz-title{
          font-size:46px;
          font-weight:520;
          letter-spacing:-.7px;
          color:var(--black);
          margin:0;
          line-height:1.12;
        }

        .hz-sub{
          margin-top:12px;
          font-size:17px;
          color:var(--ink70);
          line-height:1.75;
          max-width:760px;
        }

        .hz-actions{
          margin-top:18px;
          display:flex;
          gap:12px;
          flex-wrap:wrap;
          align-items:center;
        }

        .hz-primary{
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

        .hz-primary:hover{
          transform: translateY(-1px);
          box-shadow: 0 30px 90px rgba(193,18,31,.40), inset 0 1px 0 rgba(255,255,255,.22);
          filter:saturate(1.03);
        }

        .hz-shine{
          position:absolute; inset:-2px;
          background:
            radial-gradient(500px 120px at 20% 40%, rgba(255,255,255,.28), transparent 60%),
            radial-gradient(500px 120px at 80% 60%, rgba(255,255,255,.16), transparent 60%);
          opacity:.6;
        }

        .hz-arrow{
          margin-left:10px;
          transition: transform 160ms var(--easeOut);
        }

        .hz-primary:hover .hz-arrow{
          transform: translateX(2px);
        }

        .hz-secondary{
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

        .hz-secondary:hover{
          transform: translateY(-1px);
          border-color: rgba(0,0,0,.32);
          box-shadow:0 26px 72px rgba(0,0,0,.14);
        }

        .hz-primary.onDark{
          box-shadow: 0 22px 70px rgba(225,29,46,.28), inset 0 1px 0 rgba(255,255,255,.18);
        }

        .hz-secondary.onDark{
          background: rgba(255,255,255,.14);
          border:1px solid rgba(255,255,255,.22);
          color:#fff;
          box-shadow:none;
        }

        .hz-trustRow{
          margin-top:16px;
          display:flex;
          gap:10px;
          flex-wrap:wrap;
        }

        .hz-chip{
          display:inline-flex;
          align-items:center;
          gap:10px;
          padding:10px 14px;
          border-radius:999px;
          border:1px solid rgba(0,0,0,.10);
          background: rgba(255,255,255,.62);
          backdrop-filter: blur(14px);
          font-weight:800;
          font-size:12px;
          color: rgba(11,11,12,.78);
          box-shadow:0 14px 40px rgba(0,0,0,.10);
        }

        .hz-chipDot{
          width:8px;height:8px;border-radius:999px;
          background: var(--red);
          box-shadow:0 0 0 6px rgba(193,18,31,.10);
        }

        /* Panel */
        .hz-panel{
          background:var(--glass);
          border-radius:28px;
          padding:26px;
          border:1px solid rgba(0,0,0,.08);
          box-shadow:0 28px 60px rgba(0,0,0,.12);
          backdrop-filter: blur(16px);
          overflow:hidden;
        }

        .hz-panelHead{
          display:flex;
          align-items:flex-start;
          gap:12px;
          margin-bottom:14px;
        }

        .hz-icon{
          width:44px;height:44px;
          border-radius:14px;
          display:grid; place-items:center;
          color:var(--red);
          background: linear-gradient(180deg, rgba(193,18,31,.14), rgba(193,18,31,.06));
          border:1px solid rgba(193,18,31,.22);
          box-shadow:0 18px 44px rgba(193,18,31,.14);
          flex:0 0 auto;
        }

        .hz-svg{ width:22px;height:22px; }

        .hz-panelTitle{ font-weight:900; color:var(--black); }
        .hz-panelSub{ margin-top:6px; color:var(--ink55); font-size:13px; line-height:1.5; }

        .hz-searchWrap{ margin-top:10px; }
        .hz-search{
          width:100%;
          padding:14px 16px;
          border-radius:16px;
          border:1px solid rgba(0,0,0,.14);
          background: rgba(255,255,255,.82);
          font-size:15px;
          outline:none;
          transition:border-color .15s ease, box-shadow .15s ease, background .15s ease;
        }
        .hz-search:focus{
          border-color:rgba(193,18,31,.55);
          box-shadow:0 0 0 4px rgba(193,18,31,.12);
          background:#fff;
        }

        .hz-tabs{
          margin-top:12px;
          display:flex;
          flex-wrap:wrap;
          gap:10px;
        }

        .hz-tab{
          padding:10px 14px;
          border-radius:999px;
          border:1px solid rgba(0,0,0,.14);
          background: rgba(255,255,255,.66);
          font-weight:850;
          font-size:13px;
          cursor:pointer;
          transition: transform 160ms var(--easeOut), box-shadow 160ms ease, border-color 160ms ease;
        }

        .hz-tab:hover{
          transform: translateY(-1px);
          box-shadow:0 14px 40px rgba(0,0,0,.10);
        }

        .hz-tab.active{
          background: rgba(193,18,31,.08);
          border-color: rgba(193,18,31,.40);
          color: var(--red);
          box-shadow:0 16px 44px rgba(193,18,31,.14);
        }

        .hz-miniNote{
          margin-top:12px;
          font-size:13px;
          color: var(--ink55);
        }

        /* GRID SECTION */
        .hz-gridSec{
          padding:70px 24px 90px;
          max-width:1200px;
        }

        .hz-secHead{
          max-width:820px;
          margin:0 auto 18px;
          text-align:center;
        }

        .hz-h2{
          font-size:36px;
          font-weight:520;
          letter-spacing:-.6px;
          color:var(--black);
          margin:0;
        }

        .hz-p{
          margin-top:10px;
          color:var(--ink70);
          font-size:16px;
          line-height:1.7;
        }

        .hz-card{
          display:flex;
          flex-direction:column;
          background:var(--glass);
          backdrop-filter:blur(18px);
          border-radius:28px;
          overflow:hidden;
          text-decoration:none;
          color:inherit;
          border:1px solid rgba(0,0,0,.08);
          box-shadow:0 28px 70px rgba(0,0,0,.12);
          transition:transform 220ms var(--easeOut), box-shadow 220ms ease, border-color 220ms ease;
          position:relative;
        }

        .hz-card::before{
          content:"";
          position:absolute;
          inset:-120px -140px auto auto;
          width:240px;
          height:240px;
          background: radial-gradient(circle, var(--accent, rgba(193,18,31,.18)), transparent 60%);
          opacity:.9;
          pointer-events:none;
        }

        .hz-card:hover{
          transform:translateY(-4px) scale(1.01);
          box-shadow:0 44px 110px rgba(0,0,0,.16);
          border-color: rgba(193,18,31,.12);
        }

        .hz-cardTop{ padding:18px 18px 0; }

        .hz-media{
          min-height:210px;
          height:auto;
          border-radius:22px;
          background: rgba(255,255,255,.65);
          border:1px solid rgba(0,0,0,.06);
          display:grid;
          place-items:center;
          padding:18px;
          overflow:visible;
        }

        .hz-media img{
          display:block;
          width:100%;
          height:auto;
          max-width:100%;
          max-height:260px;
          object-fit:contain;
          filter: drop-shadow(0 20px 26px rgba(0,0,0,.12));
        }

        .hz-swatchRow{
          display:flex;
          gap:10px;
          padding:14px 6px 0;
        }

        .hz-swatch{
          width:100%;
          height:10px;
          border-radius:999px;
          border:1px solid rgba(0,0,0,.06);
        }

        .hz-body{
          padding:22px 22px 24px;
        }

        .hz-titleRow{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          margin-bottom:10px;
        }

        .hz-body h5{
          font-size:20px;
          margin:0;
          font-weight:900;
          letter-spacing:-.02em;
        }

        .hz-pill{
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

        .hz-body p{
          font-size:14px;
          color:var(--ink70);
          line-height:1.7;
          margin:0 0 14px;
        }

        .hz-chipRow{
          display:flex;
          flex-wrap:wrap;
          gap:10px;
          margin-bottom:14px;
        }

        .hz-miniChip{
          padding:9px 12px;
          border-radius:999px;
          background: rgba(255,255,255,.70);
          border:1px solid rgba(0,0,0,.10);
          font-size:12px;
          font-weight:850;
          color: rgba(11,11,12,.78);
        }

        .hz-cta{
          font-size:14px;
          font-weight:850;
          color:var(--red);
          display:inline-flex;
          align-items:center;
          gap:8px;
        }

        /* PHILOSOPHY */
        .hz-philo{
          padding:110px 24px;
          background: linear-gradient(180deg, rgba(193,18,31,.10), rgba(0,0,0,.92));
          color:#fff;
        }

        .hz-philoShell{
          max-width:1200px;
        }

        .hz-philoCard{
          max-width:860px;
          margin:auto;
          text-align:center;
          border-radius:32px;
          border:1px solid rgba(255,255,255,.12);
          background: rgba(255,255,255,.06);
          backdrop-filter: blur(18px);
          padding:50px 34px;
          box-shadow:0 50px 120px rgba(0,0,0,.32);
        }

        .hz-philoCard h2{
          font-size:40px;
          margin:0 0 14px;
          font-weight:700;
          letter-spacing:-.02em;
        }

        .hz-philoCard p{
          font-size:16px;
          color: rgba(255,255,255,.75);
          line-height:1.75;
          margin:0;
        }

        .hz-philoActions{
          margin-top:22px;
          display:flex;
          justify-content:center;
          gap:12px;
          flex-wrap:wrap;
        }

        /* Responsive */
        @media(max-width:1100px){
          .hz-heroGrid{ grid-template-columns:1fr; }
        }

        @media(max-width:768px){
          .hz-title{ font-size:36px; }
          .hz-h2{ font-size:30px; }
          .hz-media{ min-height:180px; }
          .hz-philoCard h2{ font-size:32px; }
        }

        @media (prefers-reduced-motion: reduce){
          .hz-a{ animation:none; }
          .hz-linkPill,.hz-card,.hz-primary,.hz-secondary,.hz-tab{ transition:none !important; }
        }
      `}</style>
    </>
  );
}

export default HoroscopeDesign;
