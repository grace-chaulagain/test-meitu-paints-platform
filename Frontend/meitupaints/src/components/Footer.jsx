// Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="meitu-footer" aria-label="Meitu footer">
        <div className="mf-wrap">
          {/* TOP */}
          <div className="mf-top">
            {/* Brand */}
            <div className="mf-brand">
              <Link to="/" className="mf-brandLink" aria-label="Meitu Paints">
                <img
                  src="/meitulogo.svg"
                  alt="MEITU Paints"
                  width="34"
                  height="34"
                  className="mf-logo"
                />
                <div className="mf-brandText">
                  <div className="mf-brandMain">MEITU</div>
                  <div className="mf-brandSub">PAINTS</div>
                </div>
              </Link>

              <p className="mf-tagline">
                Quiet luxury surfaces. Precision systems. Controlled red energy.
              </p>

              <div className="mf-pills">
                <span className="mf-pill">Premium Finishes</span>
                <span className="mf-pill">Color Systems</span>
                <span className="mf-pill">Professional Tools</span>
              </div>
            </div>

            {/* Columns */}
            <div className="mf-cols">
              <div className="mf-col">
                <div className="mf-title">Explore</div>
                <Link className="mf-link" to="/products">
                  Products
                </Link>
                <Link className="mf-link" to="/colors">
                  Colors
                </Link>
                <Link className="mf-link" to="/textures">
                  Textures
                </Link>
                <Link className="mf-link" to="/ratecalculator">
                  Rate Calculator
                </Link>
              </div>

              <div className="mf-col">
                <div className="mf-title">Collections</div>
                <Link className="mf-link" to="/regular">
                  Regular Paints
                </Link>
                <Link className="mf-link" to="/granite">
                  Granite &amp; Stone
                </Link>
                <Link className="mf-link" to="/primer">
                  Primers
                </Link>
                <Link className="mf-link" to="/putting">
                  Putting
                </Link>
                <Link className="mf-link" to="/specialty">
                  Specialty
                </Link>
                <Link className="mf-link" to="/utilities">
                  Utilities
                </Link>
              </div>

              <div className="mf-col">
                <div className="mf-title">Support</div>
                <Link className="mf-link" to="/support">
                  Support Center
                </Link>
                <Link className="mf-link" to="/dealership">
                  Dealership
                </Link>
                <Link className="mf-link" to="/inquiry">
                  Inquiry
                </Link>
                <Link className="mf-link" to="/about">
                  About Us
                </Link>
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="mf-bottom">
            <div className="mf-left">
              <span className="mf-copy">© {year} Meitu Paints</span>
              <span className="mf-dot" aria-hidden="true">
                ·
              </span>
              <span className="mf-muted">All rights reserved</span>
            </div>

            <div className="mf-right">
              <Link className="mf-mini" to="/support">
                Contact
              </Link>
              <span className="mf-dot" aria-hidden="true">
                ·
              </span>
              <Link className="mf-mini" to="/about">
                Brand
              </Link>
              <span className="mf-dot" aria-hidden="true">
                ·
              </span>
              <Link className="mf-mini" to="/horoscope">
                Horoscope
              </Link>
            </div>
          </div>
        </div>

        <style>{`
          :root{
            --red:#c1121f;
            --red2:#e11d2e;
            --black:#0b0b0c;
            --ink70:rgba(11,11,12,.72);
            --ink55:rgba(11,11,12,.56);
            --line:rgba(0,0,0,.10);
            --glass:rgba(255,255,255,.88);
            --ease:cubic-bezier(.22,.61,.36,1);
          }

          .meitu-footer{
            position:relative;
            margin-top:64px;
            padding: 44px 0 26px;
            background:
              radial-gradient(900px 240px at 15% 0%, rgba(193,18,31,.10), transparent 55%),
              radial-gradient(900px 240px at 100% 100%, rgba(0,0,0,.06), transparent 55%),
              rgba(255,255,255,.55);
            border-top: 1px solid rgba(0,0,0,.08);
            backdrop-filter: blur(18px);
          }

          .meitu-footer::after{
            content:"";
            position:absolute;
            left:0; right:0; top:0;
            height:1px;
            background: linear-gradient(90deg,
              transparent,
              rgba(193,18,31,.28),
              transparent
            );
            opacity:.55;
            pointer-events:none;
          }

          .mf-wrap{
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 22px;
          }

          .mf-top{
            display:grid;
            grid-template-columns: 1.1fr 1.4fr;
            gap: 36px;
            align-items:start;
          }

          /* Brand block */
          .mf-brandLink{
            display:flex;
            align-items:center;
            gap:12px;
            text-decoration:none;
          }

          .mf-logo{
            filter: drop-shadow(0 10px 20px rgba(0,0,0,.12));
          }

          .mf-brandText{
            display:flex;
            flex-direction:column;
            line-height:1;
          }

          .mf-brandMain{
            font-size:16px;
            font-weight:900;
            letter-spacing:.14em;
            color: var(--black);
          }

          .mf-brandSub{
            margin-top:4px;
            font-size:10px;
            font-weight:800;
            letter-spacing:.34em;
            color: var(--red);
          }

          .mf-tagline{
            margin: 14px 0 0;
            max-width: 420px;
            font-size: 13px;
            line-height: 1.55;
            color: var(--ink55);
          }

          .mf-pills{
            margin-top: 14px;
            display:flex;
            flex-wrap:wrap;
            gap:8px;
          }

          .mf-pill{
            display:inline-flex;
            align-items:center;
            padding: 7px 10px;
            border-radius: 999px;
            border: 1px solid rgba(0,0,0,.10);
            background: rgba(255,255,255,.62);
            font-size: 11px;
            font-weight: 800;
            color: rgba(11,11,12,.72);
          }

          /* Columns */
          .mf-cols{
            display:grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 22px;
          }

          .mf-col{
            padding: 4px 0;
          }

          .mf-title{
            font-size: 12px;
            font-weight: 900;
            letter-spacing: .10em;
            text-transform: uppercase;
            color: rgba(11,11,12,.72);
            margin-bottom: 12px;
          }

          .mf-link{
            display:block;
            text-decoration:none;
            color: var(--ink55);
            font-size: 13px;
            font-weight: 650;
            padding: 8px 0;
            transition: color .18s var(--ease), transform .18s var(--ease);
          }

          .mf-link:hover{
            color: var(--black);
            transform: translateX(2px);
          }

          .mf-link:focus-visible{
            outline: none;
            box-shadow: 0 0 0 4px rgba(193,18,31,.14);
            border-radius: 10px;
            padding-left: 8px;
            padding-right: 8px;
            margin-left: -8px;
            margin-right: -8px;
          }

          /* Bottom bar */
          .mf-bottom{
            margin-top: 26px;
            padding-top: 18px;
            border-top: 1px solid rgba(0,0,0,.08);
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap: 12px;
          }

          .mf-left, .mf-right{
            display:flex;
            align-items:center;
            gap:10px;
            flex-wrap:wrap;
          }

          .mf-copy{
            font-size: 12px;
            font-weight: 800;
            color: rgba(11,11,12,.72);
          }

          .mf-muted{
            font-size: 12px;
            color: rgba(11,11,12,.50);
            font-weight: 650;
          }

          .mf-mini{
            font-size: 12px;
            font-weight: 800;
            color: rgba(11,11,12,.62);
            text-decoration:none;
            transition: color .18s var(--ease);
          }

          .mf-mini:hover{
            color: var(--black);
          }

          .mf-dot{
            color: rgba(11,11,12,.35);
          }

          /* Responsive */
          @media (max-width: 980px){
            .mf-top{
              grid-template-columns: 1fr;
              gap: 26px;
            }
            .mf-cols{
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }

          @media (max-width: 640px){
            .meitu-footer{
              padding: 38px 0 22px;
            }
            .mf-cols{
              grid-template-columns: 1fr;
              gap: 14px;
            }
            .mf-bottom{
              flex-direction: column;
              align-items:flex-start;
            }
          }
        `}</style>
      </footer>
    </>
  );
}
