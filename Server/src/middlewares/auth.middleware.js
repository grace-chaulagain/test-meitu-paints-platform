import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../utils/tokens.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User, { USER_ACCOUNT_STATUS } from "../models/User.model.js";

export const auth = asyncHandler(async (req, _, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication required", {
      code: "AUTH_REQUIRED",
    });
  }

  const token = header.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Authentication required", {
      code: "AUTH_REQUIRED",
    });
  }

  try {
    const decoded = verifyAccessToken(token);
    const userId = decoded?.sub;

    if (!userId || !mongoose.Types.ObjectId.isValid(String(userId))) {
      throw new ApiError(401, "Invalid token", { code: "INVALID_TOKEN" });
    }

    const user = await User.findById(userId).select(
      "_id role dealerId dispatcherId isActive accountStatus",
    );

    if (
      !user ||
      !user.isActive ||
      user.accountStatus === USER_ACCOUNT_STATUS.SUSPENDED
    ) {
      throw new ApiError(403, "Account disabled", {
        code: "ACCOUNT_DISABLED",
      });
    }

    if (String(user.role || "") !== String(decoded.role || "")) {
      throw new ApiError(401, "Invalid token", { code: "INVALID_TOKEN" });
    }

    req.user = {
      ...decoded,
      id: user._id.toString(),
      sub: user._id.toString(),
      role: user.role,
      dealerId: user.dealerId || null,
      dispatcherId: user.dispatcherId || null,
      accountStatus: user.accountStatus,
    };
    next();
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, "Access token expired", {
        code: "ACCESS_TOKEN_EXPIRED",
      });
    }

    throw new ApiError(401, "Invalid access token", {
      code: "INVALID_TOKEN",
    });
  }
});

export const requireRoles = (...roles) =>
  asyncHandler(async (req, _, next) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required", {
        code: "AUTH_REQUIRED",
      });
    }

    const userRole = String(req.user.role || "").toUpperCase();
    const allowedRoles = roles.map((role) => String(role).toUpperCase());

    if (!allowedRoles.includes(userRole)) {
      throw new ApiError(403, "Forbidden");
    }

    next();
  });
