import { z } from "zod";
import { optionalTrimmedString, phoneSchema } from "./common.validation.js";

export const updateMeBodySchema = z
  .object({
    username: optionalTrimmedString(120),
    contactName: optionalTrimmedString(120),
    phone: phoneSchema.optional(),
    address: optionalTrimmedString(200),
  })
  .strict();

export const changePasswordBodySchema = z
  .object({
    currentPassword: z.string().min(1).max(256),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(128, "New password is too long"),
  })
  .strict();
