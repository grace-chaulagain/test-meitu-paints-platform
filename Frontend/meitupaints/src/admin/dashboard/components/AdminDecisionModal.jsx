export default function AdminDecisionModal({
  open,
  title,
  subtitle = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  busy = false,
  disabled = false,
  details = [],
  requireText = "",
  confirmationText = "",
  onConfirmationTextChange,
  onClose,
  onConfirm,
  children = null,
}) {
  if (!open) return null;

  const isDanger = tone === "danger";
  const isConfirmBlocked =
    disabled ||
    busy ||
    (requireText &&
      String(confirmationText || "").trim() !== String(requireText).trim());

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1600,
        background: "rgba(15,23,42,.42)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "grid",
        placeItems: "center",
        padding: 28,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) onClose?.();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          width: "min(640px, 100%)",
          borderRadius: 28,
          border: "1px solid rgba(15,23,42,.10)",
          background: "rgba(255,255,255,.94)",
          boxShadow:
            "0 34px 90px rgba(15,23,42,.22), inset 0 1px 0 rgba(255,255,255,.88)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            height: 5,
            background: isDanger
              ? "linear-gradient(90deg, #b91c1c 0%, #dd5127 100%)"
              : "linear-gradient(90deg, #0f172a 0%, rgba(15,23,42,.38) 100%)",
          }}
        />

        <div style={{ padding: 24, display: "grid", gap: 18 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1fr) auto",
              gap: 16,
              alignItems: "start",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 28,
                  padding: "0 10px",
                  borderRadius: 999,
                  background: isDanger
                    ? "rgba(180,35,24,.08)"
                    : "rgba(15,23,42,.05)",
                  color: isDanger ? "#b42318" : "#475569",
                  border: isDanger
                    ? "1px solid rgba(180,35,24,.12)"
                    : "1px solid rgba(15,23,42,.08)",
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                }}
              >
                Admin confirmation
              </div>

              <div
                style={{
                  marginTop: 12,
                  fontSize: 28,
                  fontWeight: 950,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                  color: "#0f172a",
                }}
              >
                {title}
              </div>

              {subtitle ? (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 14,
                    lineHeight: 1.65,
                    fontWeight: 700,
                    color: "rgba(15,23,42,.58)",
                  }}
                >
                  {subtitle}
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                border: "1px solid rgba(15,23,42,.08)",
                background: "#fff",
                color: "#0f172a",
                fontSize: 20,
                fontWeight: 900,
                cursor: busy ? "not-allowed" : "pointer",
                opacity: busy ? 0.55 : 1,
              }}
            >
              ×
            </button>
          </div>

          {details.length ? (
            <div
              style={{
                display: "grid",
                gap: 10,
                padding: 14,
                borderRadius: 18,
                background: "rgba(248,250,252,.92)",
                border: "1px solid rgba(15,23,42,.06)",
              }}
            >
              {details.map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "150px minmax(0,1fr)",
                    gap: 12,
                    alignItems: "baseline",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 900,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      color: "rgba(15,23,42,.44)",
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      minWidth: 0,
                      fontSize: 14,
                      lineHeight: 1.55,
                      fontWeight: 800,
                      color: "#0f172a",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.value || "-"}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {children}

          {requireText ? (
            <div style={{ display: "grid", gap: 8 }}>
              <div
                style={{
                  fontSize: 12,
                  lineHeight: 1.5,
                  fontWeight: 800,
                  color: "rgba(15,23,42,.62)",
                }}
              >
                Type <strong>{requireText}</strong> to confirm.
              </div>
              <input
                value={confirmationText}
                onChange={(e) => onConfirmationTextChange?.(e.target.value)}
                disabled={busy}
                style={{
                  width: "100%",
                  height: 48,
                  borderRadius: 16,
                  border: "1px solid rgba(15,23,42,.10)",
                  background: "#fff",
                  padding: "0 14px",
                  outline: "none",
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              />
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              style={{
                minHeight: 42,
                padding: "10px 16px",
                borderRadius: 14,
                border: "1px solid rgba(15,23,42,.08)",
                background: "#fff",
                color: "#0f172a",
                fontWeight: 900,
                cursor: busy ? "not-allowed" : "pointer",
                opacity: busy ? 0.55 : 1,
              }}
            >
              {cancelLabel}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isConfirmBlocked}
              style={{
                minHeight: 42,
                padding: "10px 16px",
                borderRadius: 14,
                border: isDanger
                  ? "1px solid rgba(180,35,24,.16)"
                  : "1px solid rgba(15,23,42,.08)",
                background: isDanger
                  ? "linear-gradient(135deg, #b91c1c 0%, #dd5127 100%)"
                  : "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
                color: "#fff",
                fontWeight: 900,
                cursor: isConfirmBlocked ? "not-allowed" : "pointer",
                opacity: isConfirmBlocked ? 0.55 : 1,
                boxShadow: isDanger
                  ? "0 14px 24px rgba(180,35,24,.18)"
                  : "0 14px 24px rgba(15,23,42,.14)",
              }}
            >
              {busy ? "Processing..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
