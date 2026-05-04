import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client.js";

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

function SectionHeader({ title, subtitle, action = null }) {
  return (
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
            fontSize: 28,
            fontWeight: 950,
            letterSpacing: "-0.03em",
            color: "#0f172a",
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              marginTop: 6,
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
      {action}
    </div>
  );
}

function ActionButton({ children, onClick, disabled = false, subtle = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        minHeight: 42,
        padding: "10px 16px",
        borderRadius: 14,
        border: "1px solid rgba(15,23,42,.08)",
        background: subtle
          ? "#fff"
          : "linear-gradient(135deg, #b91c1c 0%, #dd5127 100%)",
        color: subtle ? "#0f172a" : "#fff",
        fontWeight: 900,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        boxShadow: subtle
          ? "inset 0 1px 0 rgba(255,255,255,.72)"
          : "0 12px 22px rgba(180,35,24,.16)",
      }}
    >
      {children}
    </button>
  );
}

function Field({ label, helper = "", children }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <label
        style={{
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: ".08em",
          textTransform: "uppercase",
          color: "rgba(15,23,42,.44)",
        }}
      >
        {label}
      </label>
      {children}
      {helper ? (
        <div
          style={{
            fontSize: 12,
            lineHeight: 1.55,
            fontWeight: 700,
            color: "rgba(15,23,42,.54)",
          }}
        >
          {helper}
        </div>
      ) : null}
    </div>
  );
}

function ToggleRow({ title, description, checked, onChange }) {
  return (
    <label
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr) auto",
        gap: 14,
        alignItems: "center",
        padding: 16,
        borderRadius: 18,
        background: "rgba(248,250,252,.92)",
        border: "1px solid rgba(15,23,42,.06)",
        cursor: "pointer",
      }}
    >
      <span>
        <span
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 900,
            color: "#0f172a",
          }}
        >
          {title}
        </span>
        <span
          style={{
            display: "block",
            marginTop: 5,
            fontSize: 12,
            lineHeight: 1.55,
            fontWeight: 700,
            color: "rgba(15,23,42,.56)",
          }}
        >
          {description}
        </span>
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 20, height: 20, accentColor: "#b91c1c" }}
      />
    </label>
  );
}

const EMPTY_FORM = {
  adminEmail: "",
  factoryEmail: "",
  notificationsEnabled: true,
  dealerApplicationNotificationsEnabled: true,
  dispatcherApplicationNotificationsEnabled: true,
  factoryOrderNotificationsEnabled: true,
};

export default function AdminSettingsPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/admin/settings/notifications");
      setForm({ ...EMPTY_FORM, ...(res?.data?.item || {}) });
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to load notification settings.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSuccess("");
  };

  const buildPayload = () => ({
    adminEmail: form.adminEmail.trim().toLowerCase(),
    factoryEmail: form.factoryEmail.trim().toLowerCase(),
    notificationsEnabled: form.notificationsEnabled,
    dealerApplicationNotificationsEnabled:
      form.dealerApplicationNotificationsEnabled,
    dispatcherApplicationNotificationsEnabled:
      form.dispatcherApplicationNotificationsEnabled,
    factoryOrderNotificationsEnabled: form.factoryOrderNotificationsEnabled,
  });

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const res = await api.patch(
        "/api/admin/settings/notifications",
        buildPayload(),
      );

      setForm({ ...EMPTY_FORM, ...(res?.data?.item || {}) });
      setSuccess("Notification settings saved.");
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to save notification settings.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleSendTest() {
    try {
      setTesting(true);
      setError("");
      setSuccess("");

      const saved = await api.patch(
        "/api/admin/settings/notifications",
        buildPayload(),
      );
      setForm({ ...EMPTY_FORM, ...(saved?.data?.item || {}) });

      const res = await api.post("/api/admin/settings/notifications/test");
      const to = res?.data?.item?.to || saved?.data?.item?.adminEmail || "";
      setSuccess(
        to
          ? `Test notification sent to ${to}.`
          : "Test notification sent.",
      );
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to send test notification.",
      );
    } finally {
      setTesting(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 20, marginTop: 0, paddingTop: 0 }}>
      <GlassCard style={{ padding: 18 }}>
        <SectionHeader
          title="Notification Settings"
          subtitle="Configure operational email recipients for admin alerts. This admin email is separate from any admin login identity."
          action={
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <ActionButton
                subtle
                onClick={handleSendTest}
                disabled={loading || saving || testing}
              >
                {testing ? "Sending..." : "Send Test Email"}
              </ActionButton>
              <ActionButton subtle onClick={loadSettings} disabled={loading}>
                Refresh
              </ActionButton>
              <ActionButton
                subtle
                onClick={() => navigate("/admin/dashboard/settings/trash")}
              >
                Trash
              </ActionButton>
            </div>
          }
        />

        {(error || success) && (
          <div
            style={{
              marginTop: 18,
              padding: "14px 16px",
              borderRadius: 16,
              background: error
                ? "rgba(180,35,24,.08)"
                : "rgba(22,163,74,.08)",
              border: error
                ? "1px solid rgba(180,35,24,.14)"
                : "1px solid rgba(22,163,74,.14)",
              color: error ? "#b42318" : "#15803d",
              fontWeight: 800,
            }}
          >
            {error || success}
          </div>
        )}
      </GlassCard>

      <GlassCard style={{ padding: 22 }}>
        <SectionHeader
          title="Admin Trash"
          subtitle="Restore deleted dealers, dispatchers, orders, and applications before their 30-day retention window expires."
          action={
            <ActionButton
              subtle
              onClick={() => navigate("/admin/dashboard/settings/trash")}
            >
              Open Trash
            </ActionButton>
          }
        />
      </GlassCard>

      <GlassCard style={{ padding: 24 }}>
        {loading ? (
          <div style={{ fontWeight: 800, color: "rgba(15,23,42,.58)" }}>
            Loading settings...
          </div>
        ) : (
          <div style={{ display: "grid", gap: 20 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 16,
              }}
            >
              <Field
                label="Factory Email"
                helper="Existing factory recipient used for factory order bill emails."
              >
                <input
                  type="email"
                  value={form.factoryEmail}
                  onChange={(e) => updateField("factoryEmail", e.target.value)}
                  placeholder="factory@example.com"
                  style={{
                    width: "100%",
                    height: 50,
                    borderRadius: 16,
                    border: "1px solid rgba(15,23,42,.08)",
                    background: "#fff",
                    padding: "0 14px",
                    outline: "none",
                    fontSize: 14,
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                />
              </Field>

              <Field
                label="Admin Notification Email"
                helper="Receives new dealer applications, dispatcher applications, and factory-routed order alerts. This is not the admin login email."
              >
                <input
                  type="email"
                  value={form.adminEmail}
                  onChange={(e) => updateField("adminEmail", e.target.value)}
                  placeholder="operations-admin@example.com"
                  style={{
                    width: "100%",
                    height: 50,
                    borderRadius: 16,
                    border: "1px solid rgba(15,23,42,.08)",
                    background: "#fff",
                    padding: "0 14px",
                    outline: "none",
                    fontSize: 14,
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                />
              </Field>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              <ToggleRow
                title="Enable admin notification email"
                description="Master switch for all admin-facing notification emails."
                checked={form.notificationsEnabled}
                onChange={(value) => updateField("notificationsEnabled", value)}
              />
              <ToggleRow
                title="Dealer application alerts"
                description="Notify admin when a new dealer application is submitted."
                checked={form.dealerApplicationNotificationsEnabled}
                onChange={(value) =>
                  updateField("dealerApplicationNotificationsEnabled", value)
                }
              />
              <ToggleRow
                title="Dispatcher application alerts"
                description="Notify admin when a new dispatcher application is submitted."
                checked={form.dispatcherApplicationNotificationsEnabled}
                onChange={(value) =>
                  updateField("dispatcherApplicationNotificationsEnabled", value)
                }
              />
              <ToggleRow
                title="Factory-routed order alerts"
                description="Notify admin only for new orders placed by factory-routed dealers. Dispatcher-routed dealer orders are excluded."
                checked={form.factoryOrderNotificationsEnabled}
                onChange={(value) =>
                  updateField("factoryOrderNotificationsEnabled", value)
                }
              />
            </div>

            <div
              style={{
                padding: "14px 16px",
                borderRadius: 18,
                background: "rgba(248,250,252,.92)",
                border: "1px solid rgba(15,23,42,.06)",
                color: "rgba(15,23,42,.62)",
                fontSize: 13,
                lineHeight: 1.7,
                fontWeight: 700,
              }}
            >
              SMTP credentials still come from the backend environment. These
              settings only decide who receives operational admin alerts.
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <ActionButton onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Notification Settings"}
              </ActionButton>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
