# TurfBook — Complete Setup & Deployment Guide

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 1. Supabase Setup

### Create Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose a strong database password
3. Select a region close to your users

### Get API Keys
1. Go to **Project Settings → API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Run Database Schema
1. Go to **SQL Editor** in your Supabase dashboard
2. Paste the entire contents of `supabase/schema.sql`
3. Click **Run**

This creates all tables, RLS policies, triggers, and indexes.

### Configure Auth
1. Go to **Authentication → URL Configuration**
2. Set **Site URL** to your domain (or `http://localhost:3000` for dev)
3. Add redirect URLs: `http://localhost:3000/**` and `https://yourapp.vercel.app/**`

---

## 2. Environment Variables

Create `.env.local` (already created, fill in your values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 3. PWA Icons Setup

Generate icons using [pwabuilder.com/imageGenerator](https://www.pwabuilder.com/imageGenerator):
- Upload your logo/icon
- Download the generated icon pack
- Place PNGs in `public/icons/`:
  - `icon-72x72.png`
  - `icon-96x96.png`
  - `icon-128x128.png`
  - `icon-144x144.png`
  - `icon-152x152.png`
  - `icon-192x192.png`
  - `icon-384x384.png`
  - `icon-512x512.png`
  - `apple-touch-icon.png` (180x180)

---

## 4. Deploy to Vercel

### Via CLI
```bash
npm install -g vercel
vercel login
vercel
```

### Via GitHub
1. Push to GitHub: `git push origin main`
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Connect your GitHub repo
4. Add Environment Variables (same as `.env.local`)
5. Deploy

### Environment Variables on Vercel
In Vercel Dashboard → Project → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL` = `https://your-app.vercel.app`

---

## 5. Add Sample Data

After creating an owner account, use this SQL to add sample turfs:

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

Replace `'YOUR_OWNER_USER_ID'` with actual UUID from the `users` table.

---

## 6. File Structure

```
turf-app/
├── public/
│   ├── icons/           # PWA icons
│   ├── manifest.json    # PWA manifest
│   └── sw.js           # Service worker
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── dashboard/
│   │   │   ├── user/   # Player dashboard
│   │   │   └── owner/  # Owner dashboard
│   │   ├── turfs/      # Turf listing + detail
│   │   ├── offline/    # PWA offline page
│   │   ├── layout.tsx  # Root layout
│   │   └── page.tsx    # Home page
│   ├── components/
│   │   ├── booking/    # BookingModal, BookingCard
│   │   ├── layout/     # Navbar, BottomNav, AuthProvider
│   │   ├── map/        # Leaflet map
│   │   ├── turf/       # TurfCard, SportFilter, SearchBar
│   │   └── ui/         # shadcn-style components
│   ├── hooks/          # useAuth, useLocation, useTurfs, useToast
│   ├── lib/
│   │   ├── supabase/   # client.ts, server.ts
│   │   ├── validations/ # Zod schemas
│   │   └── utils.ts    # Helpers, formatters
│   ├── middleware.ts   # Route protection
│   ├── store/          # Zustand stores
│   └── types/          # TypeScript interfaces
├── supabase/
│   └── schema.sql      # Complete DB schema
└── .env.local          # Environment variables
```

---

## 7. Production Checklist

- [ ] Supabase project created and schema run
- [ ] Environment variables set in Vercel
- [ ] PWA icons placed in `/public/icons/`
- [ ] Supabase Auth redirect URLs configured
- [ ] Test signup flow (user + owner)
- [ ] Test turf creation (owner dashboard)
- [ ] Test booking flow (user)
- [ ] Test mobile PWA install
- [ ] Check Lighthouse score
- [ ] Set up Supabase backups

---

## 8. Key Features Implemented

| Feature | Status |
|---------|--------|
| User Authentication | ✅ |
| Owner Authentication | ✅ |
| Role-based Routing | ✅ |
| Turf Listing | ✅ |
| Turf Search & Filter | ✅ |
| Sport Filtering | ✅ |
| Turf Detail Page | ✅ |
| Booking System | ✅ |
| Double-booking Prevention | ✅ |
| Owner Dashboard | ✅ |
| User Dashboard | ✅ |
| Map Integration (Leaflet) | ✅ |
| Favorites | ✅ |
| PWA Support | ✅ |
| Service Worker | ✅ |
| Offline Fallback | ✅ |
| PWA Install Prompt | ✅ |
| Row Level Security | ✅ |
| Dark Glassmorphism UI | ✅ |
| Mobile Bottom Nav | ✅ |
| Skeleton Loaders | ✅ |
| Framer Motion Animations | ✅ |

---

## 9. Tech Stack Summary

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **UI**: Custom glassmorphism components, shadcn/ui primitives
- **Animations**: Framer Motion
- **Backend**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Maps**: Leaflet.js + OpenStreetMap
- **State**: Zustand + React Query pattern
- **Forms**: React Hook Form + Zod
- **PWA**: Custom service worker, Web App Manifest
- **Deployment**: Vercel

---

## 10. Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```
