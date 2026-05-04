import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true, trim: true },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    orderVersion: { type: Number, required: true },

    dealerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DealerProfile",
      required: true,
    },
    dispatcherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dispatcher",
      default: null,
    },

    fileUrl: { type: String, default: "" }, // PDF in S3/R2
    issuedAt: { type: Date, default: Date.now },

    totalsSnapshot: { type: Object, default: {} },

    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

InvoiceSchema.index({ orderId: 1, orderVersion: -1 });
InvoiceSchema.index({ dealerId: 1, issuedAt: -1 });

export default mongoose.model("Invoice", InvoiceSchema);
