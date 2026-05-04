import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * FinishPreview (Apple-clean)
 * - Cinematic switch: active layer fades in, previous layer fades out with blur.
 * - Cursor depth: subtle tilt + glow shift using CSS variables.
 * - Works with your existing reveal system via data-reveal wrapper.
 *
 * Props:
 *  - title, subtitle
 *  - options: [{ key, name, desc, tag }]
 *  - baseImage: string
 *  - layers: [{ key, src }]
 *  - ctas: [{ label, to, variant }]
 */
export default function FinishPreview({
  title = "See the Finish, Before You Paint",
  subtitle = "Explore how Meitu coating systems transform real surfaces — instantly.",
  options = [],
  baseImage,
  layers = [],
  ctas = [],
}) {
  const [activeKey, setActiveKey] = useState(
    options?.[0]?.key || layers?.[0]?.key
  );
  const [prevKey, setPrevKey] = useState(null);

  const wrapRef = useRef(null);
  const rafRef = useRef(0);

  const layerMap = useMemo(() => {
    const m = new Map();
    layers.forEach((l) => m.set(l.key, l.src));
    return m;
  }, [layers]);

  const activeSrc = layerMap.get(activeKey);

  // Cinematic switch
  const switchTo = (key) => {
    if (key === activeKey) return;
    setPrevKey(activeKey);
    setActiveKey(key);
    window.clearTimeout(switchTo._t || 0);
    switchTo._t = window.setTimeout(() => setPrevKey(null), 520);
  };

  // Cursor depth (tilt)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const onMove = (e) => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width; // 0..1
        const y = (e.clientY - r.top) / r.height; // 0..1
        el.style.setProperty("--mx", (x - 0.5).toFixed(4));
        el.style.setProperty("--my", (y - 0.5).toFixed(4));
        el.style.setProperty("--glowX", `${(x * 100).toFixed(2)}%`);
        el.style.setProperty("--glowY", `${(y * 100).toFixed(2)}%`);
        el.classList.add("fp-has-mouse");
      });
    };

    const onLeave = () => {
      el.classList.remove("fp-has-mouse");
      el.style.setProperty("--mx", "0");
      el.style.setProperty("--my", "0");
      el.style.setProperty("--glowX", `50%`);
      el.style.setProperty("--glowY", `50%`);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section className="finish-preview-v2">
      <div className="fp-ambient" aria-hidden="true" />
      <div className="container">
        <div className="section-head" data-reveal>
          <h2 className="section-title">{title}</h2>
          <p className="section-sub">{subtitle}</p>
        </div>

        <div className="fp-grid" data-reveal>
          {/* LEFT: options (dense) */}
          <div className="fp-left">
            <div className="fp-panel">
              <div className="fp-panel-top">
                <div className="fp-kicker">LIVE SURFACE PREVIEW</div>
                <div className="fp-mini">
                  Hover or click a finish to preview it on a real surface.
                  Cinematic transitions are applied automatically.
                </div>
              </div>

              <div className="fp-options">
                {options.map((o, idx) => {
                  const active = o.key === activeKey;
                  return (
                    <button
                      key={o.key}
                      type="button"
                      className={`fp-option ${active ? "active" : ""}`}
                      onClick={() => switchTo(o.key)}
                      onMouseEnter={() => switchTo(o.key)}
                    >
                      <span className="fp-dot" aria-hidden="true" />
                      <span className="fp-opt-copy">
                        <span className="fp-opt-name">
                          {o.name}{" "}
                          {o.tag ? <em className="fp-tag">{o.tag}</em> : null}
                        </span>
                        <span className="fp-opt-desc">{o.desc}</span>
                      </span>
                      <span className="fp-arrow" aria-hidden="true">
                        →
                      </span>
                    </button>
                  );
                })}
              </div>

              {ctas?.length ? (
                <div className="fp-ctas">
                  {ctas.map((c) => (
                    <a
                      key={c.to}
                      href={c.to}
                      className={`pill ${c.variant || "glass"}`}
                    >
                      {c.label}
                    </a>
                  ))}
                </div>
              ) : null}

              <div className="fp-foot">
                <span className="fp-foot-chip">Meitu Red System</span>
                <span className="fp-foot-chip">Clean motion</span>
                <span className="fp-foot-chip">No heavy libraries</span>
              </div>
            </div>
          </div>

          {/* RIGHT: visual (tilt + glow + cinematic layers) */}
          <div className="fp-right">
            <div ref={wrapRef} className="fp-visual">
              <div className="fp-glow" aria-hidden="true" />
              <div className="fp-frame" aria-hidden="true" />

              {/* Base */}
              {baseImage ? (
                <img className="fp-base" src={baseImage} alt="Base surface" />
              ) : (
                <div className="fp-base fp-placeholder">
                  <div className="fp-ph-title">Base image slot</div>
                  <div className="fp-ph-sub">
                    Set baseImage prop to your wall/house photo.
                  </div>
                </div>
              )}

              {/* Previous layer (cinematic exit) */}
              {prevKey && layerMap.get(prevKey) ? (
                <img
                  className="fp-layer fp-layer-prev"
                  src={layerMap.get(prevKey)}
                  alt=""
                />
              ) : null}

              {/* Active layer */}
              {activeSrc ? (
                <img
                  key={activeKey}
                  className="fp-layer fp-layer-active"
                  src={activeSrc}
                  alt=""
                />
              ) : (
                <div className="fp-layer fp-placeholder fp-layer-active">
                  <div className="fp-ph-title">Finish layer slot</div>
                  <div className="fp-ph-sub">
                    Provide layers prop: [{`{ key, src }`}]
                  </div>
                </div>
              )}

              <div className="fp-badge">
                <span className="fp-badge-dot" />
                Live Preview
              </div>
            </div>

            <div className="fp-meta">
              <div className="fp-meta-card">
                <div className="fp-meta-k">Tip</div>
                <div className="fp-meta-v">
                  Move your cursor over the image for subtle depth.
                </div>
              </div>
              <div className="fp-meta-card">
                <div className="fp-meta-k">Pro</div>
                <div className="fp-meta-v">
                  Use high-res images for the best cinematic swap.
                </div>
              </div>
              <div className="fp-meta-card">
                <div className="fp-meta-k">Clean</div>
                <div className="fp-meta-v">
                  Motion respects “reduced motion” preference.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
