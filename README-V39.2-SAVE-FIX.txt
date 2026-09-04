V39.2 — ADMIN SAVE + MOBILE NAV FIX (CHANGES ONLY)

Replace ONLY:
  admin-v4-crm.html

Fixes:
- Add Batch now uses explicit DOM field reads and saves to localStorage.
- Edit/Update Batch persists changes and preserves the batch ID.
- Add/Edit Package persists changes to the admin database.
- Add/Edit CRM Lead persists all fields, including email, expected value and notes.
- Lead status changes persist.
- Storage errors are caught and reported instead of silently failing.
- Compact mobile quick navigation: Home / Invoice / Quotation / Back.
- Quick navigation is shorter and no longer covers modal Save buttons.
- Modals are always above the quick navigation.
- Existing V39 admin database key and migration keys are retained.

This ZIP contains CHANGES ONLY, not the full project.
