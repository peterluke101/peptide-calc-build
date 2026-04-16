# Scheduler Resilience Spec

How Peptide Compass Pro handles gaps, missed doses, and long absences.

This documents **what actually happens** (verified from code), not aspirational behavior.

## Core mechanics

### Cycle status (`getCycleStatus`)

Every scheduled peptide entry has a `startDate` and optional cycle/break pattern. On any given date, the status is one of:

| Status | Meaning |
|---|---|
| `inject` | Scheduled dose day. Frequency + cycle position both say "dose today." |
| `rest` | Frequency rest day (e.g. weekend in a 5on/2off pattern). |
| `break` | In the off-period of a repeating cycle/break pattern. |
| `off` | Before start date, or past the end of a non-repeating cycle. |

### Frequency patterns

| Pattern | Logic |
|---|---|
| `daily` | Every day |
| `weekly` | Same weekday as `startDate` |
| `2x/week` | Monday + Thursday |
| `3x/week` | Monday + Wednesday + Friday |
| `5on2off` | 5 days on, 2 off, rolling from `startDate` |

### Cycle/break patterns

- **Repeating cycle:** `cycleWeeks > 0` and `breakWeeks > 0` — e.g. 8 weeks on, 4 weeks off, repeating forever. Cycle number auto-increments.
- **Single-run cycle:** `cycleDays > 0`, no break — stops showing doses after `cycleDays` elapsed. Status becomes `off`.
- **Indefinite:** No cycle or break configured — doses continue forever from `startDate`.

All cycle math is **deterministic from startDate** using `daysBetween(startDate, targetDate)`. No state is needed beyond the start date and pattern — reopening the app after any absence gives the correct cycle position.

---

## Gap scenarios

### User opens app 3 days after last dose (daily peptide, e.g. BPC-157)

**What happens:**
- Today's card shows current date's dose as "Due Today"
- If user navigates to past 3 dates via the calendar, each shows the missed dose as "⚠ Overdue"
- Overdue section renders at the top of the dose list with count: "⚠ Overdue (1)" per past date
- Each overdue dose shows: **Done** (logs retroactively), **Skip**, **Move +1d**, **Reschedule** buttons
- Adherence streak resets to 0 (streak requires all scheduled doses completed or skipped on consecutive days)
- Adherence stats (30-day) reflect the 3 missed days
- Calendar view shows those 3 days without checkmarks

**What does NOT happen:**
- Doses are not auto-skipped or auto-cleared
- No push notification or reminder (PWA — no service worker push)
- No "catch-up" prompt or bulk-clear option

### User opens app 30 days after last dose (daily peptide)

**Same as 3-day gap, scaled:**
- Navigating to any of the 30 past dates shows overdue doses
- Adherence streak is 0
- 30-day adherence rate is near 0%
- If the peptide has a cycle (e.g. 28-day cycle, no break): `getCycleStatus` returns `off` after day 28 — those last 2 days show no dose at all
- If the peptide has a repeating cycle/break (e.g. 8 weeks on, 4 off): cycle math continues correctly; some of the 30 days may fall in a break period (shown as "Break period — N days remaining")
- If indefinite: all 30 days show overdue on their respective calendar dates

### User opens app 90 days after last dose

**Same scaling. Key behaviors:**
- Indefinite peptide: 90 overdue entries accumulate across 90 calendar dates
- Weekly peptide (e.g. Semaglutide, 1x/week): only ~13 overdue entries across 90 days
- Repeating 8-week cycle + 4-week break: app correctly shows which days were inject, which were break, which were rest — cycle number may have advanced to 2 or 3
- Single-run 28-day cycle: `status: off` after day 28; remaining 62 days show no dose

### Weekly peptide (Semaglutide) vs. daily (BPC-157)

| | Daily (BPC-157) | Weekly (Semaglutide) |
|---|---|---|
| 7-day gap: overdue entries | 7 (or 5 if 5on/2off) | 1 |
| 30-day gap: overdue entries | ~30 | ~4 |
| 90-day gap: overdue entries | ~90 | ~13 |
| Streak break | After 1 missed day | After 1 missed week-day |
| Cycle position after gap | Correct (deterministic) | Correct (deterministic) |

---

## Overdue resolution

Overdue doses must be resolved manually. Options per dose:

| Action | Effect |
|---|---|
| **Done** | Logs injection retroactively to that date (stored in `injectionLog`) |
| **Skip** | Marks as intentionally skipped (stored in `skipLog`); counts toward streak |
| **Move +1d** | Moves dose to tomorrow (today's doses only; hidden for deep-past dates) |
| **Reschedule** | Available on overdue items; opens reschedule UI |

**Skip counts as "completed" for streak purposes.** The rationale: the user made a conscious decision. This means a user who opens the app after 30 days and bulk-skips all overdue doses will immediately have a 0-day streak (the skipped days count, but the streak requires *consecutive* completed days — the skip creates a completed day but the gap before it is still unresolved for prior days).

---

## Adherence calculation

Computed by `calcAdherence()` over a 365-day lookback:

- **Current streak:** consecutive days (from today backward) where every scheduled dose is either logged or skipped. Rest days (no scheduled dose) do not break the streak.
- **Longest streak:** same logic, scanned over full 365 days.
- **30-day completion rate:** `logged / scheduled` for last 30 days.
- **Missed analytics:** most-missed day of week, most-missed peptide, 7-day trend vs prior 7 days.

---

## Break period behavior

When a peptide is in its break period:
- A break notice is shown: "**{Name}** — Break period ({N} days remaining). Resume when break ends."
- No dose is rendered for that peptide on that date
- Break days do not count as missed for adherence purposes
- Cycle number auto-increments when the next cycle begins

---

## Edge cases

| Scenario | Behavior |
|---|---|
| App opened on `startDate` | First dose shown as "Due Today" |
| App opened day before `startDate` | Status `off` — no dose shown |
| `startDate` is in the future | No doses shown until that date |
| User deletes a peptide | Removed from `schedule[]`; historical injection log entries persist |
| `cycleDays: 0` + no break | Indefinite — doses continue forever |
| All overdue doses skipped at once | Each counts as completed; streak still 0 because prior unresolved days exist |
| Storage corrupted (localStorage) | `safeGetJSON` returns `[]` fallback; schedule appears empty until restored via import |

---

## Known gaps (not yet implemented)

1. **No bulk-resolve for overdue doses.** After a 90-day gap, user must tap through each day individually. A "skip all overdue" bulk action would reduce friction.
2. **No overdue count limit.** Extremely long gaps produce many overdue entries without throttling or summarization.
3. **No re-engagement prompt.** App does not surface a "welcome back" message after a gap or suggest restarting/adjusting the protocol.
4. **No push notifications.** PWA with no service worker push registration — reminders are purely visual when the app is open.
5. **Skipped doses count toward streaks.** This is intentional (conscious decision = completion) but may surprise users who expect streaks to mean "actually injected."
