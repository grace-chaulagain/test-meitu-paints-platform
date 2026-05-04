import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/client.js";
import AdminDecisionModal from "../components/AdminDecisionModal.jsx";

const FILTERS = [
  { key: "ALL", label: "All" },
  { key: "DEALER", label: "Dealers" },
  { key: "DISPATCHER", label: "Dispatchers" },
  { key: "ORDER", label: "Orders" },
  { key: "APPLICATION", label: "Applications" },
];

const TYPE_META = {
  DEALER: { label: "Dealer", tone: "neutral" },
  DISPATCHER: { label: "Dispatcher", tone: "neutral" },
  ORDER: { label: "Order", tone: "order" },
  DEALER_APPLICATION: { label: "Dealer Application", tone: "application" },
  DISPATCHER_APPLICATION: {
    label: "Dispatcher Application",
    tone: "application",
  },
};

function GlassCard({ children, style = {} }) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(15,23,42,.08)",
        background: "#fff",
        boxShadow: "0 1px 2px rgba(15,23,42,.04)",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  disabled = false,
  subtle = false,
  danger = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        minHeight: 40,
        padding: "9px 14px",
        borderRadius: 14,
        border: danger
          ? "1px solid rgba(180,35,24,.16)"
          : "1px solid rgba(15,23,42,.08)",
        background: subtle
          ? "#fff"
          : danger
            ? "linear-gradient(135deg, #b91c1c 0%, #dd5127 100%)"
            : "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
        color: subtle ? "#0f172a" : "#fff",
        fontWeight: 900,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        boxShadow: subtle
          ? "inset 0 1px 0 rgba(255,255,255,.72)"
          : danger
            ? "0 12px 22px rgba(180,35,24,.16)"
            : "0 12px 22px rgba(15,23,42,.14)",
      }}
    >
      {children}
    </button>
  );
}

function SectionHeader({ title, subtitle, action = null }) {
  return (
    <div className="trash-header">
      <div>
        <div className="trash-eyebrow">Settings</div>
        <div className="trash-title">{title}</div>
        {subtitle ? <div className="trash-subtitle">{subtitle}</div> : null}
      </div>
      {action}
    </div>
  );
}

function TypePill({ type }) {
  const meta = TYPE_META[type] || { label: type || "Item", tone: "neutral" };
  return <span className={`trash-type ${meta.tone}`}>{meta.label}</span>;
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

function TrashItem({ item, busy, onRestore }) {
  return (
    <GlassCard style={{ padding: 0 }}>
      <div className="trash-item">
        <div className="trash-item-main">
          <div className="trash-item-top">
            <TypePill type={item.type} />
            <span className="trash-status">{item.status || "Deleted"}</span>
          </div>
          <div className="trash-item-title">{item.title}</div>
          {item.subtitle ? (
            <div className="trash-item-subtitle">{item.subtitle}</div>
          ) : null}
          {item.reason ? (
            <div className="trash-reason">Reason: {item.reason}</div>
          ) : null}
        </div>

        <div className="trash-item-side">
          <div>
            <span>Deleted</span>
            <strong>{formatDate(item.requestedAt)}</strong>
          </div>
          <div>
            <span>Permanent after</span>
            <strong>{formatDate(item.deleteAfter)}</strong>
          </div>
          <div className="trash-days">
            {Number(item.daysRemaining ?? 0)} days left
          </div>
          <ActionButton
            subtle
            onClick={() => onRestore(item)}
            disabled={busy === `restore-${item.type}-${item.id}`}
          >
            {busy === `restore-${item.type}-${item.id}`
              ? "Restoring..."
              : "Restore"}
          </ActionButton>
        </div>
      </div>
    </GlassCard>
  );
}

export default function AdminTrashPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("ALL");
  const [items, setItems] = useState([]);
  const [counts, setCounts] = useState({});
  const [retentionDays, setRetentionDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [restoreItem, setRestoreItem] = useState(null);
  const [restoreAllOpen, setRestoreAllOpen] = useState(false);

  const loadTrash = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/admin/settings/trash", {
        params: { type: filter },
      });
      setItems(res?.data?.items || []);
      setCounts(res?.data?.counts || {});
      setRetentionDays(res?.data?.retentionDays || 30);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load trash.",
      );
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadTrash();
  }, [loadTrash]);

  const activeFilterLabel = useMemo(() => {
    return FILTERS.find((item) => item.key === filter)?.label || "Trash";
  }, [filter]);

  async function restoreSingle(item) {
    try {
      setBusyAction(`restore-${item.type}-${item.id}`);
      setError("");
      setSuccess("");
      await api.post(`/api/admin/settings/trash/${item.type}/${item.id}/restore`);
      setRestoreItem(null);
      setSuccess(`${item.title} restored.`);
      await loadTrash();
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to restore item.",
      );
    } finally {
      setBusyAction("");
    }
  }

  async function restoreAll() {
    try {
      setBusyAction("restore-all");
      setError("");
      setSuccess("");
      const res = await api.post("/api/admin/settings/trash/restore-all", {
        type: filter,
      });
      setRestoreAllOpen(false);
      setSuccess(
        `${res?.data?.restoredCount || 0} item${
          Number(res?.data?.restoredCount || 0) === 1 ? "" : "s"
        } restored.`,
      );
      await loadTrash();
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to restore trash.",
      );
    } finally {
      setBusyAction("");
    }
  }

  return (
    <div className="trash-page">
      <GlassCard style={{ padding: 18 }}>
        <SectionHeader
          title="Trash"
          subtitle={`Deleted admin records remain restorable for ${retentionDays} days before permanent database removal.`}
          action={
            <div className="trash-actions">
              <ActionButton subtle onClick={() => navigate("/admin/dashboard/settings")}>
                Settings
              </ActionButton>
              <ActionButton subtle onClick={loadTrash} disabled={loading}>
                Refresh
              </ActionButton>
              <ActionButton
                onClick={() => setRestoreAllOpen(true)}
                disabled={!items.length || Boolean(busyAction)}
              >
                Restore All
              </ActionButton>
            </div>
          }
        />

        <div className="trash-filters">
          {FILTERS.map((option) => (
            <button
              key={option.key}
              type="button"
              className={`trash-filter ${filter === option.key ? "active" : ""}`}
              onClick={() => setFilter(option.key)}
            >
              <span>{option.label}</span>
              <b>{counts[option.key] || 0}</b>
            </button>
          ))}
        </div>

        {(error || success) && (
          <div className={`trash-alert ${error ? "error" : "success"}`}>
            {error || success}
          </div>
        )}
      </GlassCard>

      {loading ? (
        <div className="trash-list">
          {Array.from({ length: 4 }).map((_, index) => (
            <GlassCard key={index} style={{ padding: 18 }}>
              <div className="trash-skeleton" />
            </GlassCard>
          ))}
        </div>
      ) : items.length ? (
        <div className="trash-list">
          {items.map((item) => (
            <TrashItem
              key={`${item.type}-${item.id}`}
              item={item}
              busy={busyAction}
              onRestore={setRestoreItem}
            />
          ))}
        </div>
      ) : (
        <GlassCard style={{ padding: 28 }}>
          <div className="trash-empty-title">Trash is clear</div>
          <div className="trash-empty-copy">
            No deleted {activeFilterLabel.toLowerCase()} are currently awaiting
            permanent removal.
          </div>
        </GlassCard>
      )}

      <AdminDecisionModal
        open={Boolean(restoreItem)}
        title="Restore deleted item?"
        subtitle="This will return the item to its original workspace and remove it from Trash."
        confirmLabel="Restore Item"
        busy={
          restoreItem
            ? busyAction === `restore-${restoreItem.type}-${restoreItem.id}`
            : false
        }
        details={[
          {
            label: "Type",
            value: TYPE_META[restoreItem?.type]?.label || restoreItem?.type,
          },
          { label: "Item", value: restoreItem?.title },
          { label: "Permanent after", value: formatDate(restoreItem?.deleteAfter) },
        ]}
        onClose={() => {
          if (!busyAction) setRestoreItem(null);
        }}
        onConfirm={() => restoreSingle(restoreItem)}
      />

      <AdminDecisionModal
        open={restoreAllOpen}
        title="Restore all visible trash?"
        subtitle={`This restores every item currently shown in the ${activeFilterLabel} trash view.`}
        confirmLabel="Restore All"
        busy={busyAction === "restore-all"}
        disabled={!items.length}
        details={[
          { label: "Scope", value: activeFilterLabel },
          { label: "Items", value: String(items.length) },
          { label: "Retention", value: `${retentionDays} days` },
        ]}
        onClose={() => {
          if (!busyAction) setRestoreAllOpen(false);
        }}
        onConfirm={restoreAll}
      />

      <style>{`
        .trash-page{ display:grid; gap:18px; margin-top:0; padding-top:0; align-content:start; }
        .trash-header{ display:flex; justify-content:space-between; align-items:flex-end; gap:16px; flex-wrap:wrap; }
        .trash-eyebrow{ font-size:11px; font-weight:950; letter-spacing:.1em; text-transform:uppercase; color:#b42318; }
        .trash-title{ margin-top:4px; font-size:30px; font-weight:950; letter-spacing:-.04em; color:#0f172a; }
        .trash-subtitle{ margin-top:6px; max-width:760px; font-size:14px; line-height:1.65; font-weight:700; color:rgba(15,23,42,.58); }
        .trash-actions{ display:flex; align-items:center; justify-content:flex-end; gap:10px; flex-wrap:wrap; }
        .trash-filters{ margin-top:18px; display:flex; gap:8px; flex-wrap:wrap; }
        .trash-filter{ min-height:38px; padding:8px 12px; border-radius:999px; border:1px solid rgba(15,23,42,.08); background:#fff; color:#0f172a; font-size:12px; font-weight:900; cursor:pointer; display:inline-flex; gap:8px; align-items:center; }
        .trash-filter.active{ border-color:rgba(180,35,24,.18); background:linear-gradient(135deg,#b91c1c 0%,#dd5127 100%); color:#fff; }
        .trash-filter b{ min-width:20px; height:20px; padding:0 6px; border-radius:999px; display:inline-flex; align-items:center; justify-content:center; background:rgba(15,23,42,.06); font-size:10px; }
        .trash-filter.active b{ background:rgba(255,255,255,.18); }
        .trash-alert{ margin-top:14px; padding:13px 15px; border-radius:16px; font-weight:800; border:1px solid transparent; }
        .trash-alert.error{ background:rgba(180,35,24,.08); color:#b42318; border-color:rgba(180,35,24,.14); }
        .trash-alert.success{ background:rgba(22,163,74,.08); color:#15803d; border-color:rgba(22,163,74,.14); }
        .trash-list{ display:grid; gap:12px; }
        .trash-item{ padding:18px; display:grid; grid-template-columns:minmax(0,1fr) minmax(240px,auto); gap:18px; align-items:start; }
        .trash-item-main{ min-width:0; display:grid; gap:8px; }
        .trash-item-top{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
        .trash-type,.trash-status{ min-height:28px; padding:0 10px; border-radius:999px; display:inline-flex; align-items:center; font-size:11px; font-weight:950; letter-spacing:.04em; text-transform:uppercase; }
        .trash-type.neutral{ background:rgba(15,23,42,.05); color:#334155; border:1px solid rgba(15,23,42,.08); }
        .trash-type.order{ background:rgba(180,35,24,.07); color:#b42318; border:1px solid rgba(180,35,24,.12); }
        .trash-type.application{ background:rgba(37,99,235,.07); color:#1d4ed8; border:1px solid rgba(37,99,235,.12); }
        .trash-status{ background:rgba(248,250,252,.92); color:rgba(15,23,42,.52); border:1px solid rgba(15,23,42,.06); }
        .trash-item-title{ font-size:18px; font-weight:950; letter-spacing:-.03em; color:#0f172a; }
        .trash-item-subtitle,.trash-reason{ font-size:13px; line-height:1.55; font-weight:750; color:rgba(15,23,42,.56); }
        .trash-reason{ color:rgba(15,23,42,.48); }
        .trash-item-side{ display:grid; grid-template-columns:repeat(2,minmax(0,1fr)) auto; gap:10px; align-items:center; justify-items:end; }
        .trash-item-side div:not(.trash-days){ display:grid; gap:3px; justify-items:end; }
        .trash-item-side span{ font-size:10px; font-weight:950; letter-spacing:.08em; text-transform:uppercase; color:rgba(15,23,42,.4); }
        .trash-item-side strong{ font-size:12px; font-weight:850; color:#0f172a; text-align:right; }
        .trash-days{ min-height:34px; padding:0 10px; border-radius:999px; background:rgba(180,35,24,.06); color:#b42318; border:1px solid rgba(180,35,24,.1); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:950; white-space:nowrap; }
        .trash-skeleton{ height:82px; border-radius:16px; background:linear-gradient(90deg, rgba(241,245,249,.9), rgba(248,250,252,1), rgba(241,245,249,.9)); }
        .trash-empty-title{ font-size:24px; font-weight:950; letter-spacing:-.03em; color:#0f172a; }
        .trash-empty-copy{ margin-top:8px; font-size:14px; line-height:1.7; font-weight:700; color:rgba(15,23,42,.56); }
        @media (max-width:900px){
          .trash-item{ grid-template-columns:1fr; }
          .trash-item-side{ justify-items:start; grid-template-columns:1fr; }
          .trash-item-side div:not(.trash-days){ justify-items:start; }
          .trash-item-side strong{ text-align:left; }
        }
      `}</style>
    </div>
  );
}
