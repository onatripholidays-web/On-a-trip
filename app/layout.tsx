import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.onatripholidays.com"),
  title: { default: "On A Trip Holidays | Travel Agency in Hyderabad", template: "%s | On A Trip Holidays" },
  description: "On A Trip Holidays — Telugu-first travel support for pilgrimage, domestic, adventure and international holidays.",
  applicationName: "On A Trip Holidays",
  referrer: "strict-origin-when-cross-origin",
  robots: { index: true, follow: true, "max-image-preview": "large" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-IN"><body>{children}</body></html>;
}
