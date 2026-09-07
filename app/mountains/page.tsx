import type { Metadata } from "next";
import SitePage from "@/components/SitePage";

export const metadata: Metadata = {
  title: "Mountain Destinations | Ladakh, Spiti, Manali & Himalayas | On A Trip Holidays",
  description: "Explore mountain holidays from On A Trip Holidays including Ladakh, Spiti Valley, Manali, Kashmir, Sikkim and Himachal itineraries with Telugu-first travel support.",
  alternates: { canonical: "/mountains" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: {
    title: "Mountain Destinations | Ladakh, Spiti, Manali & Himalayas | On A Trip Holidays",
    description: "Explore mountain holidays from On A Trip Holidays including Ladakh, Spiti Valley, Manali, Kashmir, Sikkim and Himachal itineraries with Telugu-first travel support.",
    url: "/mountains",
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
<a href="/">Home</a><a href="/packages">Destinations</a><a href="/packages">Packages</a>
<a href="/pilgrimage">On A Trip Temple</a><a href="packages.html#batches">Upcoming Batches</a>
<a href="/blogs">Reviews</a><a href="/blogs">Travel Reels</a><a href="/about">About Us</a><a href="/contact">Contact Us</a>
</div>
<a className="wa" href="/contact">Plan My Trip</a>
</nav>
<section className="hero">
<div className="hero-inner">
<div className="eyebrow">MOUNTAIN DESTINATIONS</div>
<h1>Chase the <span>mountains.</span></h1>
<p>Ladakh, Spiti, Manali, Kashmir, Sikkim and more — choose your Himalayan escape and let us plan the route.</p>
<div className="actions"><a className="btn" href="contact.html?category=mountains">Plan My Mountain Trip</a><a className="btn light" href="/packages">View All Packages</a></div>
</div>
</section>
<section className="section">
<div className="head"><div><div className="eyebrow">EXPLORE BY DESTINATION</div><h2>Mountain Holidays</h2></div><p>Adventure routes, scenic hill stations and Himalayan circuits selected for sightseeing-focused travel.</p></div>
<div className="grid">
<article className="card"><div className="cardimg"><img alt="Ladakh mountains" src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&amp;fit=crop&amp;w=1000&amp;q=85" /><span className="badge">HIMALAYAS</span></div><div className="cardbody"><h3>Ladakh</h3><div className="route">Leh • Nubra • Pangong • Khardung La</div><div className="price">From ₹19,999</div><div className="cardactions"><span className="pill">Mountain</span><a className="small" href="/package-ladakh">View Trip →</a></div></div></article>
<article className="card"><div className="cardimg"><img alt="Spiti Valley" src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&amp;fit=crop&amp;w=1000&amp;q=85" /><span className="badge">ADVENTURE</span></div><div className="cardbody"><h3>Spiti Valley</h3><div className="route">Shimla • Kinnaur • Kaza • Chandratal</div><div className="price">From ₹16,999</div><div className="cardactions"><span className="pill">Mountain</span><a className="small" href="/package-spiti">View Trip →</a></div></div></article>
<article className="card"><div className="cardimg"><img alt="Manali mountains" src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&amp;fit=crop&amp;w=1000&amp;q=85" /><span className="badge">POPULAR</span></div><div className="cardbody"><h3>Manali</h3><div className="route">Manali • Solang • Rohtang • Local Sightseeing</div><div className="price">From ₹8,999</div><div className="cardactions"><span className="pill">Hill Station</span><a className="small" href="/package-manali">View Trip →</a></div></div></article>
<article className="card"><div className="cardimg"><img alt="Shimla Manali hills" src="https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&amp;fit=crop&amp;w=1000&amp;q=85" /><span className="badge">HIMACHAL</span></div><div className="cardbody"><h3>Shimla & Manali</h3><div className="route">Shimla • Kufri • Manali • Solang</div><div className="price">View Package</div><div className="cardactions"><span className="pill">Mountain</span><a className="small" href="/package-shimla-manali">View Trip →</a></div></div></article>
<article className="card"><div className="cardimg"><img alt="Kashmir mountains" src="https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&amp;fit=crop&amp;w=1000&amp;q=85" /><span className="badge">SCENIC</span></div><div className="cardbody"><h3>Kashmir</h3><div className="route">Srinagar • Gulmarg • Pahalgam • Sonamarg</div><div className="price">From ₹18,999</div><div className="cardactions"><span className="pill">Valleys</span><a className="small" href="/package-kashmir">View Trip →</a></div></div></article>
<article className="card"><div className="cardimg"><img alt="Sikkim mountains" src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&amp;fit=crop&amp;w=1000&amp;q=85" /><span className="badge">NORTH EAST</span></div><div className="cardbody"><h3>Sikkim</h3><div className="route">Gangtok • Tsomgo Lake • Nathula • Pelling</div><div className="price">View Package</div><div className="cardactions"><span className="pill">Himalayas</span></div></div></article>
<article className="card"><div className="cardimg"><img alt="Kasol and Himachal valley" src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&amp;fit=crop&amp;w=1000&amp;q=85" /><span className="badge">YOUTH FAVOURITE</span></div><div className="cardbody"><h3>Shimla • Manali • Kasol</h3><div className="route">Shimla • Manali • Kasol • Himalayan sightseeing</div><div className="price">View Package</div><div className="cardactions"><span className="pill">Mountain</span><a className="small" href="/package-shimla-manali-kasol">View Trip →</a></div></div></article>
<article className="card"><div className="cardimg"><img alt="Ladakh Tso Moriri landscape" src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&amp;fit=crop&amp;w=1000&amp;q=85" /><span className="badge">LADAKH</span></div><div className="cardbody"><h3>Ladakh Tso Circuit</h3><div className="route">Leh • Pangong • Hanle • Tso Moriri</div><div className="price">View Package</div><div className="cardactions"><span className="pill">Adventure</span><a className="small" href="/package-ladakh-tso">View Trip →</a></div></div></article>
</div>
</section>
<section className="section"><div className="offer"><div><h2>Not sure which mountain trip?</h2><p>Tell us your dates, group size and budget — we’ll recommend the right destination.</p></div><a className="btn light" href="contact.html?category=mountains">Get Recommendation</a></div></section>
<div aria-label="Go to top" className="v18-page-top"><button aria-label="Go to top" type="button">⌃</button></div>
<div className="v18-wa"><a aria-label="WhatsApp us" href="https://wa.me/919182894146?text=Hi%20On%20A%20Trip%20Holidays%2C%20I%20want%20to%20plan%20a%20trip"><svg aria-hidden="true" viewbox="0 0 32 32"><path d="M19.11 17.29c-.27-.14-1.58-.78-1.82-.87-.24-.09-.42-.14-.6.14-.18.27-.69.87-.85 1.05-.16.18-.31.2-.58.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.42.12-.56.12-.12.27-.31.4-.47.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.14-.6-1.44-.82-1.97-.22-.52-.44-.45-.6-.46h-.51c-.18 0-.47.07-.71.34-.24.27-.93.91-.93 2.22s.96 2.57 1.09 2.75c.13.18 1.89 2.88 4.58 4.04.64.28 1.14.44 1.53.56.64.2 1.22.17 1.68.1.51-.08 1.58-.65 1.8-1.27.22-.62.22-1.15.16-1.27-.07-.11-.24-.18-.51-.31z" fill="currentColor"></path><path d="M16.03 3.2c-7.07 0-12.8 5.72-12.8 12.77 0 2.25.59 4.36 1.63 6.19L3.2 28.8l6.83-1.64a12.78 12.78 0 0 0 6 1.48h.01c7.06 0 12.79-5.73 12.79-12.78S23.1 3.2 16.03 3.2zm0 23.36h-.01a10.58 10.58 0 0 1-5.39-1.47l-.39-.23-4.05.97.98-3.95-.25-.41a10.56 10.56 0 1 1 9.11 5.09z" fill="currentColor"></path></svg></a></div>
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
<a href="/packages">All Packages</a><a href="/pilgrimage">Pilgrimage</a><a href="/itineraries">Itineraries</a><a href="packages.html#batches">Batch Dates</a><a href="/blogs">Travel Blog</a><a href="blogs.html#new-destination-guides">Guides</a><a href="/about">About Us</a><a href="/contact">Contact Us</a>
</div>
<div className="oat-footer-divider"></div>
<div className="oat-copy">© 2026 On A Trip Holidays. All rights reserved.</div>
</footer>
    </SitePage>
  );
}
