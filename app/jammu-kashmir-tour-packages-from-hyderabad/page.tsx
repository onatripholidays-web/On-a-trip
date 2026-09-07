import type { Metadata } from "next";
import SitePage from "@/components/SitePage";

export const metadata: Metadata = {
  title: "Jammu Kashmir Tour Packages from Hyderabad | Kashmir Holidays",
  description: "Explore Jammu Kashmir tour packages from Hyderabad covering Srinagar, Gulmarg, Pahalgam and Sonamarg with hotels, transfers and sightseeing.",
  alternates: { canonical: "/jammu-kashmir-tour-packages-from-hyderabad" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: {
    title: "Jammu Kashmir Tour Packages from Hyderabad | Kashmir Holidays",
    description: "Explore Jammu Kashmir tour packages from Hyderabad covering Srinagar, Gulmarg, Pahalgam and Sonamarg with hotels, transfers and sightseeing.",
    url: "/jammu-kashmir-tour-packages-from-hyderabad",
    siteName: "On A Trip Holidays",
    type: "website",
  },
};

export default function Page() {
  return (
    <SitePage>
      <nav className="nav"><a className="brand" href="/"><img alt="On A Trip Holidays" src="assets/logo.png" /></a><div className="navlinks"><a href="/packages">Packages</a><a href="/pilgrimage">Pilgrimage</a><a href="packages.html#batches">Batches</a><a href="/blogs">Blogs</a><a href="blogs.html#new-destination-guides">Guides</a><a href="/about">About</a><a href="/contact">Contact</a></div><a className="wa" href="https://wa.me/919182894146?text=Hi%20On%20A%20Trip%20Holidays%2C%20I%20want%20a%20travel%20quote">WhatsApp Us</a></nav><main className="tc-seo-wrap"><div className="tc-breadcrumb"><a href="/packages">Tour Packages</a> / Jammu & Kashmir</div><section className="tc-hero"><div className="tc-kicker">Hyderabad • Telugu travel support</div><h1>Jammu Kashmir Tour Packages from Hyderabad | Kashmir Holidays</h1><p>Explore Jammu Kashmir tour packages from Hyderabad covering Srinagar, Gulmarg, Pahalgam and Sonamarg with hotels, transfers and sightseeing.</p></section><h2>Why plan Jammu & Kashmir with On A Trip Holidays?</h2><div className="tc-grid"><div className="tc-card"><h3>Hyderabad-first planning</h3><p>Plan the full journey from Hyderabad, including flights or trains, local transfers, hotel nights and sightseeing.</p></div><div className="tc-card"><h3>Group & private options</h3><p>Choose a group itinerary or ask for a customised holiday based on family size, budget and preferred travel pace.</p></div><div className="tc-card"><h3>Telugu support</h3><p>Get practical assistance in Telugu for itinerary understanding, travel coordination and pre-departure preparation.</p></div></div><h2>What your itinerary can cover</h2><p>Jammu & Kashmir offers very different experiences across the year: spring gardens, summer mountain escapes, autumn colours and winter snow. Most leisure itineraries focus on the Kashmir Valley, especially Srinagar, Gulmarg, Pahalgam and Sonamarg.</p><ul><li>Srinagar</li><li>Dal Lake</li><li>Gulmarg</li><li>Pahalgam</li><li>Sonamarg</li><li>Mughal Gardens</li></ul><h2>Planning considerations</h2><p>Spring is excellent for gardens and flowers, summer is comfortable in the valley, autumn brings clear scenery and winter is popular for snow. Choose your season based on the experience you want.</p><p><strong>Suggested route:</strong> Hyderabad → Srinagar → Gulmarg → Pahalgam → Sonamarg → Srinagar → Hyderabad. Jammu can be added for pilgrimage-focused trips.</p><h2>Read the detailed Jammu & Kashmir guide</h2><p>Before booking, review our detailed destination guide for route ideas, preparation tips and FAQs.</p><p><a href="/jammu-kashmir-travel-guide-from-hyderabad">Read the complete Jammu & Kashmir travel guide →</a></p><div className="tc-cta"><h2>Get current package details</h2><p>Dates, prices and inclusions can change by season and availability. Contact us for the latest options from Hyderabad.</p><a href="/contact">Request a quote →</a></div></main><footer className="footer"><div><img alt="On A Trip Holidays" src="assets/logo.png" /><p>Hyderabad-based travel planning with Telugu group support.</p></div><div><a href="/packages">Packages</a><a href="/blogs">Travel Blog</a><a href="blogs.html#new-destination-guides">Guides</a><a href="/contact">Contact</a></div></footer>
    </SitePage>
  );
}
