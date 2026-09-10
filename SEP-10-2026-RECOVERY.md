# On A Trip Holidays — Website Recovery Snapshot
## Date: 10 September 2026

This file is the recovery reference for the website state finalized on 10 September 2026. If a future change breaks the website, use this snapshot together with the Git commit history to restore the stable state.

## Source of truth
- Repository: `onatripholidays-web/On-a-trip`
- Production branch: `main`
- Framework: Next.js App Router / React / TypeScript
- Public website: https://www.onatripholidays.com
- Hosting/deployment: Vercel
- HTML files: none; website is TypeScript/React only
- CRM, AI itinerary maker, invoice maker and admin panel are NOT part of the public website

## Stable state at snapshot
- Latest website source commit at the time of this snapshot: `3faa77380494ebd19446bcebd810d109a4c39308`
- Latest change: aligned the topbar content and updated the traveler statistic text.
- IMPORTANT: The WeGoDigitally-style animation experiments from 10 September were reverted and are NOT part of this stable snapshot.

## Website/brand updates completed
1. Rebuilt/cleaned the public website around the current On A Trip Holidays structure.
2. Preserved responsive/adaptive behavior for desktop, Mac, Android, iPhone, tablets and landscape/split-screen use.
3. Removed old `.html` route architecture and use Next.js routes instead.
4. Added/finalized package and destination route structure, including dynamic package/destination pages.
5. Added SEO infrastructure: metadata/canonical/OG/Twitter handling, robots.txt, sitemap, redirects, TravelAgency schema, README and llms.txt.
6. Fixed/redirected broken legacy package/blog routes identified during the website audit.
7. Added destination-specific package imagery and fallback image handling.
8. Finalized enquiry form and WhatsApp enquiry flow.
9. Finalized package dropdown with current approved destinations/packages.
10. Finalized About page structure and founder section.
11. Removed the unwanted About hero people/silhouette graphic.
12. Removed the duplicate Founder & CEO subtitle requested from the About page.
13. Finalized About statistics:
   - 1 Lakh+ — Successful Travelers
   - 5,000+ — Successful Trips
   - 5+ — Years in the travel industry
   - 2021 — On A Trip Holidays founded
14. Finalized team section with 15 employees, 5-per-row / 3-row design, expandable contact details and Chiefs/Trip Coordinators information.
15. Updated team roles, names, official emails and phone numbers according to the finalized employee list.
16. Updated/renamed team employee photo assets using the numbered filenames in `public/assets`.
17. Corrected founder image asset to `public/assets/nikhil-ceo.png`.
18. Moved the chefs/trip-coordinators banner to below team photos and above traveler statistics.
19. Finalized banner copy:
   - 5 Telugu Chef's — Serving authentic, delicious Telugu cuisine throughout your journey.
   - 10 Trip Coordinators — Dedicated trip coordinators ensuring a smooth, organized, and memorable travel experience.
20. Enhanced the About Founder’s Vision and What We Believe cards with premium brand styling.
21. Updated footer section heading styling to On A Trip brand color.
22. Updated footer email to `Travel@onatripholidays.com`.
23. Replaced the floating WhatsApp placeholder with a WhatsApp icon and retained the WhatsApp contact link.
24. Updated the top announcement bar traveler statistic from `50K+ travellers served` to `1 Lakh+ Successful Travelers`.
25. Aligned the complete topbar line: location on the left, traveler statistic centered, Instagram/YouTube on the right.

## Current topbar
- Left: `📍 Hyderabad • Vijayawada • All India Departures`
- Center: `⭐ 1 Lakh+ Successful Travelers`
- Right: `Instagram` and `YouTube`

## Current approved package/destination set
### Pilgrimage
- Char Dham Yatra
- Do Dham Yatra
- Kedarnath Yatra

### Domestic
- Manali
- Kashmir
- Ladakh
- Spiti
- Kerala

### International
- Thailand
- Bali
- Dubai
- Vietnam
- Nepal

South India packages other than Kerala are excluded.

## Current employee list
1. K. Harshika — COO
2. K. Naveen — Digital Marketing Manager
3. CH. Vedavyas — Content Creator
4. K. Abhilash — Editor
5. K. Mallesh — Trip Captain
6. C. Sai Subramanyam — HR Administrator
7. B. Sai Kumar — Sales Manager
8. K. Rohini — Sales Manager
9. T. Godavari — CRM (Customer Relation Manager)
10. M. Shivani — Sales Executive
11. K. Manusha — Sales Executive
12. G. Shravanthi — Sales Executive
13. B. Prabhavathi — Sales Executive
14. N. Vaishnavi — Sales Executive
15. G. Shireesha — Sales Executive

## Team image filenames
- `01-coo-k-harshika.jpg`
- `02-digital-marketing-manager-k-naveen.jpg`
- `03-content-creator-ch-vedavyas.jpg`
- `04-editor-k-abhilash.jpg`
- `05-trip-captain-k-mallesh.jpg`
- `06-hr-administrator-c-sai-subramanyam.jpg`
- `07-sales-manager-b-sai-kumar.jpg`
- `08-sales-manager-k-rohini.jpg`
- `09-crm-t-godavari.jpg`
- `10-sales-executive-m-shivani.jpg`
- `11-sales-executive-k-manusha.jpg`
- `12-sales-executive-g-shravanthi.jpg`
- `13-sales-executive-b-prabhavathi.jpg`
- `14-sales-executive-n-vaishnavi.jpg`
- `15-sales-executive-g-shireesha.jpg`

## Important finalized business details
- Brand: On A Trip Holidays
- Founder & CEO: Kadamanchi Nikhil
- Phone/WhatsApp: +91 91828 94146
- GST: 36GMYPK9431B1ZK
- Email: Travel@onatripholidays.com
- Founder email: kadamanchinikhil1@gmail.com
- Office: Metro Pillar No. A1454, Banaras Arcade, 16-2-701/614A, Room No.2, beside Chermas, Hyderabad, Telangana 500036
- Google Maps: https://maps.app.goo.gl/L7ouM5yy2vXGUVhT7
- Instagram: https://www.instagram.com/onatripholidays/?hl=en
- Facebook: https://www.facebook.com/p/Onatrip-Holidays-100088055905534/
- YouTube: https://www.youtube.com/@Onatripholidays
- Founder Instagram: https://www.instagram.com/kadamanchi_nikhil/
- Founder LinkedIn: https://www.linkedin.com/in/nikhil-kadamanchi/

## Founder section finalized copy
- Name: Kadamanchi Nikhil
- Title: Founder & CEO — On A Trip Holidays
- Tagline: Turning a passion for travel into journeys worth remembering.
- Quote: “I believe the best journeys don't just take you to new places — they create stories you carry with you.”
- Founder image: `/assets/nikhil-ceo.png`

## Important recovery rule
Do NOT restore any of the experimental animation commits from 10 September unless specifically requested. The animation experiment caused a production rendering/build problem and was intentionally reverted. The stable website snapshot above is the preferred recovery point.

## Recovery strategy
If the website breaks later:
1. Treat this file as the functional/content checklist.
2. Use Git history to locate the stable commit around `3faa773` and the preceding stable commits.
3. Restore the stable `main` source before applying any new change.
4. Verify Vercel production deployment before making additional edits.
5. Keep this recovery file updated whenever a major stable website milestone is finalized.
