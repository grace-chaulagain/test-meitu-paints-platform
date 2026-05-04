import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const stagingDir = path.join(rootDir, "hostinger-package-staging");
const outputDir = path.join(rootDir, "dist-packages");
const zipPath = path.join(outputDir, "meitu-hostinger-production.zip");
const frontendDistDir = path.join(rootDir, "Frontend", "meitupaints", "dist");

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function copyPath(source, target) {
  await fs.cp(source, target, {
    recursive: true,
    filter: (entry) => {
      const base = path.basename(entry);
      return (
        base !== "node_modules" &&
        base !== ".git" &&
        base !== ".DS_Store" &&
        base !== ".env" &&
        !(base.startsWith(".env.") && base !== ".env.example")
      );
    },
  });
}

async function assertFile(filePath, message) {
  try {
    await fs.access(filePath);
  } catch {
    throw new Error(message);
  }
}

async function main() {
  await assertFile(
    path.join(frontendDistDir, "index.html"),
    "Frontend dist build not found. Run `npm --prefix Frontend/meitupaints run build` first.",
  );

  await fs.rm(stagingDir, { recursive: true, force: true });
  await fs.rm(zipPath, { force: true });
  await fs.mkdir(stagingDir, { recursive: true });
  await fs.mkdir(outputDir, { recursive: true });

  await copyPath(path.join(rootDir, "server.js"), path.join(stagingDir, "server.js"));
  await copyPath(path.join(rootDir, "Server", "src"), path.join(stagingDir, "Server", "src"));
  await copyPath(
    path.join(rootDir, "Server", ".env.example"),
    path.join(stagingDir, "Server", ".env.example"),
  );
  await copyPath(
    path.join(rootDir, "Server", "package.json"),
    path.join(stagingDir, "Server", "package.json"),
  );
  await copyPath(
    path.join(rootDir, "Server", "package-lock.json"),
    path.join(stagingDir, "Server", "package-lock.json"),
  );
  await copyPath(
    frontendDistDir,
    path.join(stagingDir, "Frontend", "meitupaints", "dist"),
  );
  await copyPath(
    path.join(rootDir, "HOSTINGER_DEPLOYMENT.md"),
    path.join(stagingDir, "HOSTINGER_DEPLOYMENT.md"),
  );

  const rootPackage = await readJson(path.join(rootDir, "package.json"));
  const serverPackage = await readJson(path.join(rootDir, "Server", "package.json"));

  const runtimePackage = {
    name: serverPackage.name,
    version: serverPackage.version,
    private: true,
    type: "module",
    main: "server.js",
    engines: rootPackage.engines,
    scripts: {
      start: "node server.js",
      "check:syntax":
        "node --check server.js && node --check Server/src/server.js && node --check Server/src/app.js",
    },
    dependencies: serverPackage.dependencies,
    devDependencies: serverPackage.devDependencies,
  };

  await fs.writeFile(
    path.join(stagingDir, "package.json"),
    `${JSON.stringify(runtimePackage, null, 2)}\n`,
  );
  await copyPath(
    path.join(rootDir, "Server", "package-lock.json"),
    path.join(stagingDir, "package-lock.json"),
  );

  const zip = spawnSync("zip", ["-r", "-q", zipPath, "."], {
    cwd: stagingDir,
    stdio: "inherit",
  });

  if (zip.error) throw zip.error;
  if (zip.status !== 0) {
    throw new Error(`zip command failed with exit code ${zip.status}`);
  }

  console.log(`Created ${zipPath}`);
}

main().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});
