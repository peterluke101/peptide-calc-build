# Code Map

## Key Code Locations (index.html)

| What | Approximate line | Notes |
|------|-----------------|-------|
| PEPTIDES array | ~3710 | 92 entries, each with name, lowMcg, stdMcg, highMcg, rangeLabel, timing, frequency, evidence, vialSizes |
| escapeHtml() | ~3769 | XSS prevention — use for ALL user-generated content |
| safeGetJSON() | ~3776 | Safe localStorage reads with fallback |
| safeSetItem() | ~3781 | Safe localStorage writes with quota handling |

These line numbers shift as the file is edited. Search for the function names to find current positions.

## UI Structure

- **Simple / Advanced modes** — toggled via `appMode` localStorage key
- **5-tab navigation:** Compass, Schedule, History, More, Advanced
- **Add Peptide wizard:** 4 steps — select peptide → choose dose (preset buttons + custom input with steppers) → set frequency → confirm
- **Calculator wizard:** Reconstitution math (vial size, BAC water, desired dose → syringe units)
- **Weight tracker:** Log weight entries, see trends, confetti animation on milestones
- **Journal:** Free-text entries in History tab, linked to peptide names and dates
- **Logbook:** Injection log with timestamps in History tab
