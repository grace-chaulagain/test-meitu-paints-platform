import { asyncHandler } from "../utils/asyncHandler.js";
import * as notificationService from "../services/notification.service.js";

export const getNotificationSummaryController = asyncHandler(
  async (req, res) => {
    const item = await notificationService.getUnreadSummary({
      user: req.user,
    });

    res.status(200).json({ ok: true, item });
  },
);

export const listNotificationsController = asyncHandler(async (req, res) => {
  const { days, unreadOnly, limit } = req.query || {};
  const out = await notificationService.listNotifications({
    user: req.user,
    days,
    unreadOnly,
    limit,
  });

  res.status(200).json({ ok: true, ...out });
});

export const markNotificationReadController = asyncHandler(async (req, res) => {
  const { notificationId } = req.params || {};
  const out = await notificationService.markNotificationRead({
    user: req.user,
    notificationId,
  });

  res.status(200).json(out);
});

export const markNotificationsReadController = asyncHandler(
  async (req, res) => {
    const { notificationIds = [], categories = [] } = req.body || {};
    const out = await notificationService.markNotificationsRead({
      user: req.user,
      notificationIds,
      categories,
    });

    res.status(200).json(out);
  },
);
