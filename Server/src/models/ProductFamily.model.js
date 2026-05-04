import mongoose from "mongoose";

const ProductFamilyImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, required: true, trim: true },
    alt: { type: String, default: "", trim: true },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false },
);

const ProductFamilySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    category: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    copyrightText: {
      type: String,
      default: "",
      trim: true,
    },

    images: {
      type: [ProductFamilyImageSchema],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    meta: {
      source: { type: String, default: "" },
      notes: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

ProductFamilySchema.index({ category: 1, isActive: 1 });
ProductFamilySchema.index({ name: "text", code: "text", description: "text" });

export default mongoose.model("ProductFamily", ProductFamilySchema);
