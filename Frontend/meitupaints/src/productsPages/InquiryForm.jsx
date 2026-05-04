import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";

const INQUIRY_ENDPOINT = (import.meta.env.VITE_INQUIRY_ENDPOINT || "").trim();

const InquiryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const prefillSubject = useMemo(() => {
    const fromState = location?.state?.defaultSubject;
    if (typeof fromState === "string" && fromState.trim())
      return fromState.trim();

    // Optional fallback: /inquiry?subject=...
    try {
      const sp = new URLSearchParams(location?.search || "");
      const qs = sp.get("subject");
      if (typeof qs === "string" && qs.trim()) return qs.trim();
    } catch {
      // Ignore malformed subject query strings and fall back to blank.
    }

    return "";
  }, [location?.state, location?.search]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!prefillSubject) return;

    setForm((prev) => {
      // Don’t overwrite if user already typed something
      if (prev.subject && prev.subject.trim().length > 0) return prev;
      return { ...prev, subject: prefillSubject };
    });
  }, [prefillSubject, location?.key]);

  const payload = useMemo(
    () => ({
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      message: form.message,
      page: typeof window !== "undefined" ? window.location.pathname : "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      createdAt: new Date().toISOString(),
    }),
    [form],
  );

  async function postToAppsScript(data) {
    if (!INQUIRY_ENDPOINT) {
      throw new Error("Inquiry endpoint is not configured.");
    }

    await fetch(INQUIRY_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(data), // send as text/plain
    });

    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;

    setSending(true);
    setSent(false);
    setErrMsg("");

    try {
      await postToAppsScript(payload);

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: prefillSubject || "",
        message: "",
      });
      setSent(true);
    } catch (err) {
      setErrMsg(err?.message || "Error sending message. Please try again.");
      alert(err?.message || "Error sending message. Please try again later.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <NavBar />

      <section className="inq-page">
        {/* Fixed ambient (never blocks scroll) */}
        <div className="inq-ambient" aria-hidden="true">
          <div className="inq-aurora a1" />
          <div className="inq-aurora a2" />
          <div className="inq-aurora a3" />
          <div className="inq-grid" />
          <div className="inq-noise" />
          <div className="inq-vignette" />
        </div>

        <div className="container py-6 inq-content">
          {/* Header */}
          <div className="inq-header">
            <div className="inq-title">
              <span className="context-pill">
                <span className="pill-dot" aria-hidden="true" />
                Inquiry
              </span>

              <h1 className="headline">
                Let’s talk about your{" "}
                <span className="headline-accent">project</span>
              </h1>

              <p className="subline">
                Expert guidance, product recommendations, and transparent
                support tailored to your needs.
              </p>
            </div>

            <button className="secondary-action" onClick={() => navigate(-1)}>
              <span className="btn-icon" aria-hidden="true">
                ←
              </span>
              Back
            </button>
          </div>

          {/* Grid */}
          <div className="row g-5 align-items-stretch">
            {/* Left */}
            <div className="col-lg-5 order-2 order-lg-1">
              <div className="info-panel inq-card">
                <div className="card-top">
                  <div className="icon-chip" aria-hidden="true">
                    <svg viewBox="0 0 24 24" className="chip-svg">
                      <path
                        d="M12 2l1.5 5.3L19 9l-5.5 1.7L12 16l-1.5-5.3L5 9l5.5-1.7L12 2z"
                        fill="currentColor"
                        opacity=".9"
                      />
                    </svg>
                  </div>
                  <h3>Why reach out?</h3>
                </div>

                <p>
                  Whether you’re planning a residential project or managing a
                  large commercial application, our specialists help you choose
                  the right system not just the right product.
                </p>

                <ul className="info-points">
                  <li>Professional product consultation</li>
                  <li>Surface & system recommendations</li>
                  <li>Transparent pricing guidance</li>
                  <li>Fast and reliable response</li>
                </ul>

                <div className="divider" aria-hidden="true" />

                <div className="trust-stack">
                  <div className="trust-badge">
                    <span className="badge-dot" aria-hidden="true" />
                    Private by default
                  </div>
                  <div className="trust-note">
                    Your information is private and will never be shared.
                  </div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="col-lg-7 order-1 order-lg-2">
              <form className="form-panel inq-card" onSubmit={handleSubmit}>
                <div className="form-head">
                  <div>
                    <h3 className="form-title">Send an inquiry</h3>
                    <p className="form-sub">
                      We usually respond within{" "}
                      <strong className="accent">1 business day</strong>.
                    </p>
                  </div>

                  <div
                    className={`status-chip ${sent ? "ok" : ""} ${
                      sending ? "busy" : ""
                    }`}
                    aria-live="polite"
                  >
                    {sending ? "Submitting…" : sent ? "Sent ✓" : "Ready"}
                  </div>
                </div>

                <div className="form-grid">
                  <div className="field">
                    <label>Full name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Email address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Phone number</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="98XXXXXXXX"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Subject</label>
                    <input
                      type="text"
                      name="subject"
                      placeholder="Product inquiry, pricing, guidance"
                      value={form.subject}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field full">
                    <label>Your message</label>
                    <textarea
                      rows="6"
                      name="message"
                      placeholder="Tell us about your project…"
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="field full">
                    <button
                      type="submit"
                      className={`primary-action w-100 ${
                        sending ? "is-loading" : ""
                      }`}
                      disabled={sending}
                    >
                      <span className="btn-shine" aria-hidden="true" />
                      <span className="btn-content">
                        {sending ? "Submitting…" : "Submit inquiry"}
                        <span className="btn-arrow" aria-hidden="true">
                          →
                        </span>
                      </span>
                    </button>

                    {errMsg ? (
                      <div className="form-error" role="alert">
                        {errMsg}
                      </div>
                    ) : null}

                    <div className="form-foot">
                      <span className="foot-muted">
                        By submitting, you agree to be contacted about your
                        inquiry.
                      </span>
                      <Link to="/support" className="tiny-link">
                        Help & Support <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </form>

              <div className="mini-cards">
                <div className="mini-card">
                  <div className="mini-top">
                    <span className="mini-dot" aria-hidden="true" />
                    System matching
                  </div>
                  <p>
                    Tell us your surface type and location we’ll recommend the
                    correct primer + topcoat combo.
                  </p>
                </div>

                <div className="mini-card">
                  <div className="mini-top">
                    <span className="mini-dot" aria-hidden="true" />
                    Shade guidance
                  </div>
                  <p>
                    Need help with color? We’ll guide you through undertones,
                    lighting, and finish selection.
                  </p>
                </div>

                <div className="mini-card">
                  <div className="mini-top">
                    <span className="mini-dot" aria-hidden="true" />
                    Dealer network
                  </div>
                  <p>
                    We’ll connect you to a nearby dealer and installer support
                    when needed.
                  </p>
                </div>
              </div>
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

          --glass:rgba(255,255,255,.72);
          --line:rgba(0,0,0,.10);

          --shadow1: 0 28px 60px rgba(0,0,0,.12);
          --shadow2: 0 40px 110px rgba(0,0,0,.18);

          --easeOut:cubic-bezier(.22,.61,.36,1);
        }

        html, body { height:auto; }
        body { overflow-x:hidden; }

        .inq-page{
          position:relative;
          overflow:visible;
          isolation:isolate;
          background:
            radial-gradient(900px 420px at 15% 10%, rgba(193,18,31,.10), transparent 60%),
            radial-gradient(700px 420px at 85% 30%, rgba(0,0,0,.06), transparent 55%),
            #fff;
        }

        .inq-content{ position:relative; z-index:2; }
        .py-6{ padding:4.75rem 0; }

        .inq-ambient{
          position:fixed;
          inset:0;
          z-index:0;
          pointer-events:none;
        }

        .inq-aurora{
          position:absolute;
          width:720px;
          height:520px;
          border-radius:999px;
          filter: blur(44px);
          opacity:.55;
          mix-blend-mode:multiply;
          transform: translate3d(0,0,0);
        }

        .inq-aurora.a1{
          left:-120px; top:-120px;
          background:
            radial-gradient(circle at 30% 30%, rgba(225,29,46,.35), transparent 60%),
            radial-gradient(circle at 70% 70%, rgba(193,18,31,.28), transparent 62%);
          animation: float1 10s var(--easeOut) infinite alternate;
        }

        .inq-aurora.a2{
          right:-180px; top:120px;
          background:
            radial-gradient(circle at 30% 30%, rgba(0,0,0,.14), transparent 62%),
            radial-gradient(circle at 70% 70%, rgba(193,18,31,.22), transparent 64%);
          animation: float2 12s var(--easeOut) infinite alternate;
        }

        .inq-aurora.a3{
          left:20%; bottom:-260px;
          width:820px; height:620px;
          background:
            radial-gradient(circle at 30% 30%, rgba(193,18,31,.18), transparent 65%),
            radial-gradient(circle at 70% 70%, rgba(0,0,0,.10), transparent 65%);
          animation: float3 14s var(--easeOut) infinite alternate;
        }

        .inq-grid{
          position:absolute;
          inset:-2px;
          background:
            linear-gradient(to right, rgba(0,0,0,.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,.06) 1px, transparent 1px);
          background-size:72px 72px;
          opacity:.08;
          mask-image: radial-gradient(closest-side at 50% 10%, #000 40%, transparent 72%);
        }

        .inq-noise{
          position:absolute;
          inset:0;
          opacity:.06;
          background-image:url("noisetexture/2.svg");
          background-size: 420px 420px;
          mix-blend-mode:multiply;
        }

        .inq-vignette{
          position:absolute;
          inset:-2px;
          background: radial-gradient(closest-side at 50% 10%, transparent 45%, rgba(0,0,0,.06) 90%);
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

        .inq-header{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:20px;
          margin-bottom:22px;
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
          font-weight:700;
          letter-spacing:.08em;
          text-transform:uppercase;
          backdrop-filter: blur(14px);
          box-shadow: 0 18px 40px rgba(0,0,0,.08);
        }

        .pill-dot{
          width:8px;height:8px;border-radius:999px;
          background: linear-gradient(180deg, var(--red2), var(--red));
          box-shadow:0 0 0 6px rgba(193,18,31,.12);
        }

        .headline{
          font-size:42px;
          font-weight:520;
          letter-spacing:-.7px;
          color:var(--black);
          margin:10px 0 0;
        }

        .headline-accent{
          background: linear-gradient(180deg, var(--red2), var(--red));
          -webkit-background-clip:text;
          background-clip:text;
          color:transparent;
        }

        .subline{
          font-size:17px;
          color:var(--ink70);
          max-width:640px;
          margin-top:8px;
        }

        .inq-links{
          display:flex;
          gap:12px;
          flex-wrap:wrap;
          margin-top:18px;
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
          font-weight:650;
          transition: transform 160ms var(--easeOut), box-shadow 160ms ease, border-color 160ms ease;
          box-shadow:0 18px 46px rgba(0,0,0,.10);
        }
        .link-pill:hover{
          transform: translateY(-1px);
          box-shadow:0 26px 70px rgba(0,0,0,.14);
          border-color: rgba(193,18,31,.18);
        }
        .link-pill:active{ transform: translateY(0px); }
        .link-pill.ghost{ background: rgba(255,255,255,.55); }

        .inq-card{
          background:rgba(255,255,255,.72);
          border-radius:28px;
          padding:28px 32px 18px;
          border:1px solid rgba(0,0,0,.08);
          box-shadow: var(--shadow1);
          backdrop-filter: blur(16px);
          height:auto;
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

        .card-top{
          display:flex;
          align-items:center;
          gap:14px;
          margin-bottom:12px;
        }

        .icon-chip{
          width:44px;height:44px;
          border-radius:14px;
          display:grid;
          place-items:center;
          color:var(--red);
          background: linear-gradient(180deg, rgba(193,18,31,.14), rgba(193,18,31,.06));
          border:1px solid rgba(193,18,31,.22);
          box-shadow:0 18px 44px rgba(193,18,31,.14);
        }

        .chip-svg{ width:22px;height:22px; }

        .info-panel h3{ font-size:20px; font-weight:650; margin:0; }
        .info-panel p{
          font-size:16px;
          color:var(--ink70);
          margin-bottom:16px;
          line-height:1.6;
        }

        .info-points{
          list-style:none;
          padding:0;
          margin:0 0 16px 0;
        }
        .info-points li{
          margin-bottom:10px;
          padding-left:26px;
          position:relative;
          color:var(--ink70);
        }
        .info-points li::before{
          content:"✔";
          position:absolute;
          left:0;
          color:var(--red);
        }

        .divider{
          height:1px;
          background: linear-gradient(to right, transparent, rgba(0,0,0,.14), transparent);
          margin:14px 0 12px;
        }

        .trust-stack{display:grid; gap:8px;}
        .trust-badge{
          display:inline-flex;
          align-items:center;
          gap:10px;
          width:max-content;
          padding:10px 14px;
          border-radius:999px;
          border:1px solid rgba(0,0,0,.10);
          background: rgba(255,255,255,.68);
          font-weight:700;
          font-size:13px;
          color:var(--black);
        }
        .badge-dot{
          width:8px;height:8px;border-radius:999px;
          background: var(--red);
          box-shadow:0 0 0 6px rgba(193,18,31,.10);
        }
        .trust-note{ font-size:14px; color:var(--ink55); }

        .form-head{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:16px;
          margin-bottom:12px;
        }

        .form-title{ margin:0; font-size:18px; font-weight:700; }
        .form-sub{ margin:6px 0 0; font-size:14px; color:var(--ink55); }
        .accent{ color: var(--red); }

        .status-chip{
          padding:10px 14px;
          border-radius:999px;
          border:1px solid rgba(0,0,0,.12);
          background: rgba(255,255,255,.66);
          font-weight:750;
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

        .form-grid{
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:18px;
        }
        .field{display:flex; flex-direction:column;}
        .field.full{grid-column:1/-1;}
        .field label{
          font-size:14px;
          font-weight:650;
          margin-bottom:8px;
          color:var(--black);
        }

        .field input,
        .field textarea{
          width:100%;
          padding:12px 14px;
          border-radius:16px;
          border:1px solid var(--line);
          font-size:15px;
          background: rgba(255,255,255,.82);
          transition: border 160ms ease, box-shadow 160ms ease, background 160ms ease;
        }
        .field input:focus,
        .field textarea:focus{
          outline:none;
          border-color: rgba(193,18,31,.55);
          box-shadow: 0 0 0 4px rgba(193,18,31,.12);
          background:#fff;
        }

        .primary-action{
          position:relative;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding:14px 28px;
          border-radius:999px;
          background: linear-gradient(180deg, var(--red2), var(--red));
          color:#fff;
          font-weight:750;
          border:none;
          cursor:pointer;
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
        .primary-action:disabled{
          opacity:.75;
          cursor:not-allowed;
          transform:none !important;
        }

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
          gap:10px;
          padding:14px 22px;
          border-radius:999px;
          border:1px solid rgba(0,0,0,.18);
          background:rgba(255,255,255,.72);
          backdrop-filter: blur(14px);
          font-weight:750;
          cursor:pointer;
          transition: transform 160ms var(--easeOut), box-shadow 160ms ease, border-color 160ms ease;
          box-shadow:0 18px 50px rgba(0,0,0,.10);
        }
        .secondary-action:hover{
          transform: translateY(-1px);
          border-color: rgba(0,0,0,.32);
          box-shadow:0 26px 72px rgba(0,0,0,.14);
        }

        .form-foot{
          margin-top:14px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          flex-wrap:wrap;
        }
        .foot-muted{ font-size:12px; color: var(--ink55); }

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
          font-weight:700;
          font-size:12px;
          transition: transform 160ms var(--easeOut), box-shadow 160ms ease, border-color 160ms ease;
          box-shadow:0 14px 40px rgba(0,0,0,.10);
        }
        .tiny-link:hover{
          transform: translateY(-1px);
          border-color: rgba(193,18,31,.18);
          box-shadow:0 18px 52px rgba(0,0,0,.12);
        }

        .form-error{
          margin-top:12px;
          padding:12px 14px;
          border-radius:16px;
          border:1px solid rgba(193,18,31,.28);
          background: rgba(193,18,31,.06);
          color: rgba(11,11,12,.78);
          font-weight:650;
          font-size:13px;
        }

        .mini-cards{
          margin-top:14px;
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:14px;
        }

        .mini-card{
          background: rgba(255,255,255,.70);
          border:1px solid rgba(0,0,0,.08);
          border-radius:22px;
          padding:14px 16px 12px;
          box-shadow:0 18px 44px rgba(0,0,0,.10);
          backdrop-filter: blur(14px);
          transition: transform 160ms var(--easeOut), box-shadow 160ms ease, border-color 160ms ease;
        }
        .mini-card:hover{
          transform: translateY(-1px);
          box-shadow:0 26px 70px rgba(0,0,0,.12);
          border-color: rgba(193,18,31,.12);
        }

        .mini-top{
          display:flex;
          align-items:center;
          gap:10px;
          font-weight:800;
          font-size:12px;
          letter-spacing:.12em;
          text-transform:uppercase;
          color: rgba(11,11,12,.70);
          margin-bottom:10px;
        }
        .mini-dot{
          width:8px;height:8px;border-radius:999px;
          background: var(--red);
          box-shadow:0 0 0 6px rgba(193,18,31,.10);
        }

        .mini-card p{
          margin:0;
          font-size:13px;
          line-height:1.6;
          color: var(--ink70);
        }

        @media(max-width:992px){
          .headline{font-size:34px;}
          .inq-header{flex-direction:column; align-items:flex-start;}
          .mini-cards{grid-template-columns:1fr;}
        }

        @media(max-width:768px){
          .form-grid{grid-template-columns:1fr;}
          .inq-card{padding:20px 18px 14px;}
          .py-6{padding:3.75rem 0;}
        }

        @media (prefers-reduced-motion: reduce){
          .inq-aurora{animation:none;}
          .link-pill,
          .mini-card,
          .primary-action,
          .secondary-action,
          .field input,
          .field textarea{
            transition:none !important;
          }
        }
      `}</style>
    </>
  );
};

export default InquiryForm;
