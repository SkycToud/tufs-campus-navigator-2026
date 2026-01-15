# TUFS Campus Navigator 2026 - Maintenance Guide

This document is intended for developers who will maintain this application in the future.

## Overview

The application is built with **React**, **TypeScript**, and **Vite**.
It mainly relies on static logic to determine facility statuses (Open/Closed) based on predefined schedules.

## Key Files

*   **`src/lib/schedules.ts`**: Contains **ALL** schedule data. This is the most important file for regular updates.
*   **`src/lib/status-utils.ts`**: Contains the logic to determine if a facility is open/closed and what color/text to display.
*   **`src/contexts/LanguageContext.tsx`**: Contains all text translations (Japanese/English).

## Common Maintenance Tasks

### 1. Updating Schedules (Yearly/Semester updates)

All schedule data is located in `src/lib/schedules.ts`.
The `CONST_SCHEDULE_DATA` object holds configuration for each facility.

**To add a new semester's schedule:**
1.  Open `src/lib/schedules.ts`.
2.  Locate the `rules` array for the target facility.
3.  Add new rules using the helper functions:
    *   `Rules.weekday(hours)`: Sets the default schedule for weekdays.
    *   `Rules.subWeekday('saturday', hours)`: Sets the schedule for Saturdays.
    *   `Rules.range(start, end, hours, note)`: Sets a schedule for a specific date range.
    *   `Rules.date(date, hours, note)`: Sets a schedule for a specific date.
    *   `Rules.closedDate(date, note)`: Closes the facility on a specific date.

**Example:**
```typescript
// Add special short hours for Exam week
Rules.range('2026-02-01', '2026-02-07', times('11:00', '14:00'), 'note.short_hours'),
```

### 2. Adding/Updating Translations

If you add a new "Note" or status text, you must add it to the translation system.

1.  Open `src/contexts/LanguageContext.tsx`.
2.  Add a new key to the `translations` object:
    ```typescript
    'note.my_new_event': { ja: '私の新しいイベント', en: 'My New Event' },
    ```
3.  Use this key in `schedules.ts` instead of raw text:
    ```typescript
    Rules.date('2026-05-01', [], 'note.my_new_event')
    ```

### 3. Modifying Status Colors

The logic for determining the color of status pills (e.g., Green for Open, Orange for Short Hours) is currently **hardcoded** in `src/lib/status-utils.ts`.

**Warning:** The color logic often depends on exact time string matches (e.g., "11:00-14:30"). If you change the hours in `schedules.ts`, you might need to update the logic in `status-utils.ts` to ensure the correct color is applied.

**Location:** `src/lib/status-utils.ts` -> `getFacilityDailyInfo` function -> "Custom logic for..." sections.

```typescript
// Example logic in status-utils.ts
if (facilityId === 'store') {
    if (hoursText === '11:00-16:30') color = 'green'; // Standard
    else if (hoursText === '11:00-15:00') color = 'orange'; // Short
    // ...
}
```

## Deployment

The project is deployed on **Vercel**.
Any push to the `main` branch will trigger an automatic build and deployment.

## Troubleshooting Build Errors

If you encounter build errors related to "unused variables" (e.g., `TS6133`), it is because strict linting is enabled.
*   **Fix:** Remove the unused variable or prefix it with `_` (underscore).
*   **Fix:** Ensure you haven't imported a module that you aren't using.
