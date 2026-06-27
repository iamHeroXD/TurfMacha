// ─────────────────────────────────────────────────────────────────────────────
// Seed / reset the TurfMacha test account.
//
//   Email:    heroxisreal@turfmacha.app
//   Password: tiktiktik
//
// Idempotent: run it as many times as you like. It creates the auth user (email
// pre-confirmed so you can log in immediately) and the matching public.users row,
// or resets the password if the account already exists.
//
// Requires a REAL Supabase project. Put these in .env.local first:
//   NEXT_PUBLIC_SUPABASE_URL=...
//   SUPABASE_SERVICE_ROLE_KEY=...      <-- service role key, server-side secret
//
// Run:  npm run seed:testuser
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Minimal .env.local loader (no extra dependency needed).
function loadEnv() {
  try {
    const file = readFileSync(resolve(__dirname, "..", ".env.local"), "utf8");
    for (const line of file.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    /* no .env.local — rely on real process env */
  }
}
loadEnv();

const TEST_EMAIL = "heroxisreal@turfmacha.app";
const TEST_PASSWORD = "tiktiktik";
const TEST_NAME = "Hero X";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || url.includes("your-project") || !serviceKey || serviceKey.includes("your-")) {
  console.error(
    "\n✖ Missing real Supabase credentials.\n" +
      "  Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local,\n" +
      "  then run again:  npm run seed:testuser\n"
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(email) {
  // Paginate through users (fine for small projects).
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const found = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (found) return found;
    if (data.users.length < 200) break;
  }
  return null;
}

async function main() {
  console.log(`\n→ Seeding test account: ${TEST_EMAIL}`);

  let authUser = await findUserByEmail(TEST_EMAIL);

  if (authUser) {
    console.log("  • Auth user exists — resetting password & confirming email.");
    const { error } = await admin.auth.admin.updateUserById(authUser.id, {
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: TEST_NAME, role: "user" },
    });
    if (error) throw error;
  } else {
    console.log("  • Creating auth user (email pre-confirmed).");
    const { data, error } = await admin.auth.admin.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: TEST_NAME, role: "user" },
    });
    if (error) throw error;
    authUser = data.user;
  }

  console.log("  • Upserting public.users profile row.");
  const { error: profileErr } = await admin.from("users").upsert(
    {
      id: authUser.id,
      email: TEST_EMAIL,
      full_name: TEST_NAME,
      role: "user",
    },
    { onConflict: "id" }
  );
  if (profileErr) throw profileErr;

  console.log("\n✓ Done. You can now log in with:");
  console.log(`    Email:    ${TEST_EMAIL}`);
  console.log(`    Password: ${TEST_PASSWORD}\n`);
}

main().catch((err) => {
  console.error("\n✖ Seeding failed:", err.message ?? err);
  process.exit(1);
});
