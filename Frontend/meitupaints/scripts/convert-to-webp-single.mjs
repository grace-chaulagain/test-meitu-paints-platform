// convert-living-only.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUTPUT_DIR = "public/optimized-single-webp";

const WEBP_QUALITY = 80;
const WEBP_EFFORT = 5;

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

const src = "../public/kitchen.png";
const out = path.join(OUTPUT_DIR, "bedroom.webp");

(async () => {
  try {
    if (!fs.existsSync(src)) {
      console.error(`File not found: ${src}`);
      process.exit(1);
    }

    ensureDir(OUTPUT_DIR);

    // Skip if already exists
    if (fs.existsSync(out)) {
      console.log(`Already exists, skipped: ${out}`);
      process.exit(0);
    }

    // Read input metadata
    const inputMeta = await sharp(src, { failOn: "none" }).metadata();
    if (!inputMeta?.width || !inputMeta?.height) {
      console.error(`Not a valid image (no dims): ${src}`);
      process.exit(1);
    }

    // Convert (NO RESIZE => same resolution)
    await sharp(src, { failOn: "none" })
      .rotate() // fixes EXIF orientation without changing pixel dimensions
      .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
      .toFile(out);

    // Verify output metadata
    const outputMeta = await sharp(out, { failOn: "none" }).metadata();

    const same =
      inputMeta.width === outputMeta.width &&
      inputMeta.height === outputMeta.height;

    console.log("Done.");
    console.log(`Input:  ${src}  (${inputMeta.width}x${inputMeta.height})`);
    console.log(`Output: ${out}  (${outputMeta.width}x${outputMeta.height})`);
    console.log(`Same resolution: ${same ? "✅ YES" : "❌ NO"}`);

    if (!same) process.exit(2);
  } catch (err) {
    console.error(`Failed: ${src}\n${err?.message || err}`);
    process.exit(1);
  }
})();
