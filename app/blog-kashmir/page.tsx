import type { Metadata } from "next";
import SitePage from "@/components/SitePage";

export const metadata: Metadata = {
  title: "Best Places to Visit in Kashmir",
  description: "On A Trip Holidays \u2014 Telugu travel specialists for pilgrimage, domestic, adventure and international tours.",
  alternates: { canonical: "/blog-kashmir" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: {
    title: "Best Places to Visit in Kashmir",
    description: "On A Trip Holidays \u2014 Telugu travel specialists for pilgrimage, domestic, adventure and international tours.",
    url: "/blog-kashmir",
    siteName: "On A Trip Holidays",
    type: "website",
  },
};

export default function Page() {
  return (
    <SitePage>
      <nav className="nav"><a className="brand" href="/"><img alt="On A Trip Holidays" src="assets/logo.png" /></a><div className="navlinks"><a href="/packages">Packages</a><a href="/pilgrimage">Pilgrimage</a><a href="/itineraries">Itineraries</a><a href="packages.html#batches">Batches</a><a href="/blogs">Blogs</a><a href="blogs.html#new-destination-guides">Guides</a><a href="/about">About</a><a href="/contact">Contact</a></div><a className="wa" href="https://wa.me/919182894146?text=Hi%20On%20A%20Trip%20Holidays%2C%20I%20want%20a%20travel%20quote">WhatsApp Us</a></nav><section className="hero"><div className="hero-inner"><div className="eyebrow">Domestic</div><h1>Best Places to Visit in Kashmir</h1><p>A simple guide to Srinagar, Pahalgam, Gulmarg and Sonamarg for first-time visitors.</p></div></section><section className="section"><div className="form"><h2>Best Places to Visit in Kashmir</h2><p>A simple guide to Srinagar, Pahalgam, Gulmarg and Sonamarg for first-time visitors. This article can be expanded by the admin with day-wise routes, inclusions, hotel options, FAQs and booking information.</p><h3>Plan your trip</h3><p>Share your dates, number of travellers and departure city. Our team will suggest the best available batch or a private itinerary.</p><a className="btn" href="contact.html?package=kashmir">Get Package Quote</a></div></section><div aria-label="Go to top" className="v18-page-top"><button aria-label="Go to top" type="button">⌃</button></div>
<div className="v18-wa"><a aria-label="WhatsApp us" href="https://wa.me/919182894146?text=Hi%20On%20A%20Trip%20Holidays%2C%20I%20want%20to%20plan%20a%20trip"><svg aria-hidden="true" viewBox="0 0 32 32"><path d="M19.11 17.29c-.27-.14-1.58-.78-1.82-.87-.24-.09-.42-.14-.6.14-.18.27-.69.87-.85 1.05-.16.18-.31.2-.58.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.42.12-.56.12-.12.27-.31.4-.47.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.14-.6-1.44-.82-1.97-.22-.52-.44-.45-.6-.46h-.51c-.18 0-.47.07-.71.34-.24.27-.93.91-.93 2.22s.96 2.57 1.09 2.75c.13.18 1.89 2.88 4.58 4.04.64.28 1.14.44 1.53.56.64.2 1.22.17 1.68.1.51-.08 1.58-.65 1.8-1.27.22-.62.22-1.15.16-1.27-.07-.11-.24-.18-.51-.31z" fill="currentColor"></path><path d="M16.03 3.2c-7.07 0-12.8 5.72-12.8 12.77 0 2.25.59 4.36 1.63 6.19L3.2 28.8l6.83-1.64a12.78 12.78 0 0 0 6 1.48h.01c7.06 0 12.79-5.73 12.79-12.78S23.1 3.2 16.03 3.2zm0 23.36h-.01a10.58 10.58 0 0 1-5.39-1.47l-.39-.23-4.05.97.98-3.95-.25-.41a10.56 10.56 0 1 1 9.11 5.09z" fill="currentColor"></path></svg></a></div>
<footer className="oat-company-footer">
<h3 className="oat-company-name">ON A TRIP HOLIDAYS</h3>
<p className="oat-company-tag">Trusted travel company for Telangana & Andhra Pradesh — Telugu-first support for pilgrimage, domestic, adventure and international holidays.</p>
<div className="oat-company-details">
<a href="mailto:travel@onatripholidays.com">travel@onatripholidays.com</a>
<a href="tel:+919182894146">+91 91828 94146</a>
<span>Hyderabad • Vijayawada • Telangana & Andhra Pradesh</span>
</div>
<div aria-label="Social links" className="oat-socials">
<a aria-label="Instagram" href="https://www.instagram.com/onatriphyd/" rel="noopener" target="_blank">IG</a>
<a aria-label="WhatsApp" href="https://wa.me/919182894146" rel="noopener" target="_blank">WA</a>
<a aria-label="Email" href="mailto:travel@onatripholidays.com">@</a>
</div>
<div aria-hidden="true" className="oat-skyline">✦ • 🕌 • 🛕 • 🏔️ • ✈ • 🌴 • 🛕 • 🕌 • ✦</div>
<div className="oat-footer-links">
<a href="/packages">All Packages</a><a href="/pilgrimage">Pilgrimage</a><a href="packages.html#batches">Batch Dates</a><a href="/blogs">Travel Blog</a><a href="blogs.html#new-destination-guides">Guides</a><a href="/about">About Us</a><a href="/contact">Contact Us</a>
</div>
<div className="oat-footer-divider"></div>
<div className="oat-copy">© 2026 On A Trip Holidays. All rights reserved.</div>
</footer>
    </SitePage>
  );
}
