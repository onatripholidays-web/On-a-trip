"use client";

import { FormEvent, useEffect, useState } from "react";

const packageOptions = [
  "Char Dham Yatra", "Do Dham Yatra", "Kedarnath Yatra", "Manali Escape", "Kashmir Holiday", "Ladakh Adventure", "Spiti Valley Explorer", "Kerala Backwaters & Hills", "Thailand Getaway", "Bali Escape", "Dubai Highlights", "Vietnam Discovery", "Nepal & Muktinath",
];

const packageAliases: Record<string, string> = {
  chardham: "Char Dham Yatra", "char-dham": "Char Dham Yatra", "char dham": "Char Dham Yatra",
  dodham: "Do Dham Yatra", "do-dham": "Do Dham Yatra", "do dham": "Do Dham Yatra",
  kedarnath: "Kedarnath Yatra", manali: "Manali Escape", kashmir: "Kashmir Holiday", ladakh: "Ladakh Adventure",
  spiti: "Spiti Valley Explorer", kerala: "Kerala Backwaters & Hills", thailand: "Thailand Getaway", bali: "Bali Escape",
  dubai: "Dubai Highlights", vietnam: "Vietnam Discovery", nepal: "Nepal & Muktinath",
};

const initial = { name: "", phone: "", destination: "", travel_date: "", travellers: "", enquiry_type: "Package enquiry", message: "", website: "", consent: false };

type EnquiryFormProps = { defaultPackage?: string };

function resolvePackage(value: string | null) {
  if (!value) return "";
  const clean = value.trim().toLowerCase();
  return packageOptions.find((name) => name.toLowerCase() === clean) || packageAliases[clean] || packageOptions.find((name) => clean.includes(name.toLowerCase())) || "";
}

export default function EnquiryForm({ defaultPackage = "" }: EnquiryFormProps) {
  const [form, setForm] = useState({ ...initial, destination: resolvePackage(defaultPackage) });
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (defaultPackage) return;
    const params = new URLSearchParams(window.location.search);
    const fromAd = resolvePackage(params.get("package") || params.get("destination") || params.get("trip") || params.get("utm_campaign"));
    if (fromAd) setForm((previous) => ({ ...previous, destination: fromAd }));
  }, [defaultPackage]);

  const update = (key: keyof typeof initial, value: string | boolean) => setForm((previous) => ({ ...previous, [key]: value }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.consent) {
      setStatus("Please agree to the Terms & Conditions and Privacy Policy and give your consent to receive promotional updates.");
      return;
    }
    setStatus("Sending…"); if (form.website) return;
    try {
      const response = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Unable to send enquiry");
      const message = `Hello On A Trip Holidays,%0AName: ${form.name}%0APhone: ${form.phone}%0APackage: ${form.destination}%0ATravel date: ${form.travel_date || "Flexible"}%0ATravellers: ${form.travellers || "Not specified"}%0AType: ${form.enquiry_type}%0AMessage: ${form.message || "—"}`;
      window.open(`https://wa.me/919182894146?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
      setForm({ ...initial, destination: defaultPackage }); setStatus("Enquiry received. WhatsApp is opening for faster assistance.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "Please try again or call us directly."); }
  }

  return <form className="enquiry" onSubmit={submit}>
    <div className="form-grid">
      <input required autoComplete="name" value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Full name" />
      <input required inputMode="tel" autoComplete="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="Mobile / WhatsApp number" />
      <select required value={form.destination} onChange={(event) => update("destination", event.target.value)} aria-label="Select package"><option value="" disabled>Select package</option>{packageOptions.map((packageName) => <option key={packageName} value={packageName}>{packageName}</option>)}</select>
      <input type="date" value={form.travel_date} onChange={(event) => update("travel_date", event.target.value)} />
      <input inputMode="numeric" value={form.travellers} onChange={(event) => update("travellers", event.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="Travellers" />
      <select value={form.enquiry_type} onChange={(event) => update("enquiry_type", event.target.value)}><option>Package enquiry</option><option>Custom trip</option><option>Pilgrimage</option><option>International</option><option>Group departure</option></select>
      <textarea className="full" value={form.message} onChange={(event) => update("message", event.target.value)} placeholder="Tell us your departure city, hotel preference, vehicle, budget or anything important." />
      <input className="honeypot" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update("website", event.target.value)} aria-hidden="true" />
      <label className="full enquiry-consent" style={{ display: "flex", alignItems: "flex-start", gap: 12, marginTop: 4, fontSize: 13, lineHeight: 1.55, color: "#263746", cursor: "pointer" }}>
        <input required type="checkbox" checked={form.consent} onChange={(event) => update("consent", event.target.checked)} aria-describedby="enquiry-consent-text" style={{ width: 22, height: 22, minWidth: 22, margin: "2px 0 0", accentColor: "#0b78a8", cursor: "pointer" }} />
        <span id="enquiry-consent-text">I agree to the terms &amp; conditions and privacy policy and I am giving my consent to receive updates through SMS/email, Rcs Message</span>
      </label>
    </div>
    <button className="btn primary" type="submit">Send Enquiry &amp; Continue on WhatsApp →</button><p role="status" aria-live="polite">{status}</p>
  </form>;
}
