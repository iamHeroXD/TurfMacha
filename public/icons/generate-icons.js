// Run: node generate-icons.js
// This script generates PWA icons from the SVG source
// You can also use https://favicon.io or https://realfavicongenerator.net

// For production, replace these with proper PNG icons at these sizes:
// 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
// apple-touch-icon.png (180x180)

const SVG_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="128" fill="#0a0a1a"/>
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00d4aa"/>
      <stop offset="100%" style="stop-color:#00b4d8"/>
    </linearGradient>
  </defs>
  <circle cx="256" cy="220" r="80" fill="url(#g)"/>
  <path d="M256 300 L256 440" stroke="url(#g)" stroke-width="32" stroke-linecap="round"/>
  <circle cx="256" cy="220" r="40" fill="#0a0a1a"/>
</svg>`;

console.log("Place your PNG icons in this directory.");
console.log("Required sizes: 72, 96, 128, 144, 152, 192, 384, 512");
console.log("Use: https://www.pwabuilder.com/imageGenerator");
console.log("\nSVG source for your icon:");
console.log(SVG_ICON);
