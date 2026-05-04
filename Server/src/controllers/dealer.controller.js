import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

import * as dealerService from "../services/dealer.service.js";
import { createDealerOrder } from "../services/dealer.service.js";

export async function createDealerOrderController(req, res, next) {
  try {
    const { items, paymentMethod, dealerNote } = req.body;

    const order = await createDealerOrder({
      dealerId: req.user.dealerId,
      userId: req.user._id || req.user.id || req.user.sub,
      items,
      paymentMethod,
      dealerNote,
    });

    res.status(201).json({
      ok: true,
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    next(error);
  }
}

// Public: Dealer application
export const applyForDealershipController = asyncHandler(async (req, res) => {
  const out = await dealerService.applyForDealership(req.body || {});
  res.status(201).json({ ok: true, ...out });
});

// Dealer: profile
export const getMyProfileController = asyncHandler(async (req, res) => {
  const out = await dealerService.getMyProfile({ user: req.user });
  res.status(200).json({ ok: true, item: out });
});

export const updateMyProfileController = asyncHandler(async (req, res) => {
  await dealerService.updateMyProfile({
    user: req.user,
    patch: req.body || {},
  });
  res.status(200).json({ ok: true });
});

// Dealer: orders
export const listMyOrdersController = asyncHandler(async (req, res) => {
  const { status, page, limit } = req.query || {};
  const out = await dealerService.listMyOrders({
    user: req.user,
    status,
    q: req.query.q,
    page,
    limit,
  });
  res.status(200).json({ ok: true, ...out });
});

export const getMyOrderStatementsReportController = asyncHandler(
  async (req, res) => {
    const { from, to, status = "", minTotal = "", maxTotal = "" } =
      req.query || {};

    const out = await dealerService.getMyOrderStatementsReport({
      user: req.user,
      from,
      to,
      status,
      minTotal,
      maxTotal,
    });

    res.status(200).json({ ok: true, item: out });
  },
);

export const getMyOrderController = asyncHandler(async (req, res) => {
  const { orderId } = req.params || {};
  if (!orderId) throw new ApiError(400, "Missing orderId");

  const out = await dealerService.getMyOrder({ user: req.user, orderId });
  res.status(200).json({ ok: true, item: out });
});

export const createOrderController = asyncHandler(async (req, res) => {
  const out = await dealerService.createOrder({
    user: req.user,
    payload: req.body || {},
  });
  res.status(201).json({ ok: true, ...out });
});

// Dealer: payments
export const submitPaymentController = asyncHandler(async (req, res) => {
  const { orderId } = req.params || {};
  if (!orderId) throw new ApiError(400, "Missing orderId");

  const out = await dealerService.submitPayment({
    user: req.user,
    orderId,
    payload: req.body || {},
  });
  res.status(201).json({ ok: true, ...out });
});

export const listMyPaymentsController = asyncHandler(async (req, res) => {
  const { status, orderId, page, limit } = req.query || {};
  const out = await dealerService.listMyPayments({
    user: req.user,
    status,
    orderId,
    page,
    limit,
  });
  res.status(200).json({ ok: true, ...out });
});

export const getMyOrderOutstandingController = asyncHandler(
  async (req, res) => {
    const { orderId } = req.params || {};
    if (!orderId) throw new ApiError(400, "Missing orderId");

    const out = await dealerService.getMyOrderOutstanding({
      user: req.user,
      orderId,
    });
    res.status(200).json({ ok: true, ...out });
  },
);
