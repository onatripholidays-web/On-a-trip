"use client";

import { FormEvent, useState } from "react";

const packageOptions = [
  "Char Dham Yatra",
  "Do Dham Yatra",
  "Kedarnath Yatra",
  "Manali Escape",
  "Kashmir Holiday",
  "Ladakh Adventure",
  "Spiti Valley Explorer",
  "Kerala Backwaters & Hills",
  "Thailand Getaway",
  "Bali Escape",
  "Dubai Highlights",
  "Vietnam Discovery",
  "Nepal & Muktinath",
];

const initial = {
  name: "",
  phone: "",
  destination: "",
  travel_date: "",
  travellers: "",
  enquiry_type: "Package enquiry",
  message: "",
  website: "",
};

export default function EnquiryForm() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState("");

  const update = (key: keyof typeof initial, value: string) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("Sending…");
    if (form.website) return;

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to send enquiry");

      const message = `Hello On A Trip Holidays,%0AName: ${form.name}%0APhone: ${form.phone}%0APackage: ${form.destination}%0ATravel date: ${form.travel_date || "Flexible"}%0ATravellers: ${form.travellers || "Not specified"}%0AType: ${form.enquiry_type}%0AMessage: ${form.message || "—"}`;
      window.open(
        `https://wa.me/919182894146?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer"
      );
      setForm(initial);
      setStatus("Enquiry received. WhatsApp is opening for faster assistance.");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Please try again or call us directly."
      );
    }
  }

  return (
    <form className="enquiry" onSubmit={submit}>
      <div className="form-grid">
        <input
          required
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
          placeholder="Full name"
        />
        <input
          required
          inputMode="tel"
          value={form.phone}
          onChange={(event) => update("phone", event.target.value)}
          placeholder="Mobile / WhatsApp number"
        />
        <select
          required
          value={form.destination}
          onChange={(event) => update("destination", event.target.value)}
          aria-label="Select package"
        >
          <option value="" disabled>
            Select package
          </option>
          {packageOptions.map((packageName) => (
            <option key={packageName} value={packageName}>
              {packageName}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={form.travel_date}
          onChange={(event) => update("travel_date", event.target.value)}
        />
        <input
          inputMode="numeric"
          value={form.travellers}
          onChange={(event) =>
            update("travellers", event.target.value.replace(/\D/g, "").slice(0, 3))
          }
          placeholder="Travellers"
        />
        <select
          value={form.enquiry_type}
          onChange={(event) => update("enquiry_type", event.target.value)}
        >
          <option>Package enquiry</option>
          <option>Custom trip</option>
          <option>Pilgrimage</option>
          <option>International</option>
          <option>Group departure</option>
        </select>
        <textarea
          className="full"
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
          placeholder="Tell us your departure city, hotel preference, vehicle, budget or anything important."
        />
        <input
          className="honeypot"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(event) => update("website", event.target.value)}
          aria-hidden="true"
        />
      </div>
      <button className="btn primary" type="submit">
        Send Enquiry & Continue on WhatsApp →
      </button>
      <p role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
