export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const {
      name,
      phone,
      destination,
      travel_date,
      travellers,
      enquiry_type,
      message
    } = req.body || {};

    if (!name || !phone) {
      return res.status(400).json({
        error: "Name and phone are required."
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase environment variables are missing.");

      return res.status(500).json({
        error: "Supabase is not configured."
      });
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/enquiries`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Prefer": "return=representation"
        },
        body: JSON.stringify({
          name: String(name).trim(),
          phone: String(phone).trim(),
          destination: destination
            ? String(destination).trim()
            : null,
          travel_date: travel_date || null,
          travellers: travellers
            ? Number(travellers)
            : null,
          enquiry_type: enquiry_type
            ? String(enquiry_type).trim()
            : null,
          message: message
            ? String(message).trim()
            : null,
          source: "website"
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Supabase error:", errorText);

      return res.status(500).json({
        error: "Unable to save enquiry."
      });
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      enquiry: data[0] || null
    });

  } catch (error) {
    console.error("Enquiry API error:", error);

    return res.status(500).json({
      error: "Unable to save enquiry."
    });
  }
}
