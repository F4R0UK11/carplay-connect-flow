import { cp, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");
const themeAssetsDir = path.resolve("assets");

async function ensureDirExists(dir) {
  await mkdir(dir, { recursive: true });
}

async function copyAssets() {
  try {
    const info = await stat(distDir);
    if (!info.isDirectory()) {
      throw new Error("dist is not a directory");
    }
  } catch (error) {
    throw new Error("Run `npm run build` before syncing theme assets so dist exists.");
  }

  await ensureDirExists(themeAssetsDir);
  const entries = await readdir(distDir, { withFileTypes: true });

  if (entries.length === 0) {
    throw new Error("No compiled assets found under dist");
  }

  const themeAssetPattern = /^theme-.*\.(js|css|json|jpg|png|svg|webp)$/;

  const copies = entries
    .filter((entry) => entry.isFile() && themeAssetPattern.test(entry.name))
    .map(async (entry) => {
      const source = path.join(distDir, entry.name);
      const destination = path.join(themeAssetsDir, entry.name);
      await cp(source, destination);
    });

  if (copies.length === 0) {
    throw new Error("No theme-* assets found to copy. Check your Vite build output.");
  }

  await Promise.all(copies);
}

await copyAssets();
