import User from "../models/User.model.js";
import DealerProfile from "../models/DealerProfile.model.js";
import bcrypt from "bcrypt";

export const updateCurrentUserProfile = async (userId, role, payload = {}) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const safePayload = payload && typeof payload === "object" ? payload : {};
  const normalizedRole = String(role || "").toUpperCase();

  let updatedUser = user;
  let updatedDealerProfile = null;

  if (normalizedRole === "DEALER") {
    const allowedFields = ["contactName", "phone", "address"];

    const dealer = await DealerProfile.findById(user.dealerId);
    if (!dealer) throw new Error("Dealer profile not found");

    allowedFields.forEach((field) => {
      if (safePayload[field] !== undefined) {
        dealer[field] = safePayload[field];
      }
    });

    await dealer.save();
    updatedDealerProfile = dealer;
  }

  if (normalizedRole === "ADMIN") {
    const allowedFields = ["username", "phone"];

    allowedFields.forEach((field) => {
      if (safePayload[field] !== undefined) {
        updatedUser[field] = safePayload[field];
      }
    });

    await updatedUser.save();
  }

  return {
    user: updatedUser,
    dealerProfile: updatedDealerProfile,
  };
};

export const changeCurrentUserPassword = async (
  userId,
  currentPassword,
  newPassword,
) => {
  if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
    throw new Error("Invalid password input");
  }

  const trimmedCurrentPassword = currentPassword.trim();
  const trimmedNewPassword = newPassword.trim();

  if (!trimmedCurrentPassword || !trimmedNewPassword) {
    throw new Error("Both passwords are required");
  }

  const user = await User.findById(userId).select("+passwordHash");
  if (!user) throw new Error("User not found");

  if (!user.passwordHash || typeof user.passwordHash !== "string") {
    throw new Error("Stored password not available for verification");
  }

  const isMatch = await bcrypt.compare(
    trimmedCurrentPassword,
    user.passwordHash,
  );

  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  const hashed = await bcrypt.hash(trimmedNewPassword, 10);
  user.passwordHash = hashed;
  user.passwordSetAt = new Date();

  await user.save();

  return true;
};
