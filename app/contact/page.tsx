import type { Metadata } from "next";
import SitePage from "@/components/SitePage";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Contact On A Trip Holidays | Travel Experts Hyderabad",
  description: "Contact On A Trip Holidays for tour packages, custom itineraries, pilgrimage trips, family holidays and international travel. Get a quote on WhatsApp.",
  alternates: { canonical: "/contact" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: {
    title: "Contact On A Trip Holidays | Travel Experts Hyderabad",
    description: "Contact On A Trip Holidays for tour packages, custom itineraries, pilgrimage trips, family holidays and international travel. Get a quote on WhatsApp.",
    url: "/contact",
    siteName: "On A Trip Holidays",
    type: "website",
  },
};

export default function Page() {
  return (
    <SitePage>
      <nav className="nav"><a className="brand" href="/"><img alt="On A Trip Holidays" src="assets/logo.png" /></a><div className="navlinks"><a href="/packages">Packages</a><a href="/pilgrimage">Pilgrimage</a><a href="/itineraries">Itineraries</a><a href="packages.html#batches">Batches</a><a href="/blogs">Blogs</a><a href="blogs.html#new-destination-guides">Guides</a><a href="/about">About</a><a href="/contact">Contact</a></div><a className="wa" href="https://wa.me/919182894146?text=Hi%20On%20A%20Trip%20Holidays%2C%20I%20want%20a%20travel%20quote">WhatsApp Us</a></nav><section className="hero"><div className="hero-inner"><div className="eyebrow">Free travel quote</div><h1>Let's plan your trip.</h1><p>Fill in the basics. We'll open WhatsApp with your enquiry details.</p></div></section><section className="section"><div className="form"><EnquiryForm /></div></section>
    </SitePage>
  );
}
