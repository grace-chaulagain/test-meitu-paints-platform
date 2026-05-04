import mongoose from "mongoose";
import { DEALER_APPLICATION_STATUS } from "../constants/statuses.js";

/**
 * DealerApplication = what a dealer submits before being verified.
 * After verification, you create:
 * - DealerProfile
 * - User (role: DEALER)
 */
const DealerApplicationSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    address: { type: String, default: "" },
    panVat: { type: String, default: "" },
    notes: { type: String, default: "" },

    status: {
      type: String,
      enum: Object.values(DEALER_APPLICATION_STATUS),
      default: DEALER_APPLICATION_STATUS.PENDING,
      index: true,
    },

    // Admin review metadata
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: { type: Date, default: null },
    reviewNote: { type: String, default: "" },

    deletion: {
      pending: { type: Boolean, default: false, index: true },
      requestedAt: { type: Date, default: null },
      deleteAfter: { type: Date, default: null, index: true },
      requestedByUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      reason: { type: String, default: "", trim: true },
    },
  },
  { timestamps: true },
);

DealerApplicationSchema.index({ status: 1, createdAt: -1 });
DealerApplicationSchema.index({
  "deletion.pending": 1,
  "deletion.deleteAfter": 1,
});

export default mongoose.model("DealerApplication", DealerApplicationSchema);
