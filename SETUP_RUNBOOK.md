# TurfMacha — Go-Live Runbook

Everything needed to take TurfMacha from this repo to a **working hosted app +
installable Android APK**, including Google login and the `heroxisreal` test
account. Work top to bottom; each step says whether *you* or *the code* does it.

Estimated time: ~45–60 min the first time.

---

## 0. What's already done (in code)

- App-first structure — opens on **/login**, everything else is behind auth.
- Email/password login + signup (works as soon as Supabase is connected).
- Google sign-in: **native on Android** (Capacitor plugin → Supabase ID token)
  and **web OAuth** in the browser — same button, automatic per platform.
- Capacitor Android project (`android/`) that loads the hosted app.
- `npm run seed:testuser` — creates `heroxisreal@turfmacha.app` / `tiktiktik`.
- Branded splash, native status-bar theming, app-feel polish.

You provide the accounts/keys below to switch it all on.

---

## 1. Create the Supabase backend  *(you)*

1. Go to https://supabase.com → **New project**. Pick a region near your users
   (e.g. *Mumbai* for India). Save the database password.
2. Open **SQL Editor → New query**, paste the entire contents of
   [`supabase/schema.sql`](supabase/schema.sql), and **Run**. This creates the
   tables, RLS policies, and triggers.
3. Go to **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` *(secret — never ship to client)*

---

## 2. Fill in `.env.local`  *(you)*

Copy `.env.example` → `.env.local` if you haven't, then set at minimum:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOURPROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...           # long JWT
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...               # long JWT (secret)
NEXT_PUBLIC_APP_URL=https://turfmacha.vercel.app    # your prod URL (step 6)
NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID=...apps.googleusercontent.com   # step 4
```

> Razorpay / Firebase / etc. are optional — the app runs without them; those
> features just stay off until configured.

---

## 3. Create the test account  *(code — one command)*

With the Supabase keys in `.env.local`:

```bash
npm install
npm run seed:testuser
```

You'll see `✓ Done`. Now you can log in with:

```
Email:    heroxisreal@turfmacha.app
Password: tiktiktik
```

Re-run anytime to reset the password.

---

## 4. Set up Google sign-in  *(you — Google Cloud + Supabase)*

### 4a. Google Cloud — OAuth clients
1. https://console.cloud.google.com → create/select a project.
2. **APIs & Services → OAuth consent screen** → External → fill app name,
   support email → add your email as a **Test user** (until you publish).
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - **Web application**
     - Authorized redirect URI: `https://YOURPROJECT.supabase.co/auth/v1/callback`
     - Copy the **Client ID** → this is `NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID`
       and the value you give Supabase below. Copy the **Client secret** too.
   - **Android** (needed for native APK login)
     - Package name: `app.turfmacha.android`
     - **SHA-1 fingerprint:** get it from your signing keystore:
       ```bash
       # debug builds:
       keytool -list -v -keystore ~/.android/debug.keystore \
         -alias androiddebugkey -storepass android -keypass android
       # release builds: use the keystore from APK_BUILD.md
       ```
       Paste the `SHA1:` value. (Add **both** debug and release SHA-1s.)

### 4b. Supabase — enable Google
1. Supabase → **Authentication → Providers → Google** → enable.
2. Paste the **Web** Client ID + Client secret from 4a.
3. Under **Authentication → URL Configuration**, add to **Redirect URLs**:
   - `https://turfmacha.vercel.app/auth/callback` (prod web)
   - `http://localhost:3000/auth/callback` (local web dev)

Put the Web Client ID in `.env.local` as `NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID`.

> **Nonce note:** if native Google login ever errors with `nonce`, set
> *Authentication → Providers → Google → "Skip nonce check"* in Supabase, or
> pass the raw nonce through `signInWithIdToken` (see `src/lib/auth/google.ts`).

---

## 5. Run locally to verify  *(code)*

```bash
npm run dev
```

Open http://localhost:3000 → you should land on **/login**. Test:
- email/password with the `heroxisreal` account,
- "Continue with Google" (web flow).

---

## 6. Deploy the hosted app to Vercel  *(you)*

1. Push this repo to GitHub.
2. https://vercel.com → **Add New → Project** → import the repo.
3. **Environment Variables** → add everything from `.env.local`
   (all `NEXT_PUBLIC_*` **and** the secrets like `SUPABASE_SERVICE_ROLE_KEY`).
   Set `NEXT_PUBLIC_APP_URL` to your real Vercel URL.
4. Deploy. Note the production URL (e.g. `https://turfmacha.vercel.app`).

> CLI alternative: `npm i -g vercel` → `vercel` (preview) → `vercel --prod`.

---

## 7. Point the APK at production & build  *(you, on a machine with Android Studio)*

1. Make sure `server.url` in `capacitor.config.ts` matches your Vercel URL
   (default is `https://turfmacha.vercel.app`; override with
   `CAP_SERVER_URL=https://your-url npx cap sync android`).
2. Build (see **APK_BUILD.md** for prerequisites — JDK 21 + Android SDK):
   ```bash
   npm run cap:sync
   npm run android:apk          # debug APK
   # -> android/app/build/outputs/apk/debug/app-debug.apk
   ```
3. Install the APK on a phone (`adb install` or transfer + tap).
4. For Play Store, do the signed **release** build in APK_BUILD.md and register
   that keystore's SHA-1 in Google Cloud (step 4a).

---

## Final checklist

- [ ] Supabase project created + `schema.sql` run
- [ ] `.env.local` filled with real keys
- [ ] `npm run seed:testuser` → `heroxisreal` account works
- [ ] Google OAuth: Web + Android clients created, Supabase provider enabled
- [ ] App runs locally on `/login`, both login methods work
- [ ] Deployed to Vercel with all env vars
- [ ] `server.url` points at the Vercel URL
- [ ] APK built and installs; login works inside the app

Once these are green, the app is a fully working, hosted, installable product.
