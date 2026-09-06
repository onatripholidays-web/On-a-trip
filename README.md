# Team OAT — On A Trip Business App

Single app shell combining the original CRM, AI Itinerary & Quotation Maker, Invoice Maker and Admin Panel.

## Modules
- CRM — original `crm/index.html`, including its existing Supabase integration
- AI Itinerary — `ai-itinerary/index.html`
- Invoice Maker — `invoice-maker/index.html`
- Admin — `admin-panel/index.html`

## Shared backend
Keep the existing Supabase project/configuration. Do not create a second Supabase project unless intentionally migrating.

## Deployment
Deploy this whole `Team-OAT` folder as one static web app. The root `index.html` is the app entry point. Preserve the `api/` directory under `ai-itinerary` when deploying to a platform that supports the existing AI API routes.

Recommended domain: `team.onatripholidays.com` (or another domain you choose).
