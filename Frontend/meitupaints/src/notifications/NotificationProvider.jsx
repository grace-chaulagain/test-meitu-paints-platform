import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { api } from "../api/client.js";
import { useAuth } from "../auth/AuthProvider.jsx";
import { NotificationCtx } from "./notificationContext.js";

function emptySummary() {
  return {
    totalUnread: 0,
    categories: {},
  };
}

function canUseNotifications(user) {
  const role = String(user?.role || "").toUpperCase();
  return role === "ADMIN" || role === "DISPATCHER";
}

export function NotificationProvider({ children }) {
  const { user, booting } = useAuth();
  const [summary, setSummary] = useState(emptySummary);
  const [loading, setLoading] = useState(false);

  const enabled = canUseNotifications(user);

  const refreshSummary = useCallback(async () => {
    if (!enabled) {
      setSummary(emptySummary());
      return emptySummary();
    }

    try {
      setLoading(true);
      const res = await api.get("/api/notifications/summary");
      const next = res?.data?.item || emptySummary();
      setSummary(next);
      return next;
    } catch {
      setSummary(emptySummary());
      return emptySummary();
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  const markCategoriesRead = useCallback(
    async (categories = []) => {
      const cleanCategories = categories.filter(Boolean);
      if (!enabled || cleanCategories.length === 0) return { ok: true };

      const res = await api.patch("/api/notifications/read", {
        categories: cleanCategories,
      });
      await refreshSummary();
      return res?.data || { ok: true };
    },
    [enabled, refreshSummary],
  );

  const markNotificationRead = useCallback(
    async (notificationId) => {
      if (!enabled || !notificationId) return { ok: true };
      const res = await api.patch(`/api/notifications/${notificationId}/read`);
      await refreshSummary();
      return res?.data || { ok: true };
    },
    [enabled, refreshSummary],
  );

  const markNotificationIdsRead = useCallback(
    async (notificationIds = []) => {
      const cleanIds = notificationIds.filter(Boolean);
      if (!enabled || cleanIds.length === 0) return { ok: true };

      const res = await api.patch("/api/notifications/read", {
        notificationIds: cleanIds,
      });
      await refreshSummary();
      return res?.data || { ok: true };
    },
    [enabled, refreshSummary],
  );

  useEffect(() => {
    if (booting) return undefined;
    refreshSummary();

    if (!enabled) return undefined;
    const timer = window.setInterval(refreshSummary, 45000);
    return () => window.clearInterval(timer);
  }, [booting, enabled, refreshSummary]);

  const value = useMemo(
    () => ({
      enabled,
      loading,
      totalUnread: Number(summary?.totalUnread || 0),
      categories: summary?.categories || {},
      refreshSummary,
      markCategoriesRead,
      markNotificationRead,
      markNotificationIdsRead,
    }),
    [
      enabled,
      loading,
      summary,
      refreshSummary,
      markCategoriesRead,
      markNotificationRead,
      markNotificationIdsRead,
    ],
  );

  return (
    <NotificationCtx.Provider value={value}>
      {children}
    </NotificationCtx.Provider>
  );
}
