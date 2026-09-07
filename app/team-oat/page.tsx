import type { Metadata } from "next";
import SitePage from "@/components/SitePage";

export const metadata: Metadata = {
  title: "Team OAT | On A Trip Holidays",
  description: "",
  alternates: { canonical: "/team-oat" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: {
    title: "Team OAT | On A Trip Holidays",
    description: "",
    url: "/team-oat",
    siteName: "On A Trip Holidays",
    type: "website",
  },
};

export default function Page() {
  return (
    <SitePage>
      <header className="topbar">
<div className="brand">
<div className="logo">OAT</div>
<div>Team OAT<small>On A Trip Holidays</small></div>
</div>
<div className="actions">
<a className="btn" href="/admin-v4-crm">Admin Dashboard</a>
<button className="btn">Logout</button>
</div>
</header>
<main>
<section className="hero">
<h1>Welcome to Team OAT</h1>
<p>One workspace for CRM, AI itinerary & quotation, invoicing and administration.</p>
</section>
<section className="grid">
<a className="card" href="/crm">
<div className="icon">👥</div>
<h2>CRM</h2>
<p>Manage enquiries, leads, follow-ups, salespeople and customer information.</p>
<span className="open">Open CRM →</span>
</a>
<a className="card" href="/admin-ai-itinerary">
<div className="icon">✨</div>
<h2>AI Itinerary</h2>
<p>Create travel itineraries and quotations using the existing OAT AI engine.</p>
<span className="open">Create Itinerary →</span>
</a>
<a className="card" href="/invoice-maker/index">
<div className="icon">🧾</div>
<h2>Invoice Maker</h2>
<p>Create, save and print customer payment invoices from bookings.</p>
<span className="open">Create Invoice →</span>
</a>
<a className="card" href="/admin-v4-crm">
<div className="icon">⚙️</div>
<h2>Admin Panel</h2>
<p>Access the existing OAT administration dashboard and business tools.</p>
<span className="open">Open Admin →</span>
</a>
</section>
<section className="workflow">
<h2>Booking Workflow</h2>
<div className="steps">
<div className="step">👤<strong>CRM Lead</strong><span>Customer enquiry</span></div>
<div className="arrow">→</div>
<div className="step">✨<strong>AI Itinerary</strong><span>Build trip</span></div>
<div className="arrow">→</div>
<div className="step">💰<strong>Quotation</strong><span>Calculate price</span></div>
<div className="arrow">→</div>
<div className="step">🧾<strong>Invoice</strong><span>Record payment</span></div>
<div className="arrow">→</div>
<div className="step">☁️<strong>Supabase</strong><span>Store business data</span></div>
</div>
<div className="status">✓ Team OAT structure ready — existing modules are preserved and linked from one workspace.</div>
</section>
<div className="footer">© On A Trip Holidays · Team OAT</div>
</main>
    </SitePage>
  );
}
