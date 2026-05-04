import mongoose from "mongoose";
import { ROLES } from "../constants/roles.js";

export const USER_ACCOUNT_STATUS = Object.freeze({
  PENDING_PASSWORD_SETUP: "PENDING_PASSWORD_SETUP",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
});

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    passwordHash: {
      type: String,
      default: null,
      select: false,
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
    },

    // Linked entities (only one is used depending on role)
    dealerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DealerProfile",
      default: null,
    },

    dispatcherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dispatcher",
      default: null,
    },

    // Account state
    isActive: {
      type: Boolean,
      default: true,
    },

    accountStatus: {
      type: String,
      enum: Object.values(USER_ACCOUNT_STATUS),
      default: USER_ACCOUNT_STATUS.ACTIVE,
      index: true,
    },

    passwordSetAt: {
      type: Date,
      default: null,
    },

    invitationLastSentAt: {
      type: Date,
      default: null,
    },

    invitationExpiresAt: {
      type: Date,
      default: null,
    },

    refreshTokenHash: {
      type: String,
      default: null,
      select: false,
      index: true,
    },
    refreshTokenExpiresAt: { type: Date, default: null },
    previousRefreshTokenHash: {
      type: String,
      default: null,
      select: false,
      index: true,
    },
    previousRefreshTokenValidUntil: { type: Date, default: null },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Helpful indexes
UserSchema.index({ role: 1 });
UserSchema.index({ role: 1, accountStatus: 1 });
UserSchema.index({ dealerId: 1 });
UserSchema.index({ dispatcherId: 1 });

export default mongoose.model("User", UserSchema);
