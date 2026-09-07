import type { Metadata } from "next";
import SitePage from "@/components/SitePage";

export const metadata: Metadata = {
  title: "Kashi Ayodhya Yatra from Hyderabad | On A Trip Holidays",
  description: "Plan a Kashi Ayodhya pilgrimage from Hyderabad covering Varanasi, Kashi Vishwanath, Ayodhya and Sarnath with Telugu-first travel support.",
  alternates: { canonical: "/package-kashi-ayodhya" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: {
    title: "Kashi Ayodhya Yatra from Hyderabad | On A Trip Holidays",
    description: "Plan a Kashi Ayodhya pilgrimage from Hyderabad covering Varanasi, Kashi Vishwanath, Ayodhya and Sarnath with Telugu-first travel support.",
    url: "/package-kashi-ayodhya",
    siteName: "On A Trip Holidays",
    type: "website",
  },
};

export default function Page() {
  return (
    <SitePage>
      <nav className="nav"><a className="brand" href="/"><img alt="On A Trip Holidays" src="assets/logo.png" /></a><div className="navlinks"><a href="/packages">Packages</a><a href="/pilgrimage">Pilgrimage</a><a href="/itineraries">Itineraries</a><a href="packages.html#batches">Batches</a><a href="/blogs">Blogs</a><a href="blogs.html#new-destination-guides">Guides</a><a href="/about">About</a><a href="/contact">Contact</a></div><a className="wa" href="https://wa.me/919182894146?text=Hi%20On%20A%20Trip%20Holidays%2C%20I%20want%20to%20plan%20kashi%20ayodhya">WhatsApp Us</a></nav>
<section className="hero"><div className="hero-inner"><div className="eyebrow">ON A TRIP TEMPLE • PILGRIMAGE</div><h1>Kashi + Ayodhya Yatra from Hyderabad</h1><p>Hyderabad → Varanasi (Kashi) • Sarnath • Ayodhya</p><div className="actions"><a className="btn" href="contact.html?package=kashi-ayodhya">Get Latest Quote</a><a className="btn light" href="https://wa.me/919182894146?text=Hi%20On%20A%20Trip%20Holidays%2C%20I%20want%20to%20plan%20kashi%20ayodhya">WhatsApp</a></div></div></section>
<section className="section"><div className="grid"><article className="card"><div className="cardbody"><span className="pill">TRIP OVERVIEW</span><h2>Kashi + Ayodhya Yatra from Hyderabad</h2><p><strong>Route:</strong> Hyderabad → Varanasi (Kashi) • Sarnath • Ayodhya</p><p><strong>Typical duration:</strong> 4 Nights / 5 Days (customisable)</p><p><strong>Price:</strong> Latest quote on request — ask us for the current date-wise quote before booking.</p><p>Plan your pilgrimage from Hyderabad with practical travel coordination, accommodation options and Telugu-first support.</p><div className="cardactions"><a className="btn" href="contact.html?package=kashi-ayodhya">Enquire Now</a><a className="small" href="/pilgrimage">← All Pilgrimage Tours</a></div></div></article></div></section>
<section className="section"><div className="grid"><article className="card"><div className="cardbody"><h2>What you can plan</h2><ul><li>Kashi Vishwanath and Varanasi temple visits</li><li>Sarnath sightseeing</li><li>Ayodhya temple and local sightseeing</li><li>Accommodation and transfers based on selected plan</li><li>Custom private or group travel options</li></ul></div></article><article className="card"><div className="cardbody"><h2>Important booking note</h2><p>Darshan, hotel, transport and sightseeing inclusions depend on the selected itinerary and travel dates. Ask for the latest confirmed plan before payment.</p></div></article></div></section>
<section className="section"><div className="card"><div className="cardbody"><h2>Need a customised pilgrimage?</h2><p>Tell us your travel dates, preferred pickup city, group size and hotel preference. We can prepare the latest itinerary and quote.</p><div className="cardactions"><a className="btn" href="contact.html?package=kashi-ayodhya">Request a Quote</a><a className="btn" href="https://wa.me/919182894146?text=Hi%20On%20A%20Trip%20Holidays%2C%20I%20want%20to%20plan%20kashi%20ayodhya">WhatsApp On A Trip</a></div></div></div></section>
<footer className="oat-company-footer"><h3 className="oat-company-name">ON A TRIP HOLIDAYS</h3><p className="oat-company-tag">Telugu-first travel support for pilgrimage, domestic, adventure and international holidays.</p><div className="oat-company-details"><a href="mailto:travel@onatripholidays.com">travel@onatripholidays.com</a><a href="tel:+919182894146">+91 91828 94146</a><span>Hyderabad • Vijayawada • Telangana & Andhra Pradesh</span></div><div className="oat-footer-links"><a href="/packages">All Packages</a><a href="/pilgrimage">Pilgrimage</a><a href="/blogs">Travel Blog</a><a href="/about">About Us</a><a href="/contact">Contact Us</a></div><div className="oat-copy">© 2026 On A Trip Holidays. All rights reserved.</div></footer>
    </SitePage>
  );
}
