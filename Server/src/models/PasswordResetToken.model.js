import mongoose from "mongoose";

export const PASSWORD_TOKEN_PURPOSE = Object.freeze({
  SETUP_PASSWORD: "SETUP_PASSWORD",
  RESET_PASSWORD: "RESET_PASSWORD",
});

/**
 * Stores ONE-TIME password setup/reset tokens.
 * We store only a hash of the token (never the raw token).
 * TTL index auto-deletes expired docs.
 */
const PasswordResetTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    email: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
      index: true,
    },

    role: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
      index: true,
    },

    purpose: {
      type: String,
      enum: Object.values(PASSWORD_TOKEN_PURPOSE),
      default: PASSWORD_TOKEN_PURPOSE.RESET_PASSWORD,
      index: true,
    },

    // sha256(token) base64
    tokenHash: {
      type: String,
      required: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    usedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// prevent duplicates for same token
PasswordResetTokenSchema.index({ userId: 1, tokenHash: 1 }, { unique: true });
PasswordResetTokenSchema.index({ userId: 1, purpose: 1, usedAt: 1 });
PasswordResetTokenSchema.index({ tokenHash: 1, purpose: 1, usedAt: 1 });

// Auto-delete expired reset tokens
PasswordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("PasswordResetToken", PasswordResetTokenSchema);
