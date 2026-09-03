# On A Trip Holidays — V23 AI Itinerary Maker

V23 adds an AI Itinerary Maker directly into the existing admin workflow.

## Admin
- `admin-ai-itinerary.html` — protected AI itinerary workspace.
- Added `✨ AI Itinerary` to `admin-v4-crm.html`.
- Uses the existing `oat_admin_auth` session gate.
- Mobile-first form + customer-ready preview.
- Presets for Char Dham, Kedarnath, Kashmir, Ladakh, Kerala and Thailand.
- Draft saving uses browser localStorage in this static build.
- Print / Save PDF uses the browser print dialog.

## AI integration
The current static build contains an AI-ready workflow plus a local rule-based draft generator so it works immediately without exposing an API key.

For production live AI, connect the Generate action to a server-side endpoint (for example a Vercel/Next.js function) that stores `OPENAI_API_KEY` only on the server and returns validated structured itinerary JSON.

## Important
This version intentionally does not put an OpenAI secret in browser JavaScript.
