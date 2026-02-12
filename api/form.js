// pages/api/form.js
export const config = {
  api: {
    bodyParser: true, // we are sending JSON, default is fine
  },
};

export default async function handler(req, res) {
  // Handle preflight for browser
  if (req.method === "OPTIONS") {
    return res.status(200).json({ success: true });
  }

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: `Method ${req.method} not allowed` });
  }

  try {
    const formData = req.body; // should already contain Base64, fileName, etc.

    // Google Apps Script URL
    const scriptURL =
      "https://script.google.com/macros/s/AKfycbzHgyKRCkKY1GUf81hn2dUBwAz5ZBZrrvVV2JNSmVwsjpgt_tmd2IFD3qePqrkaYgqw/exec";

    const response = await fetch(scriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    // Make sure the response is valid JSON
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("Apps Script returned invalid JSON:", text);
      return res
        .status(500)
        .json({ success: false, error: "Apps Script did not return valid JSON" });
    }

    return res.status(200).json({
      success: data.success || false,
      id: data.id || new Date().getTime(),
      error: data.error || null,
    });
  } catch (err) {
    console.error("Error submitting to Google Sheets:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
