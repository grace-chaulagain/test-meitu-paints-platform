function GlassCard({ children, style }) {
  return (
    <div
      style={{
        borderRadius: 30,
        border: "1px solid rgba(255,255,255,.68)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,.84) 0%, rgba(255,255,255,.72) 100%)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow:
          "0 24px 70px rgba(15,23,42,.08), inset 0 1px 0 rgba(255,255,255,.9)",
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function HeroShell({ children }) {
  return (
    <GlassCard
      style={{
        position: "relative",
        overflow: "hidden",
        padding: 26,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 16% 18%, rgba(255,255,255,.94), transparent 22%), radial-gradient(circle at 88% 78%, rgba(209,0,0,.08), transparent 24%), linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,0))",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </GlassCard>
  );
}

function SectionTitle({ eyebrow, title, desc, right }) {
  return (
    <div
      className="profile-section-title"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div style={{ minWidth: 0 }}>
        {eyebrow ? (
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
            {eyebrow}
          </div>
        ) : null}

        <div
          className="profile-section-heading"
          style={{
            marginTop: eyebrow ? 16 : 0,
            fontSize: 40,
            lineHeight: 1,
            fontWeight: 950,
            letterSpacing: "-0.05em",
            color: "#0f172a",
          }}
        >
          {title}
        </div>

        {desc ? (
          <div
            className="profile-section-desc"
            style={{
              marginTop: 12,
              maxWidth: 820,
              color: "rgba(0,0,0,.58)",
              fontWeight: 700,
              lineHeight: 1.65,
            }}
          >
            {desc}
          </div>
        ) : null}
      </div>

      {right}
    </div>
  );
}

export { GlassCard, HeroShell, SectionTitle };
