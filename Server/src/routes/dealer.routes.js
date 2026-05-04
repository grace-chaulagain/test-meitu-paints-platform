import { Router } from "express";

import {
  getMyProfileController,
  updateMyProfileController,
  listMyOrdersController,
  getMyOrderStatementsReportController,
  getMyOrderController,
  createOrderController,
  submitPaymentController,
  listMyPaymentsController,
  getMyOrderOutstandingController,
} from "../controllers/dealer.controller.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middlewares/validate.middleware.js";
import { orderIdParamsSchema, paginationQuerySchema } from "../validations/common.validation.js";
import {
  createOrderBodySchema,
  dealerPaymentBodySchema,
} from "../validations/order.validation.js";
import { updateMeBodySchema } from "../validations/user.validation.js";

const router = Router();

// Protected
router.get("/me", getMyProfileController);
router.patch("/me", validateBody(updateMeBodySchema), updateMyProfileController);

router.get("/reports/order-statements", getMyOrderStatementsReportController);

router.get("/orders", validateQuery(paginationQuerySchema), listMyOrdersController);
router.post("/orders", validateBody(createOrderBodySchema), createOrderController);
router.get(
  "/orders/:orderId",
  validateParams(orderIdParamsSchema),
  getMyOrderController,
);

router.get(
  "/orders/:orderId/outstanding",
  validateParams(orderIdParamsSchema),
  getMyOrderOutstandingController,
);
router.post(
  "/orders/:orderId/payments",
  validateParams(orderIdParamsSchema),
  validateBody(dealerPaymentBodySchema),
  submitPaymentController,
);

router.get("/payments", listMyPaymentsController);

export default router;
