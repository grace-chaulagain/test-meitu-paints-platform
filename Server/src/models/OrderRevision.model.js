import mongoose from "mongoose";

/**
 * Enterprise-safe amendments:
 * - never "edit history"; instead create a revision version
 * - store a full snapshot for reliability
 */
const OrderRevisionSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    version: { type: Number, required: true },

    reason: { type: String, default: "" },
    requestedByDealer: { type: Boolean, default: false },

    snapshot: {
      items: { type: Array, default: [] },
      totals: { type: Object, default: {} },
      payment: { type: Object, default: {} },
      dealerNote: { type: String, default: "" },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

OrderRevisionSchema.index({ orderId: 1, version: -1 }, { unique: true });

export default mongoose.model("OrderRevision", OrderRevisionSchema);
