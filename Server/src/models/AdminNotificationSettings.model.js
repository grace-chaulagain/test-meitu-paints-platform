import mongoose from "mongoose";

const AdminNotificationSettingsSchema = new mongoose.Schema(
  {
    adminEmail: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },

    notificationsEnabled: {
      type: Boolean,
      default: true,
    },

    dealerApplicationNotificationsEnabled: {
      type: Boolean,
      default: true,
    },

    dispatcherApplicationNotificationsEnabled: {
      type: Boolean,
      default: true,
    },

    factoryOrderNotificationsEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

AdminNotificationSettingsSchema.pre("save", function normalizeSettings() {
  if (typeof this.adminEmail === "string") {
    this.adminEmail = this.adminEmail.trim().toLowerCase();
  }
});

export default mongoose.model(
  "AdminNotificationSettings",
  AdminNotificationSettingsSchema,
);
