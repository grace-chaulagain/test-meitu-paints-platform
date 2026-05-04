import mongoose from "mongoose";

const PriceItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    price: { type: Number, required: true },
  },
  { _id: false },
);

const PriceListSchema = new mongoose.Schema(
  {
    tier: { type: String, required: true, trim: true }, // DEFAULT, DEALER_A...
    currency: { type: String, default: "NPR" },
    items: { type: [PriceItemSchema], default: [] },
    effectiveFrom: { type: Date, default: Date.now },
    effectiveTo: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

PriceListSchema.index({ tier: 1, isActive: 1, effectiveFrom: -1 });

export default mongoose.model("PriceList", PriceListSchema);
