import type { Metadata } from "next";
import SitePage from "@/components/SitePage";

export const metadata: Metadata = {
  title: "On A Trip Meta Landing Pages",
  description: "",
  alternates: { canonical: "/meta-landing-pages" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: {
    title: "On A Trip Meta Landing Pages",
    description: "",
    url: "/meta-landing-pages",
    siteName: "On A Trip Holidays",
    type: "website",
  },
};

export default function Page() {
  return (
    <SitePage>
      <h1>Meta Ads Landing Pages</h1><p>Use destination-specific URLs for Meta campaigns.</p><a href="/package-thailand">🇹🇭 Thailand</a><a href="/package-bali">🌴 Bali</a><a href="/package-dubai">🏙️ Dubai</a><a href="/package-vietnam">🇻🇳 Vietnam</a><a href="/kashmir-tour-packages-from-hyderabad">🏔️ Kashmir</a><a href="/spiti-valley-tour-packages-from-hyderabad">🏔️ Spiti Valley</a>
    </SitePage>
  );
}
