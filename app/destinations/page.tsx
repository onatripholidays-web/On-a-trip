import type { Metadata } from "next";
import SitePage from "@/components/SitePage";

export const metadata: Metadata = {
  title: "Tour Packages from Hyderabad | Pilgrimage, Himalayas, South India & North East",
  description: "Explore focused tour packages from Hyderabad with Telugu-first support: pilgrimage tours, Himachal, Uttarakhand, Kashmir, Ladakh, South India, North East India and Bhutan.",
  alternates: { canonical: "/destinations" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: {
    title: "Tour Packages from Hyderabad | Pilgrimage, Himalayas, South India & North East",
    description: "Explore focused tour packages from Hyderabad with Telugu-first support: pilgrimage tours, Himachal, Uttarakhand, Kashmir, Ladakh, South India, North East India and Bhutan.",
    url: "/destinations",
    siteName: "On A Trip Holidays",
    type: "website",
  },
};

export default function Page() {
  return (
    <SitePage>
      <nav className="nav">
<a className="brand" href="/"><img alt="On A Trip Holidays" src="assets/logo.png" /></a>
<div className="navlinks">
<a href="/packages">Packages</a><a href="/pilgrimage">Pilgrimage</a>
<a href="/blogs">Blogs</a><a href="/about">About</a><a href="/contact">Contact</a>
</div>
<a className="wa" href="https://wa.me/919182894146?text=Hi%20On%20A%20Trip%20Holidays%2C%20I%20want%20a%20tour%20quote">WhatsApp Us</a>
</nav>
<main className="tc-seo-wrap">
<div className="tc-breadcrumb"><a href="/">Home</a> / Destinations</div>
<section className="tc-hero">
<div className="tc-kicker">Hyderabad • Telugu-first travel support</div>
<h1>Tour Packages from Hyderabad</h1>
<p>Choose from carefully curated pilgrimage, Himalayan, South India and North East holidays. We focus on destinations where our team can provide practical group-travel support.</p>
</section>
<h2>🕉️ Pilgrimage Tours</h2>
<p>Our pilgrimage focus includes Char Dham and Kedarnath in Uttarakhand, Maharashtra's three Jyotirlingas, Somnath–Dwarka–Nageshwar in Gujarat, Ujjain–Omkareshwar in Madhya Pradesh, Baidyanath in Jharkhand, Puri–Konark in Odisha and Kamakhya in Assam.</p>
<p><a href="/pilgrimage">Explore pilgrimage tours →</a></p>
<h2>🏔️ Himachal Pradesh Tour Packages</h2>
<p>Our Himachal focus is simple and dedicated: <strong>Shimla, Manali and Kasol</strong>. These can be planned as group or customised holidays from Hyderabad.</p>
<p><a href="/shimla-tour-packages-from-hyderabad">Shimla</a> · <a href="/manali-tour-packages-from-hyderabad">Manali</a></p>
<h2>🕉️ Uttarakhand Tours</h2>
<p>Explore Uttarakhand pilgrimage and mountain journeys, with Char Dham, Kedarnath and Do Dham as the core pilgrimage offerings.</p>
<p><a href="/char-dham-yatra-packages-from-hyderabad">Char Dham from Hyderabad →</a></p>
<h2>🏔️ Himalayan Adventures</h2>
<p>Our adventure focus includes <strong>Kashmir, Ladakh and Spiti Valley</strong>, with route planning and practical preparation guidance.</p>
<p><a href="/hyderabad-to-kashmir-tour-packages">Kashmir</a> · <a href="/hyderabad-to-ladakh-tour-packages">Ladakh</a> · <a href="/hyderabad-to-spiti-valley-tour">Spiti Valley</a></p>
<h2>🌴 South India Tours</h2>
<p>Our current South India focus is <strong>Kerala, Coorg & Chikmagalur, Ooty & Wayanad, and Pondicherry</strong>. Other destinations can be considered on request rather than crowding the main package catalogue.</p>
<p></p>
<h2>🌄 North East India & Bhutan</h2>
<p>Our North East focus includes <strong>Sikkim, Darjeeling, Gangtok, Meghalaya, Arunachal Pradesh, Tawang</strong> and <strong>Bhutan</strong>. Kamakhya can be combined with suitable Assam itineraries.</p>
<p> · <a href="/hyderabad-to-spiti-valley-tour">Browse travel guides</a></p>
<h2>🏜️ Special Experiences</h2>
<p><strong>Rann of Kutch</strong> is available as a focused Gujarat experience and can be promoted seasonally.</p>
<div className="tc-cta">
<h2>Tell us where you want to go</h2>
<p>Share your destination, travel month and number of travellers. Our team can suggest a suitable group or customised plan.</p>
<a href="/contact">Plan my trip →</a>
</div>
</main>
<footer className="footer"><div><img alt="On A Trip Holidays" src="assets/logo.png" /><p>Hyderabad-based travel planning with Telugu-first group support.</p></div></footer>
    </SitePage>
  );
}
