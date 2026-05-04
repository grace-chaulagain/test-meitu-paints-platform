import express from "express";
import { updateMe, changePassword } from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import {
  changePasswordBodySchema,
  updateMeBodySchema,
} from "../validations/user.validation.js";

const router = express.Router();

router.patch("/me", auth, validateBody(updateMeBodySchema), updateMe);
router.post(
  "/change-password",
  auth,
  validateBody(changePasswordBodySchema),
  changePassword,
);

export default router;
