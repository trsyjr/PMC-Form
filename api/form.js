// /api/form.js
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const data = req.body; // React will send JSON

      // Example: send to Google Apps Script
      const scriptUrl = "https://script.google.com/macros/s/AKfycbzHgyKRCkKY1GUf81hn2dUBwAz5ZBZrrvVV2JNSmVwsjpgt_tmd2IFD3qePqrkaYgqw/exec"; // <-- replace with your Apps Script URL

      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        return res.status(200).json({ success: true, message: "Form submitted!", id: result.id || null });
      } else {
        return res.status(500).json({ success: false, error: result.error || "Apps Script error" });
      }

    } catch (err) {
      console.error("API Error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
}
