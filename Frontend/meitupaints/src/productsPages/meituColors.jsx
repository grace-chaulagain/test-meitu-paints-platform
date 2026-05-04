import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { AutoSizer, Grid, WindowScroller } from "react-virtualized";
import "react-virtualized/styles.css";
import colorsRaw from "../ProductsList/meitu-colors.json";
import NavBar from "../components/NavBar";

/**
 * EXPECTED JSON SHAPE (each item):
 * {
 *   id: "2001P",               // shade code
 *   name: "Sunny Lemon",
 *   rgb: "rgb(244,236,207)",
 *   category: "yellows",       // reds, oranges, yellows, greens, blues, violets, earth tones, classic neutrals, dark accents, whispering whites
 *   type: "Light"              // Dark, Light, Neutral
 * }
 */

const TYPE_ORDER = ["Neutral", "Light", "Dark"];
const TONE_RAIL = ["All", ...TYPE_ORDER];

function normalize(s = "") {
  return String(s).trim().toLowerCase();
}

function clamp255(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return 180;
  return Math.max(0, Math.min(255, Math.round(x)));
}

function hexToRgb(hex) {
  const h = String(hex).trim().replace(/^#/, "");
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16);
    const g = parseInt(h[1] + h[1], 16);
    const b = parseInt(h[2] + h[2], 16);
    if ([r, g, b].some((v) => Number.isNaN(v))) return [180, 180, 180];
    return [r, g, b];
  }
  if (h.length === 6) {
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    if ([r, g, b].some((v) => Number.isNaN(v))) return [180, 180, 180];
    return [r, g, b];
  }
  return [180, 180, 180];
}

function parseRgbAny(input) {
  const s = String(input ?? "").trim();
  if (!s) return [180, 180, 180];

  // hex
  if (s.startsWith("#")) {
    return hexToRgb(s);
  }

  // rgb()/rgba()/hsl() etc -> extract first 3 numbers if present
  const m = s.match(/(-?\d+(?:\.\d+)?)/g);
  if (m && m.length >= 3) {
    return [clamp255(m[0]), clamp255(m[1]), clamp255(m[2])];
  }

  // raw triplet like "244,236,207" or "244 236 207"
  const t = s.match(/(\d+)\s*[,\s]\s*(\d+)\s*[,\s]\s*(\d+)/);
  if (t) {
    return [clamp255(t[1]), clamp255(t[2]), clamp255(t[3])];
  }

  return [180, 180, 180];
}

function normalizeCssColor(v) {
  // Always return a safe, valid rgb(r,g,b) string so CSS never becomes invalid.
  const [r, g, b] = parseRgbAny(v);
  return `rgb(${r},${g},${b})`;
}

function parseRgb(rgbString) {
  // Backwards-compatible wrapper
  return parseRgbAny(rgbString);
}

function getContrastText(rgbString) {
  const [r, g, b] = parseRgb(rgbString);
  // Relative luminance-ish for text color decision
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.64 ? "#0b0b0c" : "#ffffff";
}

// Returns a robust, nonzero viewport height, using visualViewport for mobile browsers
function getSafeViewportHeight(fallback = 720) {
  if (typeof window === "undefined") return fallback;
  // visualViewport is the most accurate on mobile Safari/Chrome
  const vv = window.visualViewport;
  const h =
    vv?.height || window.innerHeight || document.documentElement?.clientHeight;
  return Math.max(320, Number(h) || fallback);
}

function safeCategory(c) {
  // category no longer controls filtering; keep it only for display/search
  return String(c ?? "").trim();
}

function safeType(t) {
  const norm = normalize(t);
  const hit = TYPE_ORDER.find((x) => normalize(x) === norm);
  return hit || "Neutral";
}

export default function MeituColors() {
  const location = useLocation();
  const pageRef = useRef(null);
  const gridRef = useRef(null);

  // UI state
  const [activeTone, setActiveTone] = useState("All");
  const [query, setQuery] = useState("");
  const [activeShade, setActiveShade] = useState(null);

  // Memoized subject for inquiry links (mobile/desktop preview)
  const inquirySubject = useMemo(() => {
    if (!activeShade) return "";
    return `${activeShade.id}  ${activeShade.name} color shade`.trim();
  }, [activeShade]);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(max-width: 1080px)");
    const apply = () => setIsMobile(!!mq.matches);
    apply();
    if (mq.addEventListener) mq.addEventListener("change", apply);
    else mq.addListener(apply);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", apply);
      else mq.removeListener(apply);
    };
  }, []);

  // ===== Room preview (right panel) =====
  const ROOMS = useMemo(
    () => [
      {
        key: "bedroom",
        label: "Bedroom",
        img: "/bedroom.webp",
        mask: "/bedroom-mask.svg",
      },
      {
        key: "living",
        label: "Living Room",
        img: "/living.webp",
        mask: "/living-mask.svg",
      },
      {
        key: "kitchen",
        label: "Kitchen",
        img: "/kitchen.webp",
        mask: "/kitchen-mask.svg",
      },
    ],
    [],
  );

  const [activeRoom, setActiveRoom] = useState("bedroom");

  const room = useMemo(
    () => ROOMS.find((r) => r.key === activeRoom) || ROOMS[0],
    [ROOMS, activeRoom],
  );

  // When preview opens, default to Bedroom (only when opening from closed)
  useEffect(() => {
    if (!activeShade) return;
    setActiveRoom((prev) => prev || "bedroom");
  }, [activeShade]);

  // Initial render window (performance): show 504, then allow full palette
  const INITIAL_VISIBLE = 504;
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  // Always jump to the top on route entry + reload (disable browser scroll restoration)
  useLayoutEffect(() => {
    const prev = window.history.scrollRestoration;
    try {
      window.history.scrollRestoration = "manual";
    } catch {
      // ignore
    }

    const jumpTop = () => {
      // set both to defeat Safari / mobile quirks
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
    };

    // Run immediately, then again after the next frame to override any late restoration
    jumpTop();
    const raf = requestAnimationFrame(jumpTop);
    const t = window.setTimeout(jumpTop, 0);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      try {
        window.history.scrollRestoration = prev;
      } catch {
        // ignore
      }
    };
  }, [location.key]);

  // Reveal polish (matches your home page behavior)
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const els = Array.from(root.querySelectorAll("[data-reveal]"));
    if (els.length === 0) return;

    // If IntersectionObserver is unavailable (older iOS / embedded webviews),
    // reveal everything immediately so the page never looks blank.
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }

    let io;
    try {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add("is-in");
          });
        },
        { threshold: 0.08 },
      );

      els.forEach((el) => io.observe(el));

      // Safety: if something goes wrong with IO on mobile, reveal after a short delay
      const t = window.setTimeout(() => {
        els.forEach((el) => el.classList.add("is-in"));
      }, 700);

      return () => {
        window.clearTimeout(t);
        io?.disconnect?.();
      };
    } catch {
      // Ultimate fallback: reveal all
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
  }, []);

  // Normalize and pre-process once
  const colors = useMemo(() => {
    const rawList = Array.isArray(colorsRaw)
      ? colorsRaw
      : Array.isArray(colorsRaw?.colors)
        ? colorsRaw.colors
        : [];

    const list = rawList.map((c, idx) => {
      const id =
        String(c.id ?? c.code ?? c.shadeCode ?? "").trim() ||
        `shade-${idx + 1}`;
      const name = String(c.name ?? c.shadeName ?? "Untitled Shade").trim();
      const rgb = normalizeCssColor(c.rgb ?? "rgb(180,180,180)");
      const category = safeCategory(c.category);
      const type = safeType(c.type);
      const _q = normalize(`${id} ${name} ${category} ${type}`);
      const _text = getContrastText(rgb);
      return { ...c, id, name, rgb, category, type, _q, _text };
    });

    if (process.env.NODE_ENV !== "production" && list.length === 0) {
      // eslint-disable-next-line no-console
      console.warn(
        "[MeituColors] No colors loaded. Check meitu-colors.json shape (expected an array).",
        colorsRaw,
      );
    }
    // Keep the original JSON order (do not sort)
    return list;
  }, []);

  // Filtering (memoized)
  const filtered = useMemo(() => {
    const q = normalize(query);

    return colors.filter((c) => {
      // Tone filter (single select)
      if (activeTone !== "All" && c.type !== activeTone) return false;

      // Search filter
      if (q && !c._q.includes(q)) return false;

      return true;
    });
  }, [colors, activeTone, query]);

  // Visible slice (for initial 504 + Show all)
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [activeTone, query]);

  const visible = useMemo(() => {
    return filtered.slice(0, Math.max(0, visibleCount));
  }, [filtered, visibleCount]);

  // Ensure the virtualized grid recomputes sizes after mount / reload and after filtering.
  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      try {
        gridRef.current?.recomputeGridSize?.();
        gridRef.current?.forceUpdateGrid?.();
      } catch {
        // no-op
      }
    });
    return () => window.cancelAnimationFrame(raf);
  }, [activeTone, query, filtered.length]);

  // Ensure selected swatch highlight updates immediately
  useEffect(() => {
    try {
      gridRef.current?.forceUpdateGrid?.();
    } catch {
      // no-op
    }
  }, [activeShade]);

  useEffect(() => {
    const onResize = () => {
      try {
        gridRef.current?.recomputeGridSize?.();
        gridRef.current?.forceUpdateGrid?.();
      } catch {
        // no-op
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    // Mobile: address bar / keyboard changes often only trigger visualViewport
    const vv = window.visualViewport;
    vv?.addEventListener?.("resize", onResize);
    vv?.addEventListener?.("scroll", onResize);

    // One extra pass after first paint helps iOS Safari report correct height
    const t = window.setTimeout(onResize, 120);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      vv?.removeEventListener?.("resize", onResize);
      vv?.removeEventListener?.("scroll", onResize);
      window.clearTimeout(t);
    };
  }, []);

  // Tone counts (respect search; used for pill counts)
  const toneCounts = useMemo(() => {
    const q = normalize(query);
    const counts = new Map();

    counts.set("All", 0);
    TYPE_ORDER.forEach((t) => counts.set(t, 0));

    colors.forEach((c) => {
      if (q && !c._q.includes(q)) return;
      counts.set("All", (counts.get("All") || 0) + 1);
      counts.set(c.type, (counts.get(c.type) || 0) + 1);
    });

    return counts;
  }, [colors, query]);

  function selectTone(tone) {
    setActiveTone(tone);
    const el = document.getElementById("colorsGridTop");
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function closeShade() {
    setActiveShade(null);
  }

  // Close on ESC + lock scroll while modal is open
  useEffect(() => {
    if (!activeShade) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeShade();
    };
    document.addEventListener("keydown", onKeyDown);

    let prevOverflow;
    if (isMobile) {
      // Mobile: lock background scroll while preview is open (do NOT change scroll position)
      prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (isMobile && prevOverflow !== undefined) {
        document.body.style.overflow = prevOverflow;
      }
    };
  }, [activeShade, isMobile]);

  return (
    <>
      <NavBar />
      {activeShade && isMobile ? (
        <aside className="preview-panel mobile-abs" aria-label="Room preview">
          <div className="preview-card">
            <div className="preview-head">
              <div>
                <div className="preview-kicker">ROOM PREVIEW</div>
              </div>
              <button
                type="button"
                className="preview-close"
                aria-label="Close preview"
                onClick={closeShade}
              >
                ×
              </button>
            </div>

            <div className="preview-room">
              <img className="room-img" src={room.img} alt={room.label} />

              <div
                className="room-tint"
                aria-hidden="true"
                style={{
                  backgroundColor: activeShade.rgb,
                  WebkitMaskImage: `url(${room.mask})`,
                  maskImage: `url(${room.mask})`,
                }}
              />

              <div
                className="room-shadow"
                aria-hidden="true"
                style={{
                  backgroundImage: `url(${room.img})`,
                  WebkitMaskImage: `url(${room.mask})`,
                  maskImage: `url(${room.mask})`,
                }}
              />

              <div className="room-sheen" aria-hidden="true" />
            </div>

            <div className="preview-info">
              <div className="pname">{activeShade.name}</div>
              <div className="pmeta">
                <span className="pcode">{activeShade.id}</span>
                <span className="pdot" aria-hidden="true">
                  •
                </span>
                <span className="prgb">{activeShade.rgb}</span>
              </div>
            </div>

            <div className="preview-footer">
              <div className="room-rail" role="tablist" aria-label="Rooms">
                {ROOMS.map((r) => {
                  const on = r.key === activeRoom;
                  return (
                    <button
                      key={r.key}
                      type="button"
                      className={`room-pill ${on ? "on" : ""}`}
                      onClick={() => setActiveRoom(r.key)}
                      aria-pressed={on}
                      title={r.label}
                    >
                      <span
                        className="room-thumb"
                        aria-hidden="true"
                        style={{ backgroundImage: `url(${r.img})` }}
                      />
                      <span className="room-label">{r.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="shade-ref" aria-label="Selected shade reference">
                <span
                  className="shade-ref-swatch"
                  aria-hidden="true"
                  style={{ backgroundColor: activeShade.rgb }}
                />
                <div className="shade-ref-meta">
                  <div className="shade-ref-k">Reference</div>
                  <div className="shade-ref-v">{activeShade.rgb}</div>
                </div>
              </div>
              <div className="preview-cta">
                <Link
                  to={`/inquiry?subject=${encodeURIComponent(inquirySubject)}`}
                  state={{ defaultSubject: inquirySubject }}
                  className="pill solid preview-cta-btn"
                >
                  Talk to an Expert
                </Link>
                <Link
                  to="/products"
                  className="pill glass preview-cta-btn"
                  aria-label="Go to products page"
                >
                  Explore Products
                </Link>
              </div>
            </div>
          </div>
        </aside>
      ) : null}
      <div ref={pageRef} className="colors-root">
        {/* HERO */}
        <header className="colors-hero" data-reveal>
          <div className="hero-ambient" aria-hidden="true" />
          <div className="hero-shell">
            <div className="hero-left">
              <span className="hero-eyebrow">MEITU COLOR SYSTEM</span>
              <h1 className="hero-title">
                1000+ Shades.
                <span className="hero-accent"> One Palette.</span>
              </h1>
              <p className="hero-sub">
                Browse Meitu’s full colour library, search by shade code, and
                filter by tone designed for fast selection.
              </p>

              {/* Quick links */}
              <div className="hero-actions">
                <Link to="/horoscope" className="pill glass">
                  Horoscope Palettes
                </Link>
                <Link to="/about" className="pill glass">
                  About Meitu
                </Link>
                <Link to="/support" className="pill glass">
                  Support
                </Link>
              </div>
            </div>

            {/* Right hero card */}
            <div className="hero-right" data-reveal>
              <div className="hero-card">
                <div className="hero-card-top">
                  <div className="hero-badge">Curated Preview</div>
                </div>

                {/* Placeholder visual block */}
                <div
                  className="hero-visual"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* TODO: place an abstract SVG / gradient image here (e.g. /assets/abstract/meitu-spectrum.svg) */}
                  <img
                    src="zodiac-wheel.webp"
                    alt="Abstract spectrum placeholder"
                    style={{ height: "200px", width: "auto" }}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <div className="hero-visual-fallback" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* TOOLBAR (sticky / premium) */}
        <section className="toolbar" data-reveal>
          <div className="toolbar-shell">
            {/* Categories rail */}
            {/* Tone rail (reuses the exact same styling) */}
            <div
              className="cat-rail"
              role="tablist"
              aria-label="Tone categories"
            >
              {TONE_RAIL.map((t) => {
                const isActive = t === activeTone;
                const count = toneCounts.get(t) || 0;

                return (
                  <button
                    key={t}
                    type="button"
                    className={`cat-pill ${isActive ? "active" : ""}`}
                    onClick={() => selectTone(t)}
                    aria-pressed={isActive}
                    title={`${t} (${count})`}
                  >
                    <span className="cat-text">{t}</span>
                    <span className="cat-count">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Search + type filters */}
            <div className="filters">
              <div className="search">
                <span className="sicon" aria-hidden="true">
                  ⌕
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search shade name or code (e.g., 2001P, Sunny Lemon)…"
                  aria-label="Search shades"
                />
                {query ? (
                  <button
                    className="clear"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    type="button"
                  >
                    ×
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* GRID HEADER */}
        <section className="grid-head" data-reveal>
          <div className="grid-head-shell" id="colorsGridTop">
            <div>
              <h2 className="grid-title">{activeTone} Shades</h2>
              <p className="grid-sub">
                Showing <strong>{visible.length}</strong>
                {filtered.length > visible.length ? (
                  <>
                    {" "}
                    of <strong>{filtered.length}</strong>
                  </>
                ) : null}{" "}
                shades
                {query ? (
                  <>
                    {" "}
                    matching <strong>“{query}”</strong>
                  </>
                ) : null}
                . Tap a color to preview.
              </p>
            </div>
          </div>
        </section>

        {/* COLORS GRID (virtualized) */}
        <section className="grid-wrap" data-reveal>
          <div className={`grid-shell ${activeShade ? "has-preview" : ""}`}>
            <div className="grid-main">
              {filtered.length === 0 ? (
                <div className="endcap">
                  <div className="endcap-title">No shades found.</div>
                  <div className="endcap-sub">
                    Try switching tone pills or clearing your search.
                  </div>
                </div>
              ) : (
                <>
                  <WindowScroller>
                    {({
                      height,
                      isScrolling,
                      onChildScroll,
                      scrollTop,
                      registerChild,
                    }) => (
                      <div
                        className={`rv-wrap ${isScrolling ? "is-scrolling" : ""}`}
                        aria-label="Shades grid"
                        ref={registerChild}
                        style={{ minHeight: 360 }}
                      >
                        <AutoSizer disableHeight>
                          {({ width }) => {
                            const isNarrow = width < 560;
                            const isPhone = width < 460;
                            const PAD = isNarrow ? 8 : 10;
                            const gutterX = isNarrow ? 8 : 10;
                            // More vertical breathing room (extra on mobile)
                            const gutterY = isNarrow ? 28 : 28;
                            const contentW = Math.max(0, width - PAD * 2);
                            const safeH =
                              height && height > 0
                                ? height
                                : getSafeViewportHeight();
                            const viewportH = Math.max(320, safeH - PAD * 2);

                            // Pro responsive grid: phones 2 cols, small phones 3, tablets 4–5, desktop 6–7
                            const getColumnCount = (w) => {
                              if (w >= 1220) return 7;
                              if (w >= 980) return 6;
                              if (w >= 820) return 5;
                              if (w >= 640) return 4;
                              if (w >= 460) return 3;
                              return 2;
                            };

                            const baseCols = getColumnCount(contentW);
                            const columnCount =
                              activeShade && !isMobile && contentW >= 820
                                ? 3
                                : baseCols;
                            const itemH = isNarrow ? 86 : 88; // slightly roomier on mobile
                            const rowCount = Math.ceil(
                              visible.length / columnCount,
                            );

                            // tight column width so it never overflows
                            const itemW = Math.max(
                              isPhone ? 132 : 140,
                              Math.floor(
                                (contentW - gutterX * (columnCount - 1)) /
                                  columnCount,
                              ),
                            );

                            return (
                              <div
                                className={
                                  isNarrow ? "rv-pad rv-pad-sm" : "rv-pad"
                                }
                              >
                                <Grid
                                  ref={gridRef}
                                  className="rv-grid"
                                  autoHeight
                                  width={contentW}
                                  height={viewportH}
                                  columnCount={columnCount}
                                  rowCount={rowCount}
                                  columnWidth={itemW + gutterX}
                                  rowHeight={itemH + gutterY}
                                  overscanRowCount={isNarrow ? 14 : 12}
                                  scrollingResetTimeInterval={140}
                                  isScrolling={isScrolling}
                                  onScroll={onChildScroll}
                                  scrollTop={scrollTop}
                                  style={{
                                    overflowX: "hidden",
                                    overflowY: "hidden",
                                  }}
                                  cellRenderer={({
                                    columnIndex,
                                    rowIndex,
                                    key,
                                    style,
                                  }) => {
                                    const index =
                                      rowIndex * columnCount + columnIndex;
                                    if (index >= visible.length) return null;

                                    const shade = visible[index];
                                    const isLastCol =
                                      columnIndex === columnCount - 1;
                                    const isLastRow = rowIndex === rowCount - 1;

                                    return (
                                      <div
                                        key={key}
                                        style={{
                                          ...style,
                                          paddingRight: isLastCol ? 0 : gutterX,
                                          paddingBottom: isLastRow
                                            ? 0
                                            : gutterY,
                                          boxSizing: "border-box",
                                        }}
                                      >
                                        {isScrolling ? (
                                          <SwatchLite
                                            shade={shade}
                                            isActive={
                                              activeShade?.id === shade.id
                                            }
                                          />
                                        ) : (
                                          <SwatchCard
                                            shade={shade}
                                            onOpen={setActiveShade}
                                            isActive={
                                              activeShade?.id === shade.id
                                            }
                                          />
                                        )}
                                      </div>
                                    );
                                  }}
                                />
                              </div>
                            );
                          }}
                        </AutoSizer>
                      </div>
                    )}
                  </WindowScroller>
                  {filtered.length > visible.length ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        paddingTop: 18,
                      }}
                    >
                      <button
                        type="button"
                        className="pill glass"
                        onClick={() => setVisibleCount(filtered.length)}
                        aria-label="Show all colors"
                      >
                        Show all colors
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </div>
            {activeShade && !isMobile ? (
              <aside className="preview-panel" aria-label="Room preview">
                <div className="preview-card">
                  <div className="preview-head">
                    <div>
                      <div className="preview-kicker">ROOM PREVIEW</div>
                    </div>
                    <button
                      type="button"
                      className="preview-close"
                      aria-label="Close preview"
                      onClick={closeShade}
                    >
                      ×
                    </button>
                  </div>

                  <div className="preview-room">
                    <img className="room-img" src={room.img} alt={room.label} />

                    {/* Pure RGB layer (accurate shade, no photo blending) */}
                    <div
                      className="room-tint"
                      aria-hidden="true"
                      style={{
                        backgroundColor: activeShade.rgb,
                        WebkitMaskImage: `url(${room.mask})`,
                        maskImage: `url(${room.mask})`,
                      }}
                    />

                    {/* Shadow/luminance layer (keeps original room shadows) */}
                    <div
                      className="room-shadow"
                      aria-hidden="true"
                      style={{
                        backgroundImage: `url(${room.img})`,
                        WebkitMaskImage: `url(${room.mask})`,
                        maskImage: `url(${room.mask})`,
                      }}
                    />

                    <div className="room-sheen" aria-hidden="true" />
                  </div>

                  <div className="preview-info">
                    <div className="pname">{activeShade.name}</div>
                    <div className="pmeta">
                      <span className="pcode">{activeShade.id}</span>
                      <span className="pdot" aria-hidden="true">
                        •
                      </span>
                      <span className="prgb">{activeShade.rgb}</span>
                    </div>
                  </div>

                  <div className="preview-footer">
                    <div
                      className="room-rail"
                      role="tablist"
                      aria-label="Rooms"
                    >
                      {ROOMS.map((r) => {
                        const on = r.key === activeRoom;
                        return (
                          <button
                            key={r.key}
                            type="button"
                            className={`room-pill ${on ? "on" : ""}`}
                            onClick={() => setActiveRoom(r.key)}
                            aria-pressed={on}
                            title={r.label}
                          >
                            <span
                              className="room-thumb"
                              aria-hidden="true"
                              style={{ backgroundImage: `url(${r.img})` }}
                            />
                            <span className="room-label">{r.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div
                      className="shade-ref"
                      aria-label="Selected shade reference"
                    >
                      <span
                        className="shade-ref-swatch"
                        aria-hidden="true"
                        style={{ backgroundColor: activeShade.rgb }}
                      />
                      <div className="shade-ref-meta">
                        <div className="shade-ref-k">Reference</div>
                        <div className="shade-ref-v">{activeShade.rgb}</div>
                      </div>
                    </div>
                    <div className="preview-cta">
                      <Link
                        to={`/inquiry?subject=${encodeURIComponent(inquirySubject)}`}
                        state={{ defaultSubject: inquirySubject }}
                        className="pill solid preview-cta-btn"
                        aria-label="Go to inquiry page"
                      >
                        Talk to an Expert
                      </Link>
                      <Link
                        to="/products"
                        className="pill glass preview-cta-btn"
                        aria-label="Go to products page"
                      >
                        Explore Products
                      </Link>
                    </div>
                  </div>
                </div>
              </aside>
            ) : null}
          </div>
        </section>

        {/* FOOTER STRIP CTA */}
        <section className="bottom-strip" data-reveal>
          <div className="bottom-shell">
            <div className="bottom-left">
              <div className="bottom-eyebrow">NEXT STEP</div>
              <h3>Want a recommendation, not just a palette?</h3>
              <p>
                Tell us your surface type, lighting, and environment we’ll
                suggest a system and matching shades that look premium in real
                conditions.
              </p>
            </div>
            <div className="bottom-actions">
              <Link to="/inquiry" className="pill solid">
                Talk to an Expert
              </Link>
              <Link to="/ratecalculator" className="pill glass">
                Estimate Cost
              </Link>
            </div>
          </div>
        </section>
      </div><style>{`
:root{
  /* Premium “Apple-like” reds (deeper base + brighter highlight) */
  --red:#b3121b;      /* deep premium red */
  --red2:#ff3b30;     /* crisp highlight red */
  --red3:#ff6a5f;     /* soft glow accent */

  --black:#0b0b0c;

  --ink70:rgba(11,11,12,.70);
  --ink55:rgba(11,11,12,.55);

  --glass:rgba(255,255,255,.86);
  --glass2:rgba(255,255,255,.72);

  --shadow: 0 50px 120px rgba(0,0,0,.14);
  --shadow2: 0 30px 80px rgba(0,0,0,.10);

  --ease: cubic-bezier(.22,.61,.36,1);
}

        .colors-root{
          position:relative;
          background:
            radial-gradient(1200px 700px at 18% 0%, rgba(193,18,31,.10), transparent 55%),
            radial-gradient(1000px 700px at 85% 18%, rgba(193,18,31,.08), transparent 55%),
            #fff;
          min-height:100vh;
        }

        /* Reveal animation (same behavior as your home) */
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

        /* Pills (reuse your language) */
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
        .colors-hero{
          position:relative;
          padding: 140px 24px 70px;
          overflow:hidden;
        }
        .hero-ambient{
          position:absolute;
          inset:-180px -200px auto -200px;
          height:520px;
          background:
            radial-gradient(closest-side at 50% 45%, rgba(193,18,31,.20), transparent 72%),
            radial-gradient(closest-side at 22% 38%, rgba(225,29,46,.15), transparent 70%);
          filter: blur(10px);
          pointer-events:none;
        }
        .hero-shell{
          position:relative;
          max-width:1280px;
          margin:0 auto;
          display:grid;
          grid-template-columns: 1.2fr .8fr;
          gap:36px;
          align-items:start;
        }

        .hero-eyebrow{
          font-size:12px;
          letter-spacing:.34em;
          color:var(--red);
          font-weight:900;
        }
        .hero-title{
          font-size:56px;
          margin:18px 0 12px;
          letter-spacing:-.05em;
          font-weight:880;
          color:var(--black);
          line-height:1.06;
        }
        .hero-accent{ color:var(--red); }
        .hero-sub{
          font-size:17px;
          color:var(--ink70);
          line-height:1.75;
          max-width:740px;
        }

        .hero-actions{
          margin-top:22px;
          display:flex;
          gap:12px;
          flex-wrap:wrap;
        }

        .hero-stats{
          margin-top:26px;
          display:grid;
          grid-template-columns:repeat(4, 1fr);
          gap:12px;
          max-width:740px;
        }
        .hstat{
          background:rgba(255,255,255,.65);
          border:1px solid rgba(0,0,0,.06);
          border-radius:18px;
          padding:14px 14px;
          box-shadow:0 22px 50px rgba(0,0,0,.06);
          backdrop-filter: blur(14px);
        }
        .hval{
          font-size:18px;
          font-weight:880;
          letter-spacing:-.02em;
          color:var(--black);
        }
        .hkey{
          margin-top:6px;
          font-size:11px;
          letter-spacing:.16em;
          text-transform:uppercase;
          color:var(--ink55);
          font-weight:900;
        }

        .hero-right{
          display:flex;
          flex-direction:column;
          gap:14px;
        }

        .hero-card{
          border-radius:28px;
          background:rgba(255,255,255,.76);
          border:1px solid rgba(0,0,0,.08);
          backdrop-filter: blur(18px);
          box-shadow:var(--shadow);
          overflow:hidden;
        }
        .hero-card-top{
          padding:18px 18px 0;
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:10px;
        }
        .hero-badge{
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
        .hero-note{
          color:var(--ink55);
          font-size:12px;
          line-height:1.4;
          text-align:right;
        }
        .hero-visual{
          position:relative;
          margin:14px;
          border-radius:22px;
          overflow:hidden;
          min-height:220px;
          background:linear-gradient(180deg, rgba(193,18,31,.12), rgba(11,11,12,.06));
          border:1px solid rgba(0,0,0,.08);
        }
        .hero-visual img{
          width:100%;
          height:100%;
          object-fit:cover;
          display:block;
          opacity:.9;
        }
        .hero-visual-fallback{
          position:absolute;
          inset:0;
          background:
            radial-gradient(closest-side at 30% 30%, rgba(193,18,31,.22), transparent 70%),
            radial-gradient(closest-side at 70% 60%, rgba(0,0,0,.10), transparent 70%),
            linear-gradient(180deg, rgba(255,255,255,.1), rgba(255,255,255,0));
          filter: blur(0px);
        }

        .hero-card-bottom{
          padding:16px 18px 18px;
          display:flex;
          flex-direction:column;
          gap:10px;
        }
        .hero-card-row{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          padding:10px 12px;
          border-radius:16px;
          background:rgba(255,255,255,.55);
          border:1px solid rgba(0,0,0,.06);
        }
        .label{
          font-size:11px;
          letter-spacing:.18em;
          text-transform:uppercase;
          font-weight:900;
          color:var(--ink55);
        }
        .value{
          font-size:13px;
          color:var(--ink70);
          text-align:right;
        }

        .zodiac-strip{
          border-radius:26px;
          padding:18px;
          background:rgba(11,11,12,.92);
          color:#fff;
          border:1px solid rgba(255,255,255,.10);
          box-shadow:0 44px 120px rgba(0,0,0,.18);
          overflow:hidden;
          position:relative;
        }
        .zodiac-strip::after{
          content:"";
          position:absolute;
          inset:-120px -120px auto auto;
          width:260px;
          height:260px;
          background:radial-gradient(circle, rgba(193,18,31,.22), transparent 60%);
          pointer-events:none;
        }
        .zstripe-title{
          font-weight:900;
          letter-spacing:-.02em;
          font-size:16px;
        }
        .zstripe-sub{
          margin-top:8px;
          color:rgba(255,255,255,.70);
          font-size:13px;
          line-height:1.6;
        }
        .zpill{ margin-top:12px; }

        /* TOOLBAR */
        .toolbar{
          position:sticky;
          top:78px; /* navbar height-ish */
          z-index:20;
          padding: 16px 24px;
          backdrop-filter: blur(18px);
          background:rgba(255,255,255,.70);
          border-top:1px solid rgba(0,0,0,.06);
          border-bottom:1px solid rgba(0,0,0,.06);
        }
        .toolbar-shell{
          max-width:1280px;
          margin:0 auto;
          display:flex;
          flex-direction:row;
          align-items:center;
          justify-content:space-between;
          gap:14px;
        }

                /* On smaller screens, stack back to column */
        @media (max-width: 820px){
          .toolbar-shell{
            flex-direction:column;
            align-items:stretch;
          }
        }


        .cat-rail{
          display:flex;
          align-items:center;
          flex: 1 1 auto;
          min-width: 0;
          gap:10px;
          overflow:auto;
          padding-bottom:6px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .cat-rail::-webkit-scrollbar{ display:none; }

        .cat-pill{
          display:inline-flex;
          align-items:center;
          gap:10px;
          padding:10px 14px;
          border-radius:999px;
          border:1px solid rgba(0,0,0,.10);
          background:rgba(255,255,255,.75);
          backdrop-filter: blur(14px);
          color:var(--black);
          font-weight:760;
          font-size:13px;
          cursor:pointer;
          transition:transform .16s ease, box-shadow .16s ease, border-color .16s ease;
          white-space:nowrap;
          outline:none;
        }
        .cat-pill:focus-visible{
          outline:3px solid rgba(193,18,31,.35);
          outline-offset:2px;
        }
        .cat-pill:hover{
          transform:translateY(-1px);
          box-shadow:var(--shadow2);
        }
        .cat-pill.active{
          background:linear-gradient(180deg, var(--red2), var(--red));
          color:#fff;
          border-color:rgba(255,255,255,.22);
          box-shadow:
            0 26px 70px rgba(193,18,31,.28),
            inset 0 1px 0 rgba(255,255,255,.22);
        }

        .cat-pill.active .cat-dot{
          background:#fff;
          box-shadow:0 0 0 6px rgba(255,255,255,.18);
        }

        .cat-pill.active .cat-text{ opacity:1; }

        .cat-pill.active .cat-count{
          background:rgba(0,0,0,.18);
          border-color:rgba(255,255,255,.18);
          color:rgba(255,255,255,.86);
        }
        .cat-dot{
          width:10px;
          height:10px;
          border-radius:999px;
          background:var(--red);
          box-shadow:0 0 0 6px rgba(193,18,31,.12);
        }
        .cat-text{ opacity:.92; }
        .cat-count{
          font-size:11px;
          font-weight:900;
          letter-spacing:.12em;
          padding:6px 10px;
          border-radius:999px;
          border:1px solid rgba(0,0,0,.08);
          background:rgba(255,255,255,.7);
          color:var(--ink55);
        }

        .filters{
          display:flex;
          gap:12px;
          align-items:center;
          justify-content:flex-end;
          flex: 0 0 auto;
          min-width: 0;
          white-space: nowrap;
        }

          @media (max-width: 820px){
          .filters{
            width:100%;
            justify-content:stretch;
          }
        }

        .search{
          width: min(520px, 42vw);
          flex: 0 1 auto;
          display:flex;
          align-items:center;
          gap:10px;
          padding:12px 14px;
          border-radius:18px;
          background:rgba(255,255,255,.76);
          border:1px solid rgba(0,0,0,.10);
          box-shadow:0 18px 50px rgba(0,0,0,.06);
          backdrop-filter: blur(14px);
          position:relative;
          min-width:280px;
        }
        .sicon{ color:var(--ink55); }
        .search input{
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

        /* GRID HEAD */
        .grid-head{
          padding: 34px 24px 6px;
        }
        .grid-head-shell{
          max-width:1280px;
          margin:0 auto;
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:18px;
          flex-wrap:wrap;
        }
        .grid-title{
          font-size:36px;
          font-weight:880;
          letter-spacing:-.04em;
          margin:0;
          color:var(--black);
        }
        .grid-sub{
          margin-top:10px;
          color:var(--ink70);
          font-size:15px;
          line-height:1.7;
          max-width:720px;
        }

        .grid-meta{
          display:flex;
          gap:12px;
          flex-wrap:wrap;
          justify-content:flex-end;
        }
        .meta-card{
          display:flex;
          align-items:center;
          gap:12px;
          padding:12px 14px;
          border-radius:18px;
          background:rgba(255,255,255,.76);
          border:1px solid rgba(0,0,0,.08);
          box-shadow:0 18px 50px rgba(0,0,0,.06);
          backdrop-filter: blur(14px);
          min-width:240px;
        }
        .meta-ico{
          width:38px;
          height:38px;
          border-radius:14px;
          display:grid;
          place-items:center;
          background:linear-gradient(180deg, rgba(193,18,31,.18), rgba(193,18,31,.06));
          border:1px solid rgba(193,18,31,.18);
          box-shadow:0 20px 44px rgba(193,18,31,.10);
          color:var(--black);
          font-weight:700;
        }
        .meta-top{
          font-weight:860;
          letter-spacing:-.02em;
          color:var(--black);
          font-size:14px;
        }
        .meta-sub{
          margin-top:2px;
          color:var(--ink55);
          font-size:12px;
          line-height:1.4;
        }

        /* GRID */
        .grid-wrap{
          padding: 14px 24px 70px;
        }
        .grid-shell{
          max-width:1280px;
          margin:0 auto;
        }

        /* When the preview is open, allow a wider layout so the panel can feel substantial */
        .grid-shell.has-preview{
          max-width: min(96vw, 1600px);
        }

        /* Grid + Preview split layout */
      .grid-shell.has-preview{
        display:flex;
        gap:16px;
        align-items:flex-start;
      }
      .grid-main{
        flex: 1 1 auto;
        min-width: 0;
      }
      .grid-shell.has-preview .grid-main{
        max-width: min(48vw, 760px);
      }

/* Sticky preview (stays put while grid scrolls) */
.preview-panel{
  /* ~half viewport on desktop, with sensible caps */
  flex: 0 0 min(48vw, 760px);
  position: sticky;
  top: calc(78px + 18px + env(safe-area-inset-top));
  align-self: flex-start;
}

/* Premium preview card */
.preview-card{
  border-radius: 26px;
  background: rgba(255,255,255,.82);
  border: 1px solid rgba(0,0,0,.08);
  box-shadow: 0 40px 120px rgba(0,0,0,.14);
  backdrop-filter: blur(18px) saturate(150%);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  overflow:hidden;
}

.preview-head{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:12px;
  padding: 16px 16px 10px;
}

.preview-kicker{
  font-size:11px;
  letter-spacing:.22em;
  text-transform:uppercase;
  font-weight:900;
  color: rgba(11,11,12,.55);
}
.preview-title{
  margin-top:6px;
  font-size:16px;
  font-weight:900;
  letter-spacing:-.02em;
  color: var(--black);
}
.preview-sub{
  margin-top:6px;
  display:flex;
  align-items:center;
  gap:8px;
  flex-wrap:wrap;
  color: rgba(11,11,12,.62);
  font-size:12px;
  font-weight:800;
}
.preview-code{
  letter-spacing:.14em;
  text-transform:uppercase;
  padding:6px 10px;
  border-radius:999px;
  background: rgba(11,11,12,.06);
  border: 1px solid rgba(0,0,0,.08);
}
.preview-dot{ opacity:.5; }
.preview-rgb{ font-weight:800; }

.preview-close{
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,.10);
  background: rgba(255,255,255,.78);
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  display:grid;
  place-items:center;
  color: rgba(11,11,12,.72);
  box-shadow: 0 18px 55px rgba(0,0,0,.12);
  transition: transform .16s ease, box-shadow .18s ease, border-color .18s ease, background .18s ease;
}
.preview-close:hover{
  transform: translateY(-1px);
  border-color: rgba(0,0,0,.14);
  box-shadow: 0 26px 80px rgba(0,0,0,.16);
}

/* Room preview */
.preview-room{
  position: relative;
  margin: 12px 18px 0;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,.10);
  background: rgba(255,255,255,.70);
  box-shadow: 0 24px 70px rgba(0,0,0,.10);
}
.room-img{
  width: 100%;
  height: clamp(360px, 42vh, 520px);
  object-fit: cover;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}
.room-tint,
.room-shadow,
.room-sheen{
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* exact RGB (no blending with photo) */
.room-tint{
  mix-blend-mode: normal;
  opacity: .88;

  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: cover;
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: cover;
}

/* keep original shadows via luminance */
.room-shadow{
  mix-blend-mode: multiply;
  opacity: .65;
  filter: grayscale(1) contrast(1.18) brightness(.92);

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: cover;
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: cover;
}

/* subtle premium sheen */
.room-sheen{
  background: linear-gradient(180deg, rgba(255,255,255,.14), rgba(255,255,255,0) 44%);
  mix-blend-mode: soft-light;
  opacity: .75;
}

.preview-footer{
  padding: 14px 16px 16px;
  display:flex;
  flex-direction:column;
  gap: 12px;
}

.room-rail{
  display:flex;
  gap:10px;
  overflow:auto;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width:none;
}
.room-rail::-webkit-scrollbar{ display:none; }

.room-pill{
  display:flex;
  align-items:center;
  gap:10px;
  padding: 10px 12px;
  border-radius: 18px;
  border: 1px solid rgba(0,0,0,.10);
  background: rgba(255,255,255,.72);
  cursor: pointer;
  transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
  white-space: nowrap;
}
.room-pill:hover{ transform: translateY(-1px); box-shadow: 0 24px 70px rgba(0,0,0,.10); }
.room-pill.on{
  /* Apple-like liquid glass selection (no red) */
  border-color: rgba(0,0,0,.14);
  background: rgba(255,255,255,.86);
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  box-shadow:
    0 26px 80px rgba(0,0,0,.14),
    inset 0 1px 0 rgba(255,255,255,.50),
    inset 0 0 0 1px rgba(255,255,255,.18);
}
.room-thumb{
  width: 46px;
  height: 36px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,.12);
  background-size: cover;
  background-position: center;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.22);
  flex: 0 0 auto;
}
.room-label{
  font-size: 12px;
  font-weight: 900;
  color: rgba(11,11,12,.78);
}

.shade-ref{
  display:flex;
  align-items:center;
  gap: 12px;
  padding: 12px 12px;
  border-radius: 18px;
  border: 1px solid rgba(0,0,0,.08);
  background: rgba(255,255,255,.74);
  box-shadow: 0 18px 55px rgba(0,0,0,.08);
}
.shade-ref-swatch{
  width: 46px;
  height: 46px;
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,.12);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.28);
  flex: 0 0 auto;
}
.shade-ref-k{
  font-size: 11px;
  letter-spacing: .18em;
  text-transform: uppercase;
  font-weight: 900;
  color: rgba(11,11,12,.55);
}
.shade-ref-v{
  margin-top: 4px;
  font-size: 12px;
  font-weight: 850;
  color: rgba(11,11,12,.78);
  word-break: break-word;
  line-height: 1.2;
}

/* Responsive: stack preview below on smaller screens */
@media (max-width: 1080px){
  .grid-shell.has-preview{
    display:block;
  }

  /* Mobile: the right-side preview panel is not used; instead we render an absolute overlay */
  .preview-panel.mobile-abs{
    position: fixed;
    top: 76.5px;
    left: 0;
    right: 0;
    z-index: 99999;

    margin: 0;
    padding: 14px 14px calc(14px + env(safe-area-inset-bottom));
    background: rgba(11,11,12,.40);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);

    display:flex;
    align-items: stretch;
    justify-content: center;
  }

  /* Ensure any non-mobile-abs preview rules don't interfere */
  .preview-panel:not(.mobile-abs){
    position: static;
  }

  /* Fill the available height; no internal scrolling */
  .preview-card{
    width: 100%;
    max-width: 760px;
    height: 100%;
    border-radius: 22px;
    overflow: hidden;
    display:flex;
    flex-direction:column;
  }

  /* Keep header visible, but do NOT allow scrolling (so sticky is unnecessary) */
  .preview-head{
    background: rgba(255,255,255,.86);
    backdrop-filter: blur(16px) saturate(150%);
    -webkit-backdrop-filter: blur(16px) saturate(150%);
    border-bottom: 1px solid rgba(0,0,0,.06);
  }

  /* Let the room preview take remaining height */
  .preview-room{
    margin: 12px 14px 0;
    border-radius: 20px;
    flex: 1 1 auto;
    height: auto;
    width: auto;
  }

  .room-img{
    height: 100%;
    width: 100%;
  }

  /* Keep info + controls compact and non-scrollable */
  .preview-info{
    padding: 10px 14px 0;
  }

  .preview-footer{
    padding: 12px 14px calc(14px + env(safe-area-inset-bottom));
    overflow: hidden; /* IMPORTANT: no internal scroll */
  }

  /* Avoid horizontal scrolling on mobile too: wrap room pills */
  .room-rail{
    overflow: hidden;
    flex-wrap: wrap;
    padding-bottom: 0;
  }
}

        /* 7 columns on desktop; scales down automatically */
        
        /* Virtualized grid shell */
.rv-wrap{
  border-radius:22px;
  background:rgba(255,255,255,.70);
  border:1px solid rgba(0,0,0,.08);
  box-shadow:0 18px 50px rgba(0,0,0,.06);
  backdrop-filter: blur(14px);
  overflow:hidden;
}

/* inner padding without inline style churn */
.rv-pad{ padding:10px; }
.rv-pad-sm{ padding:8px; }

.rv-grid{ outline:none; }
.ReactVirtualized__Grid{ outline:none; }

/* While scrolling: reduce expensive paint (blur/shadows) for buttery performance */
.rv-wrap.is-scrolling{
  backdrop-filter:none;
}
.rv-wrap.is-scrolling .swatch,
.rv-wrap.is-scrolling .swatch.lite{
  box-shadow:none !important;
  backdrop-filter:none !important;
  transition:none !important;
}
/* Keep selection ring visible even while scrolling */
/* Keep selection visible even while scrolling (no heavy effects) */
.rv-wrap.is-scrolling .swatch.selected,
.rv-wrap.is-scrolling .swatch.lite.selected{
  border-color: rgba(0,0,0,.18);
  background: rgba(245,245,247,.92);
}
  
.rv-wrap.is-scrolling .swatch-chip{
  box-shadow:none !important;
}
.rv-wrap.is-scrolling .swatch-pop{
  display:none;
}

/* Swatch card (moved here to avoid per-item <style> injection) */
.swatch{
  position:relative;
  width:100%;
  padding:10px 10px 12px;
  border-radius:16px;
  border:1px solid rgba(0,0,0,.10);
  background:rgba(255,255,255,.72);
  backdrop-filter: blur(12px);
  box-shadow:0 16px 40px rgba(0,0,0,.06);
  cursor:pointer;
  text-align:left;
  transition:transform .16s ease, box-shadow .16s ease, border-color .16s ease;
  overflow:hidden;
  min-height:88px;
  contain: layout paint;
  will-change: transform;
  transform: translateZ(0);
}

.swatch.lite{
  cursor:default;
}
.swatch.lite:hover{
  transform:none;
}

.swatch::before{
  content:"";
  position:absolute;
  inset:0;
  background:linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,0));
  pointer-events:none;
}

.swatch:hover{
  transform:translateY(-2px);
  box-shadow:0 26px 70px rgba(0,0,0,.10);
  border-color:rgba(193,18,31,.16);
}

/* Selected swatch (Apple-grade: subtle darkened glass press) */
.swatch.selected{
  border-color: rgba(0,0,0,.18);
  background: rgba(245,245,247,.88);
  backdrop-filter: blur(14px) saturate(150%);
  -webkit-backdrop-filter: blur(14px) saturate(150%);
  box-shadow:
    0 24px 70px rgba(0,0,0,.14),
    inset 0 1px 0 rgba(255,255,255,.55),
    inset 0 0 0 1px rgba(255,255,255,.16),
    inset 0 -14px 28px rgba(0,0,0,.06);
  transform: translateY(-1px);
}

/* Subtle darkening overlay to signal selection */
.swatch.selected::after{
  content:"";
  position:absolute;
  inset:0;
  background: rgba(0,0,0,.035);
  pointer-events:none;
}

.swatch.selected .swatch-chip{
  filter: saturate(1.06) brightness(.95);
}

/* Keep the existing pop behavior but don't rely on it for selected */
.swatch.selected .swatch-pop{ display:none; }

        .swatch-chip{
  width:100%;
  height:44px;
  border-radius:12px;
  background:linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,0)), var(--swatch, rgba(0,0,0,.08));
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.25),
    0 14px 28px rgba(0,0,0,.10);
  border:1px solid rgba(0,0,0,.08);
}

.swatch-meta{
  margin-top:8px;
  display:flex;
  flex-direction:column;
  gap:2px;
}

.swatch-name{
  font-size:12px;
  font-weight:860;
  letter-spacing:-.01em;
  color:#0b0b0c;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}

.swatch-code{
  font-size:11px;
  letter-spacing:.12em;
  text-transform:uppercase;
  color:rgba(11,11,12,.55);
  font-weight:900;
}

.swatch-pop{
  position:absolute;
  right:10px;
  top:10px;
  font-size:10px;
  letter-spacing:.18em;
  text-transform:uppercase;
  font-weight:900;
  padding:7px 10px;
  border-radius:999px;
  color:var(--swatchText);
  background:rgba(11,11,12,.76);
  border:1px solid rgba(255,255,255,.12);
  backdrop-filter: blur(10px);
  transform:translateY(-6px);
  opacity:0;
  transition:opacity .18s ease, transform .18s ease;
}

.swatch:hover .swatch-pop{
  opacity:1;
  transform:translateY(0);
}

.swatch.copied .swatch-pop{
  opacity:1;
  transform:translateY(0);
  background:linear-gradient(180deg, rgba(193,18,31,.92), rgba(193,18,31,.78));
  border-color:rgba(255,255,255,.18);
}

@media (hover:none){
  .swatch-pop{ opacity:1; transform:none; }
}

@media (prefers-reduced-motion: reduce){
  .swatch{ transition:none; }
  .swatch-pop{ transition:none; }
}


        .endcap{
          text-align:center;
          padding:18px 14px;
          border-radius:22px;
          background:rgba(255,255,255,.70);
          border:1px solid rgba(0,0,0,.08);
          backdrop-filter: blur(14px);
          box-shadow:0 18px 50px rgba(0,0,0,.06);
          max-width:620px;
        }
        .endcap-title{
          font-weight:880;
          letter-spacing:-.02em;
          color:var(--black);
        }
        .endcap-sub{
          margin-top:8px;
          color:var(--ink70);
          line-height:1.6;
          font-size:14px;
        }

        /* Bottom CTA strip */
        .bottom-strip{
          padding: 70px 24px 110px;
          background:
            radial-gradient(1000px 540px at 20% 50%, rgba(193,18,31,.10), transparent 60%),
            #fff;
        }
        .bottom-shell{
          max-width:1280px;
          margin:0 auto;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:18px;
          flex-wrap:wrap;
          padding:28px 26px;
          border-radius:28px;
          background:rgba(11,11,12,.92);
          color:#fff;
          border:1px solid rgba(255,255,255,.10);
          box-shadow:0 44px 120px rgba(0,0,0,.18);
          position:relative;
          overflow:hidden;
        }
        .bottom-shell::after{
          content:"";
          position:absolute;
          inset:-140px -140px auto auto;
          width:320px;
          height:320px;
          background:radial-gradient(circle, rgba(193,18,31,.22), transparent 62%);
          pointer-events:none;
        }
        .bottom-eyebrow{
          font-size:11px;
          letter-spacing:.22em;
          text-transform:uppercase;
          font-weight:900;
          color:rgba(255,255,255,.72);
        }
        .bottom-left h3{
          margin:10px 0 8px;
          font-size:22px;
          letter-spacing:-.02em;
          font-weight:900;
        }
        .bottom-left p{
          margin:0;
          color:rgba(255,255,255,.72);
          line-height:1.7;
          max-width:720px;
          font-size:14px;
        }
        .bottom-actions{
          display:flex;
          gap:12px;
          flex-wrap:wrap;
        }

        /* Responsive */
        @media (max-width: 1180px){
          .hero-shell{
            grid-template-columns: 1fr;
          }
          .hero-title{ font-size:48px; }
          .hero-stats{ grid-template-columns:repeat(2, 1fr); }
        }

        @media (max-width: 820px){
          .grid-wrap{ padding: 12px 16px 60px; }
          .grid-head{ padding: 26px 16px 6px; }
          .grid-meta{ justify-content:flex-start; }
          .meta-card{ min-width: unset; }
        }

        @media (max-width: 520px){
          .grid-wrap{ padding: 10px 14px 54px; }
          .grid-head{ padding: 22px 14px 6px; }
          .grid-title{ font-size:30px; }
          .meta-card{ width:100%; }
          .search{ flex: 1 1 100%; min-width: 0; }
        }

        @media (max-width: 460px){
          
          .toolbar{ padding: 14px 14px; }
          .cat-pill{ padding: 9px 12px; font-size:12px; }
          .tchip{ padding: 9px 12px; font-size:12px; }
        }

        @media (prefers-reduced-motion: reduce){
          [data-reveal]{ transition:none; transform:none; opacity:1; }
          .pill, .cat-pill, .tchip{ transition:none; }
        }
        @media (max-width: 640px){
  .swatch{ min-height:82px; border-radius:14px; }
  .swatch-chip{ height:40px; border-radius:11px; }
}

        .preview-info{
          padding: 12px 18px 0;
        }
        .pname{
          font-size: 15px;
          font-weight: 920;
          letter-spacing: -.02em;
          color: var(--black);
        }
        .pmeta{
          margin-top: 7px;
          display:flex;
          align-items:center;
          gap: 10px;
          flex-wrap: wrap;
          color: rgba(11,11,12,.62);
          font-size: 12px;
          font-weight: 850;
        }
        .pcode{
          letter-spacing:.14em;
          text-transform:uppercase;
          padding:6px 10px;
          border-radius:999px;
          background: rgba(11,11,12,.06);
          border: 1px solid rgba(0,0,0,.08);
        }
        .pdot{ opacity:.5; }
        .prgb{ font-weight: 850; }

        .preview-cta{
          display:flex;
          flex-direction:column;
          gap:10px;
          justify-content:stretch;
        }
        .preview-cta-btn{
          width:100%;
        }
      `}</style>
    </>
  );
}

const SwatchCard = React.memo(
  function SwatchCard({ shade, onOpen, isActive }) {
    return (
      <button
        type="button"
        className={`swatch ${isActive ? "selected" : ""}`}
        aria-pressed={!!isActive}
        onClick={() => onOpen?.(shade)}
        title={`${shade.name} • ${shade.id} • ${shade.rgb}`}
        aria-label={`Preview shade ${shade.name} ${shade.id}`}
        style={{
          "--swatch": shade.rgb,
          "--swatchText": shade._text,
        }}
      >
        <div className="swatch-chip" aria-hidden="true" />
        <div className="swatch-meta">
          <div className="swatch-name">{shade.name}</div>
          <div className="swatch-code">{shade.id}</div>
        </div>
      </button>
    );
  },
  (prev, next) =>
    prev.shade === next.shade &&
    prev.onOpen === next.onOpen &&
    prev.isActive === next.isActive,
);

function SwatchLite({ shade, isActive }) {
  // ultra-light renderer used only during scroll
  return (
    <div
      className={`swatch lite ${isActive ? "selected" : ""}`}
      aria-hidden="true"
      style={{ "--swatch": shade.rgb, "--swatchText": shade._text }}
    >
      <div className="swatch-chip" aria-hidden="true" />
      <div className="swatch-meta">
        <div className="swatch-name">{shade.name}</div>
        <div className="swatch-code">{shade.id}</div>
      </div>
    </div>
  );
}
