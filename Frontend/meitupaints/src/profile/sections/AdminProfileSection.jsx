import { useEffect, useRef, useState } from "react";
import { api, getApiErrorMessage } from "../../api/client.js";
import {
  InfoCard,
  KeyValueRow,
  StatPill,
} from "../components/ProfileInfoCard.jsx";
import ProfileEditCard from "../components/ProfileEditCard.jsx";

function SecurityCard({ onClose }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [visible, setVisible] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setSuccess("");
      setError("");

      if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
        setError("Please fill in all password fields.");
        return;
      }

      if (form.newPassword !== form.confirmPassword) {
        setError("New password and confirm password do not match.");
        return;
      }

      await api.post("/api/users/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSuccess("Password updated successfully.");
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to update password right now."));
    } finally {
      setLoading(false);
    }
  };

  const fieldLabelStyle = {
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: ".08em",
    textTransform: "uppercase",
    color: "rgba(0,0,0,.48)",
  };

  const inputStyle = {
    width: "100%",
    height: 54,
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,.08)",
    background: "rgba(255,255,255,.94)",
    padding: "0 16px",
    fontSize: 14,
    fontWeight: 800,
    color: "#111827",
    outline: "none",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,.88)",
  };

  const renderPasswordField = ({ name, label, placeholder }) => (
    <label style={{ display: "grid", gap: 8 }}>
      <span style={fieldLabelStyle}>{label}</span>
      <div style={{ position: "relative" }}>
        <input
          type={visible[name] ? "text" : "password"}
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          style={{ ...inputStyle, paddingRight: 58 }}
        />
        <button
          type="button"
          aria-label={visible[name] ? `Hide ${label}` : `Show ${label}`}
          onClick={() =>
            setVisible((prev) => ({ ...prev, [name]: !prev[name] }))
          }
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            width: 38,
            height: 38,
            display: "inline-grid",
            placeItems: "center",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,.07)",
            background: "rgba(255,255,255,.9)",
            color: "rgba(15,23,42,.72)",
            cursor: "pointer",
          }}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
            <circle cx="12" cy="12" r="3" />
            {visible[name] ? <path d="M4 4l16 16" /> : null}
          </svg>
        </button>
      </div>
    </label>
  );

  return (
    <div
      className="profile-security-card"
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
          className="profile-security-head"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
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
              Security
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
              Change your password
            </div>

            <div
              style={{
                marginTop: 8,
                color: "rgba(0,0,0,.58)",
                fontWeight: 700,
                lineHeight: 1.65,
                fontSize: 14,
                maxWidth: 760,
              }}
            >
              Keep your administrator account secure with a strong updated
              password.
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 16px",
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,.08)",
              background: "rgba(255,255,255,.9)",
              color: "#111",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,.9)",
            }}
          >
            Close
          </button>
        </div>

        {(success || error) && (
          <div
            style={{
              marginTop: 16,
              padding: "12px 14px",
              borderRadius: 14,
              background: success
                ? "rgba(18,183,106,.08)"
                : "rgba(180,35,24,.08)",
              color: success ? "#067647" : "#b42318",
              fontWeight: 700,
            }}
          >
            {success || error}
          </div>
        )}

        <div
          className="profile-security-actions"
          style={{
            marginTop: 18,
            display: "grid",
            gap: 14,
          }}
        >
          {renderPasswordField({
            name: "currentPassword",
            label: "Current Password",
            placeholder: "Enter current password",
          })}
          {renderPasswordField({
            name: "newPassword",
            label: "New Password",
            placeholder: "Enter new password",
          })}
          {renderPasswordField({
            name: "confirmPassword",
            label: "Confirm Password",
            placeholder: "Confirm new password",
          })}
        </div>

        <div
          style={{
            marginTop: 18,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            className="profile-security-action"
            type="button"
            onClick={handleSubmit}
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
            }}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
      <style>{`
        @media (max-width:720px){
          .profile-security-card{
            border-radius:24px !important;
            padding:16px !important;
          }
          .profile-security-head{
            display:grid !important;
            gap:14px !important;
          }
          .profile-security-head button{
            width:100%;
          }
          .profile-security-actions{
            display:grid !important;
            grid-template-columns:1fr !important;
          }
          .profile-security-action{
            width:100%;
            min-height:46px;
          }
        }
      `}</style>
    </div>
  );
}

export default function AdminProfileSection({ profile }) {
  const [showEdit, setShowEdit] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);

  const editRef = useRef(null);
  const securityRef = useRef(null);

  const openEdit = () => {
    setShowSecurity(false);
    setShowEdit(true);
  };

  const openSecurity = () => {
    setShowEdit(false);
    setShowSecurity(true);
  };

  const closeEdit = () => setShowEdit(false);
  const closeSecurity = () => setShowSecurity(false);

  useEffect(() => {
    if (showEdit && editRef.current) {
      requestAnimationFrame(() => {
        editRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [showEdit]);

  useEffect(() => {
    if (showSecurity && securityRef.current) {
      requestAnimationFrame(() => {
        securityRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [showSecurity]);

  return (
    <div className="profile-role-section" style={{ display: "grid", gap: 22 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
        }}
      >
        <StatPill label="Role" value={profile.role} />
        <StatPill label="Status" value={profile.status} />
        <StatPill label="Workspace" value="Administration" />
      </div>

      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 26,
          border: "1px solid rgba(255,255,255,.68)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,.84) 0%, rgba(255,255,255,.72) 100%)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          boxShadow:
            "0 20px 50px rgba(15,23,42,.08), inset 0 1px 0 rgba(255,255,255,.9)",
          padding: 20,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 14% 20%, rgba(255,255,255,.94), transparent 24%), radial-gradient(circle at 90% 80%, rgba(209,0,0,.06), transparent 24%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
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
                Workspace Actions
              </div>

              <div
                style={{
                  marginTop: 14,
                  fontSize: 26,
                  fontWeight: 950,
                  letterSpacing: "-0.04em",
                  color: "#0f172a",
                }}
              >
                Manage your administrator workspace
              </div>

              <div
                style={{
                  marginTop: 8,
                  color: "rgba(0,0,0,.58)",
                  fontWeight: 700,
                  lineHeight: 1.65,
                  fontSize: 14,
                  maxWidth: 760,
                }}
              >
                Update your administrator details or securely change your
                password. Opening an action takes you directly to that section.
              </div>
            </div>

            <div
              className="profile-action-buttons"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <button
                className="profile-action-button"
                onClick={showEdit ? closeEdit : openEdit}
                style={{
                  padding: "10px 18px",
                  borderRadius: 999,
                  border: "1px solid rgba(0,0,0,.08)",
                  background: showEdit
                    ? "linear-gradient(135deg, #c40000, #ff5b2e)"
                    : "rgba(255,255,255,.92)",
                  color: showEdit ? "#fff" : "#111",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: showEdit
                    ? "0 12px 30px rgba(196,0,0,.2)"
                    : "inset 0 1px 0 rgba(255,255,255,.9)",
                  transition: "all .2s ease",
                }}
              >
                {showEdit ? "Close Editor" : "Edit Profile"}
              </button>

              <button
                className="profile-action-button"
                onClick={showSecurity ? closeSecurity : openSecurity}
                style={{
                  padding: "10px 18px",
                  borderRadius: 999,
                  border: "1px solid rgba(0,0,0,.08)",
                  background: showSecurity
                    ? "linear-gradient(135deg, #111827, #374151)"
                    : "rgba(255,255,255,.92)",
                  color: showSecurity ? "#fff" : "#111",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: showSecurity
                    ? "0 12px 30px rgba(15,23,42,.16)"
                    : "inset 0 1px 0 rgba(255,255,255,.9)",
                  transition: "all .2s ease",
                }}
              >
                {showSecurity ? "Close Security" : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showEdit && (
        <div ref={editRef}>
          <ProfileEditCard />
        </div>
      )}

      {showSecurity && (
        <div ref={securityRef}>
          <SecurityCard onClose={closeSecurity} />
        </div>
      )}

      <InfoCard
        title="Administrator Details"
        desc="Core account identity and internal access context for the authenticated administrator session."
      >
        <KeyValueRow label="Full Name" value={profile.username} />
        <KeyValueRow label="Email" value={profile.email} />
        <KeyValueRow label="Role" value={profile.role} />
        <KeyValueRow label="Status" value={profile.status} subtle />
      </InfoCard>

      <InfoCard
        title="Security"
        desc="Sensitive account actions and account hardening flows will be added here next."
      >
        <KeyValueRow label="Password" value="Managed securely" />
        <KeyValueRow label="Session Status" value={profile.status} />
        <KeyValueRow
          label="Authentication Source"
          value="Protected session"
          subtle
        />
      </InfoCard>
      <style>{`
        @media (max-width:720px){
          .profile-role-section{
            gap:14px !important;
          }
          .profile-action-buttons{
            display:grid !important;
            grid-template-columns:1fr !important;
            width:100%;
          }
          .profile-action-button{
            width:100%;
            min-height:44px;
          }
        }
      `}</style>
    </div>
  );
}
