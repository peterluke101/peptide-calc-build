# Peptide Compass Pro — Project Brain

> **Read this first.** This file gives any Claude session full context to work on this project immediately.

## Identity

Peptide Compass Pro is a peptide tracking dashboard PWA. It helps users manage peptide schedules, log injections, track weight, calculate reconstitution math, and journal their progress. Target audience: biohackers and peptide therapy patients.

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

## Working With This Repo

```bash
# Local development — just open index.html or use any static server
python3 -m http.server 8000

# The app is a static site — no build step, no bundler, no npm
# All dependencies are inline or CDN-loaded

# After changes, bump sw.js cache version and push to main
# Cloudflare Pages auto-deploys
```

Additional context in .claude/rules/ — loaded automatically.
