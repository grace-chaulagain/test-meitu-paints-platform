import { useMemo, useState } from "react";
import { api, getApiErrorMessage } from "../../api/client.js";
import { useAuth } from "../../auth/AuthProvider.jsx";
import { useSelector } from "react-redux";

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
}) {
  return (
    <label
      style={{
        display: "grid",
        gap: 8,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: ".08em",
          textTransform: "uppercase",
          color: "rgba(0,0,0,.48)",
        }}
      >
        {label}
      </span>

      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: "100%",
          height: 54,
          borderRadius: 18,
          border: "1px solid rgba(0,0,0,.08)",
          background: disabled
            ? "rgba(245,245,247,.9)"
            : "rgba(255,255,255,.94)",
          padding: "0 16px",
          fontSize: 14,
          fontWeight: 800,
          color: "#111827",
          outline: "none",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.88)",
          transition:
            "border-color .18s ease, box-shadow .18s ease, transform .18s ease",
        }}
      />
    </label>
  );
}

function SectionCard({ title, desc, children }) {
  return (
    <div
      className="profile-section-card"
      style={{
        padding: 18,
        borderRadius: 24,
        background: "rgba(250,250,252,.78)",
        border: "1px solid rgba(0,0,0,.05)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.86)",
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 950,
          letterSpacing: "-0.03em",
          color: "#0f172a",
        }}
      >
        {title}
      </div>
      {desc ? (
        <div
          style={{
            marginTop: 8,
            color: "rgba(0,0,0,.56)",
            fontWeight: 700,
            lineHeight: 1.6,
            fontSize: 14,
          }}
        >
          {desc}
        </div>
      ) : null}

      <div
        style={{
          marginTop: 16,
          display: "grid",
          gap: 14,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function ProfileEditCard() {
  const { refresh } = useAuth();
  const reduxUser = useSelector((state) => state?.user?.user || null);
  const dealerProfile = useSelector(
    (state) => state?.user?.dealerProfile || null,
  );

  const isDealer = String(reduxUser?.role || "").toUpperCase() === "DEALER";

  const initialForm = useMemo(
    () => ({
      contactName: dealerProfile?.contactName || "",
      phone: dealerProfile?.phone || reduxUser?.phone || "",
      address: dealerProfile?.address || "",
      username: reduxUser?.username || "",
      email: reduxUser?.email || dealerProfile?.email || "",
      companyName: dealerProfile?.companyName || "",
    }),
    [dealerProfile, reduxUser],
  );

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setForm(initialForm);
    setSuccess("");
    setError("");
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setSuccess("");
      setError("");

      const payload = isDealer
        ? {
            contactName: form.contactName,
            phone: form.phone,
            address: form.address,
          }
        : {
            username: form.username,
            phone: form.phone,
          };

      await api.patch("/api/users/me", payload);
      await refresh();

      setSuccess("Profile details updated successfully.");
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Unable to save profile changes right now."),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="profile-edit-card"
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 30,
        border: "1px solid rgba(255,255,255,.68)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,.84) 0%, rgba(255,255,255,.72) 100%)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow:
          "0 24px 70px rgba(15,23,42,.08), inset 0 1px 0 rgba(255,255,255,.9)",
        padding: 22,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 16% 14%, rgba(255,255,255,.94), transparent 22%), radial-gradient(circle at 86% 82%, rgba(209,0,0,.07), transparent 24%), linear-gradient(180deg, rgba(255,255,255,.16), rgba(255,255,255,0))",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          className="profile-edit-head"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(255,255,255,.74)",
                border: "1px solid rgba(0,0,0,.05)",
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: ".08em",
                textTransform: "uppercase",
                color: "rgba(0,0,0,.56)",
              }}
            >
              Edit Profile
            </div>

            <div
              style={{
                marginTop: 14,
                fontSize: 30,
                fontWeight: 950,
                letterSpacing: "-0.04em",
                color: "#0f172a",
              }}
            >
              Update your account details
            </div>

            <div
              style={{
                marginTop: 10,
                maxWidth: 760,
                color: "rgba(0,0,0,.58)",
                fontWeight: 700,
                lineHeight: 1.65,
                fontSize: 14,
              }}
            >
              Keep your business and contact information accurate so your Meitu
              workspace stays professional, current, and ready for operations.
            </div>
          </div>

          <div
            className="profile-edit-account-pill"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "10px 14px",
              borderRadius: 999,
              background: "rgba(255,255,255,.74)",
              border: "1px solid rgba(0,0,0,.05)",
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,.56)",
            }}
          >
            {isDealer ? "Dealer Account" : "Admin Account"}
          </div>
        </div>

        {(success || error) && (
          <div
            style={{
              marginTop: 18,
              padding: "14px 16px",
              borderRadius: 18,
              border: success
                ? "1px solid rgba(18,183,106,.14)"
                : "1px solid rgba(180,35,24,.16)",
              background: success
                ? "rgba(18,183,106,.08)"
                : "rgba(180,35,24,.08)",
              color: success ? "#067647" : "#b42318",
              fontWeight: 800,
              lineHeight: 1.55,
              transition: "all .2s ease",
            }}
          >
            {success || error}
          </div>
        )}

        <div
          className="profile-edit-actions"
          style={{
            marginTop: 20,
            display: "grid",
            gap: 16,
          }}
        >
          {isDealer ? (
            <>
              <SectionCard
                title="Business contact"
                desc="Primary communication details used for dealer coordination and operational follow-ups."
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 14,
                  }}
                >
                  <Field
                    label="Contact Name"
                    name="contactName"
                    value={form.contactName}
                    onChange={handleChange}
                    placeholder="Enter contact name"
                  />
                  <Field
                    label="Phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>

                <Field
                  label="Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter business address"
                />
              </SectionCard>

              <SectionCard
                title="Business identity"
                desc="Reference-only company information tied to your approved dealer account."
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 14,
                  }}
                >
                  <Field
                    label="Company"
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="Company name"
                    disabled
                  />
                  <Field
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    disabled
                  />
                </div>
              </SectionCard>
            </>
          ) : (
            <>
              <SectionCard
                title="Account identity"
                desc="Maintain your administrator identity and internal contact details."
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 14,
                  }}
                >
                  <Field
                    label="Username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                  />
                  <Field
                    label="Phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>

                <Field
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  disabled
                />
              </SectionCard>
            </>
          )}
        </div>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <button
            className="profile-edit-action"
            type="button"
            onClick={handleReset}
            disabled={loading}
            style={{
              height: 50,
              padding: "0 18px",
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,.08)",
              background: "rgba(255,255,255,.88)",
              color: "#111827",
              fontWeight: 900,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,.92)",
              opacity: loading ? 0.6 : 1,
              transition: "all .18s ease",
            }}
          >
            Reset
          </button>

          <button
            className="profile-edit-action primary"
            type="button"
            onClick={handleSave}
            disabled={loading}
            style={{
              height: 50,
              padding: "0 20px",
              borderRadius: 999,
              border: "1px solid rgba(196,0,0,.16)",
              background: loading
                ? "rgba(0,0,0,.10)"
                : "linear-gradient(135deg, #c40000 0%, #ff5b2e 100%)",
              color: "#fff",
              fontWeight: 950,
              letterSpacing: "-0.01em",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 16px 30px rgba(196,0,0,.22)",
              transition: "all .18s ease",
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
      <style>{`
        @media (max-width:720px){
          .profile-edit-card{
            border-radius:24px !important;
            padding:16px !important;
          }
          .profile-edit-head{
            display:grid !important;
            gap:14px !important;
            align-items:start !important;
          }
          .profile-edit-account-pill{
            justify-self:start !important;
          }
          .profile-section-card{
            padding:15px !important;
            border-radius:20px !important;
          }
          .profile-edit-actions{
            display:grid !important;
            grid-template-columns:1fr !important;
          }
          .profile-edit-action{
            width:100% !important;
          }
        }
      `}</style>
    </div>
  );
}
