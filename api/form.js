// /api/form.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const formData = req.body;

    // Replace with your published Google Apps Script Web App URL
    const GAS_URL = "https://script.google.com/macros/s/AKfycbzHgyKRCkKY1GUf81hn2dUBwAz5ZBZrrvVV2JNSmVwsjpgt_tmd2IFD3qePqrkaYgqw/exec";

    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const text = await response.text();

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      return res.status(500).json({ success: false, error: "Invalid response from Google Apps Script" });
    }

    if (result.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ success: false, error: result.error || "Failed to submit form" });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
