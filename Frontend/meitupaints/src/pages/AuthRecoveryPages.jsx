import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api, getApiErrorMessage } from "../api/client.js";

const shellStyle = {
  minHeight: "100vh",
  background:
    "radial-gradient(900px 520px at 12% 0%, rgba(255,230,160,.34), transparent 52%), radial-gradient(900px 520px at 88% 10%, rgba(255,120,80,.12), transparent 45%), linear-gradient(180deg, #f5f6f8 0%, #edf1f5 100%)",
  padding: "88px 16px 48px",
  display: "grid",
  placeItems: "center",
};

const cardStyle = {
  width: "100%",
  maxWidth: 520,
  borderRadius: 30,
  background: "rgba(255,255,255,.82)",
  border: "1px solid rgba(255,255,255,.72)",
  boxShadow:
    "0 30px 80px rgba(15,23,42,.12), inset 0 1px 0 rgba(255,255,255,.92)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  padding: "clamp(22px, 4vw, 34px)",
};

const inputStyle = {
  width: "100%",
  height: 56,
  borderRadius: 18,
  border: "1px solid rgba(15,23,42,.08)",
  background: "rgba(255,255,255,.94)",
  padding: "0 16px",
  outline: "none",
  fontSize: 15,
  fontWeight: 800,
  color: "#0f172a",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,.92)",
};

const labelStyle = {
  display: "block",
  marginBottom: 8,
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: ".08em",
  textTransform: "uppercase",
  color: "rgba(15,23,42,.52)",
};

const neutralMessage =
  "If an eligible account exists for this email, an email has been sent.";

function EyeIcon({ hidden = false }) {
  return (
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
      {hidden ? <path d="M4 4l16 16" /> : null}
    </svg>
  );
}

function StatusAlert({ tone = "error", children }) {
  const isSuccess = tone === "success";
  return (
    <div
      style={{
        borderRadius: 18,
        padding: "14px 16px",
        border: isSuccess
          ? "1px solid rgba(18,183,106,.16)"
          : "1px solid rgba(180,35,24,.14)",
        background: isSuccess ? "rgba(18,183,106,.10)" : "rgba(180,35,24,.08)",
        color: isSuccess ? "#067647" : "#b42318",
        fontSize: 14,
        fontWeight: 800,
        lineHeight: 1.55,
      }}
    >
      {children}
    </div>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  visible,
  onToggleVisibility,
  placeholder,
  autoComplete,
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          style={{ ...inputStyle, paddingRight: 58 }}
        />
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={onToggleVisibility}
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
            border: "1px solid rgba(15,23,42,.08)",
            background: "rgba(255,255,255,.92)",
            color: "rgba(15,23,42,.72)",
            cursor: "pointer",
          }}
        >
          <EyeIcon hidden={visible} />
        </button>
      </div>
    </div>
  );
}

function RecoveryShell({ eyebrow, title, description, children }) {
  return (
    <div style={shellStyle}>
      <section style={cardStyle}>
        <div
          style={{
            display: "inline-flex",
            padding: "8px 12px",
            borderRadius: 999,
            background: "rgba(255,255,255,.82)",
            border: "1px solid rgba(15,23,42,.06)",
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            color: "rgba(15,23,42,.56)",
          }}
        >
          {eyebrow}
        </div>
        <h1
          style={{
            margin: "18px 0 0",
            fontSize: "clamp(32px, 7vw, 48px)",
            lineHeight: 1,
            fontWeight: 950,
            letterSpacing: "-0.05em",
            color: "#0f172a",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            margin: "14px 0 0",
            fontSize: 15,
            lineHeight: 1.7,
            fontWeight: 650,
            color: "rgba(15,23,42,.58)",
          }}
        >
          {description}
        </p>
        <div style={{ marginTop: 24 }}>{children}</div>
      </section>
    </div>
  );
}

function RequestEmailPage({
  mode,
  eyebrow,
  title,
  description,
  endpoint,
  submitLabel,
  footerLink,
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState({ loading: false, ok: false, err: "" });

  const onSubmit = async (event) => {
    event.preventDefault();
    setState({ loading: true, ok: false, err: "" });

    try {
      await api.post(endpoint, { email });
      setState({ loading: false, ok: true, err: "" });
    } catch (error) {
      setState({
        loading: false,
        ok: false,
        err: getApiErrorMessage(error, "Unable to process this request."),
      });
    }
  };

  return (
    <RecoveryShell eyebrow={eyebrow} title={title} description={description}>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }}>
        {state.ok ? (
          <StatusAlert tone="success">{neutralMessage}</StatusAlert>
        ) : null}
        {state.err ? <StatusAlert>{state.err}</StatusAlert> : null}

        <div>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your account email"
            autoComplete="email"
            required
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={state.loading}
          style={{
            height: 56,
            borderRadius: 18,
            border: "1px solid rgba(196,0,0,.18)",
            background: state.loading
              ? "rgba(15,23,42,.12)"
              : "linear-gradient(135deg, #c40000 0%, #ff5b2e 100%)",
            color: "#fff",
            fontWeight: 950,
            fontSize: 15,
            cursor: state.loading ? "not-allowed" : "pointer",
            boxShadow: state.loading
              ? "none"
              : "0 18px 34px rgba(196,0,0,.20)",
          }}
        >
          {state.loading ? "Sending..." : submitLabel}
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            fontSize: 13,
            fontWeight: 850,
          }}
        >
          <Link to="/login" style={{ color: "#475467", textDecoration: "none" }}>
            Back to login
          </Link>
          <Link
            to={footerLink.to}
            style={{ color: "#b42318", textDecoration: "none" }}
          >
            {footerLink.label}
          </Link>
        </div>

        {mode === "setup" ? (
          <div
            style={{
              borderRadius: 18,
              padding: "14px 16px",
              background: "rgba(248,248,250,.9)",
              border: "1px solid rgba(15,23,42,.06)",
              color: "rgba(15,23,42,.58)",
              fontSize: 13,
              lineHeight: 1.6,
              fontWeight: 750,
            }}
          >
            Setup links are available only for approved dealer or dispatcher
            accounts that have not completed password setup yet.
          </div>
        ) : null}
      </form>
    </RecoveryShell>
  );
}

function SetNewPasswordPage({
  purpose,
  endpoint,
  title,
  description,
  expiredLink,
  successRedirect = "/login",
}) {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const token = useMemo(() => params.get("token") || "", [params]);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [tokenState, setTokenState] = useState({
    loading: true,
    valid: false,
    reason: "",
  });
  const [state, setState] = useState({ loading: false, ok: false, err: "" });

  useEffect(() => {
    let cancelled = false;

    async function checkToken() {
      if (!token) {
        setTokenState({ loading: false, valid: false, reason: "MISSING" });
        return;
      }

      try {
        const { data } = await api.post("/api/auth/password-token-status", {
          token,
          purpose,
        });

        if (!cancelled) {
          setTokenState({
            loading: false,
            valid: Boolean(data?.valid),
            reason: data?.reason || "",
          });
        }
      } catch {
        if (!cancelled) {
          setTokenState({ loading: false, valid: false, reason: "INVALID" });
        }
      }
    }

    checkToken();
    return () => {
      cancelled = true;
    };
  }, [purpose, token]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setState({ loading: true, ok: false, err: "" });

    if (!token) {
      setState({ loading: false, ok: false, err: "Missing token in URL." });
      return;
    }

    if (pw.length < 8) {
      setState({
        loading: false,
        ok: false,
        err: "Password must be at least 8 characters.",
      });
      return;
    }

    if (pw !== pw2) {
      setState({ loading: false, ok: false, err: "Passwords do not match." });
      return;
    }

    try {
      await api.post(endpoint, { token, newPassword: pw });
      setState({ loading: false, ok: true, err: "" });
      setTimeout(() => nav(successRedirect), 700);
    } catch (error) {
      setState({
        loading: false,
        ok: false,
        err: getApiErrorMessage(error, "Unable to save password."),
      });
    }
  };

  const showInvalidLink = !tokenState.loading && !tokenState.valid;

  return (
    <RecoveryShell
      eyebrow="Secure Access"
      title={title}
      description={description}
    >
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }}>
        {tokenState.loading ? (
          <StatusAlert tone="success">Checking secure link...</StatusAlert>
        ) : null}
        {showInvalidLink ? (
          <StatusAlert>
            This link has expired or is no longer valid.{" "}
            <Link
              to={expiredLink.to}
              style={{ color: "inherit", fontWeight: 950 }}
            >
              {expiredLink.label}
            </Link>
          </StatusAlert>
        ) : null}
        {state.ok ? (
          <StatusAlert tone="success">
            Password saved. Redirecting to login...
          </StatusAlert>
        ) : null}
        {state.err ? <StatusAlert>{state.err}</StatusAlert> : null}

        <PasswordInput
          label="New Password"
          value={pw}
          onChange={(event) => setPw(event.target.value)}
          visible={showPw}
          onToggleVisibility={() => setShowPw((value) => !value)}
          placeholder="Enter new password"
          autoComplete="new-password"
        />

        <PasswordInput
          label="Confirm Password"
          value={pw2}
          onChange={(event) => setPw2(event.target.value)}
          visible={showPw2}
          onToggleVisibility={() => setShowPw2((value) => !value)}
          placeholder="Re-enter new password"
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={state.loading || tokenState.loading || !tokenState.valid}
          style={{
            height: 56,
            borderRadius: 18,
            border: "1px solid rgba(196,0,0,.18)",
            background:
              state.loading || tokenState.loading || !tokenState.valid
                ? "rgba(15,23,42,.12)"
                : "linear-gradient(135deg, #c40000 0%, #ff5b2e 100%)",
            color: "#fff",
            fontWeight: 950,
            fontSize: 15,
            cursor:
              state.loading || tokenState.loading || !tokenState.valid
                ? "not-allowed"
                : "pointer",
            boxShadow:
              state.loading || tokenState.loading || !tokenState.valid
                ? "none"
                : "0 18px 34px rgba(196,0,0,.20)",
          }}
        >
          {state.loading ? "Saving..." : "Save Password"}
        </button>

        <Link
          to="/login"
          style={{
            justifySelf: "center",
            color: "#475467",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 850,
          }}
        >
          Back to login
        </Link>
      </form>
    </RecoveryShell>
  );
}

export function ForgotPasswordPage() {
  return (
    <RequestEmailPage
      mode="reset"
      eyebrow="Password Recovery"
      title="Reset your password."
      description="Enter your account email and we will send a secure, single-use reset link if the account is eligible."
      endpoint="/api/auth/forgot-password"
      submitLabel="Send Reset Link"
      footerLink={{
        to: "/resend-setup-link",
        label: "Need setup link?",
      }}
    />
  );
}

export function ResendSetupLinkPage() {
  return (
    <RequestEmailPage
      mode="setup"
      eyebrow="Account Setup"
      title="Request a fresh setup link."
      description="If your invitation link expired, enter the approved account email and we will send a fresh setup link when eligible."
      endpoint="/api/auth/resend-setup-link"
      submitLabel="Send Setup Link"
      footerLink={{
        to: "/forgot-password",
        label: "Forgot password?",
      }}
    />
  );
}

export function ResetPasswordPage() {
  return (
    <SetNewPasswordPage
      purpose="RESET_PASSWORD"
      endpoint="/api/auth/reset-password"
      title="Choose a new password."
      description="Use this secure recovery link to set a new password for your Meitu account."
      expiredLink={{
        to: "/forgot-password",
        label: "Request a new reset link.",
      }}
    />
  );
}

export function SetupPasswordPage() {
  return (
    <SetNewPasswordPage
      purpose="SETUP_PASSWORD"
      endpoint="/api/auth/set-password"
      title="Set your account password."
      description="Complete your approved dealer or dispatcher account setup with a secure one-time activation link."
      expiredLink={{
        to: "/resend-setup-link",
        label: "Request a fresh setup link.",
      }}
    />
  );
}
