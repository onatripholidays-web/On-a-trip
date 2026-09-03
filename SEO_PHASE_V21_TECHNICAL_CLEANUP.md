# V21 — Technical SEO Cleanup

- Fixed missing static H1s on public content pages (including Blogs and Trip Details).
- Added useful fallback copy for the dynamic Trip Details page.
- Added a custom noindex 404 page.
- Added permanent redirects for six legacy `/lp/` campaign URLs and the legacy Hyderabad Amarnath URL.
- Regenerated sitemap.xml from existing canonical, indexable HTML pages only.
- Preserved robots.txt sitemap declaration.
- Preserved V20 destination SEO, schema, redirects and landing pages.

Note: A third-party audit may continue to report historical 4XX URLs until it recrawls the site. V21 removes the known legacy `/lp/` 404 targets from the active URL path by redirecting them.
