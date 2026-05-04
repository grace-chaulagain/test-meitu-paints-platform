import { Router } from "express";
import { upload } from "../middlewares/upload.js";
import { auth } from "../middlewares/auth.middleware.js";
import { publicReadRateLimit } from "../middlewares/rateLimit.middleware.js";
import { requireRole } from "../middlewares/requireRole.middleware.js";
import {
  listProductFamilies,
  createProductFamily,
  uploadProductFamilyImage,
  updateProductFamily,
} from "../controllers/productFamily.controller.js";

const router = Router();

router.get("/", publicReadRateLimit, listProductFamilies);
router.post("/", auth, requireRole("ADMIN"), createProductFamily);
router.patch("/:familyId", auth, requireRole("ADMIN"), updateProductFamily);
router.post(
  "/:familyId/image",
  auth,
  requireRole("ADMIN"),
  upload.single("image"),
  uploadProductFamilyImage,
);

export default router;
