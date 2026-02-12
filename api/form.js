// /api/form.js
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  }

  try {
    const formData = req.body;

    // Your Google Apps Script URL
    const scriptURL =
      "https://script.google.com/macros/s/AKfycbHgyKRCkKY1GUf81hn2dUBwAz5ZBZrrvVV2JNSmVwsjpgt_tmd2IFD3qePqrkaYgqw/exec";

    // Forward the form data to Google Apps Script
    const response = await fetch(scriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    // Parse the response from Apps Script
    const data = await response.json();

    return res.status(200).json({ success: true, id: data.id || "N/A" });
  } catch (err) {
    console.error("Error submitting to Google Sheets:", err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}
