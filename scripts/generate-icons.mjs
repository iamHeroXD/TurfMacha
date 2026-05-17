#!/usr/bin/env node
/**
 * TurfMacha PWA Icon Generator
 * Uses public/logoofturfmacha.png as source for authentic brand icons.
 * Falls back to public/icons/icon.svg if PNG not present.
 * Run: node scripts/generate-icons.mjs
 * Requires: sharp (dev dependency)
 */

import { existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ICONS_DIR = join(ROOT, "public", "icons");
const PNG_SOURCE = join(ROOT, "public", "logoofturfmacha.png");
const SVG_SOURCE = join(ICONS_DIR, "icon.svg");

const SIZES = [192, 512];

async function main() {
  // Pick source: prefer the real brand PNG, fall back to SVG
  const source = existsSync(PNG_SOURCE) ? PNG_SOURCE : SVG_SOURCE;
  if (!existsSync(source)) {
    console.error("❌ No icon source found at:", source);
    process.exit(1);
  }
  console.log("📷 Icon source:", source);

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

  for (const size of SIZES) {
    const outPath = join(ICONS_DIR, `icon-${size}x${size}.png`);
    await sharp(source).resize(size, size, { fit: "contain", background: { r: 10, g: 10, b: 10, alpha: 1 } }).png().toFile(outPath);
    console.log(`✅ Generated ${size}x${size} → ${outPath}`);
  }

  console.log("🎉 PWA icons generated successfully.");
}

main().catch((err) => {
  console.error("❌ Icon generation failed:", err.message);
  process.exit(1);
});
