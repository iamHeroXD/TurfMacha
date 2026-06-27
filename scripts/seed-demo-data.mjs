// ─────────────────────────────────────────────────────────────────────────────
// Seed demo content so the app looks alive: one demo owner + a handful of turfs
// in Trivandrum. Idempotent — turfs use fixed UUIDs, so re-running updates them
// in place instead of duplicating. Safe to delete later (all rows are owned by
// demo-owner@turfmacha.app).
//
//   npm run seed:demo
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
function loadEnv() {
  try {
    const file = readFileSync(resolve(__dirname, "..", ".env.local"), "utf8");
    for (const line of file.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {}
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey || url.includes("your-project")) {
  console.error("✖ Missing real Supabase credentials in .env.local.");
  process.exit(1);
}
const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const OWNER_EMAIL = "demo-owner@turfmacha.app";
const OWNER_PASSWORD = "tiktiktik";

async function findUserByEmail(email) {
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const u = data.users.find((x) => x.email?.toLowerCase() === email.toLowerCase());
    if (u) return u;
    if (data.users.length < 200) break;
  }
  return null;
}

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=1200`;

const TURFS = [
  {
    id: "11111111-1111-4111-8111-111111111101",
    name: "Greenfield Arena",
    description:
      "Premium FIFA-standard 5-a-side football turf with floodlights and pro-grade artificial grass. The most popular ground in the city for evening matches.",
    address: "Kowdiar, near Police Ground", city: "Trivandrum", state: "Kerala",
    latitude: 8.5167, longitude: 76.9558,
    sports: ["football", "cricket"], price_per_hour: 900,
    amenities: ["Floodlights", "Parking", "Changing Room", "Drinking Water", "Washroom"],
    images: [img("photo-1459865264687-595d652de67e"), img("photo-1551958219-acbc608c6377")],
    rating: 4.8, total_reviews: 124,
  },
  {
    id: "11111111-1111-4111-8111-111111111102",
    name: "SportZone Turf",
    description:
      "Multi-sport facility with dedicated football and cricket nets. Air-conditioned lounge and free parking. Great for tournaments and corporate games.",
    address: "Technopark Phase 1, Kazhakkoottam", city: "Trivandrum", state: "Kerala",
    latitude: 8.5571, longitude: 76.8797,
    sports: ["football", "cricket", "volleyball"], price_per_hour: 750,
    amenities: ["Parking", "Cafeteria", "First Aid", "Floodlights", "Seating"],
    images: [img("photo-1431324155629-1a6deb1dec8d"), img("photo-1556056504-5c7696c4c28d")],
    rating: 4.6, total_reviews: 89,
  },
  {
    id: "11111111-1111-4111-8111-111111111103",
    name: "Smash Badminton Court",
    description:
      "Six indoor wooden-floor badminton courts with anti-slip synthetic mats and tournament-grade lighting. Rackets available on rent.",
    address: "Pattom, opposite Saraswathy School", city: "Trivandrum", state: "Kerala",
    latitude: 8.5189, longitude: 76.9426,
    sports: ["badminton"], price_per_hour: 400,
    amenities: ["Indoor", "AC", "Equipment Rental", "Parking", "Washroom"],
    images: [img("photo-1626224583764-f87db24ac4ea"), img("photo-1521587760476-6c12a4b040da")],
    rating: 4.7, total_reviews: 156,
  },
  {
    id: "11111111-1111-4111-8111-111111111104",
    name: "Hoops Basketball Park",
    description:
      "Full-size outdoor basketball court with professional hoops and night lighting. Perfect for 3v3 and 5v5 pickup games.",
    address: "Vellayambalam, near Museum", city: "Trivandrum", state: "Kerala",
    latitude: 8.5095, longitude: 76.9573,
    sports: ["basketball"], price_per_hour: 500,
    amenities: ["Floodlights", "Parking", "Drinking Water", "Seating"],
    images: [img("photo-1546519638-68e109498ffc"), img("photo-1574623452334-1e0ac2b3ccb4")],
    rating: 4.5, total_reviews: 67,
  },
  {
    id: "11111111-1111-4111-8111-111111111105",
    name: "Ace Tennis Club",
    description:
      "Two synthetic hard tennis courts maintained to ITF standards. Coaching available on weekends. Quiet, well-lit and beginner friendly.",
    address: "Kuravankonam, Kowdiar", city: "Trivandrum", state: "Kerala",
    latitude: 8.5214, longitude: 76.9512,
    sports: ["tennis"], price_per_hour: 600,
    amenities: ["Floodlights", "Coaching", "Parking", "Equipment Rental", "Washroom"],
    images: [img("photo-1622279457486-62dcc4a431d6"), img("photo-1595435934249-5df7ed86e1c0")],
    rating: 4.4, total_reviews: 42,
  },
];

async function main() {
  console.log("→ Seeding demo owner + turfs");

  // 1) Demo owner
  let owner = await findUserByEmail(OWNER_EMAIL);
  if (owner) {
    await admin.auth.admin.updateUserById(owner.id, {
      password: OWNER_PASSWORD, email_confirm: true,
      user_metadata: { full_name: "Demo Owner", role: "owner" },
    });
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email: OWNER_EMAIL, password: OWNER_PASSWORD, email_confirm: true,
      user_metadata: { full_name: "Demo Owner", role: "owner" },
    });
    if (error) throw error;
    owner = data.user;
  }
  await admin.from("users").upsert(
    { id: owner.id, email: OWNER_EMAIL, full_name: "Demo Owner", role: "owner" },
    { onConflict: "id" }
  );
  console.log("  • Owner ready:", OWNER_EMAIL);

  // 2) Turfs
  const rows = TURFS.map((t) => ({
    ...t, owner_id: owner.id,
    operating_hours_start: "06:00", operating_hours_end: "23:00", is_active: true,
  }));
  const { error } = await admin.from("turfs").upsert(rows, { onConflict: "id" });
  if (error) throw error;
  console.log(`  • Upserted ${rows.length} turfs`);

  console.log("\n✓ Demo data ready. Owner login: " + OWNER_EMAIL + " / " + OWNER_PASSWORD);
}

main().catch((e) => { console.error("✖ Demo seed failed:", e.message ?? e); process.exit(1); });
