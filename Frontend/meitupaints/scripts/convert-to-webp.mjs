// scripts/convert-to-webp.mjs
import fs from "node:fs";
import path from "node:path";
import { globSync } from "glob";
import sharp from "sharp";

const INPUT_DIR = "public";
const OUTPUT_DIR = "public/optimized";

// target widths (includes 2400 + 3200 for wide carousel/hero images)
const SIZES = [320, 640, 1024, 1600, 2400, 3200];

// file types to convert
const exts = ["jpg", "jpeg", "png"];

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function outPath(file, w) {
  const rel = path.relative(INPUT_DIR, file); // keep folder structure
  const dir = path.join(OUTPUT_DIR, path.dirname(rel));
  ensureDir(dir);

  const base = path.basename(rel).replace(/\.(png|jpe?g)$/i, "");
  return path.join(dir, `${base}-${w}w.webp`);
}

// Only include sizes <= original width (no upscaling)
// If the image is smaller than the smallest size, we still generate ONE webp at its original width.
function sizesForWidth(maxW) {
  const allowed = SIZES.filter((w) => w <= maxW);
  if (allowed.length) return allowed;
  // If image is tiny, still produce a single output matching its real width
  return [maxW];
}

// Optional: slightly lower quality for huge outputs (keeps file sizes sane)
function qualityFor(w) {
  if (w >= 3200) return 66;
  if (w >= 2400) return 68;
  if (w >= 1600) return 70;
  return 72;
}

// Find all images except anything already in /optimized
const files = globSync(`${INPUT_DIR}/**/*.+(${exts.join("|")})`, {
  nodir: true,
  ignore: ["**/optimized/**"],
});

console.log(`Found ${files.length} images`);

let converted = 0;
let skipped = 0;

for (const file of files) {
  try {
    const img = sharp(file, { failOn: "none" });
    const meta = await img.metadata();

    const maxW = Number(meta.width) || 0;
    if (!maxW) {
      console.warn(`Skip (no width): ${file}`);
      skipped++;
      continue;
    }

    const widths = sizesForWidth(maxW);

    for (const w of widths) {
      const out = outPath(file, w);

      // Skip if already exists (saves time on reruns)
      if (fs.existsSync(out)) {
        continue;
      }

      await sharp(file, { failOn: "none" })
        .resize({ width: w, withoutEnlargement: true })
        .webp({
          quality: qualityFor(w),
          effort: 5, // good speed/quality balance
        })
        .toFile(out);

      converted++;
    }
  } catch (err) {
    console.warn(`Failed: ${file}\n${err?.message || err}`);
    skipped++;
  }
}

console.log(`Done. WebP output → ${OUTPUT_DIR}`);
console.log(`Converted: ${converted} files  |  Skipped/Failed: ${skipped}`);
