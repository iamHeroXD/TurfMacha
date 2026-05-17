# TurfMacha — Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → New project
2. Name it **TurfMacha**, choose your region (e.g., ap-south-1 for India), set a strong DB password
3. Wait for provisioning (~1 min)

---

## 2. Run the Database Schema

1. In your Supabase dashboard → **SQL Editor**
2. Paste the entire contents of `supabase/schema.sql`
3. Click **Run**

The schema is **fully idempotent** — safe to re-run on an existing database. It will:
- Create all tables, indexes, triggers, and functions
- Enable RLS on all tables
- Drop and re-create policies (so re-running is safe)
- Set `search_path` on all functions to prevent SQL injection
- Revoke direct execution of `SECURITY DEFINER` functions from client roles

---

## 3. Configure Auth Settings

Go to **Authentication → Settings** in your Supabase dashboard:

### Email Auth
- **Enable email confirmations**: OFF (recommended for dev/MVP — users sign in immediately)
  - If you enable this, the signup page already handles the "check your email" state
- **Enable leaked password protection**: ON
- **Minimum password length**: 8

### Redirect URLs (Site URL)
Add these to **Authentication → URL Configuration**:

**Site URL:**
```
https://your-app.vercel.app
```

**Redirect URLs (allowed):**
```
https://your-app.vercel.app/**
http://localhost:3000/**
```

> Replace `your-app.vercel.app` with your actual Vercel domain.

---

## 4. Get Your API Keys

Go to **Project Settings → API**:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` / public key |

Add these to your `.env.local` file (and Vercel environment variables):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # From Project Settings → API → service_role (SECRET)
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

> **IMPORTANT:** `SUPABASE_SERVICE_ROLE_KEY` is required for the admin user deletion feature.
> It is server-only and is NEVER exposed to the browser. Add it to Vercel environment variables,
> mark it as **Production + Preview** only, NOT as a `NEXT_PUBLIC_` variable.

---

## 5. Add Seed Data (Optional)

After creating your first owner account, get your user UUID from:
- **Authentication → Users** → copy the UUID

Then in SQL Editor, uncomment and run the seed at the bottom of `schema.sql`,
replacing `'YOUR_OWNER_USER_ID'` with the actual UUID.

---

## 6. Security Checks

After running the schema, verify these in Supabase dashboard:

### Functions (Database → Functions)
- `handle_new_user` — should show SECURITY DEFINER, search_path = public
- `update_updated_at` — should show search_path = public
- `update_turf_rating` — should show search_path = public

### RLS Policies (Database → Policies)
Every table should show RLS = Enabled with appropriate policies:
- `users`: 3 policies (SELECT public, INSERT own, UPDATE own)
- `turfs`: 4 policies
- `bookings`: 3 policies
- `reviews`: 4 policies
- `favorites`: 1 policy (ALL)
- `owner_profiles`: 2 policies

---

## 7. Troubleshooting Auth Issues

### "Profile not found" on login
The `handle_new_user()` trigger may have failed for a legacy account.
The login page automatically attempts to recreate the profile from auth metadata.
If it still fails, delete the user from **Authentication → Users** and re-sign-up.

### "violates row-level security policy" on signup
Verify the INSERT policy on `public.users` exists. Re-run `schema.sql`.

### Email confirmation loop
If you have email confirmation enabled, make sure your **Site URL** and **Redirect URLs**
are correctly set in **Authentication → URL Configuration**.

### Deleting a broken user (for testing)
```sql
-- In SQL Editor — deletes auth user AND cascades to public.users
DELETE FROM auth.users WHERE email = 'test@example.com';
```

---

## 8. Admin Setup

### Promote an account to admin
Run this in SQL Editor (replace with your email):
```sql
UPDATE public.users SET role = 'admin' WHERE email = 'rohansija@gmail.com';
```

### Set up the `is_admin()` function
The Phase 3 security additions in `schema.sql` add a `is_admin()` SECURITY DEFINER function.
Re-run the full `schema.sql` after updating — it is idempotent and safe to re-run.

---

## 9. Google OAuth Branding (Fix "supabase.co" in consent screen)

The Google OAuth consent screen shows your Supabase project URL because that's where the
OAuth redirect happens. To show "TurfMacha" branding instead:

1. Go to [Google Cloud Console → APIs & Services → OAuth consent screen](https://console.cloud.google.com/apis/oauth-consent)
2. Set **App name**: `TurfMacha`
3. Set **App logo**: upload `logoofturfmacha.png`
4. Set **App homepage**: `https://your-vercel-domain.vercel.app`
5. Set **Privacy policy link**: `https://your-vercel-domain.vercel.app/privacy` (create this page)
6. Set **Support email**: your email
7. Under **Authorized domains**, add: `your-vercel-domain.vercel.app`
8. Save → If in "Testing" mode, add test users; for production, click **Publish App**

Then in Supabase:
- **Authentication → URL Configuration**
- **Site URL**: `https://your-vercel-domain.vercel.app`
- **Redirect URLs**: `https://your-vercel-domain.vercel.app/**`

---

## 10. Testing Auth Flow (Checklist)

- [ ] Sign up as **Player** → lands on `/dashboard/user`
- [ ] Sign up as **Turf Owner** → lands on `/dashboard/owner`
- [ ] Log out → lands on `/login`
- [ ] Log in again → profile loads correctly, role-based redirect works
- [ ] Visit `/dashboard` without auth → redirects to `/login`
- [ ] Already logged in → visiting `/login` redirects to dashboard
- [ ] Google Sign-in → consent screen shows "TurfMacha" (after Google Cloud Console config)
- [ ] Admin login → `/admin` shows dashboard, not "access required"
- [ ] Admin delete user → user cannot log back in
- [ ] Forgot password → check email → reset-password page → success
- [ ] Install PWA → login → restart app → auth persists
