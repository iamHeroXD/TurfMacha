# TurfMacha — Deployment Guide (Vercel)

## Prerequisites

- Node.js 18+
- A Supabase project set up (see `SUPABASE_SETUP.md`)
- A GitHub account with the repo pushed
- A Vercel account

---

## 1. Environment Variables

Create a `.env.local` file (never commit this file):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key...
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

| Variable | Where to find | Required for |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | All features |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon key | All features |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role key | Admin user deletion |
| `NEXT_PUBLIC_APP_URL` | Your Vercel production URL | OG metadata, OAuth |

> **Security note:** `SUPABASE_SERVICE_ROLE_KEY` is a secret — never expose it to the browser.
> It is only used in server-side API routes (`/api/admin/*`). Do NOT prefix it with `NEXT_PUBLIC_`.

---

## 2. Local Development

```bash
# Install dependencies
npm install

# Generate PWA icons (runs automatically before build too)
npm run generate-icons

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 3. Build Verification (Before Deploying)

Always verify the build passes locally before pushing:

```bash
npm run build
```

This runs:
1. `prebuild` → generates PWA icons (192×192 and 512×512 PNGs)
2. TypeScript type-check
3. Next.js production build

The build must exit with **zero errors**.

---

## 4. Deploy to Vercel

### First Deployment

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo (`TurfMacha`)
4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` → your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → your Supabase anon key
5. Click **Deploy**

Vercel auto-detects Next.js — no framework configuration needed.

### Subsequent Deployments

Every push to `main` triggers an automatic redeploy.

To manually redeploy without a code change:
- Vercel Dashboard → your project → **Deployments** → **Redeploy**

---

## 5. Post-Deploy Configuration

### Update Supabase Redirect URLs

After your Vercel domain is assigned (e.g., `turfmacha.vercel.app`), update Supabase:

1. **Authentication → URL Configuration**
2. **Site URL**: `https://turfmacha.vercel.app`
3. **Redirect URLs**: `https://turfmacha.vercel.app/**`

### Custom Domain (Optional)

1. Vercel Dashboard → **Settings → Domains** → Add your domain
2. Update **Site URL** in Supabase to match your custom domain

---

## 6. PWA Icons

Icons are generated from `public/icons/icon.svg` during `prebuild`.
The generated PNGs (`192×192`, `512×512`) are committed to the repo.

If you update the SVG logo, regenerate icons:
```bash
npm run generate-icons
```

Then commit the updated PNGs.

---

## 7. Production Checklist

Before going live:

- [ ] `npm run build` passes with zero errors
- [ ] Supabase schema applied (run `supabase/schema.sql`)
- [ ] Environment variables set in Vercel dashboard
- [ ] Supabase Site URL + Redirect URLs updated to production domain
- [ ] Auth flows tested (signup, login, logout, protected routes)
- [ ] PWA installable on mobile Chrome (check manifest + icons)
- [ ] No `console.error` output in browser devtools on happy paths

---

## 8. Rollback

To roll back to a previous deployment:
- Vercel Dashboard → **Deployments** → click the previous successful deployment → **Promote to Production**

---

## 9. Monitoring

- **Vercel Logs**: Dashboard → your project → **Logs** (real-time)
- **Supabase Logs**: Dashboard → **Logs** → API / Auth / Database
- **Errors**: Check browser console and Vercel function logs for any runtime issues
