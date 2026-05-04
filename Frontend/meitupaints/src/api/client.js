import axios from "axios";

function resolveBaseURL() {
  const configured = (import.meta.env.VITE_API_BASE_URL || "").trim();

  if (configured) {
    return configured.replace(/\/+$/, "");
  }

  if (import.meta.env.DEV && typeof window !== "undefined") {
    const protocol = window.location?.protocol || "http:";
    const hostname = window.location?.hostname || "localhost";
    return `${protocol}//${hostname}:5002`;
  }

  return import.meta.env.DEV ? "http://localhost:5002" : "";
}

const baseURL = resolveBaseURL();

export const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

let currentAccessToken = null;
let refreshHandler = null;
let logoutHandler = null;
let refreshPromise = null;

const ACCESS_TOKEN_REFRESH_SKEW_MS = 60 * 1000;

const TERMINAL_AUTH_CODES = new Set([
  "ACCOUNT_DISABLED",
  "REFRESH_TOKEN_EXPIRED",
  "REFRESH_TOKEN_REVOKED",
  "REFRESH_TOKEN_MISSING",
  "INVALID_REFRESH_TOKEN",
]);

function getAuthErrorCode(error) {
  return String(error?.response?.data?.code || "").toUpperCase();
}

function decodeJwtPayload(token) {
  try {
    const [, payload] = String(token || "").split(".");
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );

    return JSON.parse(window.atob(padded));
  } catch {
    return null;
  }
}

function getAccessTokenExpiresAt(token) {
  const payload = decodeJwtPayload(token);
  const exp = Number(payload?.exp || 0);
  return exp > 0 ? exp * 1000 : 0;
}

function shouldRefreshBeforeRequest(token) {
  const expiresAt = getAccessTokenExpiresAt(token);
  if (!expiresAt) return false;
  return expiresAt - ACCESS_TOKEN_REFRESH_SKEW_MS <= Date.now();
}

function isRefreshRequest(config = {}) {
  return (
    config?.url?.includes("/api/auth/refresh") ||
    config?.url?.includes("/auth/refresh") ||
    config?.__skipAuthRefresh === true
  );
}

function isRefreshableAuthFailure(error) {
  const status = Number(error?.response?.status || 0);
  if (status !== 401) return false;

  const code = getAuthErrorCode(error);
  return (
    !code ||
    code === "ACCESS_TOKEN_EXPIRED" ||
    code === "AUTH_REQUIRED" ||
    code === "INVALID_TOKEN"
  );
}

function isTerminalAuthFailure(error) {
  const status = Number(error?.response?.status || 0);
  if (![401, 403].includes(status)) return false;

  const code = getAuthErrorCode(error);
  return TERMINAL_AUTH_CODES.has(code) || isRefreshRequest(error?.config);
}

export function setAccessToken(token) {
  currentAccessToken = token || null;

  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("accessToken", token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem("accessToken");
  }
}

export function getAccessToken() {
  return currentAccessToken;
}

export function clearAccessToken() {
  setAccessToken(null);
}

export function registerAuthHandlers({ onRefreshToken, onAuthFailure }) {
  refreshHandler = onRefreshToken || null;
  logoutHandler = onAuthFailure || null;
}

async function refreshAccessTokenOnce() {
  if (!refreshHandler) {
    throw new Error("No refresh handler registered");
  }

  if (!refreshPromise) {
    refreshPromise = Promise.resolve()
      .then(() => refreshHandler())
      .then((token) => {
        if (!token) {
          throw new Error("Unable to refresh access token");
        }

        setAccessToken(token);
        return token;
      })
      .catch(async (error) => {
        if (logoutHandler && isTerminalAuthFailure(error)) {
          await logoutHandler(error);
        }
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

api.interceptors.request.use(
  async (config) => {
    if (
      !isRefreshRequest(config) &&
      currentAccessToken &&
      refreshHandler &&
      shouldRefreshBeforeRequest(currentAccessToken)
    ) {
      const nextToken = await refreshAccessTokenOnce();
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${nextToken}`;
      return config;
    }

    if (currentAccessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${currentAccessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;

    const code = getAuthErrorCode(error);

    if (
      logoutHandler &&
      [401, 403].includes(Number(status)) &&
      TERMINAL_AUTH_CODES.has(code)
    ) {
      await logoutHandler(error);
      return Promise.reject(error);
    }

    if (!originalRequest || !isRefreshableAuthFailure(error)) {
      return Promise.reject(error);
    }

    if (isRefreshRequest(originalRequest)) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (!refreshHandler) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newToken = await refreshAccessTokenOnce();

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

export function getApiErrorMessage(err, fallback = "Request failed") {
  return (
    err?.response?.data?.error ||
    err?.response?.data?.message ||
    err?.message ||
    fallback
  );
}

const savedToken = localStorage.getItem("accessToken");
if (savedToken) {
  setAccessToken(savedToken);
}
