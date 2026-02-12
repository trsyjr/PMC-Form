// /api/form.js
export default async function handler(req, res) {
  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", ["POST", "OPTIONS"]);
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST", "OPTIONS"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  }

  try {
    const formData = req.body;

    const scriptURL =
      "https://script.google.com/macros/s/AKfycbzHgyKRCkKY1GUf81hn2dUBwAz5ZBZrrvVV2JNSmVwsjpgt_tmd2IFD3qePqrkaYgqw/exec";

    // Forward the data to Google Apps Script
    const response = await fetch(scriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text); // If the script returns valid JSON
    } catch {
      console.error("Google Apps Script returned invalid JSON:", text);
      data = {};
    }

    return res.status(200).json({ success: true, id: data.id || "N/A" });
  } catch (err) {
    console.error("Error submitting to Google Sheets:", err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}
