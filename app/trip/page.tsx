import type { Metadata } from "next";
import SitePage from "@/components/SitePage";

export const metadata: Metadata = {
  title: "Trip Details | On A Trip Holidays",
  description: "Trip Details | On A Trip Holidays \u2014 travel packages, itineraries, planning tips and support from On A Trip Holidays.",
  alternates: { canonical: "/trip" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: {
    title: "Trip Details | On A Trip Holidays",
    description: "Trip Details | On A Trip Holidays \u2014 travel packages, itineraries, planning tips and support from On A Trip Holidays.",
    url: "/trip",
    siteName: "On A Trip Holidays",
    type: "website",
  },
};

export default function Page() {
  return (
    <SitePage>
      <nav className="nav"><a className="brand" href="/"><img alt="On A Trip Holidays" src="assets/logo.png" /></a><div className="navlinks"><a href="/packages">Trips</a><a href="/pilgrimage">Temple</a></div><a className="wa" href="https://wa.me/919182894146">WhatsApp Us</a></nav><section className="section"><div className="v13-wrap"><div className="v13-banner" id="detail"><h1>Trip Details & Custom Travel Planning</h1><p>Explore trip options from On A Trip Holidays with route ideas, duration, destination category and current availability. Select a trip from our packages and destination pages to request the latest dates, inclusions and price from our travel team.</p><div className="v21-trip-links"><a href="/packages">View all packages</a><a href="/pilgrimage">Pilgrimage journeys</a><a href="/destinations-from-hyderabad">Destinations from Hyderabad</a><a href="/contact">Contact our travel team</a></div></div><div className="actions"><a className="btn" href="#" id="wa">Ask Price & Availability</a><a className="btn light" href="/contact">Send Enquiry</a></div></div></section><section className="section" id="v21-trip-seo"><div><h2>Plan Your Trip with On A Trip Holidays</h2><p>Use this trip-details page to review a selected itinerary before you enquire. On A Trip Holidays plans group tours, pilgrimage journeys, family holidays, Himalayan road trips and customised vacations for travellers from Hyderabad, Telangana and Andhra Pradesh. Trip options can include planned accommodation, local transfers, sightseeing, meals and travel assistance depending on the selected package.</p><p>For pilgrimage journeys such as Char Dham, Kedarnath and Do Dham, travellers can review route planning, yatra preparation and practical travel guidance before booking. For leisure destinations such as Kashmir, Ladakh, Himachal, Kerala, Sikkim and Bhutan, our destination pages explain the main route, sightseeing themes and planning considerations.</p><p>Because package prices, batch dates, vehicle availability and inclusions can change, the final details should always be confirmed with the On A Trip Holidays team before payment. Use the WhatsApp enquiry button to request the current price, departure date, group size options, hotel category and inclusions for your selected trip.</p><p>We support Telugu-first group travel and can help compare suitable itineraries for families, couples, senior travellers and private groups. Start from our <a href="/destinations-from-hyderabad">destinations from Hyderabad</a>, browse <a href="/packages">tour packages</a>, or contact us for a customised plan.</p></div></section><div aria-label="Go to top" className="v18-page-top"><button aria-label="Go to top" type="button">⌃</button></div>
<div className="v18-wa"><a aria-label="WhatsApp us" href="https://wa.me/919182894146?text=Hi%20On%20A%20Trip%20Holidays%2C%20I%20want%20to%20plan%20a%20trip"><svg aria-hidden="true" viewBox="0 0 32 32"><path d="M19.11 17.29c-.27-.14-1.58-.78-1.82-.87-.24-.09-.42-.14-.6.14-.18.27-.69.87-.85 1.05-.16.18-.31.2-.58.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.42.12-.56.12-.12.27-.31.4-.47.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.14-.6-1.44-.82-1.97-.22-.52-.44-.45-.6-.46h-.51c-.18 0-.47.07-.71.34-.24.27-.93.91-.93 2.22s.96 2.57 1.09 2.75c.13.18 1.89 2.88 4.58 4.04.64.28 1.14.44 1.53.56.64.2 1.22.17 1.68.1.51-.08 1.58-.65 1.8-1.27.22-.62.22-1.15.16-1.27-.07-.11-.24-.18-.51-.31z" fill="currentColor"></path><path d="M16.03 3.2c-7.07 0-12.8 5.72-12.8 12.77 0 2.25.59 4.36 1.63 6.19L3.2 28.8l6.83-1.64a12.78 12.78 0 0 0 6 1.48h.01c7.06 0 12.79-5.73 12.79-12.78S23.1 3.2 16.03 3.2zm0 23.36h-.01a10.58 10.58 0 0 1-5.39-1.47l-.39-.23-4.05.97.98-3.95-.25-.41a10.56 10.56 0 1 1 9.11 5.09z" fill="currentColor"></path></svg></a></div>
    </SitePage>
  );
}
