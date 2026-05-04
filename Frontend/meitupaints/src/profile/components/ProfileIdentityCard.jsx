import { GlassCard } from "./ProfileShell.jsx";

function ProfileIdentityCard({ profile }) {
  return (
    <GlassCard
      style={{
        overflow: "hidden",
      }}
    >
      <div
        className="profile-identity-head"
        style={{
          position: "relative",
          padding: 24,
          background:
            "radial-gradient(circle at 18% 18%, rgba(255,255,255,.95), transparent 22%), radial-gradient(circle at 84% 82%, rgba(209,0,0,.08), transparent 24%), linear-gradient(180deg, rgba(255,255,255,.22), rgba(255,255,255,0))",
        }}
      >
        <div
          className="profile-identity-row"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            className="profile-avatar"
            style={{
              width: 76,
              height: 76,
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #c40000 0%, #ff5b2e 100%)",
              color: "#fff",
              fontWeight: 950,
              fontSize: 28,
              boxShadow: "0 18px 34px rgba(196,0,0,.22)",
              flexShrink: 0,
            }}
          >
            {profile.initial}
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              className="profile-identity-name"
              style={{
                fontSize: 28,
                fontWeight: 950,
                letterSpacing: "-0.04em",
                color: "#0f172a",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {profile.username}
            </div>

            <div
              className="profile-identity-email"
              style={{
                marginTop: 6,
                color: "rgba(0,0,0,.58)",
                fontWeight: 700,
                fontSize: 14,
                wordBreak: "break-word",
              }}
            >
              {profile.email}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 18,
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(255,255,255,.72)",
              border: "1px solid rgba(0,0,0,.05)",
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,.6)",
            }}
          >
            {profile.role}
          </span>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 12px",
              borderRadius: 999,
              background:
                profile.status === "ACTIVE" || profile.status === "VERIFIED"
                  ? "rgba(18,183,106,.10)"
                  : "rgba(245,158,11,.10)",
              border:
                profile.status === "ACTIVE" || profile.status === "VERIFIED"
                  ? "1px solid rgba(18,183,106,.14)"
                  : "1px solid rgba(245,158,11,.14)",
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color:
                profile.status === "ACTIVE" || profile.status === "VERIFIED"
                  ? "#067647"
                  : "#b54708",
            }}
          >
            {profile.status}
          </span>
        </div>
      </div>

      <div
        className="profile-identity-summary"
        style={{
          padding: 18,
          display: "grid",
          gap: 12,
        }}
      >
        <div
          style={{
            padding: 16,
            borderRadius: 20,
            background: "rgba(248,248,250,.88)",
            border: "1px solid rgba(0,0,0,.05)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,.46)",
            }}
          >
            Account Summary
          </div>

          <div
            style={{
              marginTop: 10,
              display: "grid",
              gap: 8,
            }}
          >
            <div
              className="profile-summary-row"
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <span style={{ color: "rgba(0,0,0,.56)", fontWeight: 700 }}>
                Username
              </span>
              <strong>{profile.username}</strong>
            </div>

            <div
              className="profile-summary-row"
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <span style={{ color: "rgba(0,0,0,.56)", fontWeight: 700 }}>
                Role
              </span>
              <strong>{profile.role}</strong>
            </div>

            <div
              className="profile-summary-row"
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <span style={{ color: "rgba(0,0,0,.56)", fontWeight: 700 }}>
                Status
              </span>
              <strong>{profile.status}</strong>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width:640px){
          .profile-identity-head{
            padding:18px !important;
          }
          .profile-identity-row{
            align-items:flex-start !important;
            gap:12px !important;
          }
          .profile-avatar{
            width:58px !important;
            height:58px !important;
            border-radius:18px !important;
            font-size:22px !important;
          }
          .profile-identity-name{
            font-size:clamp(21px, 7vw, 26px) !important;
            white-space:normal !important;
            overflow-wrap:anywhere !important;
          }
          .profile-identity-email{
            font-size:13px !important;
          }
          .profile-identity-summary{
            padding:14px !important;
          }
          .profile-summary-row{
            display:grid !important;
            grid-template-columns:1fr !important;
            gap:4px !important;
          }
          .profile-summary-row strong{
            overflow-wrap:anywhere;
          }
        }
      `}</style>
    </GlassCard>
  );
}

export default ProfileIdentityCard;
