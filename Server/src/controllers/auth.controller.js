import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import {
  login,
  refresh,
  logout,
  requestPasswordReset,
  resetPassword,
  setPasswordFromSetupToken,
  getPasswordTokenStatus,
  requestSetupLinkByEmail,
  resendDealerSetupEmailByEmail,
  smtpTest,
} from "../services/auth.service.js";
import {
  COOKIE_DOMAIN,
  COOKIE_SAME_SITE,
  COOKIE_SECURE,
  IS_PRODUCTION,
} from "../config/env.js";

const refreshCookieMaxAgeMs =
  Number(process.env.REFRESH_TTL_DAYS || 7) * 24 * 60 * 60 * 1000;

function resolveSameSite() {
  const value = String(COOKIE_SAME_SITE || "lax").toLowerCase();
  if (["lax", "strict", "none"].includes(value)) return value;
  return "lax";
}

function isCookieSecureExplicitlyConfigured() {
  return Object.prototype.hasOwnProperty.call(process.env, "COOKIE_SECURE");
}

function requestUsesHttps(req) {
  const forwardedProto = String(req.get("x-forwarded-proto") || "")
    .split(",")[0]
    .trim()
    .toLowerCase();
  return Boolean(req.secure || forwardedProto === "https");
}

function baseCookieOptions(req) {
  const sameSite = resolveSameSite();
  const secure =
    sameSite === "none"
      ? true
      : isCookieSecureExplicitlyConfigured()
        ? COOKIE_SECURE
        : requestUsesHttps(req);

  return {
    httpOnly: true,
    sameSite,
    secure,
    path: "/api",
    ...(COOKIE_DOMAIN ? { domain: COOKIE_DOMAIN } : {}),
  };
}

function refreshCookieOptions(req) {
  return {
    ...baseCookieOptions(req),
    maxAge: refreshCookieMaxAgeMs,
  };
}

export const loginController = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body || {};
  if (!email || !password)
    throw new ApiError(400, "Email and password are required");

  const { user, dealerProfile, accessToken, refreshToken } = await login({
    email,
    password,
    role,
    ip: req.ip,
    userAgent: req.get("user-agent") || "",
  });

  res.cookie("refreshToken", refreshToken, refreshCookieOptions(req));
  res.status(200).json({ ok: true, user, dealerProfile, accessToken });
});

export const refreshController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    res.clearCookie("refreshToken", baseCookieOptions(req));
    throw new ApiError(401, "Missing refresh token", {
      code: "REFRESH_TOKEN_MISSING",
    });
  }

  let out;
  try {
    out = await refresh({ refreshToken });
  } catch (error) {
    res.clearCookie("refreshToken", baseCookieOptions(req));
    throw error;
  }

  if (out.refreshToken) {
    res.cookie("refreshToken", out.refreshToken, refreshCookieOptions(req));
  }
  res.status(200).json({
    ok: true,
    user: out.user,
    dealerProfile: out.dealerProfile,
    accessToken: out.accessToken,
  });
});

export const logoutController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  await logout({ refreshToken });

  // Must match cookie options (path) used when setting it
  res.clearCookie("refreshToken", baseCookieOptions(req));
  res.clearCookie("accessToken", baseCookieOptions(req));
  res.status(200).json({ ok: true });
});

export const forgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.body || {};
  if (!email) throw new ApiError(400, "Email is required");

  const out = await requestPasswordReset(email);

  const token = IS_PRODUCTION ? undefined : out.token;

  res.status(200).json({
    ok: true,
    message: out.message,
    token,
  });
});

export const resetPasswordController = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body || {};
  if (!token || !newPassword)
    throw new ApiError(400, "token and newPassword are required");

  await resetPassword(token, newPassword);

  // Ensure any existing session cookie is cleared after password reset
  res.clearCookie("refreshToken", baseCookieOptions(req));
  res.clearCookie("accessToken", baseCookieOptions(req));
  res.status(200).json({ ok: true });
});

export const setPasswordController = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body || {};
  if (!token || !newPassword) {
    throw new ApiError(400, "token and newPassword are required");
  }

  await setPasswordFromSetupToken(token, newPassword);

  res.clearCookie("refreshToken", baseCookieOptions(req));
  res.clearCookie("accessToken", baseCookieOptions(req));
  res.status(200).json({ ok: true });
});

export const passwordTokenStatusController = asyncHandler(async (req, res) => {
  const { token, purpose } = req.body || {};
  if (!token || !purpose) {
    throw new ApiError(400, "token and purpose are required");
  }

  const out = await getPasswordTokenStatus({ token, purpose });
  res.status(200).json({ ok: true, ...out });
});

export const requestSetupLinkController = asyncHandler(async (req, res) => {
  const { email } = req.body || {};
  if (!email) throw new ApiError(400, "Email is required");

  const out = await requestSetupLinkByEmail({ email });
  const token = IS_PRODUCTION ? undefined : out.token;

  res.status(200).json({
    ok: true,
    message: out.message,
    token,
  });
});

export const resendSetupEmailController = asyncHandler(async (req, res) => {
  const { email } = req.body || {};
  if (!email) throw new ApiError(400, "Email is required");

  const out = await resendDealerSetupEmailByEmail({ email });

  const token = IS_PRODUCTION ? undefined : out.token;

  res.status(200).json({
    ok: true,
    message: out.message,
    token,
    alreadySet: out.alreadySet,
  });
});

export const smtpTestController = asyncHandler(async (req, res) => {
  const { to } = req.body || {};
  const out = await smtpTest({ to });
  res.status(200).json(out);
});
