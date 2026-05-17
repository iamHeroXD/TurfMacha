# TurfMacha — Complete Setup & Deployment Guide

## Quick Start

```bash
npm install
npm run generate-icons   # Generate PWA icon PNGs
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 1. Supabase Setup

### Create Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose a strong database password
3. Select a region close to your users (e.g. ap-south-1 for India)

### Get API Keys
1. Go to **Project Settings → API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Run Database Schema
1. Go to **SQL Editor** in your Supabase dashboard
2. Paste the entire contents of `supabase/schema.sql`
3. Click **Run**

This creates all tables, RLS policies, triggers, and indexes automatically.

> **Note on PostGIS:** The schema has PostGIS commented out. Only enable it if your Supabase plan supports it.

### Configure Auth
1. Go to **Authentication → URL Configuration**
2. Set **Site URL** to your domain (or `http://localhost:3000` for dev)
3. Add allowed redirect URLs:
   - `http://localhost:3000/**`
   - `https://your-app.vercel.app/**`

---

## 2. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 3. PWA Icons Setup

Icons are generated automatically during build via `scripts/generate-icons.mjs`.

To generate manually:

```bash
npm run generate-icons
```

This reads `public/icons/icon.svg` and outputs:
- `public/icons/icon-192x192.png`
- `public/icons/icon-512x512.png`

Requires: `npm install` (includes `sharp` as a dev dependency).

---

## 4. Deploy to Vercel

### Via GitHub (Recommended)
1. Push to GitHub: `git push origin main`
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Connect your GitHub repo: `iamHeroXD/TurfMacha`
4. Add Environment Variables (same as `.env.local`)
5. Click Deploy

### Environment Variables on Vercel
In Vercel Dashboard → Project → Settings → Environment Variables:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |

---

## 5. Add Sample Data

After creating an owner account, copy the owner's user ID from the Supabase users table and run:

```sql
INSERT INTO public.turfs (
  owner_id, name, description, address, city, state,
  latitude, longitude, sports, price_per_hour, amenities,
  images, operating_hours_start, operating_hours_end,
  is_active, rating, total_reviews
) VALUES
(
  'YOUR_OWNER_USER_ID',
  'Green Arena Football Ground',
  'Premium synthetic football ground with floodlights. Perfect for evening matches.',
  '123 Sports Complex, Koramangala',
  'Bangalore', 'Karnataka',
  12.9279, 77.6271,
  ARRAY['football'],
  800,
  ARRAY['Parking', 'Floodlights', 'Changing Rooms', 'Drinking Water'],
  ARRAY['https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800'],
  '06:00', '23:00',
  TRUE, 4.5, 12
),
(
  'YOUR_OWNER_USER_ID',
  'Champions Cricket Arena',
  'Full-size cricket ground with well-maintained pitch.',
  '45 Stadium Road, Indiranagar',
  'Bangalore', 'Karnataka',
  12.9784, 77.6408,
  ARRAY['cricket'],
  1200,
  ARRAY['Parking', 'Changing Rooms', 'First Aid', 'Cafeteria'],
  ARRAY['https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800'],
  '05:00', '22:00',
  TRUE, 4.2, 8
),
(
  'YOUR_OWNER_USER_ID',
  'Smash Badminton Courts',
  'Indoor air-conditioned badminton courts with wooden flooring.',
  '78 Fitness Hub, HSR Layout',
  'Bangalore', 'Karnataka',
  12.9116, 77.6389,
  ARRAY['badminton'],
  400,
  ARRAY['Parking', 'Wifi', 'Showers', 'Changing Rooms', 'Drinking Water'],
  ARRAY['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800'],
  '06:00', '23:00',
  TRUE, 4.7, 25
);
```

---

## 6. Auth Troubleshooting

**"new row violates row-level security policy"**  
→ Re-run `supabase/schema.sql` in the Supabase SQL Editor to ensure the INSERT policy on `public.users` exists.

**User profile not found after signup**  
→ Check that the `on_auth_user_created` trigger is active in Supabase → Database → Triggers.

**Session not persisting**  
→ Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correctly set.
