# V24 — Real AI Itinerary Builder

## What changed
- Removed the old CRM-heavy admin experience.
- Admin is now intentionally limited to:
  1. Clean dashboard
  2. Upcoming Batch Highlights
  3. Photo Updater
  4. AI Itinerary Builder
- AI Itinerary Builder calls `/api/generate-itinerary`.
- The serverless endpoint calls OpenAI with `OPENAI_API_KEY` kept server-side.
- Quote preview can be printed to PDF from the browser.
- WhatsApp button opens WhatsApp with the guest/quote message.

## Enable live AI on Vercel
Add these Environment Variables in the Vercel project:
- `OPENAI_API_KEY` = your OpenAI API key
- `OPENAI_MODEL` = your chosen compatible model (default in code: `gpt-5.6`)

Redeploy after adding variables.

## Admin login
The included demo login is:
- ID: admin
- Password: OnATrip@2026

Change this before production. This demo gate is client-side and is not a secure production authentication system.

## Quote PDF
The "Print / Save PDF" button uses the browser's print dialog. Choose "Save as PDF". This avoids exposing payment/customer data to a third-party PDF service.
