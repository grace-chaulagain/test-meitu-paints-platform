import { v2 as cloudinary } from "cloudinary";
import { CLOUD_NAME, API_KEY, API_SECRET } from "../config/env.js";

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.warn(
    "[cloudinary] Cloudinary credentials are incomplete. Image uploads will fail until configured.",
  );
}

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

export default cloudinary;
