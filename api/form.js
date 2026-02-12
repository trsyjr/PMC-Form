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
    const formData = req.body;

    const scriptURL =
      "https://script.google.com/macros/s/AKfycbzHgyKRCkKY1GUf81hn2dUBwAz5ZBZrrvVV2JNSmVwsjpgt_tmd2IFD3qePqrkaYgqw/exec";

    const response = await fetch(scriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    return res.status(200).json({
      success: true,
      id: data.id || new Date().getTime(),
    });
  } catch (err) {
    console.error("Error submitting to Google Sheets:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
