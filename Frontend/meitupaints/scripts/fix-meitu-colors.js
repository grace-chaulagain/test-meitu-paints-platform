// fix-meitu-colors.js
// Run: node fix-meitu-colors.js
// (Place this script anywhere, then update INPUT_JSON path below.)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Update this path to your actual file location:
const INPUT_JSON = path.resolve(
  __dirname,
  "../src/ProductsList/meitu-colors.json"
);

// Choose output behavior:
// - overwrite input: true
// - or write to a new file: false (writes meitu-colors.cleaned.json next to input)
const OVERWRITE = true;

function typeFromId(id) {
  const last = String(id ?? "")
    .trim()
    .slice(-1)
    .toUpperCase();
  if (last === "P") return "Light";
  if (last === "T") return "Neutral";
  if (last === "C" || last === "D") return "Dark";
  return null; // unknown suffix
}

function main() {
  const raw = fs.readFileSync(INPUT_JSON, "utf8");
  const data = JSON.parse(raw);

  if (!Array.isArray(data)) {
    throw new Error("Expected the JSON root to be an array of color objects.");
  }

  let changed = 0;
  let unknown = 0;

  const cleaned = data.map((item) => {
    const obj = { ...item };

    // Remove category for all objects
    if ("category" in obj) delete obj.category;

    // Update type based on id suffix
    const computedType = typeFromId(obj.id);
    if (!computedType) {
      unknown += 1;
      return obj; // leave type as-is if id suffix is unexpected
    }

    if (obj.type !== computedType) {
      obj.type = computedType;
      changed += 1;
    }

    return obj;
  });

  const outPath = OVERWRITE
    ? INPUT_JSON
    : path.join(path.dirname(INPUT_JSON), "meitu-colors.cleaned.json");

  fs.writeFileSync(outPath, JSON.stringify(cleaned, null, 2) + "\n", "utf8");

  console.log("✅ Done.");
  console.log(`Input:  ${INPUT_JSON}`);
  console.log(`Output: ${outPath}`);
  console.log(`Type updated on: ${changed} objects`);
  console.log(`Unknown id suffix: ${unknown} objects (left unchanged)`);
}

main();
