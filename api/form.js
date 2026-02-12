// pages/api/form.js
export const config = {
  api: { bodyParser: true },
};

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).json({ success: true });
  if (req.method !== "POST") return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });

  try {
    const formData = req.body;

    // Convert File to Base64 if exists
    if (formData.letterFile) {
      const arrayBuffer = await fetch(formData.letterFile)
        .then(r => r.arrayBuffer());
      const base64 = Buffer.from(arrayBuffer).toString("base64");

      formData.letterFileBase64 = base64;
      formData.letterFileName = formData.letterFileName || formData.letterFile.name;
      formData.letterFileType = formData.letterFile.type || "application/octet-stream";

      delete formData.letterFile; // remove raw file
    }

    const scriptURL = "https://script.google.com/macros/s/AKfycbzC6vm-J3mg4xCrOEZtuWb8oMLaOkJNGgacP5ltfGrcHbzHDnDU8FBM9W5uOymi13EP/exec";

    const response = await fetch(scriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } 
    catch { return res.status(500).json({ success: false, error: "Apps Script did not return valid JSON" }); }

    return res.status(200).json({
      success: data.success || false,
      id: data.id || new Date().getTime(),
      error: data.error || null
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
