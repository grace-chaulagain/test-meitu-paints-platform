import mongoose from "mongoose";

const FactorySettingsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Meitu Factory",
      trim: true,
    },

    primaryEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    ccEmails: {
      type: [String],
      default: [],
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    notificationsEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

FactorySettingsSchema.pre("save", function normalizeFactorySettings() {
  if (typeof this.name === "string") {
    this.name = this.name.trim();
  }

  if (typeof this.primaryEmail === "string") {
    this.primaryEmail = this.primaryEmail.trim().toLowerCase();
  }

  if (Array.isArray(this.ccEmails)) {
    this.ccEmails = this.ccEmails
      .map((email) =>
        String(email || "")
          .trim()
          .toLowerCase(),
      )
      .filter(Boolean);
  }

  if (typeof this.phone === "string") {
    this.phone = this.phone.trim();
  }

  if (typeof this.address === "string") {
    this.address = this.address.trim();
  }
});

export default mongoose.model("FactorySettings", FactorySettingsSchema);
