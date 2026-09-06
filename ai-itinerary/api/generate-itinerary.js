export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      service: "On A Trip Holidays AI Itinerary",
      configured: Boolean(process.env.OPENAI_API_KEY)
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: "OPENAI_API_KEY is not configured for this deployment."
    });
  }

  try {
    const r = req.body || {};
    const destination = String(r.dest || "").trim();

    if (!destination) {
      return res.status(400).json({ error: "Destination is required." });
    }

    const days = Math.max(1, Math.min(30, Number(r.days) || 1));
    const pax = Math.max(1, Number(r.pax) || 1);

    const system = `
You are the senior itinerary planner for On A Trip Holidays, a Telugu-first travel company in India.

Create a professional, customer-ready travel itinerary for the supplied destination and trip details.

CRITICAL RULES:
- The destination must NEVER be undefined, blank, "Custom Trip", or replaced by a generic destination.
- Generate destination-specific day-by-day plans. Do not use generic filler such as "sightseeing & experiences".
- Respect the exact number of requested days.
- Do not invent confirmed hotel bookings, ticket bookings, darshan slots, permits, prices, road conditions, or availability.
- If a detail is not confirmed, say "subject to confirmation".
- Preserve the supplied budget/quote exactly in the price field when one is supplied.
- For pilgrimage trips, use respectful temple sequencing, realistic walking/trek guidance, senior-friendly pacing and Satvik meals when requested.
- For adventure/high-altitude trips, prioritize acclimatization, realistic driving times, buffers and safety.
- For families, avoid unnecessarily exhausting schedules.
- For premium trips, suggest appropriate premium options without claiming availability.
- Match the requested language: English, Telugu, or English + Telugu.
- Every day must contain useful destination-specific content.
- Output ONLY valid JSON matching the requested schema.
`;

    const userPrompt = `
Create a ${days}-day itinerary for:

Guest: ${r.guest || "Guest"}
Destination: ${destination}
Travellers: ${pax}
Start city: ${r.start || "TBC"}
Travel dates: ${r.dates || "TBC"}
Language: ${r.language || "English"}
Trip type: ${r.type || "Custom"}
Hotel preference: ${r.hotel || "3 Star"}
Vehicle: ${r.vehicle || "Private Car"}
Meals: ${r.meals || "Breakfast & Dinner"}
Budget / quote: ${r.budget || "Price to be quoted"}
Special requirements: ${r.special || "None"}
Additional sales instruction: ${r.instruction || "None"}

Build exactly ${days} days. Make each day specific to ${destination}.
`;

    const schema = {
      type: "object",
      additionalProperties: false,
      required: [
        "title",
        "summary",
        "days",
        "hotels",
        "vehicle",
        "meals",
        "price",
        "inclusions",
        "exclusions",
        "notes"
      ],
      properties: {
        title: { type: "string" },
        summary: { type: "string" },
        days: {
          type: "array",
          minItems: days,
          maxItems: days,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["day", "title", "summary", "hotel", "meals"],
            properties: {
              day: { type: "integer" },
              title: { type: "string" },
              summary: { type: "string" },
              hotel: { type: "string" },
              meals: { type: "string" }
            }
          }
        },
        hotels: { type: "string" },
        vehicle: { type: "string" },
        meals: { type: "string" },
        price: { type: "string" },
        inclusions: {
          type: "array",
          items: { type: "string" }
        },
        exclusions: {
          type: "array",
          items: { type: "string" }
        },
        notes: { type: "string" }
      }
    };

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
        input: [
          {
            role: "system",
            content: [{ type: "input_text", text: system }]
          },
          {
            role: "user",
            content: [{ type: "input_text", text: userPrompt }]
          }
        ],
        text: {
          format: {
            type: "json_schema",
            name: "on_a_trip_itinerary",
            strict: true,
            schema
          }
        }
      })
    });

    const raw = await response.text();

    if (!response.ok) {
      let detail = "OpenAI request failed.";
      try {
        const provider = JSON.parse(raw);
        detail = provider?.error?.message || detail;
      } catch (_) {}
      console.error("OpenAI error:", response.status, raw);
      return res.status(502).json({
        error: `AI provider error (${response.status}): ${detail}`
      });
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch (_) {
      return res.status(502).json({ error: "AI provider returned invalid JSON." });
    }

    // Raw Responses API HTTP responses contain generated text in
    // output[].content[].text. output_text is an SDK convenience property
    // and is not guaranteed in a direct fetch response.
    let text = typeof data.output_text === "string" ? data.output_text : "";

    if (!text && Array.isArray(data.output)) {
      for (const item of data.output) {
        if (!Array.isArray(item?.content)) continue;

        for (const content of item.content) {
          if (typeof content?.text === "string" && content.text.trim()) {
            text = content.text;
            break;
          }
        }

        if (text) break;
      }
    }

    if (!text) {
      const refusal = data.output?.find?.((item) => item?.type === "message")?.content?.find?.(
        (content) => content?.type === "refusal"
      )?.refusal;

      console.error("No generated itinerary text:", raw);

      return res.status(502).json({
        error: refusal
          ? `AI refused to generate the itinerary: ${refusal}`
          : "AI returned no itinerary text."
      });
    }

    let itinerary;
    try {
      itinerary = JSON.parse(text);
    } catch (_) {
      console.error("Malformed itinerary text:", text);
      return res.status(502).json({ error: "AI returned malformed itinerary JSON." });
    }

    if (!itinerary.title || !Array.isArray(itinerary.days) || itinerary.days.length !== days) {
      return res.status(502).json({ error: "AI returned an incomplete itinerary." });
    }

    return res.status(200).json(itinerary);
  } catch (error) {
    console.error("Itinerary endpoint error:", error);
    return res.status(500).json({
      error: "Unable to generate itinerary. Please try again."
    });
  }
}
