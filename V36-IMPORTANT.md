V36 CHANGES ONLY — ADMIN DASHBOARD + PAYMENT INVOICER

This patch fixes the dashboard file that was still showing the old Photos/AI Itinerary layout.

Replace these files in the GitHub repository root:
- admin.html
- admin-dashboard.html
- admin-v4-crm.html  <-- IMPORTANT: this was the old dashboard entry still used by the existing admin workflow
- admin-ai-itinerary.html
- payment-invoicer.html

Replace:
- assets/logo.png

After committing, wait for Vercel deployment to finish, then hard-refresh the admin page.

V36 includes:
- AI Itinerary Builder renamed to AI Quotation Maker
- Payment Invoicer added to the dashboard
- Update Photos removed from the dashboard navigation/cards
- Existing Upcoming Batches retained
- Payment invoice / travel confirmation voucher workflow retained
- Main On A Trip Holidays logo used across admin pages
