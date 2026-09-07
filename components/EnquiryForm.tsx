"use client";

import { FormEvent, useState } from "react";

const initial = {
  name: "", phone: "", destination: "", travel_date: "",
  travellers: "", enquiry_type: "Package enquiry", message: "", website: ""
};

export default function EnquiryForm() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState("");

  const update = (key: keyof typeof initial, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Sending…");
    if (form.website) return setStatus("Unable to send enquiry.");

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return setStatus(data.error || "Unable to send enquiry.");

      const text = [
        "Hello On A Trip Holidays,",
        `Name: ${form.name}`, `Phone: ${form.phone}`,
        `Destination: ${form.destination}`,
        `Travel date: ${form.travel_date || "Flexible"}`,
        `Travellers: ${form.travellers || "Not specified"}`,
        `Type: ${form.enquiry_type}`, `Message: ${form.message || "—"}`
      ].join("\n");

      window.open(
        `https://wa.me/919182894146?text=${encodeURIComponent(text)}`,
        "_blank", "noopener,noreferrer"
      );
      setForm(initial);
      setStatus("Enquiry sent. Opening WhatsApp…");
    } catch {
      setStatus("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={submit} className="oat-secure-enquiry-form" noValidate>
      <div className="formgrid">
        <div><input required maxLength={80} value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Full name" /></div>
        <div><input required maxLength={20} inputMode="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Mobile / WhatsApp number" /></div>
        <div><input required maxLength={100} value={form.destination} onChange={(e) => update("destination", e.target.value)} placeholder="Destination" /></div>
        <div><input type="date" value={form.travel_date} onChange={(e) => update("travel_date", e.target.value)} /></div>
        <div><input maxLength={3} inputMode="numeric" value={form.travellers} onChange={(e) => update("travellers", e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="Number of travellers" /></div>
        <div><select value={form.enquiry_type} onChange={(e) => update("enquiry_type", e.target.value)}>
          <option>Package enquiry</option><option>Custom trip</option><option>Pilgrimage</option><option>International</option><option>Group departure</option>
        </select></div>
        <div className="full"><textarea maxLength={1000} value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Tell us anything important: departure city, hotel preference, vehicle, budget, etc." /></div>
        <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
          <label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update("website", e.target.value)} /></label>
        </div>
      </div>
      <button className="btn" type="submit">Send Enquiry on WhatsApp</button>
      <p role="status" aria-live="polite">{status}</p>
    </form>
  );
}
