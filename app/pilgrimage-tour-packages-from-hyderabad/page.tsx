import type { Metadata } from "next";
import SitePage from "@/components/SitePage";

export const metadata: Metadata = {
  title: "Pilgrimage Tour Packages from Hyderabad | Char Dham, Kedarnath & More",
  description: "Pilgrimage tour packages from Hyderabad covering Char Dham, Kedarnath, Do Dham, Amarnath, Vaishno Devi and Ujjain with Telugu-first travel support.",
  alternates: { canonical: "/pilgrimage-tour-packages-from-hyderabad" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: {
    title: "Pilgrimage Tour Packages from Hyderabad | Char Dham, Kedarnath & More",
    description: "Pilgrimage tour packages from Hyderabad covering Char Dham, Kedarnath, Do Dham, Amarnath, Vaishno Devi and Ujjain with Telugu-first travel support.",
    url: "/pilgrimage-tour-packages-from-hyderabad",
    siteName: "On A Trip Holidays",
    type: "website",
  },
};

export default function Page() {
  return (
    <SitePage>
      <nav className="nav"><a className="brand" href="/"><img alt="On A Trip Holidays" src="assets/logo.png" /></a><div className="navlinks"><a href="/packages">Packages</a><a href="/pilgrimage">Pilgrimage</a><a href="/itineraries">Itineraries</a><a href="/blogs">Blogs</a><a href="blogs.html#new-destination-guides">Guides</a><a href="/about">About</a><a href="/contact">Contact</a></div><a className="wa" href="https://wa.me/919182894146?text=Hi%20On%20A%20Trip%20Holidays%2C%20I%20want%20a%20travel%20quote">WhatsApp Us</a></nav><main className="seo-page"><div className="seo-hero"><div className="eyebrow">ON A TRIP TEMPLE</div><h1>Pilgrimage Tour Packages from Hyderabad</h1><p>Plan a comfortable spiritual journey from Hyderabad with organised transport, accommodation, route assistance and practical preparation guidance for major pilgrimage destinations.</p><div className="seo-cta"><a href="/packages">Explore Packages</a><a href="/contact">Get a Custom Quote</a></div></div><section className="seo-content-grid"><article><h3>Char Dham Yatra</h3><p>Yamunotri, Gangotri, Kedarnath and Badrinath with day-wise route planning.</p><a href="/hyderabad-to-char-dham-yatra">Char Dham from Hyderabad →</a></article><article><h3>Kedarnath Yatra</h3><p>Plan Sonprayag, Kedarnath and return travel with trekking or available transfer options.</p><a href="/hyderabad-to-kedarnath-yatra">Kedarnath from Hyderabad →</a></article><article><h3>Do Dham Yatra</h3><p>Combine Kedarnath and Badrinath with an organised group itinerary.</p><a href="/package-do-dham">Do Dham package →</a></article><article><h3>Amarnath Yatra</h3><p>Explore Amarnath preparation, registration information and travel planning.</p><a href="/hyderabad-to-amarnath-yatra">Amarnath from Hyderabad →</a></article><article><h3>Vaishno Devi Yatra</h3><p>Plan Katra stay and Vaishno Devi pilgrimage with route guidance.</p><a href="/vaishno-devi-from-hyderabad">Vaishno Devi from Hyderabad →</a></article><article><h3>Ujjain & Mahakal</h3><p>Plan Mahakaleshwar and Omkareshwar pilgrimage travel.</p><a href="/package-ujjain">Ujjain package →</a></article></section><section className="seo-guide"><div className="eyebrow">FREQUENTLY ASKED QUESTIONS</div><h2>Planning questions answered</h2><details><summary>When should I plan Char Dham Yatra from Hyderabad?</summary><p>Travel windows depend on temple opening dates, weather and road conditions. Check the latest confirmed batch before booking.</p></details><details><summary>Can senior citizens join pilgrimage group tours?</summary><p>They can, but route difficulty and walking requirements vary. Ask the team for a slower/private option where appropriate.</p></details><details><summary>Are helicopter services included?</summary><p>Helicopter services are destination- and availability-dependent and may be an optional add-on. Confirm before booking.</p></details></section><section className="seo-cta-block"><h2>Ready to plan your trip from Hyderabad?</h2><p>Tell us your destination, travel dates, number of travellers and preferred budget. Our team can help with group and customised options.</p><a href="/contact">Plan My Trip →</a></section></main><footer className="oat-company-footer"><h3 className="oat-company-name">ON A TRIP HOLIDAYS</h3><p className="oat-company-tag">Telugu-first travel support from Hyderabad for pilgrimage, domestic, adventure and international holidays.</p><div className="oat-footer-links"><a href="/packages">All Packages</a><a href="/itineraries">Itineraries</a><a href="/blogs">Travel Blog</a><a href="blogs.html#new-destination-guides">Guides</a><a href="/contact">Contact</a></div><div className="oat-copy">© 2026 On A Trip Holidays. All rights reserved.</div></footer>
    </SitePage>
  );
}
