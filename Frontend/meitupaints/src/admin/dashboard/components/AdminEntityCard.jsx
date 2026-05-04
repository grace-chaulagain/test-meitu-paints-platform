function toneClass(tone = "neutral") {
  return ["success", "danger", "accent", "muted"].includes(tone)
    ? tone
    : "neutral";
}

export function AdminEntityCardStyles() {
  return (
    <style>{`
      .admin-entity-card{
        position:relative;
        border-radius:18px;
        border:1px solid rgba(15,23,42,.07);
        background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(250,250,252,.96));
        box-shadow:0 14px 34px rgba(15,23,42,.055), inset 0 1px 0 rgba(255,255,255,.92);
        overflow:hidden;
      }
      .admin-entity-card::before{
        content:"";
        position:absolute;
        inset:0 auto 0 0;
        width:3px;
        background:rgba(15,23,42,.14);
      }
      .admin-entity-card.accent::before{ background:#b42318; }
      .admin-entity-card.success::before{ background:#16a34a; }
      .admin-entity-card.danger::before{ background:#b91c1c; }
      .admin-entity-inner{
        padding:16px;
        display:grid;
        gap:14px;
      }
      .admin-entity-main{
        min-width:0;
        display:grid;
        grid-template-columns:44px minmax(0,1fr) auto;
        gap:12px;
        align-items:start;
      }
      .admin-entity-avatar{
        width:44px;
        height:44px;
        border-radius:14px;
        display:grid;
        place-items:center;
        background:linear-gradient(135deg,#0f172a,#334155);
        color:#fff;
        font-size:17px;
        font-weight:950;
        box-shadow:0 10px 22px rgba(15,23,42,.14);
      }
      .admin-entity-copy{
        min-width:0;
        display:grid;
        gap:5px;
      }
      .admin-entity-title{
        min-width:0;
        margin:0;
        font-size:17px;
        line-height:1.18;
        font-weight:950;
        letter-spacing:-.03em;
        color:#0f172a;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      .admin-entity-subtitle,
      .admin-entity-line{
        min-width:0;
        font-size:12px;
        line-height:1.45;
        font-weight:750;
        color:rgba(15,23,42,.56);
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      .admin-entity-line{ color:rgba(15,23,42,.46); }
      .admin-entity-badges{
        display:flex;
        flex-wrap:wrap;
        justify-content:flex-end;
        gap:6px;
        max-width:210px;
      }
      .admin-entity-badge{
        min-height:25px;
        padding:0 9px;
        border-radius:999px;
        display:inline-flex;
        align-items:center;
        border:1px solid rgba(15,23,42,.08);
        background:rgba(15,23,42,.045);
        color:rgba(15,23,42,.58);
        font-size:10px;
        font-weight:950;
        letter-spacing:.05em;
        text-transform:uppercase;
        white-space:nowrap;
      }
      .admin-entity-badge.success{
        background:rgba(22,163,74,.08);
        border-color:rgba(22,163,74,.12);
        color:#15803d;
      }
      .admin-entity-badge.danger{
        background:rgba(180,35,24,.08);
        border-color:rgba(180,35,24,.12);
        color:#b42318;
      }
      .admin-entity-badge.accent{
        background:rgba(180,35,24,.07);
        border-color:rgba(180,35,24,.12);
        color:#b42318;
      }
      .admin-entity-badge.muted{
        background:rgba(248,250,252,.92);
        color:rgba(15,23,42,.48);
      }
      .admin-entity-actions{
        display:flex;
        align-items:center;
        gap:6px;
        flex-wrap:wrap;
        padding:8px;
        border-radius:14px;
        background:rgba(248,250,252,.86);
        border:1px solid rgba(15,23,42,.055);
      }
      .admin-entity-action{
        min-height:34px;
        padding:0 10px;
        border-radius:10px;
        border:1px solid rgba(15,23,42,.07);
        background:#fff;
        color:#0f172a;
        font-size:12px;
        font-weight:900;
        cursor:pointer;
        transition:background .16s ease, border-color .16s ease, transform .16s ease;
      }
      .admin-entity-action:hover{
        transform:translateY(-1px);
        background:rgba(255,255,255,.96);
        border-color:rgba(15,23,42,.12);
      }
      .admin-entity-action.primary{
        background:#0f172a;
        color:#fff;
        border-color:#0f172a;
      }
      .admin-entity-action.danger{
        background:rgba(180,35,24,.06);
        color:#b42318;
        border-color:rgba(180,35,24,.12);
      }
      .admin-entity-action:disabled{
        cursor:not-allowed;
        opacity:.55;
        transform:none;
      }
      @media (max-width:720px){
        .admin-entity-inner{ padding:14px; }
        .admin-entity-main{
          grid-template-columns:40px minmax(0,1fr);
        }
        .admin-entity-avatar{
          width:40px;
          height:40px;
          border-radius:13px;
        }
        .admin-entity-badges{
          grid-column:1 / -1;
          justify-content:flex-start;
          max-width:none;
        }
        .admin-entity-title{ white-space:normal; }
        .admin-entity-actions{
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
        }
        .admin-entity-action{ width:100%; }
      }
    `}</style>
  );
}

export default function AdminEntityCard({
  accent = "neutral",
  initial = "M",
  title = "",
  subtitle = "",
  line = "",
  badges = [],
  actions = [],
}) {
  return (
    <article className={`admin-entity-card ${toneClass(accent)}`}>
      <div className="admin-entity-inner">
        <div className="admin-entity-main">
          <div className="admin-entity-avatar">{initial || "M"}</div>
          <div className="admin-entity-copy">
            <h3 className="admin-entity-title">{title || "Unnamed record"}</h3>
            {subtitle ? (
              <div className="admin-entity-subtitle">{subtitle}</div>
            ) : null}
            {line ? <div className="admin-entity-line">{line}</div> : null}
          </div>
          <div className="admin-entity-badges">
            {badges.filter(Boolean).map((badge) => (
              <span
                key={`${badge.label}-${badge.tone || "neutral"}`}
                className={`admin-entity-badge ${toneClass(badge.tone)}`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        <div className="admin-entity-actions">
          {actions.filter(Boolean).map((action) => (
            <button
              key={action.key || action.label}
              type="button"
              className={`admin-entity-action ${action.variant || ""}`}
              onClick={action.onClick}
              disabled={action.disabled}
              title={action.title || action.label}
            >
              {action.busy ? action.busyLabel || "Working..." : action.label}
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}
