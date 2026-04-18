# Juvenis Medical — Website

**Live (staging):** https://peterluke101.github.io/peptide-calc-build/juvenis/
**Production domain:** https://peptidesandhormones.com *(pending DNS setup)*

Physician website for Dr. Paul Goodkin — peptide therapy, hormone optimization, and medical weight loss in Fort Lauderdale, FL. Nationwide telehealth for non-controlled compounds.

---

## Stack

- **Pure static HTML/CSS** — no build step, no framework, no JavaScript dependencies
- **Shared stylesheet:** `jv-styles.css` — all design tokens, components, and layouts
- **Deployed:** GitHub Pages (staging) → Cloudflare Pages or custom domain (production)
- **Schema markup:** JSON-LD on every page (BreadcrumbList, FAQPage, MedicalBusiness)

---

## Site Structure

```
juvenis/
├── index.html                    # Home page
├── about.html                    # About Dr. Paul
├── contact.html                  # Contact page
├── start.html                    # Intake funnel / "See If You Qualify"
├── jv-styles.css                 # Shared design system
├── robots.txt                    # Search engine directives
├── sitemap.xml                   # All 21 pages for Google Search Console
│
├── services/
│   ├── index.html                # Services hub
│   ├── trt.html                  # Testosterone / TRT
│   ├── mens-health.html          # Men's Health
│   ├── peptides.html             # Peptide Therapy overview
│   ├── weight-loss.html          # Medical Weight Loss
│   └── bhrt.html                 # Women's Hormones / BHRT
│
└── peptides/
    ├── index.html                # Peptides hub (all compounds)
    ├── bpc-157.html              # BPC-157 — recovery & healing
    ├── sermorelin.html           # Sermorelin — GH optimization
    ├── ipamorelin-cjc-1295.html  # Ipamorelin + CJC-1295 — GH stack
    ├── nad-plus.html             # NAD+ — cellular energy & longevity
    ├── pt-141.html               # PT-141 — sexual health
    ├── semaglutide.html          # Semaglutide — GLP-1 weight loss
    ├── tirzepatide.html          # Tirzepatide — dual GLP-1/GIP weight loss
    └── gac.html                  # GAC injections — amino acid performance
```

---

## Design System (`jv-styles.css`)

| Token | Value |
|-------|-------|
| `--bg` | `#0D0F14` (dark charcoal) |
| `--gold` | `#C9963A` (warm gold) |
| `--text` | `#E8E6E1` |
| `--surface` | `#111318` |
| `--max-w` | `1100px` |
| Font (headings) | Space Grotesk |
| Font (body) | Inter |

**Key components:** `.nav`, `.page-hero`, `.section`, `.step-list`, `.cta-band`, `.footer`

---

## SEO Architecture

Every page has:
- Unique `<title>` and `<meta name="description">`
- `<link rel="canonical">` pointing to `peptidesandhormones.com`
- JSON-LD structured data (BreadcrumbList + FAQPage on all peptide pages)
- Home page: MedicalBusiness schema for local SEO / Google Maps

Target keywords: `[compound] Fort Lauderdale`, `[compound] Florida`, `[compound] telehealth`, `peptide therapy South Florida`

---

## Telehealth Compliance

| Service | Telehealth Availability |
|---------|------------------------|
| Peptides (non-controlled) | All 50 states |
| NAD+, GAC, GLP-1 | All 50 states |
| TRT / testosterone | Florida residents only (telehealth) |
| In-person visits | Any state |

---

## Deployment

Files are pushed via GitHub Contents API (PUT `/repos/peterluke101/peptide-calc-build/contents/`).

To push a new or updated file:
```python
# See deployment script pattern in project notes
# Requires classic PAT with repo scope
TOKEN = "ghp_..."
REPO = "peterluke101/peptide-calc-build"
# Files go in: juvenis/[path]
```

---

## Phase Roadmap

- [x] Phase 1 — Core site (home, about, contact, services, peptides, intake funnel)
- [x] Phase 1 — Individual peptide SEO pages (8 compounds)
- [x] Phase 1 — JSON-LD schema, sitemap, robots.txt
- [ ] Phase 2 — Zoho Forms embed in start.html
- [ ] Phase 2 — Zoho Bookings embed for consultation scheduling
- [ ] Phase 3 — Zoho Sign document consolidation (3 emails → 1 package)
- [ ] Phase 4 — Custom domain DNS (peptidesandhormones.com → this repo / Cloudflare Pages)

---

*Dr. Paul Goodkin, DC · FL License CH7998 · NPI 1083750665*
*1164 E. Oakland Park Blvd., Suite #202 · Oakland Park, FL 33334 · (954) 982-8378*
