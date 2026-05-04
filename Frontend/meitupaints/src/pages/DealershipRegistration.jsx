import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import { api, getApiErrorMessage } from "../api/client.js";

const initialForm = {
  companyName: "",
  contactName: "",
  phone: "",
  email: "",
  address: "",
  panVat: "",
  businessType: "",
  yearsInBusiness: "",
  monthlyOrderEstimate: "",
  territory: "",
  notes: "",
  website: "",
};

export default function DealershipRegistrationPage() {
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setSubmitted(false);

    try {
      if (formData.website) {
        setSubmitted(true);
        setFormData(initialForm);
        return;
      }

      const extraLines = [
        formData.businessType ? `Business type: ${formData.businessType}` : "",
        formData.yearsInBusiness
          ? `Years in business: ${formData.yearsInBusiness}`
          : "",
        formData.monthlyOrderEstimate
          ? `Estimated monthly order (NPR): ${formData.monthlyOrderEstimate}`
          : "",
        formData.territory
          ? `Preferred territory/area: ${formData.territory}`
          : "",
      ].filter(Boolean);

      const compiledNotes = [
        (formData.notes || "").trim(),
        extraLines.length ? `\n\n---\n${extraLines.join("\n")}` : "",
      ]
        .filter(Boolean)
        .join("");

      await api.post("/api/dealer/apply", {
        companyName: formData.companyName,
        contactName: formData.contactName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        panVat: formData.panVat,
        notes: compiledNotes,
      });

      setSubmitted(true);
      alert(
        "Application submitted. Our team will verify your details and email you a password setup link.",
      );
      setFormData(initialForm);
    } catch (err) {
      alert(getApiErrorMessage(err, "Something went wrong. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <NavBar />

      <main className="dealer-registration-page">
        <section className="dealer-registration-shell">
          <div className="registration-head">
            <div>
              <div className="registration-eyebrow">Dealer Registration</div>
              <h1>Dealership Registration</h1>
              <p>
                Submit your dealership details. After admin verification, you
                will receive a password setup link for the dealer portal.
              </p>
            </div>

            <div
              className={`registration-status ${submitted ? "ok" : ""} ${
                submitting ? "busy" : ""
              }`}
              aria-live="polite"
            >
              {submitting ? "Submitting" : submitted ? "Submitted" : "Ready"}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="registration-form">
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="registration-grid">
              <label className="registration-field">
                <span>Contact Person</span>
                <input
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                />
              </label>

              <label className="registration-field">
                <span>Email Address</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                />
              </label>

              <label className="registration-field">
                <span>Phone Number</span>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="98XXXXXXXX"
                />
              </label>

              <label className="registration-field">
                <span>Company Name</span>
                <input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  placeholder="Business / shop name"
                />
              </label>

              <label className="registration-field">
                <span>Business Type</span>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                >
                  <option value="">Select optional type</option>
                  <option value="Paint shop / Hardware">
                    Paint shop / Hardware
                  </option>
                  <option value="Building materials supplier">
                    Building materials supplier
                  </option>
                  <option value="Contractor / Applicator">
                    Contractor / Applicator
                  </option>
                  <option value="Distributor / Wholesaler">
                    Distributor / Wholesaler
                  </option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="registration-field">
                <span>PAN / VAT</span>
                <input
                  name="panVat"
                  value={formData.panVat}
                  onChange={handleChange}
                  placeholder="Optional PAN/VAT number"
                />
              </label>

              <label className="registration-field full">
                <span>Business Address</span>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="City / area / full address"
                />
              </label>

              <label className="registration-field">
                <span>Years in Business</span>
                <input
                  name="yearsInBusiness"
                  value={formData.yearsInBusiness}
                  onChange={handleChange}
                  placeholder="Optional, e.g. 3"
                />
              </label>

              <label className="registration-field">
                <span>Monthly Order Estimate</span>
                <input
                  name="monthlyOrderEstimate"
                  value={formData.monthlyOrderEstimate}
                  onChange={handleChange}
                  placeholder="Optional, e.g. 200000"
                />
              </label>

              <label className="registration-field full">
                <span>Preferred Territory / Area</span>
                <input
                  name="territory"
                  value={formData.territory}
                  onChange={handleChange}
                  placeholder="Optional city, district, or area"
                />
              </label>

              <label className="registration-field full">
                <span>Notes</span>
                <textarea
                  rows="5"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Optional context about your business and market"
                />
              </label>
            </div>

            <div className="registration-actions">
              <button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Dealership Request"}
              </button>
              <Link to="/dealership">Back to dealership page</Link>
            </div>
          </form>
        </section>
      </main>

      <style>{`
        .dealer-registration-page{
          min-height:100vh;
          padding:112px 20px 64px;
          background:
            radial-gradient(760px 420px at 12% 6%, rgba(193,18,31,.14), transparent 58%),
            radial-gradient(720px 460px at 90% 18%, rgba(15,23,42,.08), transparent 55%),
            linear-gradient(180deg,#fbfbfc 0%,#f2f4f7 100%);
          color:#0f172a;
        }

        .dealer-registration-shell{
          width:min(980px,100%);
          margin:0 auto;
          border:1px solid rgba(15,23,42,.08);
          background:rgba(255,255,255,.92);
          border-radius:24px;
          box-shadow:0 28px 80px rgba(15,23,42,.10);
          padding:28px;
        }

        .registration-head{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:18px;
          padding-bottom:22px;
          border-bottom:1px solid rgba(15,23,42,.08);
        }

        .registration-eyebrow{
          font-size:11px;
          font-weight:950;
          letter-spacing:.12em;
          text-transform:uppercase;
          color:#b42318;
        }

        .registration-head h1{
          margin:8px 0 0;
          font-size:36px;
          line-height:1;
          font-weight:950;
          letter-spacing:-.05em;
        }

        .registration-head p{
          margin:10px 0 0;
          max-width:660px;
          color:rgba(15,23,42,.62);
          font-size:14px;
          font-weight:700;
          line-height:1.7;
        }

        .registration-status{
          min-width:max-content;
          border-radius:999px;
          border:1px solid rgba(15,23,42,.08);
          background:#fff;
          padding:9px 12px;
          color:rgba(15,23,42,.62);
          font-size:11px;
          font-weight:950;
          letter-spacing:.08em;
          text-transform:uppercase;
        }

        .registration-status.busy{
          color:#b42318;
          background:rgba(180,35,24,.08);
          border-color:rgba(180,35,24,.14);
        }

        .registration-status.ok{
          color:#067647;
          background:rgba(16,163,74,.08);
          border-color:rgba(16,163,74,.14);
        }

        .registration-form{
          margin-top:22px;
        }

        .registration-grid{
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:14px;
        }

        .registration-field{
          display:grid;
          gap:8px;
        }

        .registration-field.full{
          grid-column:1 / -1;
        }

        .registration-field span{
          font-size:11px;
          font-weight:950;
          letter-spacing:.08em;
          text-transform:uppercase;
          color:rgba(15,23,42,.54);
        }

        .registration-field input,
        .registration-field select,
        .registration-field textarea{
          width:100%;
          border:1px solid rgba(15,23,42,.10);
          border-radius:14px;
          background:#fff;
          color:#0f172a;
          font-size:14px;
          font-weight:750;
          outline:none;
          box-shadow:inset 0 1px 0 rgba(255,255,255,.9);
        }

        .registration-field input,
        .registration-field select{
          height:48px;
          padding:0 13px;
        }

        .registration-field textarea{
          padding:13px;
          resize:vertical;
        }

        .registration-actions{
          margin-top:20px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          flex-wrap:wrap;
        }

        .registration-actions button{
          min-height:48px;
          border:0;
          border-radius:14px;
          padding:0 18px;
          background:linear-gradient(135deg,#b42318,#ec6f3b);
          color:#fff;
          font-size:14px;
          font-weight:950;
          cursor:pointer;
          box-shadow:0 18px 34px rgba(180,35,24,.18);
        }

        .registration-actions button:disabled{
          opacity:.62;
          cursor:not-allowed;
        }

        .registration-actions a{
          color:rgba(15,23,42,.66);
          font-size:13px;
          font-weight:850;
          text-decoration:none;
        }

        @media (max-width:760px){
          .dealer-registration-page{
            padding:92px 14px 42px;
          }

          .dealer-registration-shell{
            border-radius:18px;
            padding:18px;
          }

          .registration-head{
            display:grid;
          }

          .registration-head h1{
            font-size:30px;
          }

          .registration-grid{
            grid-template-columns:1fr;
          }

          .registration-actions{
            display:grid;
          }
        }
      `}</style>
    </>
  );
}
