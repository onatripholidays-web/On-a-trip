V25 AI ITINERARY FIX — UPDATE ONLY

Files in this ZIP:
- admin-ai-itinerary.html
- api/generate-itinerary.js

What this fixes:
1. Removes the `undefined` destination bug.
2. Requires a real destination before generation.
3. Stops silently falling back to a generic fake itinerary.
4. Shows the actual API error in the admin screen.
5. Makes the server validate the destination.
6. Forces exactly the requested number of days.
7. Makes the AI produce destination-specific daily plans.
8. Adds a GET health check at /api/generate-itinerary.
9. Keeps OPENAI_API_KEY server-side only.
10. Preserves the supplied quote amount.

Deployment:
1. Replace the existing admin-ai-itinerary.html in the GitHub root.
2. Replace api/generate-itinerary.js in the api folder.
3. Commit both to main.
4. Vercel will deploy automatically.
5. Test:
   /api/generate-itinerary
   A successful GET should return JSON with ok:true and configured:true.
6. Then open:
   /admin-ai-itinerary.html
   and generate a real itinerary.

IMPORTANT:
- Do not put the OpenAI API key in any HTML or JavaScript browser file.
- Do not send the API key in chat.
- The PDF button uses the browser print dialog to save a PDF.
