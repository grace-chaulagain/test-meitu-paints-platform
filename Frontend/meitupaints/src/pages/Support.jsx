import React, { useEffect, useMemo, useRef, useState } from "react";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";

function Support() {
  const pageRef = useRef(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    msg: "",
    actionLabel: "",
    onAction: null,
  });
  const toastTimerRef = useRef(null);

  // ✅ Mobile-safe deep links
  const SUPPORT_PHONE = "+97715199724"; // keep digits + country code
  const SUPPORT_EMAIL = "sujata.meitupaints@gmail.com";
  const WHATSAPP_PHONE = "9779808299777"; // digits only (country code + number)

  const isMobile_ = () =>
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const openHref_ = (href) => {
    // Use direct navigation for deep links (tel/mailto/whatsapp)
    if (typeof window === "undefined") return;
    window.location.href = href;
  };

  const handleCall_ = (e) => {
    e?.preventDefault?.();
    openHref_(`tel:${SUPPORT_PHONE}`);
  };

  const isInAppBrowser_ = () => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent || "";
    return /FBAN|FBAV|Instagram|Line\/|TikTok|Twitter|LinkedInApp|WhatsApp|wv|WebView/i.test(
      ua
    );
  };

  const showToast_ = ({ msg, actionLabel = "", onAction = null }) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ open: true, msg, actionLabel, onAction });
    toastTimerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, open: false }));
    }, 4500);
  };

  const hideToast_ = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast((t) => ({ ...t, open: false }));
  };

  const copyText_ = async (text) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) {}

    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return Boolean(ok);
    } catch (_) {
      return false;
    }
  };

  const handleEmail_ = async (e) => {
    e?.preventDefault?.();

    const mailto = `mailto:${SUPPORT_EMAIL}`;

    // Attempt to open mail client
    openHref_(mailto);

    // Mobile + in-app browsers often block/silently fail -> provide copy fallback
    if (isMobile_() || isInAppBrowser_()) {
      showToast_({
        msg: "If your email app didn’t open, copy our address.",
        actionLabel: "Copy email",
        onAction: async () => {
          const ok = await copyText_(SUPPORT_EMAIL);
          showToast_({
            msg: ok
              ? "Email address copied."
              : "Couldn’t copy automatically. Please copy manually.",
          });
        },
      });
    }
  };

  const handleWhatsApp_ = (e) => {
    e?.preventDefault?.();
    // On mobile, prefer the app scheme; fallback to wa.me
    const appHref = `whatsapp://send?phone=${WHATSAPP_PHONE}`;
    const webHref = `https://wa.me/${WHATSAPP_PHONE}`;

    if (!isMobile_()) {
      // Desktop -> WhatsApp Web
      if (typeof window !== "undefined")
        window.open(webHref, "_blank", "noopener,noreferrer");
      return;
    }

    // Mobile -> try app scheme first
    openHref_(appHref);

    // Fallback to web after a short delay if app scheme is blocked
    setTimeout(() => {
      try {
        openHref_(webHref);
      } catch (_) {}
    }, 400);
  };

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

  // “Support tiles” (dense + curated)
  const supportPillars = useMemo(
    () => [
      {
        title: "Product Guidance",
        desc: "Pick the right system for your surface, climate, and finish goals  with clear, professional steps.",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-receipt"
            viewBox="0 0 16 16"
          >
            <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27m.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0z" />
            <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5" />
          </svg>
        ), // TODO: replace with sleek SVG icon (document/checklist)
        tag: "Most Popular",
        to: "/products",
      },
      {
        title: "Application Help",
        desc: "Primer, coats, drying time, and prep  learn the Meitu method for consistency and durability.",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-hammer"
            viewBox="0 0 16 16"
          >
            <path d="M9.972 2.508a.5.5 0 0 0-.16-.556l-.178-.129a5 5 0 0 0-2.076-.783C6.215.862 4.504 1.229 2.84 3.133H1.786a.5.5 0 0 0-.354.147L.146 4.567a.5.5 0 0 0 0 .706l2.571 2.579a.5.5 0 0 0 .708 0l1.286-1.29a.5.5 0 0 0 .146-.353V5.57l8.387 8.873A.5.5 0 0 0 14 14.5l1.5-1.5a.5.5 0 0 0 .017-.689l-9.129-8.63c.747-.456 1.772-.839 3.112-.839a.5.5 0 0 0 .472-.334" />
          </svg>
        ), // TODO: replace with sleek SVG icon (tools)
        tag: "Step-by-step",
        to: "/inquiry",
      },
      {
        title: "Colour Matching",
        desc: "Ensure lighting-proof colour decisions  undertones, sheen effects, and accurate sampling.",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-palette"
            viewBox="0 0 16 16"
          >
            <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
            <path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8m-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7" />
          </svg>
        ), // TODO: replace with sleek SVG icon (palette)
        tag: "Precision",
        to: "/colors",
      },
      {
        title: "Dealer & Availability",
        desc: "Find authorized dealers, confirm stock, and access genuine product guidance nationwide.",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-geo-alt-fill"
            viewBox="0 0 16 16"
          >
            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
          </svg>
        ), // TODO: replace with sleek SVG icon (location pin)
        tag: "Nationwide",
        to: "/dealership",
      },
      {
        title: "Warranty & Claims",
        desc: "Understand coverage, documentation, and what we need to resolve issues quickly.",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-shield-check"
            viewBox="0 0 16 16"
          >
            <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56" />
            <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0" />
          </svg>
        ), // TODO: replace with sleek SVG icon (shield)
        tag: "Assurance",
        to: "/inquiry",
      },
      {
        title: "Technical Data",
        desc: "Spec sheets, VOC info, drying curves, coverage tables  the details professionals ask for.",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-calculator-fill"
            viewBox="0 0 16 16"
          >
            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm2 .5v2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5m0 4v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5M4.5 9a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 12.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5M7.5 6a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM7 9.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5m.5 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM10 6.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5m.5 2.5a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5z" />
          </svg>
        ), // TODO: replace with sleek SVG icon (ruler/graph)
        tag: "Pro-grade",
        to: "/inquiry",
      },
    ],
    []
  );

  // FAQ (dense)
  const faqs = useMemo(
    () => [
      {
        q: "Which paint system should I choose: Regular, Granite, Liquid, RealStone?",
        a: "Start with the surface (cement/plaster/wood/metal), then decide the finish behaviour you need (washability, texture, sheen stability, weather resistance). Regular systems prioritize everyday performance, Granite/Stone emphasizes texture and depth, Liquid focuses on smooth flow and premium finish feel, and RealStone targets authentic stone-like visual systems. If you share a photo of the wall + location climate, we can recommend a full system: prep + primer + topcoat.",
      },
      {
        q: "Why does the colour look different at night?",
        a: "Light temperature changes perception. Warm bulbs pull colours toward yellow/red; cool LEDs can shift tones blue/grey. Sheen also matters  higher sheen reflects more and can appear lighter. Always sample on a 1m² area, check in day + night, and keep lighting consistent when comparing.",
      },
      {
        q: "What’s the ideal drying time between coats?",
        a: "Drying depends on humidity, airflow, and substrate absorption. As a safe professional baseline: allow the first coat to dry fully (touch-dry is not enough), then apply the next coat. In high humidity, extend the time. Proper curing improves washability and reduces marks.",
      },
      {
        q: "How do I avoid patchiness and roller marks?",
        a: "Use consistent loading, maintain a wet edge, and avoid over-rolling. Prep should be even (no dusty areas). Primer selection matters: it stabilizes absorption so topcoats behave consistently. Use the correct roller nap and maintain uniform pressure.",
      },
      {
        q: "Do you have low-VOC options?",
        a: "Yes  Meitu’s low-VOC approach focuses on indoor comfort: reduced odour, better air quality, and safer living spaces. Always ventilate during application and curing.",
      },
      {
        q: "Can I paint during monsoon season?",
        a: "Yes, but conditions matter. High humidity can slow drying and affect film formation. Prioritize airflow, avoid painting on damp substrates, and extend drying times. For exterior jobs, ensure a stable weather window for curing.",
      },
      {
        q: "How do I maintain the finish over time?",
        a: "Use gentle cleaning methods for the first few weeks (full cure period). Avoid harsh abrasives. Choose the right sheen for the room: higher sheen often improves washability, while matte hides surface imperfections better.",
      },
      {
        q: "How can I contact Meitu support quickly?",
        a: "Use the quick actions below: call, WhatsApp, email, or visit your nearest dealer. You can also use the Live Chat widget (bottom-right) once integrated.",
      },
    ],
    []
  );

  // Horoscope palette chips (vibrant detail layer)
  const zodiacChips = useMemo(
    () => [
      {
        name: "Aries",
        note: "Bold, kinetic, confident.",
        colors: [
          "#C1121F",
          "#FF3B30",
          "#FF6B6B",
          "#111111",
          "#FFD1D1",
          "#B80F1A",
        ],
      },
      {
        name: "Libra",
        note: "Balanced, soft, refined.",
        colors: [
          "#F2F2F7",
          "#E5E5EA",
          "#C7C7CC",
          "#BDB8B2",
          "#C1121F",
          "#0B0B0C",
        ],
      },
      {
        name: "Aquarius",
        note: "Modern, visionary contrast.",
        colors: [
          "#0A84FF",
          "#64D2FF",
          "#34C759",
          "#0B0B0C",
          "#EAF6FF",
          "#C1121F",
        ],
      },
    ],
    []
  );

  return (
    <>
      <NavBar />

      <main ref={pageRef} className="support-root">
        {/* HERO */}
        <header className="support-hero">
          <div className="hero-ambient" aria-hidden="true" />
          <div className="hero-shell" data-reveal>
            <span className="eyebrow">SUPPORT</span>
            <h1 className="hero-title">
              Meitu <span className="accent">Support</span>.
              <br />
            </h1>
            <p className="hero-sub">
              From selecting the right coating system to perfecting application
              technique Meitu Support is designed to deliver clarity, speed, and
              professional confidence. Browse our curated resources, technical
              guidance, and options.
            </p>

            {/* Quick contact chips */}
            <div className="contact-chips" data-reveal>
              <a
                className="chip-link"
                href={`tel:${SUPPORT_PHONE}`}
                onClick={handleCall_}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-telephone"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                </svg>{" "}
                <span>Call</span>
              </a>

              <a
                className="chip-link"
                href={`mailto:${SUPPORT_EMAIL}`}
                onClick={handleEmail_}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-envelope"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                </svg>{" "}
                <span>Email</span>
              </a>

              <a
                className="chip-link"
                href={`https://wa.me/${WHATSAPP_PHONE}`}
                onClick={handleWhatsApp_}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-whatsapp"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                </svg>
                <span>WhatsApp</span>
              </a>

              <Link className="chip-link" to="/dealership">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-bag"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                </svg>
                <span>Dealer</span>
              </Link>
            </div>

            {/* Social (moved up for quicker access) */}
            <div className="social-row top" data-reveal>
              <div className="social-title">Follow Meitu</div>
              <div className="social-links">
                <a
                  className="social-btn"
                  href="https://www.facebook.com/meitupaint/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-facebook"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                  </svg>
                  <span>Facebook</span>
                </a>
                <a
                  className="social-btn"
                  href="https://www.instagram.com/meitupaintsnepal/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-instagram"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                  </svg>
                  <span>Instagram</span>
                </a>
                <a
                  className="social-btn"
                  href="https://www.tiktok.com/@meitu_paints_nepal/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-tiktok"
                    viewBox="0 0 16 16"
                  >
                    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                  </svg>
                  <span>TikTok</span>
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Thin Divider */}
        <section className="section-divider" aria-hidden="true">
          <span className="divider-line" />
        </section>

        {/* SUPPORT PILLARS */}
        <section className="support-section">
          <div className="container">
            <div className="section-head" data-reveal>
              <h2 className="section-title">What can we help you with?</h2>
              <p className="section-sub">
                Choose a category each one is built like a mini product
                experience: clear steps, pro-grade details, and elegant
                guidance.
              </p>
            </div>

            <div className="pillar-grid">
              {supportPillars.map((p) => (
                <Link
                  key={p.title}
                  to={p.to}
                  className="pillar-card"
                  data-reveal
                >
                  <div className="pillar-top">
                    <div className="icon-chip" aria-hidden="true">
                      {p.icon}
                    </div>
                    <div className="tag">{p.tag}</div>
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <div className="card-cta">
                    Learn more <span className="inline-arrow">→</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="center-actions" data-reveal>
              <Link to="/about" className="pill glass">
                About Meitu <span className="btn-arrow">→</span>
              </Link>
              <Link to="/ratecalculator" className="pill ghost">
                Rate Calculator <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* APPLICATION GUIDE (Dense) */}
        <section id="application" className="support-section alt">
          <div className="container">
            <div className="section-head" data-reveal>
              <h2 className="section-title">Application guidance</h2>
              <p className="section-sub">
                We don’t just tell you “apply two coats”. We explain why each
                layer exists and how to make finishes behave consistently in
                real environments.
              </p>
            </div>

            <div className="two-col">
              <div className="glass-block" data-reveal>
                <div className="block-title">
                  {/* TODO: Replace with “surface prep” SVG icon */}🧱 Surface
                  preparation
                </div>
                <p>
                  Professional results are determined before the first coat.
                  Ensure the surface is clean, dry, stable, and even. Dust and
                  inconsistent absorption create patchiness and weak adhesion.
                </p>
                <ul className="pro-list">
                  <li>
                    Remove dust + loose material (cleaner surface = stronger
                    film)
                  </li>
                  <li>
                    Repair cracks and level uneven areas (finish looks cleaner)
                  </li>
                  <li>
                    Use primer to stabilize absorption (controls patchiness)
                  </li>
                  <li>
                    Allow proper drying time between coats (durability +
                    washability)
                  </li>
                </ul>
                <Link to="/primer" className="inline-action">
                  Find the right primer <span className="inline-arrow">→</span>
                </Link>
              </div>

              <div className="glass-block" data-reveal>
                <div className="block-title">
                  {/* TODO: Replace with “roller/brush” SVG icon */}🧑‍🎨 Tools +
                  technique
                </div>
                <p>
                  Technique affects texture, sheen, and perceived colour.
                  Maintain a wet edge, apply consistent pressure, and avoid
                  over-rolling as paint begins to set.
                </p>
                <div className="micro-grid">
                  <div className="micro-card">
                    <h4>Roller selection</h4>
                    <p>
                      Use the correct nap length for your texture level and
                      finish target.
                    </p>
                  </div>
                  <div className="micro-card">
                    <h4>Coat discipline</h4>
                    <p>
                      Two coats mean two fully dried coats not rushed layering.
                    </p>
                  </div>
                  <div className="micro-card">
                    <h4>Edge control</h4>
                    <p>
                      Keep a wet edge to prevent lap marks and visible
                      transitions.
                    </p>
                  </div>
                  <div className="micro-card">
                    <h4>Lighting check</h4>
                    <p>
                      Review under day + night lighting for the real perception.
                    </p>
                  </div>
                </div>

                <Link to="/inquiry" className="inline-action">
                  Ask about tools <span className="inline-arrow">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* COLOUR SUPPORT */}
        <section id="color" className="support-section">
          <div className="container">
            <div className="section-head" data-reveal>
              <h2 className="section-title">
                Colour matching & sheen behaviour
              </h2>
              <p className="section-sub">
                Colour is physics: light + surface + sheen. We help you choose
                tones that stay stable and elegant under real lighting.
              </p>
            </div>

            <div className="color-grid">
              <div className="color-card" data-reveal>
                {/* TODO: Replace with “light/sun” SVG */}🌤️
                <h4>Lighting reality</h4>
                <p>
                  Warm lighting pulls tones toward red/yellow; cool LEDs can
                  shift them blue/grey. Always test in your actual room
                  lighting.
                </p>
              </div>

              <div className="color-card" data-reveal>
                {/* TODO: Replace with “sparkle/sheen” SVG */}✨
                <h4>Sheen control</h4>
                <p>
                  Higher sheen reflects more light (often appears brighter).
                  Matte hides imperfections better. Select based on use +
                  maintenance.
                </p>
              </div>

              <div className="color-card" data-reveal>
                {/* TODO: Replace with “swatch” SVG */}🧩
                <h4>Sampling protocol</h4>
                <p>
                  Sample at least 1m². View from distance. Check at day + night.
                  This avoids expensive surprises after full application.
                </p>
              </div>

              <div className="color-card" data-reveal>
                {/* TODO: Replace with “shield/clean” SVG */}🧼
                <h4>Washability</h4>
                <p>
                  For high-touch areas, pick systems optimized for cleaning and
                  stain resistance. Proper curing makes a huge difference.
                </p>
              </div>
            </div>

            <div className="center-actions" data-reveal>
              <Link to="/products" className="pill glass">
                Match to Products <span className="btn-arrow">→</span>
              </Link>
              <Link to="/inquiry" className="pill ghost">
                Get Expert Colour Help <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </section>
        {/* Horoscope palette teaser (vibrant layer) */}
        <div className="zodiac-strip" data-reveal>
          <div className="zodiac-left">
            <div className="zodiac-title">Horoscope palettes</div>
            <div className="zodiac-sub">
              Inspiration that stays professional playful colour energy mapped
              into real systems.
            </div>
            <Link className="inline-action" to="/horoscope">
              Explore Zodiac Colours <span className="inline-arrow">→</span>
            </Link>
          </div>

          <div className="zodiac-right" aria-hidden="true">
            {zodiacChips.map((z) => (
              <div key={z.name} className="zodiac-chip">
                <div className="z-name">{z.name}</div>
                <div className="z-note">{z.note}</div>
                <div className="z-swatches">
                  {z.colors.map((c) => (
                    <span key={c} style={{ background: c }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TECHNICAL RESOURCES */}
        <section id="technical" className="support-section alt">
          <div className="container">
            <div className="section-head" data-reveal>
              <h2 className="section-title">Technical resources</h2>
              <p className="section-sub">
                Designed for professionals: coverage guidance, VOC notes, drying
                guidance, surface compatibility, and system selection.
              </p>
            </div>

            <div className="resource-grid">
              <div className="resource-card" data-reveal>
                <div className="resource-top">
                  <div className="icon-chip" aria-hidden="true">
                    {/* TODO: Replace with PDF/specsheet SVG */}📄
                  </div>
                  <span className="tag">Spec Sheets</span>
                </div>
                <h3>Product specification sheets</h3>
                <p>
                  Coverage, drying time guidance, recommended primers, finish
                  options, and application details. (You can link to PDFs
                  later.)
                </p>
                <Link className="pill glass small" to="/inquiry">
                  Request PDFs <span className="btn-arrow">→</span>
                </Link>
              </div>

              <div className="resource-card" data-reveal>
                <div className="resource-top">
                  <div className="icon-chip" aria-hidden="true">
                    {/* TODO: Replace with VOC/leaf SVG */}🍃
                  </div>
                  <span className="tag">Low-VOC</span>
                </div>
                <h3>Indoor comfort & safety</h3>
                <p>
                  Low odour, safer indoor air guidance, ventilation basics, and
                  curing best practices explained clearly.
                </p>
                <Link className="pill glass small" to="/inquiry">
                  Inquire <span className="btn-arrow">→</span>
                </Link>
              </div>

              <div className="resource-card" data-reveal>
                <div className="resource-top">
                  <div className="icon-chip" aria-hidden="true">
                    {/* TODO: Replace with climate/monsoon SVG */}🌧️
                  </div>
                  <span className="tag">Climate</span>
                </div>
                <h3>Monsoon application notes</h3>
                <p>
                  How humidity affects film formation and why drying time
                  matters. Practical tips for Nepal’s weather realities.
                </p>
                <a className="pill solid small" href="#faqs">
                  Read FAQs <span className="btn-arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* WARRANTY */}
        <section id="warranty" className="support-section">
          <div className="container">
            <div className="section-head" data-reveal>
              <h2 className="section-title">Warranty & claims</h2>
              <p className="section-sub">
                Clarity: what’s covered, what we need, and how we resolve issues
                quickly.
              </p>
            </div>

            <div className="warranty-grid">
              <div className="glass-block" data-reveal>
                <div className="block-title">
                  {/* TODO: Replace with shield/check SVG */}✅ What we
                  typically need
                </div>
                <ul className="pro-list">
                  <li>Product name + batch info (from packaging)</li>
                  <li>Surface type (cement/plaster/wood/metal)</li>
                  <li>Application method (roller/brush/spray)</li>
                  <li>Photos in daylight (wide + close-up)</li>
                  <li>
                    Timeline (date of application, coats, drying intervals)
                  </li>
                </ul>
                <Link className="pill solid small" to="/inquiry">
                  Start a claim <span className="btn-arrow">→</span>
                </Link>
              </div>

              <div className="glass-block" data-reveal>
                <div className="block-title">
                  {/* TODO: Replace with timeline/steps SVG */}🧠 How we resolve
                  fast
                </div>
                <p>
                  We treat issues like a system diagnosis: identify the
                  substrate behaviour, confirm prep + primer, analyze
                  environment conditions, then recommend correction steps that
                  restore finish integrity.
                </p>
                <div className="steps">
                  {[
                    "Submit details",
                    "Technical review",
                    "Recommendation",
                    "Resolution plan",
                  ].map((s) => (
                    <div key={s} className="step">
                      <span className="step-dot" aria-hidden="true" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
                <Link className="inline-action" to="/products">
                  Learn about systems <span className="inline-arrow">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section id="faqs" className="support-section alt">
          <div className="container">
            <div className="section-head" data-reveal>
              <h2 className="section-title">Frequently asked questions</h2>
              <p className="section-sub">
                Dense, professional answers designed to save time and prevent
                costly mistakes.
              </p>
            </div>

            <div className="faq-grid">
              {faqs.map((f) => (
                <details key={f.q} className="faq" data-reveal>
                  <summary>
                    <span>{f.q}</span>
                    <span className="chev" aria-hidden="true">
                      ▾
                    </span>
                  </summary>
                  <div className="faq-body">{f.a}</div>
                </details>
              ))}
            </div>

            <div className="center-actions" data-reveal>
              <Link to="/about" className="pill glass">
                About Us <span className="btn-arrow">→</span>
              </Link>
              <Link to="/dealership" className="pill solid">
                Find a Dealer <span className="btn-arrow">→</span>
              </Link>
              <Link to="/products" className="pill ghost">
                Browse Products <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* CONTACT + SOCIAL */}
        <section id="contact" className="support-final">
          <div className="final-ambient" aria-hidden="true" />
          <div className="final-shell" data-reveal>
            <span className="eyebrow on-dark">CONTACT</span>
            <h2>Support that stays with you</h2>
            <p>
              Reach us through the channel you prefer. If you’re unsure what to
              choose, send a photo of the surface and your location we’ll guide
              you to the correct system.
            </p>

            {/* Cross nav */}
            <div className="final-nav" data-reveal>
              <Link className="inline-action on-dark" to="/products">
                Products <span className="inline-arrow">→</span>
              </Link>
              <span className="dot on-dark" aria-hidden="true" />
              <Link className="inline-action on-dark" to="/about">
                About <span className="inline-arrow">→</span>
              </Link>
              <span className="dot on-dark" aria-hidden="true" />
              <Link className="inline-action on-dark" to="/dealership">
                Dealership <span className="inline-arrow">→</span>
              </Link>
              <span className="dot on-dark" aria-hidden="true" />
              <Link className="inline-action on-dark" to="/horoscope">
                Horoscope <span className="inline-arrow">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* LIVE CHAT PLACEHOLDER (bottom-right, you’ll integrate later) */}
        <div
          className={`livechat ${chatOpen ? "open" : ""}`}
          aria-live="polite"
        >
          <button
            className="livechat-fab"
            onClick={() => setChatOpen((v) => !v)}
            aria-label={chatOpen ? "Close live chat" : "Open live chat"}
          >
            {/* TODO: Replace with sleek chat SVG icon */}
            <span className="fab-icon" aria-hidden="true">
              💬
            </span>
            <span className="fab-text">{chatOpen ? "Close" : "Chat"}</span>
          </button>

          <div
            className="livechat-panel"
            role="dialog"
            aria-label="Live chat (placeholder)"
          >
            <div className="chat-head">
              <div className="chat-title">
                <span className="chat-dot" aria-hidden="true" />
                Live Chat
              </div>
              <div className="chat-sub">Customer Care</div>
            </div>

            <div className="chat-body">
              <div className="chat-bubble bot">
                Hi! 👋 I’m the Meitu support assistant (demo). Pardon us as Live
                Chat is under construction. Please use Call, WhatsApp, or Email
                for now.
              </div>
            </div>

            <div className="chat-input">
              <input
                type="text"
                placeholder="Type your message… (placeholder)"
                disabled
              />
              <button className="send-btn" type="button" disabled>
                Send <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
        {/* Toast (email fallback + small notices) */}
        <div
          className={`meitu-toast ${toast.open ? "show" : ""}`}
          role="status"
          aria-live="polite"
        >
          <div className="toast-inner">
            <div className="toast-msg">{toast.msg}</div>
            <div className="toast-actions">
              {toast.actionLabel && toast.onAction ? (
                <button
                  type="button"
                  className="toast-btn"
                  onClick={() => toast.onAction?.()}
                >
                  {toast.actionLabel}
                </button>
              ) : null}
              <button
                type="button"
                className="toast-close"
                onClick={hideToast_}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
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

        /* Page base */
        .support-root{
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

        /* Layout helpers */
        .container{
          max-width:1200px;
          margin:0 auto;
        }

        /* HERO */
        .support-hero{
          position:relative;
          padding:110px 24px 70px;
          overflow:hidden;
        }
        .hero-ambient{
          position:absolute;
          inset:-140px -120px auto -120px;
          height:560px;
          background:
            radial-gradient(closest-side at 50% 45%, rgba(193,18,31,.20), transparent 72%),
            radial-gradient(closest-side at 20% 40%, rgba(225,29,46,.12), transparent 68%);
          filter: blur(10px);
          pointer-events:none;
        }
        .hero-shell{
          position:relative;
          max-width:1100px;
          margin:0 auto;
          text-align:center;
        }

        .eyebrow{
          display:inline-block;
          font-size:12px;
          letter-spacing:.34em;
          color:var(--red);
          font-weight:850;
        }
        .eyebrow.on-dark{ color:rgba(255,255,255,.78); }

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
          max-width:920px;
          font-size:18px;
          color:var(--ink70);
          line-height:1.75;
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
          border:none;
          cursor:pointer;
        }

        .pill::before{
          content:"";
          position:absolute;
          inset:0;
          border-radius:inherit;
          background:radial-gradient(120px 60px at 30% 25%, rgba(255,255,255,.28), transparent 60%);
          opacity:0;
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

        .pill.small{
          padding:12px 22px;
          font-size:13px;
        }

        /* Focus-visible accessibility */
        .pill:focus-visible,
        .chip-link:focus-visible,
        .pillar-card:focus-visible,
        .inline-action:focus-visible,
        .social-btn:focus-visible,
        summary:focus-visible,
        .livechat-fab:focus-visible{
          outline:none;
          box-shadow:0 0 0 4px rgba(193,18,31,.18), 0 0 0 1px rgba(193,18,31,.55);
        }

        .hero-cta{
          margin-top:26px;
          display:flex;
          justify-content:center;
          gap:12px;
          flex-wrap:wrap;
        }

        /* Contact chips */
        .contact-chips{
          margin-top:18px;
          display:flex;
          justify-content:center;
          gap:10px;
          flex-wrap:wrap;
        }
        .chip-link{
          display:inline-flex;
          align-items:center;
          gap:10px;
          padding:10px 14px;
          border-radius:999px;
          background:rgba(255,255,255,.70);
          border:1px solid rgba(0,0,0,.08);
          text-decoration:none;
          color:var(--black);
          font-weight:750;
          transition:transform .18s var(--ease-out), box-shadow .18s var(--ease-out), background .18s var(--ease-out);
          box-shadow:0 18px 45px rgba(0,0,0,.08);
          backdrop-filter: blur(14px);
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        .chip-link:hover{
          transform:translateY(-2px);
          box-shadow:0 28px 70px rgba(0,0,0,.12);
          background:rgba(255,255,255,.86);
        }
        .chip-link span{ opacity:.92; }

        /* Inline Apple-style links (not blue) */
        .inline-action{
          display:inline-flex;
          align-items:center;
          gap:8px;
          font-size:14px;
          font-weight:760;
          color:var(--red);
          text-decoration:none;
          letter-spacing:.01em;
          position:relative;
          transition:color .25s var(--ease-out);
        }
        .inline-action.on-dark{ color:rgba(255,255,255,.80); }
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
        .inline-action.on-dark:hover{ color:#fff; }
        .inline-action:hover::after{ transform:scaleX(1); }
        .inline-arrow{
          display:inline-block;
          font-size:16px;
          transform:translateX(0);
          transition:transform .25s var(--ease-out);
        }
        .inline-action:hover .inline-arrow{ transform:translateX(4px); }

        /* Zodiac strip */
        .zodiac-strip{
          margin:28px auto 0;
          max-width:1100px;
          display:grid;
          grid-template-columns:1fr 1.2fr;
          gap:16px;
          padding:18px;
          border-radius:26px;
          background:rgba(255,255,255,.60);
          border:1px solid rgba(0,0,0,.06);
          box-shadow:0 34px 100px rgba(0,0,0,.10);
          backdrop-filter: blur(18px);
          text-align:left;
        }
        .zodiac-title{
          font-weight:860;
          letter-spacing:-.02em;
          color:var(--black);
          font-size:18px;
        }
        .zodiac-sub{
          margin-top:6px;
          color:var(--ink70);
          line-height:1.6;
          font-size:14px;
        }
        .zodiac-left .inline-action{ margin-top:10px; }

        .zodiac-right{
          display:grid;
          grid-template-columns:repeat(3, 1fr);
          gap:10px;
          align-items:stretch;
        }
        .zodiac-chip{
          border-radius:20px;
          padding:12px 12px 12px;
          background:rgba(255,255,255,.78);
          border:1px solid rgba(0,0,0,.06);
          box-shadow:0 18px 55px rgba(0,0,0,.08);
          transition:transform .2s var(--ease-out), box-shadow .2s var(--ease-out);
        }
        .zodiac-chip:hover{
          transform:translateY(-2px);
          box-shadow:0 28px 85px rgba(0,0,0,.12);
        }
        .z-name{
          font-weight:860;
          letter-spacing:-.02em;
          font-size:14px;
          color:var(--black);
        }
        .z-note{
          margin-top:4px;
          font-size:12px;
          color:var(--ink55);
          line-height:1.45;
        }
        .z-swatches{
          margin-top:10px;
          display:flex;
          gap:6px;
        }
        .z-swatches span{
          height:10px;
          flex:1;
          border-radius:999px;
          border:1px solid rgba(0,0,0,.06);
        }

        /* Divider */
        .section-divider{ padding:0 24px; }
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

        /* Sections */
        .support-section{
          padding:92px 24px;
        }
        .support-section.alt{
          background:
            radial-gradient(900px 520px at 15% 50%, rgba(193,18,31,.08), transparent 65%),
            #fafafa;
        }

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

        .center-actions{
          margin-top:22px;
          display:flex;
          justify-content:center;
          gap:12px;
          flex-wrap:wrap;
        }

        /* Pillar cards */
        .pillar-grid{
          margin-top:28px;
          display:grid;
          grid-template-columns:repeat(3, 1fr);
          gap:16px;
        }
        .pillar-card{
          text-decoration:none;
          color:inherit;
          background:var(--glass);
          border:1px solid rgba(0,0,0,.06);
          border-radius:26px;
          padding:28px;
          box-shadow:var(--shadow);
          backdrop-filter: blur(18px);
          position:relative;
          overflow:hidden;
          transition:transform .22s var(--ease-out), box-shadow .22s var(--ease-out), border-color .22s var(--ease-out);
        }
        .pillar-card::before{
          content:"";
          position:absolute;
          inset:-80px -90px auto auto;
          width:240px;
          height:240px;
          background:radial-gradient(circle, rgba(193,18,31,.12), transparent 62%);
          filter: blur(2px);
          pointer-events:none;
        }
        .pillar-card:hover{
          transform:translateY(-4px);
          box-shadow:0 60px 140px rgba(0,0,0,.16);
          border-color:rgba(193,18,31,.18);
        }
        .pillar-top{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          margin-bottom:14px;
        }
        .icon-chip{
          width:44px; height:44px;
          border-radius:14px;
          display:flex; align-items:center; justify-content:center;
          background:linear-gradient(180deg, rgba(193,18,31,.18), rgba(193,18,31,.06));
          border:1px solid rgba(193,18,31,.18);
          box-shadow:0 20px 44px rgba(193,18,31,.14);
          font-size:18px;
        }
        .tag{
          font-size:11px;
          font-weight:850;
          letter-spacing:.18em;
          text-transform:uppercase;
          color:var(--red);
          background:rgba(193,18,31,.10);
          border:1px solid rgba(193,18,31,.22);
          padding:7px 10px;
          border-radius:999px;
          white-space:nowrap;
        }
        .pillar-card h3{
          font-size:18px;
          font-weight:860;
          letter-spacing:-.02em;
          margin:0 0 10px;
        }
        .pillar-card p{
          margin:0 0 16px;
          color:var(--ink70);
          line-height:1.7;
        }
        .card-cta{
          color:var(--red);
          font-weight:860;
          display:flex;
          align-items:center;
          gap:8px;
        }

        /* Two-col */
        .two-col{
          margin-top:28px;
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:16px;
          align-items:start;
        }
        .glass-block{
          background:rgba(255,255,255,.78);
          border:1px solid rgba(0,0,0,.06);
          border-radius:26px;
          padding:30px;
          box-shadow:0 40px 110px rgba(0,0,0,.10);
          backdrop-filter: blur(18px);
          position:relative;
          overflow:hidden;
        }
        .glass-block::before{
          content:"";
          position:absolute;
          inset:-90px -110px auto auto;
          width:260px;
          height:260px;
          background:radial-gradient(circle, rgba(193,18,31,.12), transparent 62%);
          pointer-events:none;
        }
        .block-title{
          font-weight:880;
          letter-spacing:-.02em;
          font-size:18px;
          margin-bottom:10px;
          color:var(--black);
        }
        .glass-block p{
          margin:0 0 14px;
          color:var(--ink70);
          line-height:1.7;
        }

        .pro-list{
          margin:0 0 14px;
          padding-left:18px;
          color:var(--ink70);
          line-height:1.75;
        }
        .pro-list li{ margin:8px 0; }

        .micro-grid{
          display:grid;
          grid-template-columns:repeat(2, 1fr);
          gap:12px;
          margin:16px 0 10px;
        }
        .micro-card{
          background:rgba(255,255,255,.72);
          border:1px solid rgba(0,0,0,.06);
          border-radius:18px;
          padding:14px;
          box-shadow:0 18px 55px rgba(0,0,0,.08);
        }
        .micro-card h4{
          margin:0 0 6px;
          font-weight:860;
          font-size:14px;
          letter-spacing:-.01em;
          color:var(--black);
        }
        .micro-card p{
          margin:0;
          color:var(--ink70);
          line-height:1.6;
          font-size:13px;
        }

        /* Color grid */
        .color-grid{
          margin-top:28px;
          display:grid;
          grid-template-columns:repeat(4, 1fr);
          gap:14px;
        }
        .color-card{
          background:rgba(255,255,255,.80);
          border:1px solid rgba(0,0,0,.06);
          border-radius:24px;
          padding:22px;
          box-shadow:0 30px 90px rgba(0,0,0,.10);
          transition:transform .22s var(--ease-out), box-shadow .22s var(--ease-out);
          font-size:18px;
        }
        .color-card:hover{
          transform:translateY(-3px);
          box-shadow:0 50px 130px rgba(0,0,0,.14);
        }
        .color-card h4{
          margin:10px 0 8px;
          font-weight:860;
          letter-spacing:-.02em;
          font-size:16px;
          color:var(--black);
        }
        .color-card p{
          margin:0;
          color:var(--ink70);
          line-height:1.7;
          font-size:14px;
        }

        /* Resources */
        .resource-grid{
          margin-top:28px;
          display:grid;
          grid-template-columns:repeat(3, 1fr);
          gap:16px;
        }
        .resource-card{
          background:var(--glass);
          border:1px solid rgba(0,0,0,.06);
          border-radius:26px;
          padding:28px;
          box-shadow:var(--shadow);
          backdrop-filter: blur(18px);
          position:relative;
          overflow:hidden;
          transition:transform .22s var(--ease-out), box-shadow .22s var(--ease-out), border-color .22s var(--ease-out);
        }
        .resource-card:hover{
          transform:translateY(-4px);
          box-shadow:0 60px 140px rgba(0,0,0,.16);
          border-color:rgba(193,18,31,.18);
        }
        .resource-top{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          margin-bottom:14px;
        }
        .resource-card h3{
          margin:0 0 10px;
          font-weight:880;
          letter-spacing:-.02em;
          font-size:18px;
        }
        .resource-card p{
          margin:0 0 14px;
          color:var(--ink70);
          line-height:1.7;
        }

        /* Warranty grid */
        .warranty-grid{
          margin-top:28px;
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:16px;
        }

        .steps{
          display:grid;
          gap:10px;
          margin:14px 0 10px;
        }
        .step{
          display:flex;
          align-items:center;
          gap:10px;
          padding:10px 12px;
          border-radius:16px;
          background:rgba(255,255,255,.70);
          border:1px solid rgba(0,0,0,.06);
          box-shadow:0 18px 55px rgba(0,0,0,.08);
          color:var(--black);
          font-weight:760;
        }
        .step-dot{
          width:10px; height:10px;
          border-radius:999px;
          background:var(--red);
          box-shadow:0 0 0 6px rgba(193,18,31,.12);
        }

        /* FAQ */
        .faq-grid{
          margin-top:28px;
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:14px;
        }
        .faq{
          background:rgba(255,255,255,.80);
          border:1px solid rgba(0,0,0,.06);
          border-radius:22px;
          padding:0;
          box-shadow:0 30px 90px rgba(0,0,0,.10);
          overflow:hidden;
          transition:transform .18s var(--ease-out), box-shadow .18s var(--ease-out);
        }
        .faq:hover{
          transform:translateY(-2px);
          box-shadow:0 46px 120px rgba(0,0,0,.14);
        }
        summary{
          list-style:none;
          cursor:pointer;
          padding:18px 18px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:14px;
          font-weight:860;
          color:var(--black);
        }
        summary::-webkit-details-marker{ display:none; }
        .chev{
          transition:transform .22s var(--ease-out);
          color:rgba(0,0,0,.55);
        }
        details[open] .chev{ transform:rotate(180deg); }
        .faq-body{
          padding:0 18px 18px;
          color:var(--ink70);
          line-height:1.75;
          font-size:14px;
        }

        /* FINAL */
        .support-final{
          position:relative;
          padding:92px 24px;
          text-align:center;
          color:#fff;
          overflow:hidden;
          background:linear-gradient(180deg, rgba(193,18,31,.12), rgba(11,11,12,.96));
        }
        .final-ambient{
          position:absolute;
          inset:-160px -120px auto -120px;
          height:520px;
          background:
            radial-gradient(closest-side at 50% 40%, rgba(193,18,31,.30), transparent 70%),
            radial-gradient(closest-side at 70% 55%, rgba(193,18,31,.18), transparent 66%);
          filter: blur(10px);
          pointer-events:none;
        }
        .final-shell{
          position:relative;
          max-width:980px;
          margin:0 auto;
        }
        .final-shell h2{
          margin:12px 0 12px;
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
          margin-top:18px;
          display:flex;
          justify-content:center;
          gap:12px;
          flex-wrap:wrap;
        }

        .social-row{
          margin-top:26px;
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:14px;
          padding:18px 18px;
          border-radius:22px;
          background:rgba(255,255,255,.12);
          border:1px solid rgba(255,255,255,.18);
          backdrop-filter: blur(12px);
        }
        .social-title{
          font-weight:880;
          letter-spacing:-.02em;
        }
        .social-links{
          display:flex;
          gap:10px;
          flex-wrap:wrap;
          justify-content:flex-end;
        }
        .social-btn{
          display:inline-flex;
          align-items:center;
          gap:10px;
          padding:10px 14px;
          border-radius:999px;
          background:rgba(255,255,255,.14);
          border:1px solid rgba(255,255,255,.18);
          color:#fff;
          text-decoration:none;
          font-weight:760;
          transition:transform .18s var(--ease-out), box-shadow .18s var(--ease-out), background .18s var(--ease-out);
        }
        .social-btn:hover{
          transform:translateY(-2px);
          background:rgba(255,255,255,.18);
          box-shadow:0 24px 70px rgba(0,0,0,.25);
        }
        .social-btn span{ opacity:.9; }

        /* Social row when used on light hero background */
        .social-row.top{
          background: rgba(255,255,255,.70);
          border: 1px solid rgba(0,0,0,.08);
          box-shadow: 0 24px 80px rgba(0,0,0,.10);
          color: var(--black);
        }
        .social-row.top .social-title{
          color: var(--black);
        }
        .social-row.top .social-btn{
          background: rgba(255,255,255,.78);
          border: 1px solid rgba(0,0,0,.10);
          color: var(--black);
          box-shadow: 0 18px 55px rgba(0,0,0,.10);
        }
        .social-row.top .social-btn:hover{
          background: rgba(255,255,255,.92);
          box-shadow: 0 26px 86px rgba(0,0,0,.14);
        }
        .social-row.top .social-btn span{ opacity: .82; }

        .final-nav{
          margin-top:18px;
          display:flex;
          justify-content:center;
          align-items:center;
          gap:10px;
          flex-wrap:wrap;
        }
        .dot.on-dark{
          background:rgba(255,255,255,.35);
          width:4px; height:4px; border-radius:999px;
        }

        /* ===== Live Chat (bottom-right placeholder) ===== */
        .livechat{
          position:fixed;
          right:18px;
          bottom:18px;
          z-index:1200;
          pointer-events:none; /* enabled on children */
        }

        .livechat-fab{
          pointer-events:auto;
          display:inline-flex;
          align-items:center;
          gap:10px;
          padding:12px 14px;
          border-radius:999px;
          background:linear-gradient(180deg, var(--red2), var(--red));
          color:#fff;
          border:1px solid rgba(255,255,255,.20);
          box-shadow:0 22px 60px rgba(193,18,31,.35), inset 0 1px 0 rgba(255,255,255,.22);
          cursor:pointer;
          transition:transform .18s var(--ease-out), box-shadow .18s var(--ease-out), filter .18s var(--ease-out);
        }
        .livechat-fab:hover{
          transform:translateY(-2px);
          box-shadow:0 28px 80px rgba(193,18,31,.42), inset 0 1px 0 rgba(255,255,255,.28);
        }
        .livechat-fab:active{ transform:translateY(1px); filter:saturate(1.05); }
        .fab-icon{ font-size:16px; }
        .fab-text{ font-weight:860; letter-spacing:.01em; }

        .livechat-panel{
          pointer-events:auto;
          position:absolute;
          right:0;
          bottom:54px;
          width:340px;
          border-radius:22px;
          overflow:hidden;
          background:rgba(255,255,255,.92);
          border:1px solid rgba(0,0,0,.10);
          box-shadow:0 40px 120px rgba(0,0,0,.22);
          backdrop-filter: blur(18px);
          transform:translateY(10px) scale(.98);
          opacity:0;
          transition:opacity .22s var(--ease-out), transform .22s var(--ease-out);
          max-height:520px;
          display:flex;
          flex-direction:column;
        }
        .livechat.open .livechat-panel{
          opacity:1;
          transform:translateY(0) scale(1);
        }

        .chat-head{
          padding:16px 16px 12px;
          background:rgba(11,11,12,.92);
          color:#fff;
        }
        .chat-title{
          display:flex;
          align-items:center;
          gap:10px;
          font-weight:880;
          letter-spacing:-.02em;
        }
        .chat-dot{
          width:10px; height:10px;
          border-radius:999px;
          background:#34C759;
          box-shadow:0 0 0 6px rgba(52,199,89,.18);
        }
        .chat-sub{
          margin-top:6px;
          color:rgba(255,255,255,.70);
          font-size:12px;
        }

        .chat-body{
          padding:14px;
          display:flex;
          flex-direction:column;
          gap:10px;
          overflow:auto;
        }
        .chat-bubble{
          border-radius:18px;
          padding:12px 12px;
          line-height:1.55;
          font-size:13px;
          max-width:92%;
        }
        .chat-bubble.bot{
          background:rgba(0,0,0,.06);
          border:1px solid rgba(0,0,0,.06);
          color:var(--black);
        }

        .chat-quick{
          margin-top:10px;
          display:grid;
          gap:8px;
        }
        .chat-quick-btn{
          text-align:left;
          width:100%;
          border-radius:14px;
          padding:10px 12px;
          background:rgba(255,255,255,.72);
          border:1px solid rgba(0,0,0,.08);
          cursor:pointer;
          font-weight:760;
          transition:transform .18s var(--ease-out), box-shadow .18s var(--ease-out);
        }
        .chat-quick-btn span{ float:right; color:var(--red); }
        .chat-quick-btn:hover{
          transform:translateY(-1px);
          box-shadow:0 18px 55px rgba(0,0,0,.10);
        }

        .chat-input{
          padding:12px;
          display:flex;
          gap:10px;
          border-top:1px solid rgba(0,0,0,.08);
          background:rgba(255,255,255,.82);
        }
        .chat-input input{
          flex:1;
          border-radius:14px;
          border:1px solid rgba(0,0,0,.10);
          padding:10px 12px;
          outline:none;
          background:rgba(255,255,255,.9);
        }
        .send-btn{
          border-radius:14px;
          padding:10px 12px;
          border:1px solid rgba(0,0,0,.10);
          background:rgba(255,255,255,.85);
          font-weight:860;
          cursor:pointer;
        }

        /* Responsive */
        @media(max-width:1100px){
          .hero-title{ font-size:44px; }
          .section-title{ font-size:34px; }
          .pillar-grid{ grid-template-columns:1fr; }
          .two-col{ grid-template-columns:1fr; }
          .color-grid{ grid-template-columns:1fr 1fr; }
          .resource-grid{ grid-template-columns:1fr; }
          .warranty-grid{ grid-template-columns:1fr; }
          .faq-grid{ grid-template-columns:1fr; }
          .zodiac-strip{ grid-template-columns:1fr; }
          .zodiac-right{ grid-template-columns:1fr; }
          .social-row{ flex-direction:column; align-items:flex-start; }
          .social-links{ justify-content:flex-start; width:100%; }
        }

        @media(max-width:768px){
          .support-root{ padding-top:72px; }
          .hero-title{ font-size:36px; }
          .hero-sub{ font-size:16px; }
          .final-shell h2{ font-size:34px; }
          .livechat-panel{ width:min(340px, calc(100vw - 36px)); }
        }

        @media (prefers-reduced-motion: reduce){
          [data-reveal]{ transition:none; transform:none; opacity:1; }
          .pill, .chip-link, .pillar-card, .faq, .color-card, .resource-card, .livechat-panel, .livechat-fab{
            transition:none !important;
          }
          .pill:hover, .chip-link:hover, .pillar-card:hover, .faq:hover, .color-card:hover, .resource-card:hover{
            transform:none;
          }
        }
          /* Toast */
.meitu-toast{
  position: fixed;
  left: 50%;
  bottom: 22px;
  transform: translateX(-50%) translateY(10px);
  z-index: 1400;
  width: min(560px, calc(100vw - 36px));
  opacity: 0;
  pointer-events: none;
  transition: opacity .22s var(--ease-out), transform .22s var(--ease-out);
}
.meitu-toast.show{
  opacity: 1;
  transform: translateX(-50%) translateY(0);
  pointer-events: auto;
}
.toast-inner{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
  padding: 12px 12px 12px 14px;
  border-radius: 16px;
  background: rgba(255,255,255,.92);
  border: 1px solid rgba(0,0,0,.10);
  box-shadow: 0 26px 90px rgba(0,0,0,.18);
  backdrop-filter: blur(18px);
  color: var(--black);
}
.toast-msg{
  font-size: 13px;
  font-weight: 650;
  color: rgba(11,11,12,.78);
  line-height: 1.35;
}
.toast-actions{
  display:flex;
  align-items:center;
  gap: 8px;
  flex: 0 0 auto;
}
.toast-btn{
  border: 1px solid rgba(0,0,0,.12);
  background: rgba(255,255,255,.78);
  border-radius: 999px;
  padding: 9px 12px;
  font-weight: 820;
  font-size: 12px;
  cursor: pointer;
  transition: transform .18s var(--ease-out), box-shadow .18s var(--ease-out), border-color .18s var(--ease-out);
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.toast-btn:hover{
  transform: translateY(-1px);
  box-shadow: 0 18px 55px rgba(0,0,0,.12);
  border-color: rgba(0,0,0,.18);
}
.toast-close{
  border: 1px solid rgba(0,0,0,.10);
  background: rgba(0,0,0,.04);
  color: rgba(11,11,12,.70);
  border-radius: 999px;
  width: 34px;
  height: 34px;
  display:grid;
  place-items:center;
  cursor: pointer;
  transition: transform .18s var(--ease-out), background .18s var(--ease-out);
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.toast-close:hover{
  transform: translateY(-1px);
  background: rgba(0,0,0,.06);
}

/* Keep toast above the chat button on small screens */
@media(max-width:768px){
  .meitu-toast{ bottom: 78px; }
}
      `}</style>
    </>
  );
}

export default Support;
