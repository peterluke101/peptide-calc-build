# peptide-calc-build

[![CI](https://github.com/peterluke101/peptide-calc-build/actions/workflows/ci.yml/badge.svg)](https://github.com/peterluke101/peptide-calc-build/actions/workflows/ci.yml)

This repo hosts two separate projects:

---

## 1. Peptide Compass Pro (`/`)

**Live:** https://peptide-calc-build.pages.dev/

Track, organize, and better understand your peptide protocol.

- Single-file PWA — `index.html` inline HTML/CSS/JS
- Deployed on Cloudflare Pages — auto-deploys from `main`
- Dark theme, light mode toggle, all data in `localStorage`

**Key files:** `index.html`, `schedule.html`, `sw.js`, `manifest.json`, `pro/`

---

## 2. Juvenis Medical Website (`/juvenis/`)

**Staging:** https://peterluke101.github.io/peptide-calc-build/juvenis/
**Production:** https://peptidesandhormones.com *(DNS pending)*

Physician website for Dr. Paul Goodkin — peptide therapy, hormone optimization, and medical weight loss in Fort Lauderdale, FL.

- Pure static HTML/CSS — no build step
- 21 pages across home, services, and individual peptide compound pages
- Full JSON-LD schema (FAQPage, BreadcrumbList, MedicalBusiness)
- Sitemap + robots.txt included

**See:** [`juvenis/README.md`](juvenis/README.md) for full documentation.

---

## Repository Structure

```
/                          # Peptide Compass Pro (PWA)
├── index.html
├── schedule.html
├── sw.js
├── manifest.json
├── pro/                   # Pro tier features
├── docs/                  # Documentation
└── _archive/              # Legacy files

juvenis/                   # Juvenis Medical website
├── index.html
├── jv-styles.css
├── about.html
├── contact.html
├── start.html
├── sitemap.xml
├── robots.txt
├── services/              # Service category pages (5)
└── peptides/              # Individual compound pages (9)
```

---

## Deployment

- **Peptide Compass Pro** → Cloudflare Pages (auto-deploy on push to `main`)
- **Juvenis Medical** → GitHub Pages at `/juvenis/` path; push via Contents API or direct commit

## License

Private — all rights reserved.
