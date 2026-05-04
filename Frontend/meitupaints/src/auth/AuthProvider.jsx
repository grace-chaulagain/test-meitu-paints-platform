import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  api,
  setAccessToken,
  clearAccessToken,
  registerAuthHandlers,
} from "../api/client.js";
import { useDispatch } from "react-redux";
import { loginSuccess, logout as logoutAction } from "../redux/userSlice.js";

const AuthCtx = createContext(null);
const AUTH_CACHE_KEY = "meitu.authCache";
const SESSION_EXPIRED_KEY = "meitu.sessionExpired";
const REFRESH_BEFORE_EXPIRY_MS = 45 * 1000;
let refreshSessionPromise = null;
const TERMINAL_REFRESH_CODES = new Set([
  "ACCOUNT_DISABLED",
  "AUTH_REQUIRED",
  "INVALID_TOKEN",
  "REFRESH_TOKEN_EXPIRED",
  "REFRESH_TOKEN_REVOKED",
  "REFRESH_TOKEN_MISSING",
  "INVALID_REFRESH_TOKEN",
]);
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthCtx);

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

function isAccessTokenUsable(token, skewMs = 0) {
  const expiresAt = getAccessTokenExpiresAt(token);
  return Boolean(expiresAt && expiresAt - skewMs > Date.now());
}

function userFromAccessToken(token) {
  const payload = decodeJwtPayload(token);
  if (!payload?.sub || !payload?.role) return null;

  return {
    id: payload.sub,
    role: payload.role,
    dealerId: payload.dealerId || null,
    dispatcherId: payload.dispatcherId || null,
  };
}

function readAuthCache() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_CACHE_KEY) || "null");
  } catch {
    return null;
  }
}

function requestSessionRefresh() {
  if (!refreshSessionPromise) {
    refreshSessionPromise = api
      .post(
        "/api/auth/refresh",
        {},
        {
          __skipAuthRefresh: true,
        },
      )
      .then(({ data }) => data)
      .finally(() => {
        refreshSessionPromise = null;
      });
  }

  return refreshSessionPromise;
}

function getAuthErrorCode(error) {
  return String(error?.response?.data?.code || "").toUpperCase();
}

function isTerminalRefreshFailure(error) {
  const status = Number(error?.response?.status || 0);
  if (![401, 403].includes(status)) return false;

  const code = getAuthErrorCode(error);
  return !code || TERMINAL_REFRESH_CODES.has(code);
}

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [accessToken, setToken] = useState(null);
  const [booting, setBooting] = useState(true);
  const [refreshingSession, setRefreshingSession] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  const applyToken = useCallback((token) => {
    const nextToken = token || null;
    setToken(nextToken);
    setAccessToken(nextToken);
  }, []);

  const syncAuthState = useCallback((data) => {
    applyToken(data?.accessToken || null);
    setUser(data?.user || null);
    setSessionExpired(false);
    sessionStorage.removeItem(SESSION_EXPIRED_KEY);

    const role = String(data?.user?.role || "").toUpperCase();

    if (!data?.user) {
      localStorage.removeItem(AUTH_CACHE_KEY);
      dispatch(logoutAction());
      return;
    }

    localStorage.setItem(
      AUTH_CACHE_KEY,
      JSON.stringify({
        user: data.user,
        dealerProfile: data?.dealerProfile || null,
      }),
    );

    dispatch(
      loginSuccess({
        user: data.user,
        role,
        dealerProfile: role === "DEALER" ? data?.dealerProfile || null : null,
      }),
    );
  }, [applyToken, dispatch]);

  const clearAuthState = useCallback(({ expired = false } = {}) => {
    clearAccessToken();
    setToken(null);
    setUser(null);
    setRefreshingSession(false);
    setSessionExpired(Boolean(expired));

    if (expired) {
      sessionStorage.setItem(SESSION_EXPIRED_KEY, "1");
    }

    localStorage.removeItem(AUTH_CACHE_KEY);
    dispatch(logoutAction());
  }, [dispatch]);

  const restoreAuthFromAccessToken = useCallback((token) => {
    const tokenUser = userFromAccessToken(token);
    if (!tokenUser) return false;

    const cached = readAuthCache();
    const cachedUser =
      cached?.user && String(cached.user.id || cached.user._id) === tokenUser.id
        ? cached.user
        : null;

    const restoredUser = {
      ...(cachedUser || {}),
      ...tokenUser,
      role: tokenUser.role,
    };
    const role = String(restoredUser.role || "").toUpperCase();
    const dealerProfile =
      role === "DEALER" ? cached?.dealerProfile || null : null;

    applyToken(token);
    setUser(restoredUser);
    setSessionExpired(false);
    sessionStorage.removeItem(SESSION_EXPIRED_KEY);

    dispatch(
      loginSuccess({
        user: restoredUser,
        role,
        dealerProfile,
      }),
    );

    return true;
  }, [applyToken, dispatch]);

  const login = useCallback(async ({ email, password, role: loginRole }) => {
    const payload = { email, password };
    if (loginRole) payload.role = loginRole;

    const { data } = await api.post("/api/auth/login", payload, {
      __skipAuthRefresh: true,
    });

    syncAuthState(data);
    return data;
  }, [syncAuthState]);

  const logout = useCallback(async () => {
    try {
      await api.post(
        "/api/auth/logout",
        {},
        {
          __skipAuthRefresh: true,
        },
      );
    } catch {
      // ignore server logout failure
    } finally {
      clearAuthState();
    }
  }, [clearAuthState]);

  const refresh = useCallback(async () => {
    setRefreshingSession(true);
    try {
      const data = await requestSessionRefresh();
      syncAuthState(data);
      return data;
    } finally {
      setRefreshingSession(false);
    }
  }, [syncAuthState]);

  useEffect(() => {
    registerAuthHandlers({
      onRefreshToken: async () => {
        const data = await refresh();
        return data?.accessToken || null;
      },
      onAuthFailure: async (error) => {
        if (!isTerminalRefreshFailure(error)) return;
        clearAuthState({ expired: true });
      },
    });

    return () => {
      registerAuthHandlers({
        onRefreshToken: null,
        onAuthFailure: null,
      });
    };
  }, [clearAuthState, refresh]);

  useEffect(() => {
    let alive = true;

    (async () => {
      const savedToken = localStorage.getItem("accessToken");
      const cachedSession = readAuthCache();
      const hadStoredSession = Boolean(savedToken || cachedSession?.user);

      if (savedToken && isAccessTokenUsable(savedToken)) {
        if (alive) {
          restoreAuthFromAccessToken(savedToken);
          setBooting(false);
        }
        return;
      }

      if (!hadStoredSession) {
        if (alive) {
          clearAuthState();
          setBooting(false);
        }
        return;
      }

      try {
        const data = await requestSessionRefresh();
        if (alive) {
          syncAuthState(data);
        }
      } catch (error) {
        if (alive) {
          if (isTerminalRefreshFailure(error)) {
            clearAuthState({ expired: hadStoredSession });
          } else if (savedToken && restoreAuthFromAccessToken(savedToken)) {
            setSessionExpired(false);
          } else {
            clearAuthState({ expired: false });
          }
        }
      } finally {
        if (alive) {
          setBooting(false);
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, [clearAuthState, restoreAuthFromAccessToken, syncAuthState]);

  useEffect(() => {
    if (!accessToken || !user) return undefined;

    const expiresAt = getAccessTokenExpiresAt(accessToken);
    if (!expiresAt) return undefined;

    const delay = Math.max(
      expiresAt - Date.now() - REFRESH_BEFORE_EXPIRY_MS,
      0,
    );

    const timer = window.setTimeout(async () => {
      try {
        await refresh();
      } catch (error) {
        if (isTerminalRefreshFailure(error)) {
          clearAuthState({ expired: true });
        }
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [accessToken, clearAuthState, refresh, user]);

  const value = useMemo(
    () => ({
      booting,
      refreshingSession,
      recoveringSession: booting || refreshingSession,
      user,
      accessToken,
      sessionExpired,
      isAuthed: Boolean(accessToken && user),
      login,
      logout,
      refresh,
      setUser,
      setAuth: ({ user, accessToken, dealerProfile = null }) => {
        applyToken(accessToken || null);
        setUser(user || null);

        const role = String(user?.role || "").toUpperCase();

        if (!user) {
          dispatch(logoutAction());
          return;
        }

        dispatch(
          loginSuccess({
            user,
            role,
            dealerProfile: role === "DEALER" ? dealerProfile || null : null,
          }),
        );
      },
    }),
    [
      booting,
      refreshingSession,
      user,
      accessToken,
      sessionExpired,
      login,
      logout,
      refresh,
      applyToken,
      dispatch,
    ],
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function RequireRole({ roles = [], children, fallback = null }) {
  const { recoveringSession, user } = useAuth();

  if (recoveringSession) return null;
  if (!user) return fallback;

  const allowed = roles.map((r) => String(r || "").toUpperCase());
  const current = String(user.role || "").toUpperCase();

  if (!allowed.includes(current)) return fallback;
  return children;
}
