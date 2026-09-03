export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "OPENAI_API_KEY is not configured" });

  try {
    const r = req.body || {};
    const system = `You are the senior itinerary planner for On A Trip Holidays, a Telugu-first travel company in India.
Create accurate, commercially useful itinerary drafts for a salesperson. Never invent confirmed hotel names, ticket availability, darshan slots, permits, prices, road conditions or transport bookings. If unknown, say "subject to confirmation".
For pilgrimage trips: use respectful temple sequencing, senior-friendly pacing, realistic walking/trek guidance and Satvik meals when requested.
For adventure/high altitude: prioritize acclimatization, realistic driving time, buffers and safety.
For families: avoid unnecessarily exhausting schedules.
For premium trips: improve hotel/vehicle/experience suggestions without inventing availability.
Output ONLY valid JSON matching the requested schema.`;

    const schema = {
      type:"object", additionalProperties:false, required:["title","summary","days","hotels","vehicle","meals","price","inclusions","exclusions","notes"],
      properties:{
        title:{type:"string"}, summary:{type:"string"},
        days:{type:"array",items:{type:"object",additionalProperties:false,required:["day","title","summary"],properties:{day:{type:"integer"},title:{type:"string"},summary:{type:"string"},hotel:{type:"string"},meals:{type:"string"}}},
        hotels:{type:"string"}, vehicle:{type:"string"}, meals:{type:"string"}, price:{type:"string"},
        inclusions:{type:"array",items:{type:"string"}}, exclusions:{type:"array",items:{type:"string"}}, notes:{type:"string"}
      }
    };

    const prompt = `Create a ${r.days}-day ${r.type||"custom"} itinerary.
Guest: ${r.guest||"Guest"}
Destination: ${r.dest||"Custom Trip"}
Travellers: ${r.pax||1}
Start: ${r.start||"TBC"}
Dates: ${r.dates||"TBC"}
Language: ${r.language||"English"}
Hotel: ${r.hotel||"3 Star"}
Vehicle: ${r.vehicle||"Private Car"}
Meals: ${r.meals||"Breakfast & Dinner"}
Budget/quote: ${r.budget||"TBC"}
Special requirements: ${r.special||"None"}
Salesperson instruction: ${r.instruction||"None"}

Make every day useful and realistic. The price field must repeat the supplied budget/quote if one was supplied; otherwise say "Price to be quoted". Do not claim that a hotel or ticket is booked.`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":`Bearer ${process.env.OPENAI_API_KEY}`},
      body:JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.6",
        input:[{role:"system",content:[{type:"input_text",text:system}]},{role:"user",content:[{type:"input_text",text:prompt}]}],
        text:{format:{type:"json_schema",name:"on_a_trip_itinerary",strict:true,schema}}
      })
    });
    if(!response.ok) return res.status(502).json({error:"AI provider request failed"});
    const data=await response.json();
    const text=data.output_text;
    if(!text) return res.status(502).json({error:"AI returned no itinerary"});
    return res.status(200).json(JSON.parse(text));
  } catch(e) {
    return res.status(500).json({error:"Unable to generate itinerary"});
  }
}