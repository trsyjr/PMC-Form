// pages/api/form.js
import { google } from "googleapis";

const DRIVE_FOLDER_ID = "1k-fm5djppR0hZIFB-xt-AYLDPDi9Dous-1WUV5epOgE"; // Replace with your folder ID

export const config = {
  api: { bodyParser: true },
};

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).json({ success: true });
  if (req.method !== "POST")
    return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });

  try {
    const formData = req.body;

    // ---------------- AUTHENTICATE USING ENV VAR ----------------
    if (!process.env.GOOGLE_SERVICE_ACCOUNT)
      throw new Error("Service account credentials not set in environment variables");

    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const drive = google.drive({ version: "v3", auth });

    let fileLink = null;

    // ---------------- UPLOAD FILE IF EXISTS ----------------
    if (formData.letterFileBase64 && formData.letterFileName) {
      const buffer = Buffer.from(formData.letterFileBase64, "base64");

      const fileMetadata = {
        name: formData.letterFileName,
        parents: [DRIVE_FOLDER_ID],
      };

      const media = {
        mimeType: formData.letterFileType || "application/octet-stream",
        body: Buffer.from(buffer),
      };

      const file = await drive.files.create({
        requestBody: fileMetadata,
        media,
        fields: "id, webViewLink",
      });

      fileLink = file.data.webViewLink;
    }

    // ---------------- RETURN RESPONSE ----------------
    return res.status(200).json({
      success: true,
      id: new Date().getTime(),
      fileLink,
    });
  } catch (err) {
    console.error("Error submitting form:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
