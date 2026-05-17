#!/usr/bin/env node
/**
 * TurfMacha PWA Icon Generator
 * Reads public/icons/icon.svg and generates PNG icons required by manifest.json.
 * Run: node scripts/generate-icons.mjs
 * Requires: sharp (dev dependency)
 */

import { readFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ICONS_DIR = join(ROOT, "public", "icons");
const SVG_PATH = join(ICONS_DIR, "icon.svg");

const SIZES = [192, 512];

async function main() {
  if (!existsSync(SVG_PATH)) {
    console.error("❌ SVG not found:", SVG_PATH);
    process.exit(1);
  }

  // Dynamically import sharp so the script fails gracefully if not installed
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.warn(
      "⚠️  sharp not installed — skipping icon generation.\n" +
        "   Run: npm install --save-dev sharp\n" +
        "   Then: npm run generate-icons"
    );
    return;
  }

  if (!existsSync(ICONS_DIR)) {
    mkdirSync(ICONS_DIR, { recursive: true });
  }

  const svgBuffer = readFileSync(SVG_PATH);

  for (const size of SIZES) {
    const outPath = join(ICONS_DIR, `icon-${size}x${size}.png`);
    await sharp(svgBuffer).resize(size, size).png().toFile(outPath);
    console.log(`✅ Generated ${size}x${size} → ${outPath}`);
  }

  console.log("🎉 PWA icons generated successfully.");
}

main().catch((err) => {
  console.error("❌ Icon generation failed:", err.message);
  process.exit(1);
});
