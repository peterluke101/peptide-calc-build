# Peptide Compass Pro — Project Brain

> **Read this first.** This file gives any Claude session full context to work on this project immediately.

## Identity

Peptide Compass Pro is a peptide tracking dashboard PWA. It helps users manage peptide schedules, log injections, track weight, calculate reconstitution math, and journal their progress. Target audience: biohackers and peptide therapy patients.

**Monetization (planned):** Free tier + $8.99/mo Navigator Pro + $49.99/yr annual. No paywall UI built yet.

**Distribution:** Cloudflare Pages (live site). Google Play via TWA first, then Apple App Store.

## Architecture

Single-file PWA — nearly all UI and logic lives in one `index.html` (~11k lines).

```
index.html          — Main app: UI, logic, data, styles (single-file PWA)
sw.js               — Service worker for offline caching
manifest.json       — PWA manifest (standalone, portrait)
schedule.html       — Separate calendar/schedule page
logs-journal.js     — Journal and logbook functionality
privacy.html        — Privacy policy
terms.html          — Terms of service
data-handling.html  — Data handling disclosure
icons/              — PWA icons (placeholders — need real branding)
.well-known/        — assetlinks.json placeholder for TWA signing key
_archive/           — Archived/legacy files
pro/                — Pro tier assets
landing-bg.webp     — Landing page background
distributor-catalog.md  — Peptide distributor reference
store-listing-draft.md  — Google Play store listing draft
```

## Key Code Locations (index.html)

| What | Approximate line | Notes |
|------|-----------------|-------|
| PEPTIDES array | ~3710 | 92 entries, each with name, lowMcg, stdMcg, highMcg, rangeLabel, timing, frequency, evidence, vialSizes |
| escapeHtml() | ~3769 | XSS prevention — use for ALL user-generated content |
| safeGetJSON() | ~3776 | Safe localStorage reads with fallback |
| safeSetItem() | ~3781 | Safe localStorage writes with quota handling |

These line numbers shift as the file is edited. Search for the function names to find current positions.

## Data Layer

All persistence is via **localStorage**. No server, no database.

**Structured data (use safeGetJSON/safeSetItem):**
costEntries, doseChangeLog, injectionLog, peptide-schedule, peptideJournal, peptideLogs, peptideNotes, reconRecipes, savedProtocols, skipLog, snoozeLog, vialData, weightTracker

**Flags and preferences (raw localStorage):**
activeTab, addSectionCollapsed, appMode, hasAddedPeptide, hasCalculated, hasCompletedWizard, hasLoggedDose, hasOnboarded, hasSavedProtocol, hasSeenResult, hasSeenUnlock, install-banner-dismissed, logbookView, onboardingStep, peptidesCollapsed, rc-dose-unit, rc-syringe-size, stacks-oat-dismissed, theme, weightGoal, weightStartingWeight, weightUnitPreference

**PEPTIDES array structure** (each entry):
```js
{
  name: "BPC-157",
  lowMcg: 200,    // low dose in mcg
  stdMcg: 400,    // standard dose
  highMcg: 600,   // high dose
  rangeLabel: "200–600 mcg",
  timing: "Morning or evening",
  frequency: "Daily",
  evidence: "strong",  // or "moderate", "emerging", "experimental"
  vialSizes: [5]       // mg per vial, from wholesale data
}
```

`peptideIndex` in schedule entries references the index into the PEPTIDES array.

## UI Structure

- **Simple / Advanced modes** — toggled via `appMode` localStorage key
- **5-tab navigation:** Compass, Schedule, History, More, Advanced
- **Add Peptide wizard:** 4 steps — select peptide → choose dose (preset buttons + custom input with steppers) → set frequency → confirm
- **Calculator wizard:** Reconstitution math (vial size, BAC water, desired dose → syringe units)
- **Weight tracker:** Log weight entries, see trends, confetti animation on milestones
- **Journal:** Free-text entries in History tab, linked to peptide names and dates
- **Logbook:** Injection log with timestamps in History tab

## Development Rules

1. **XSS prevention:** Always use `escapeHtml()` for any user-generated content rendered to DOM.
2. **Cache busting:** Always bump the cache version in `sw.js` (`CACHE_NAME = 'peptide-calc-vNN'`) when changing ANY cached asset. This is the deploy mechanism — miss it and users get stale content.
3. **localStorage safety:** Use `safeGetJSON()` / `safeSetItem()` for all reads/writes. They handle parse errors and quota limits gracefully.
4. **Test on live site:** After every deploy, test on the actual Cloudflare Pages URL, not just locally.
5. **Private data:** The wholesale price list files (xlsx/pdf) in the repo are **private**. Never expose prices in the app UI. Only vial size data from the Excel is intended for public use in the app.
6. **Single-file discipline:** Resist the urge to split index.html into modules. The single-file architecture is intentional for PWA simplicity and offline reliability.

## CI/CD

- **CI:** `.github/workflows/ci.yml` runs htmlhint + JS syntax checks on push/PR
- **Deploy:** Cloudflare Pages auto-deploys from main branch
- **Linting config:** `.htmlhintrc` in repo root

## Sprint History

| Sprint | Issues | Status |
|--------|--------|--------|
| UX Simplification | #103–#112 | In progress |
| P0 Critical fixes | PR #113 | Done |
| P1 Next up | #106–#109 | Planned |

**Recent changes:**
- Custom dose input feature: all peptides now have preset buttons + editable number input + ±stepper buttons in Step 3 of Add Peptide wizard
- Journal bug fix: corrected sort-by-date logic, Invalid Date handling, and peptide name extraction in `getLastInjection()`
- Service worker progressed v29 → v30 → v31

## Upcoming Work

- Virtual vial design with labels and color-coded tops
- Replace placeholder PWA icons with real branding
- Fill in assetlinks.json with real signing key after Google Play Developer account setup
- Build paywall UI for Navigator Pro tier
- Issues #106–#109 (P1 UX improvements)

## Working With This Repo

```bash
# Local development — just open index.html or use any static server
python3 -m http.server 8000

# The app is a static site — no build step, no bundler, no npm
# All dependencies are inline or CDN-loaded

# After changes, bump sw.js cache version and push to main
# Cloudflare Pages auto-deploys
```
