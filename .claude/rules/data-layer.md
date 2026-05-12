# Data Layer

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
