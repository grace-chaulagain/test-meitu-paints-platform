import mongoose from "mongoose";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "../constants/statuses.js";

const PaymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    dealerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DealerProfile",
      required: true,
    },

    method: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
      required: true,
    },

    amount: { type: Number, default: 0 },
    currency: { type: String, default: "NPR" },

    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING_VERIFICATION,
    },

    proof: {
      fileUrl: { type: String, default: "" },
      note: { type: String, default: "" },
      uploadedAt: { type: Date, default: Date.now },
    },

    meta: {
      txnId: { type: String, default: "" },
      bankName: { type: String, default: "" },
      chequeNo: { type: String, default: "" },
      bgNo: { type: String, default: "" },
      receivedDate: { type: Date, default: null },
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    verifiedAt: { type: Date, default: null },
    verificationNote: { type: String, default: "" },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

PaymentSchema.index({ orderId: 1, createdAt: -1 });
PaymentSchema.index({ dealerId: 1, createdAt: -1 });
PaymentSchema.index({ status: 1, method: 1, createdAt: -1 });

export default mongoose.model("Payment", PaymentSchema);
