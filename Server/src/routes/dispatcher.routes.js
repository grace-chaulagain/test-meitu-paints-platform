import { Router } from "express";
import {
  createDispatcherApplicationController,
  listDispatchersController,
  listPendingDispatchersController,
  getDispatcherByIdController,
  approveDispatcherController,
  rejectDispatcherController,
  listVerifiedDispatchersController,
  deleteDispatcherController,
  getMyDispatcherProfileController,
  listMyAssignedDealersController,
  listMyOrdersController,
  getMyOrderByIdController,
  verifyAssignedOrderController,
  rejectAssignedOrderController,
  amendAssignedOrderController,
  listMyOrderArchiveController,
} from "../controllers/dispatcher.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { applicationRateLimit } from "../middlewares/rateLimit.middleware.js";
import { requireRole } from "../middlewares/requireRole.middleware.js";
import { validateBody, validateParams } from "../middlewares/validate.middleware.js";
import { dispatcherApplicationBodySchema } from "../validations/application.validation.js";
import { orderIdParamsSchema } from "../validations/common.validation.js";
import {
  amendOrderBodySchema,
  orderReviewBodySchema,
} from "../validations/order.validation.js";

const router = Router();

/* ---------------------------------------
   Public Dispatcher Application
---------------------------------------- */

router.post(
  "/apply",
  applicationRateLimit,
  validateBody(dispatcherApplicationBodySchema),
  createDispatcherApplicationController,
);

/* ---------------------------------------
   Dispatcher Self Workspace
---------------------------------------- */

router.get(
  "/me",
  auth,
  requireRole("DISPATCHER"),
  getMyDispatcherProfileController,
);

router.get(
  "/me/dealers",
  auth,
  requireRole("DISPATCHER"),
  listMyAssignedDealersController,
);

router.get(
  "/me/orders",
  auth,
  requireRole("DISPATCHER"),
  listMyOrdersController,
);

router.get(
  "/me/orders/archive",
  auth,
  requireRole("DISPATCHER"),
  listMyOrderArchiveController,
);

router.get(
  "/me/orders/:orderId",
  auth,
  requireRole("DISPATCHER"),
  validateParams(orderIdParamsSchema),
  getMyOrderByIdController,
);

router.patch(
  "/me/orders/:orderId/verify",
  auth,
  requireRole("DISPATCHER"),
  validateParams(orderIdParamsSchema),
  validateBody(orderReviewBodySchema),
  verifyAssignedOrderController,
);

router.patch(
  "/me/orders/:orderId/reject",
  auth,
  requireRole("DISPATCHER"),
  validateParams(orderIdParamsSchema),
  validateBody(orderReviewBodySchema),
  rejectAssignedOrderController,
);

router.patch(
  "/me/orders/:orderId/amend",
  auth,
  requireRole("DISPATCHER"),
  validateParams(orderIdParamsSchema),
  validateBody(amendOrderBodySchema),
  amendAssignedOrderController,
);

/* ---------------------------------------
   Admin Dispatcher Management
---------------------------------------- */

router.get("/", auth, requireRole("ADMIN"), listDispatchersController);

router.get(
  "/pending",
  auth,
  requireRole("ADMIN"),
  listPendingDispatchersController,
);

router.get(
  "/verified",
  auth,
  requireRole("ADMIN"),
  listVerifiedDispatchersController,
);

router.get(
  "/:dispatcherId",
  auth,
  requireRole("ADMIN"),
  getDispatcherByIdController,
);

router.patch(
  "/:dispatcherId/approve",
  auth,
  requireRole("ADMIN"),
  approveDispatcherController,
);

router.patch(
  "/:dispatcherId/reject",
  auth,
  requireRole("ADMIN"),
  rejectDispatcherController,
);

router.delete(
  "/:dispatcherId",
  auth,
  requireRole("ADMIN"),
  deleteDispatcherController,
);

export default router;
