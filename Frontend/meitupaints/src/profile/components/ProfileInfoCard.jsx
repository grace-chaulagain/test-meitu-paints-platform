import { GlassCard } from "./ProfileShell";

function StatPill({ label, value }) {
  return (
    <div
      className="profile-stat-pill"
      style={{
        padding: "14px 16px",
        borderRadius: 20,
        background: "rgba(248,248,250,.88)",
        border: "1px solid rgba(0,0,0,.05)",
        minWidth: 150,
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
        {label}
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 18,
          fontWeight: 950,
          letterSpacing: "-0.03em",
          color: "#111827",
        }}
      >
        {value || "—"}
      </div>
    </div>
  );
}

function KeyValueRow({ label, value, subtle = false }) {
  return (
    <div
      className="profile-key-row"
      style={{
        padding: "14px 16px",
        borderRadius: 18,
        background: subtle ? "rgba(250,250,252,.92)" : "rgba(248,248,250,.88)",
        border: "1px solid rgba(0,0,0,.05)",
        display: "flex",
        justifyContent: "space-between",
        gap: 14,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          color: "rgba(0,0,0,.56)",
          fontWeight: 700,
        }}
      >
        {label}
      </span>

      <strong
        style={{
          color: "#111827",
          wordBreak: "break-word",
          minWidth: 0,
          textAlign: "right",
        }}
      >
        {value || "—"}
      </strong>
    </div>
  );
}

function InfoCard({ title, desc, children, right }) {
  return (
    <GlassCard style={{ padding: 22 }}>
      <div
        className="profile-info-head"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            className="profile-info-title"
            style={{
              fontSize: 24,
              fontWeight: 950,
              letterSpacing: "-0.03em",
              color: "#0f172a",
            }}
          >
            {title}
          </div>

          {desc ? (
            <div
              className="profile-info-desc"
              style={{
                marginTop: 8,
                color: "rgba(0,0,0,.58)",
                fontWeight: 700,
                lineHeight: 1.6,
                maxWidth: 720,
              }}
            >
              {desc}
            </div>
          ) : null}
        </div>

        {right}
      </div>

      <div
        className="profile-info-body"
        style={{
          marginTop: 18,
          display: "grid",
          gap: 12,
        }}
      >
        {children}
      </div>
      <style>{`
        @media (max-width:640px){
          .profile-stat-pill{
            min-width:0 !important;
            padding:13px 14px !important;
          }
          .profile-key-row{
            display:grid !important;
            grid-template-columns:1fr !important;
            align-items:start !important;
            gap:6px !important;
            padding:13px 14px !important;
          }
          .profile-key-row strong{
            text-align:left !important;
            overflow-wrap:anywhere;
          }
          .profile-info-head{
            display:grid !important;
          }
          .profile-info-title{
            font-size:22px !important;
          }
          .profile-info-desc{
            font-size:13px !important;
            line-height:1.55 !important;
          }
          .profile-info-body{
            gap:10px !important;
          }
        }
      `}</style>
    </GlassCard>
  );
}

export { InfoCard, KeyValueRow, StatPill };
