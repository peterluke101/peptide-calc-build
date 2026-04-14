# Google Play Store Listing Draft
# Issue #79 — PWA / TWA Play Store Launch

---

## App Name Options

1. **Peptide Compass Pro** *(recommended — matches current app title)*
2. Peptide Dose Calculator Pro
3. PeptideCalc: Dose & Schedule

---

## Short Description (80 chars max)

```
Peptide reconstitution calculator with dose scheduling and injection log
```
*(72 chars)*

---

## Full Description (4000 chars max)

```
Peptide Compass Pro is a precise, privacy-first toolkit for anyone managing a peptide protocol. Everything runs on-device — no account, no cloud, no data collection.

DOSE CALCULATOR
Accurately calculate reconstitution volumes and injection doses for any peptide. Enter your vial size (mg), BAC water volume (mL), and target dose (mcg or mg) to get the exact syringe draw in units or mL. Supports any concentration, any syringe size. Covers common peptides including BPC-157, TB-500, CJC-1295, Ipamorelin, Sermorelin, Tesamorelin, and more.

SCHEDULE TRACKING
Set up and manage your dosing schedule with injection reminders. Log each injection with a single tap. View your upcoming doses at a glance and track adherence over time. Protocols are stored locally and persist across sessions.

INJECTION JOURNAL
Keep a private record of every injection — date, time, peptide, dose, and notes. Review your full history, spot patterns, and share a clean log with your practitioner if needed. All data stays on your device.

DESIGNED FOR REAL USE
• Works fully offline — no internet required after first load
• Dark and light mode
• Saves your last-used values for fast re-entry
• No ads, no subscriptions, no tracking
• Installs as a home screen app (PWA)

DISCLAIMER
Peptide Compass Pro is a calculation aid only. It does not provide medical advice. Peptide use should be supervised by a qualified healthcare provider. Always verify dosing with your prescribing physician.
```
*(~1,450 chars — leaves room to expand)*

---

## Category

**Health & Fitness** (primary)
- Secondary tag: Medical / Tools

---

## Content Rating Guidance

**IARC Self-Rating answers (expected result: Everyone / Teen):**
- No violence, no sexual content, no gambling
- Medical/health content — select "References to medical topics" when prompted
- No user-generated content shared publicly
- No location tracking
- Expected rating: **Teen** or **Everyone** (health reference content may push to Teen)

Run the IARC questionnaire in Play Console to get the official rating. Likely outcome: **Everyone** with a "Drug & Alcohol Reference" or "Medical" content descriptor, or **Teen**.

---

## Screenshot Requirements

Google Play requires screenshots for each form factor you target. Minimum 2 per form factor, maximum 8.

### Phone (required)
- **Size:** 1080 × 1920 px (portrait) or 1080 × 2340 px (modern aspect ratio)
- **Format:** JPG or PNG, 24-bit, no alpha
- **Suggested shots:**
  1. Compass tab — calculator with a filled-in result
  2. Schedule tab — a protocol with upcoming doses
  3. History/Journal tab — a populated injection log
  4. Dark mode variant of the calculator

### 7-inch Tablet (optional but recommended)
- **Size:** 1200 × 1920 px
- Same content suggestions as phone

### 10-inch Tablet (optional but recommended)
- **Size:** 1920 × 1200 px (landscape) or 1200 × 1920 px (portrait)
- Same content suggestions as phone

**Tip:** Use Chrome DevTools device emulation to capture at exact pixel dimensions, then export. Avoid showing any real personal health data in screenshots.

### Feature Graphic (required)
- **Size:** 1024 × 500 px
- Used as the banner at the top of the Play Store listing
- Suggested: app logo centered on the dark background (`#0a0a0a`) with the teal accent (`#3DE8C3`)

---

## TWA / Bubblewrap Notes

### What's already in place
- `manifest.json` with `display: standalone`, `start_url: /`, `scope: /`, `orientation: portrait`
- Service worker with offline caching (passes Lighthouse offline check)
- App served over HTTPS (Cloudflare Pages)

### What still needs manual setup before generating the TWA

1. **App icons (PNG files — blocker)**
   - `icons/icon-192.png` — 192 × 192 px
   - `icons/icon-512.png` — 512 × 512 px, standard
   - `icons/icon-512-maskable.png` — 512 × 512 px, maskable (safe zone: center 80%, i.e. content within the inner 409 × 409 px circle)
   - The manifest has been updated to reference these paths. The actual PNG files must be created and committed.
   - Recommended tool: [Maskable.app editor](https://maskable.app/editor) to generate the maskable variant from your base icon.

2. **`.well-known/assetlinks.json` (blocker)**
   - A placeholder file has been created at `.well-known/assetlinks.json`
   - You must fill in `package_name` (e.g. `com.peptidecompass.pro`) and `sha256_cert_fingerprints` after generating your signing keystore via Bubblewrap or Android Studio.
   - This file must be publicly accessible at `https://yourdomain.com/.well-known/assetlinks.json` — verify Cloudflare Pages serves it with no redirect and `Content-Type: application/json`.
   - Until this is filled in with the real fingerprint, the TWA will fall back to a browser tab (not standalone).

3. **Google Play Developer Account**
   - One-time $25 USD registration fee at play.google.com/console

4. **Signing keystore**
   - Generate with `bubblewrap init` or `keytool`. Keep the `.jks` file and passwords secure — losing them means you cannot update the app.
   - After generating: extract the SHA-256 fingerprint (`keytool -list -v -keystore release.jks`) and paste it into `assetlinks.json`.

5. **Bubblewrap setup**
   ```bash
   npm install -g @bubblewrap/cli
   bubblewrap init --manifest https://yourdomain.com/manifest.json
   bubblewrap build
   ```
   - This generates an `.aab` (Android App Bundle) ready for upload to Play Console.

6. **Target URL / domain**
   - Confirm the final production domain before running `bubblewrap init`. The domain is baked into the APK and assetlinks verification. If the domain changes, you need a new build.

7. **Privacy Policy**
   - Required by Google Play for any app in Health & Fitness. A simple one-pager noting "no data collected, all data stored locally" should be sufficient. Host it on the same domain.

8. **Screenshots**
   - See screenshot requirements section above. Must be uploaded in Play Console before the listing can go live.

---

## Checklist Summary

| Item | Status |
|------|--------|
| manifest.json fields (name, scope, orientation, display) | ✅ Fixed |
| Service worker caches start_url | ✅ Already passing |
| `.well-known/assetlinks.json` placeholder | ✅ Created (needs real values) |
| PNG icon files (192, 512, 512-maskable) | ❌ Needs manual creation |
| assetlinks.json filled with real fingerprint | ❌ After keystore generation |
| Google Play Developer account | ❌ Manual |
| Signing keystore | ❌ Manual |
| Privacy policy page | ❌ Manual |
| Screenshots captured | ❌ Manual |
| Bubblewrap build & upload | ❌ After above complete |
