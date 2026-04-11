# Peptide Compass Pro

**Mission:** Track, organize, and better understand your peptide protocol.

**Live site:** https://peptide-calc-build.pages.dev/

---

## Architecture

- **Single-file PWA** — `index.html` contains all HTML, CSS, and JS inline
- **`schedule.html`** — separate calendar/schedule page
- **Deployed on Cloudflare Pages** — auto-deploys from `main` branch
- Dark theme default, light mode toggle via `body.light-mode` class
- All data stored in `localStorage` — no backend, no accounts

---

## Key localStorage Keys

| Key | Contents |
|-----|----------|
| `schedule` | Scheduled doses |
| `injectionLog` | Logged doses |
| `savedProtocols` | Saved protocol configurations |
| `vialInventory` | Vial tracking with lifecycle data |
| `journalEntries` | Journal entries |
| `skipLog` | Skipped doses |
| `doseChangeLog` | Dose change history |
| `weightLog` | Weight tracking |
| `theme` | Dark/light mode preference |
| `hasOnboarded` | Onboarding completion flag |
| `activeTab` | Last active tab |

---

## Features

- Reconstitution calculator with math transparency (Show Math expandable)
- Reverse calculator (dose → syringe mark)
- Protocol builder and saved protocols
- Stack builder with recommendations
- Schedule creation with calendar (.ics) export
- Today's Doses card with one-tap actions (done / skip / move)
- Adherence stats — streaks, adherence %, progress rings
- Vial inventory with full lifecycle tracking (reconstitution date, discard-by date, doses remaining, runout forecast)
- Injection log with dose change history
- Journal with symptom tracking
- Weight tracking with trend charts and protocol overlay
- Side-effect timeline
- Missed-dose analytics
- Learn tab — foundational educational content (accordion style)
- Data export / import (CSV)
- Dark / light mode
- PWA installable (Add to Home Screen)

---

## Tab Structure

**Bottom nav:** Compass (main) · Schedule (→ schedule.html) · History · More

**Sub-tabs accessible from More:** Weight · Stacks · Logs · Journal · Learn · Inventory

---

## Sprint History

| Sprint | Topic | PR | Status |
|--------|-------|----|--------|
| Sprint 5 | Adherence & Reminders | #69 | ✅ Merged |
| Sprint 10 | Inventory & Vial Lifecycle | #75 | ✅ Merged |
| Sprint 11 | Logging Insights & Trend Summaries | #76 | ✅ Merged |
| Sprint 12 | Evidence & Source Transparency | #72 | Planned |
| Sprint 13 | Scheduler Polish for Repeat Use | #73 | Planned |
| Sprint 14 | Credibility & Trust Layer | #74 | Planned |

---

## Monetization (Planned)

- **Model:** Freemium + subscription
- **Free tier:** Calculator, reverse calc, 1 protocol, basic reminders, 7-day history, intro Learn entries
- **Premium tier:** $8.99/mo or $49.99/yr — everything else (Navigator unlock)
- **Billing:** RevenueCat (mobile) + Stripe (web)
- **Launch order:** Google Play first, then Apple App Store
- See issues [#77](https://github.com/peterluke101/peptide-calc-build/issues/77)–[#81](https://github.com/peterluke101/peptide-calc-build/issues/81) for app store and monetization work

---

## Development

- All UI changes go in `index.html` (and `schedule.html` for schedule-page changes)
- Branch from `main`, open a PR, merge, verify on live site
- Cloudflare Pages auto-deploys on merge to `main`
- Branch naming: `feature/<issue>-<short-desc>`, `fix/<issue>-<short-desc>`
