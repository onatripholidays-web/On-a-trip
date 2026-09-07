import type { Metadata } from "next";
import SitePage from "@/components/SitePage";

export const metadata: Metadata = {
  title: "Delhi Tour Packages from Hyderabad | Sightseeing & Golden Triangle",
  description: "Explore Delhi tour packages from Hyderabad for sightseeing, family holidays and Golden Triangle trips with hotel, transfers and guided planning.",
  alternates: { canonical: "/delhi-tour-packages-from-hyderabad" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: {
    title: "Delhi Tour Packages from Hyderabad | Sightseeing & Golden Triangle",
    description: "Explore Delhi tour packages from Hyderabad for sightseeing, family holidays and Golden Triangle trips with hotel, transfers and guided planning.",
    url: "/delhi-tour-packages-from-hyderabad",
    siteName: "On A Trip Holidays",
    type: "website",
  },
};

export default function Page() {
  return (
    <SitePage>
      <nav className="nav"><a className="brand" href="/"><img alt="On A Trip Holidays" src="assets/logo.png" /></a><div className="navlinks"><a href="/packages">Packages</a><a href="/pilgrimage">Pilgrimage</a><a href="packages.html#batches">Batches</a><a href="/blogs">Blogs</a><a href="blogs.html#new-destination-guides">Guides</a><a href="/about">About</a><a href="/contact">Contact</a></div><a className="wa" href="https://wa.me/919182894146?text=Hi%20On%20A%20Trip%20Holidays%2C%20I%20want%20a%20travel%20quote">WhatsApp Us</a></nav><main className="tc-seo-wrap"><div className="tc-breadcrumb"><a href="/packages">Tour Packages</a> / Delhi</div><section className="tc-hero"><div className="tc-kicker">Hyderabad • Telugu travel support</div><h1>Delhi Tour Packages from Hyderabad | Sightseeing & Golden Triangle</h1><p>Explore Delhi tour packages from Hyderabad for sightseeing, family holidays and Golden Triangle trips with hotel, transfers and guided planning.</p></section><h2>Why plan Delhi with On A Trip Holidays?</h2><div className="tc-grid"><div className="tc-card"><h3>Hyderabad-first planning</h3><p>Plan the full journey from Hyderabad, including flights or trains, local transfers, hotel nights and sightseeing.</p></div><div className="tc-card"><h3>Group & private options</h3><p>Choose a group itinerary or ask for a customised holiday based on family size, budget and preferred travel pace.</p></div><div className="tc-card"><h3>Telugu support</h3><p>Get practical assistance in Telugu for itinerary understanding, travel coordination and pre-departure preparation.</p></div></div><h2>What your itinerary can cover</h2><p>Delhi is a strong starting point for North India travel because it combines major heritage attractions, food, markets and transport connections. It also works well as the first or last stop of a Golden Triangle or Himalayan trip.</p><ul><li>India Gate</li><li>Red Fort</li><li>Qutub Minar</li><li>Humayun’s Tomb</li><li>Old Delhi</li><li>Akshardham</li><li>Lotus Temple</li></ul><h2>Planning considerations</h2><p>October to March is generally comfortable for extensive sightseeing, while the hotter months require shorter outdoor sessions and more indoor breaks.</p><p><strong>Suggested route:</strong> Hyderabad → Delhi → Old Delhi & Red Fort → central Delhi → Qutub Minar/Humayun’s Tomb → optional Agra/Jaipur extension → Hyderabad.</p><h2>Read the detailed Delhi guide</h2><p>Before booking, review our detailed destination guide for route ideas, preparation tips and FAQs.</p><p><a href="/delhi-travel-guide-from-hyderabad">Read the complete Delhi travel guide →</a></p><div className="tc-cta"><h2>Get current package details</h2><p>Dates, prices and inclusions can change by season and availability. Contact us for the latest options from Hyderabad.</p><a href="/contact">Request a quote →</a></div></main><footer className="footer"><div><img alt="On A Trip Holidays" src="assets/logo.png" /><p>Hyderabad-based travel planning with Telugu group support.</p></div><div><a href="/packages">Packages</a><a href="/blogs">Travel Blog</a><a href="blogs.html#new-destination-guides">Guides</a><a href="/contact">Contact</a></div></footer>
    </SitePage>
  );
}
