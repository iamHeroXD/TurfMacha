# TurfMacha — Play Store Release Guide

Everything is automated through GitHub Actions — you never need a local Android
toolchain. Two workflows handle signing:

| Workflow | When | Output |
| --- | --- | --- |
| **Build Android APK** | every push / manual | unsigned-ish *debug* APK for testing |
| **Generate Release Keystore** | once | your signing keystore + secrets |
| **Build Release (Play Store)** | each release | **signed** APK + **AAB** |

---

## Step 1 — Create your signing key (once)

1. GitHub → **Actions** → **Generate Release Keystore** → **Run workflow**.
2. Enter a **keystore password**, **key password** (can match), and keep alias
   `turfmacha`. Run it.
3. When it's green, open the run → download the **`release-keystore`** artifact.
4. Inside: `turfmacha-release.keystore`, `keystore-base64.txt`, `SECRETS.md`.

> 🔒 **Back up `turfmacha-release.keystore` somewhere safe and private forever.**
> Lose it and you can never push updates to the same Play Store app again.

## Step 2 — Add the 4 repository secrets

GitHub → **Settings → Secrets and variables → Actions → New repository secret**.
Add (values are in the artifact's `SECRETS.md`):

- `RELEASE_KEYSTORE_BASE64` — paste the full contents of `keystore-base64.txt`
- `RELEASE_STORE_PASSWORD` — your keystore password
- `RELEASE_KEY_ALIAS` — `turfmacha`
- `RELEASE_KEY_PASSWORD` — your key password

## Step 3 — Build the signed release

GitHub → **Actions** → **Build Release (Play Store)** → **Run workflow**.
When green, download **`turfmacha-release`**:
- `app-release.aab` → **upload this to the Play Console** (preferred format)
- `app-release.apk` → for direct install / sideload testing

## Step 4 — Publish on Google Play

1. Pay the one-time **$25** Google Play Developer registration.
2. Play Console → **Create app** → fill listing (name, icon, screenshots,
   privacy policy URL, content rating).
3. **Production → Create release → upload `app-release.aab`** → roll out.
4. For native **Google sign-in** in the published app, add the **release**
   SHA-1/SHA-256 (printed at the bottom of `SECRETS.md`) to your Google Cloud
   **Android OAuth client**. Google Play App Signing also has its own SHA — add
   that one too (Play Console → Setup → App signing).

## Versioning each update

Before each new release, bump in `android/app/build.gradle`:
```gradle
versionCode 2      // must increase every upload
versionName "1.1"  // shown to users
```
Commit, push, then re-run **Build Release (Play Store)**.
