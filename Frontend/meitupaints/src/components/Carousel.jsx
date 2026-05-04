import { Link } from "react-router-dom";

function Carousel() {
  return (
    <>
      <div
        id="myCarousel"
        className="carousel slide mb-6 meitu-carousel"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators meitu-indicators">
          <button
            type="button"
            data-bs-target="#myCarousel"
            data-bs-slide-to="0"
            className="active"
            aria-label="Slide 1"
            aria-current="true"
          ></button>
          <button
            type="button"
            data-bs-target="#myCarousel"
            data-bs-slide-to="1"
            aria-label="Slide 2"
            className=""
          ></button>
          <button
            type="button"
            data-bs-target="#myCarousel"
            data-bs-slide-to="2"
            aria-label="Slide 3"
            className=""
          ></button>
        </div>

        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="carouselimg3.webp"
              className="d-block w-100 mobile-img"
              alt="First slide"
            />
            <div className="container">
              <div className="carousel-caption text-start meitu-caption">
                <p>
                  <Link
                    className="btn btn-lg btn-primary meitu-pill"
                    to="/colors"
                  >
                    Browse Colors
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="carousel-item">
            <img
              src="carouselimg1.webp"
              className="d-block w-100 mobile-img"
              alt="Second slide"
            />
            <div className="container">
              <div className="carousel-caption meitu-caption">
                <p>
                  <Link
                    className="btn btn-lg btn-primary meitu-pill"
                    to="/support"
                  >
                    Contact us
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="carousel-item">
            <img
              src="carouselimg2.webp"
              className="d-block w-100 mobile-img"
              alt="Third slide"
            />
            <div className="container">
              <div className="carousel-caption text-end meitu-caption">
                <p>
                  <Link
                    className="btn btn-lg btn-primary meitu-pill"
                    to="/products"
                  >
                    Browse Products
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          className="carousel-control-prev meitu-control"
          type="button"
          data-bs-target="#myCarousel"
          data-bs-slide="prev"
          aria-label="Previous slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="currentColor"
            className="bi bi-chevron-left"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
            />
          </svg>
          <span className="visually-hidden">Previous</span>
        </button>

        <button
          className="carousel-control-next meitu-control"
          type="button"
          data-bs-target="#myCarousel"
          data-bs-slide="next"
          aria-label="Next slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="currentColor"
            className="bi bi-chevron-right"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
            />
          </svg>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* ===== Apple-like Premium Styling (Meitu Red) ===== */}
      <style>{`
        :root{
          --meitu-red:#c1121f;
          --meitu-black:#0b0b0c;
          --glass: rgba(255,255,255,.68);
          --glass-strong: rgba(255,255,255,.78);
          --shadow: 0 22px 60px rgba(0,0,0,.28);
        }

        /* Make slide transitions feel premium + avoid "flash" */
        .meitu-carousel{
          background: transparent;
        }
        .meitu-carousel .carousel-item{
          background: #000; /* prevents white flash between slides */
        }

        /* Slight Apple-like photo polish */
        .meitu-carousel .carousel-item img{
          filter: brightness(1.06) contrast(1.04) saturate(1.04);
          transform: scale(1.02);
          transition: transform 5s cubic-bezier(.22,.61,.36,1);
          will-change: transform;
        }
        .meitu-carousel .carousel-item.active img{
          transform: scale(1);
        }

        /* Caption area should NOT block image; keep it light */
        .meitu-caption{
          pointer-events: none; /* so only pill is clickable */
        }
        .meitu-caption p{ margin:0; }
        .meitu-pill{
          pointer-events: auto;
        }

        /* ===== CTA PILL (Apple-ish liquid glass + Meitu red) ===== */
        .meitu-pill{
          border: 1px solid rgba(255,255,255,.28) !important;
          background:
            linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,.06)),
            rgba(193,18,31,.92) !important;
          color: #fff !important;
          border-radius: 999px !important;
          padding: 14px 30px !important;
          font-weight: 650 !important;
          letter-spacing: .01em !important;
          text-decoration: none !important;
          box-shadow:
            0 18px 55px rgba(193,18,31,.42),
            inset 0 1px 0 rgba(255,255,255,.22);
          transform: translateY(0) scale(1);
          transition:
            transform .22s cubic-bezier(.22,.61,.36,1),
            box-shadow .22s ease,
            background .22s ease,
            filter .22s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .meitu-pill:hover{
          transform: translateY(-2px) scale(1.02);
          box-shadow:
            0 26px 80px rgba(193,18,31,.52),
            inset 0 1px 0 rgba(255,255,255,.28);
          filter: saturate(1.06);
        }

        .meitu-pill:active{
          transform: translateY(0) scale(.99);
          box-shadow:
            0 14px 44px rgba(193,18,31,.38),
            inset 0 1px 0 rgba(255,255,255,.18);
        }

        .meitu-pill:focus{
          outline: none !important;
          box-shadow:
            0 26px 80px rgba(193,18,31,.52),
            0 0 0 4px rgba(193,18,31,.18),
            inset 0 1px 0 rgba(255,255,255,.25);
        }

        /* ===== Indicators: Apple-like dots w/ red active ===== */
        .meitu-indicators [data-bs-target]{
          width: 9px;
          height: 9px;
          border-radius: 999px;
          border: 0;
          background: rgba(255,255,255,.55);
          opacity: 1;
          transition: transform .2s ease, background .2s ease, width .2s ease;
          margin: 0 6px;
          box-shadow: 0 6px 18px rgba(0,0,0,.22);
        }
        .meitu-indicators .active{
          background: var(--meitu-red);
          width: 22px;
          transform: translateY(-1px);
        }

        /* ===== Premium side controls (glass buttons) ===== */
        .meitu-control{
          width: 54px;
          height: 54px;
          top: 50%;
          transform: translateY(-50%);
          border-radius: 999px;
          opacity: 0;
          transition: opacity .25s ease, transform .25s ease;
        }

        /* show controls on hover / touch intent */
        .meitu-carousel:hover .meitu-control{
          opacity: 1;
        }

        .meitu-control:hover{
          transform: translateY(-50%) scale(1.05);
        }

        .meitu-control-icon{
          width: 54px;
          height: 54px;
          border-radius: 999px;
          background:
            linear-gradient(180deg, rgba(255,255,255,.9), rgba(255,255,255,.65));
          backdrop-filter: blur(14px);
          box-shadow: var(--shadow);
          border: 1px solid rgba(255,255,255,.35);
          filter: none;
        }

        /* Make the arrow icon darker + crisp */
        .carousel-control-prev-icon.meitu-control-icon,
        .carousel-control-next-icon.meitu-control-icon{
          background-size: 16px 16px;
          filter: invert(0);
        }

        /* ===== Mobile polish ===== */
        @media (max-width: 768px){
          .meitu-carousel:hover .meitu-control{
            opacity: 1; /* always visible on mobile since hover isn't reliable */
          }

          .meitu-control{
            width: 46px;
            height: 46px;
            opacity: .95;
          }

          .meitu-control-icon{
            width: 46px;
            height: 46px;
            box-shadow: 0 16px 40px rgba(0,0,0,.22);
          }

          .meitu-pill{
            padding: 12px 22px !important;
            font-size: 14px !important;
          }

          .meitu-indicators [data-bs-target]{
            width: 8px;
            height: 8px;
          }
          .meitu-indicators .active{
            width: 20px;
          }
        }

        /* Accessibility: respect reduced motion */
        @media (prefers-reduced-motion: reduce){
          .meitu-carousel .carousel-item img,
          .meitu-pill,
          .meitu-indicators [data-bs-target],
          .meitu-control{
            transition: none !important;
            animation: none !important;
          }
        }
        /* ===== CTA PILL REFINEMENT ===== */

/* Unbold text */
.meitu-pill{
  font-weight: 500 !important; /* was bold – now Apple-clean */
  position: relative;
  padding-left: 44px !important;
  padding-right: 44px !important;
}

/* ===== RESPONSIVE CAROUSEL HEIGHT FIX ===== */

/* Tablets */
@media (max-width: 1024px){
  .carousel,
  .carousel-inner,
  .carousel-item{
    width: 100%;
    height: auto;
  }
}

/* Phones */
@media (max-width: 768px){
  .carousel,
  .carousel-inner,
  .carousel-item{
    height: auto;
  }
    .mobile-img{
        max-width: 100%;
  height: auto; 
    }
}

/* Small phones */
@media (max-width: 480px){
  .carousel,
  .carousel-inner,
  .carousel-item{
    height: 240px;
  }
}

/* ===== RESPONSIVE IMAGE FIT (NO CROPPING) ===== */

/* Tablets & below */
@media (max-width: 1024px) {
  .carousel,
  .carousel-inner,
  .carousel-item {
    height: auto; /* allow image to define height */
  }

  .carousel-item img {
    width: 100%;
    height: auto;            /* key fix */
    object-fit: contain;     /* show full image */
    transform: none;         /* disable zoom crop */
    filter: brightness(1.08) contrast(1.03);
  }
}

/* Phones */
@media (max-width: 768px) {
  .carousel-item img {
    max-height: 70vh; /* keeps hero feel without overflow */
  }
}

/* Small phones */
@media (max-width: 480px) {
  .carousel-item img {
    max-height: 60vh;
  }
  .meitu-caption p {
  display:none;
  }
}


      `}</style>
    </>
  );
}

export default Carousel;
