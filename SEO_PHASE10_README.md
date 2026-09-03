# SEO PHASE 10 — Technical Cleanup

Changes in V10:
- Kept sitemap focused on HTML URLs; itinerary PDFs are not listed in sitemap.
- Added X-Robots-Tag: noindex to /itinerary/*.pdf so downloadable itineraries remain accessible without competing with HTML landing pages in search.
- Added noindex/nofollow/noarchive to internal admin/CRM/meta/duplicate pages.
- Preserved existing robots.txt and sitemap URL.
- Preserved all public SEO landing pages and existing redirects.

Deployment:
1. Extract On-a-trip-main.
2. Upload/replace the repository contents.
3. After deployment, verify homepage, sitemap.xml and a few priority landing pages.
4. In Search Console, do not repeatedly request indexing; let the sitemap drive discovery.
