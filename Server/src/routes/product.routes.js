import { Router } from "express";
import { listProductsController } from "../controllers/product.controller.js";
import { upload } from "../middlewares/upload.js";
import { uploadProductImage } from "../controllers/product.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { publicReadRateLimit } from "../middlewares/rateLimit.middleware.js";
import { requireRole } from "../middlewares/requireRole.middleware.js";

const router = Router();

router.get("/", publicReadRateLimit, listProductsController);

router.post(
  "/:productId/image",
  auth,
  requireRole("ADMIN"),
  upload.single("image"),
  uploadProductImage,
);

export default router;
