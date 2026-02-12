// pages/api/form.js
import { google } from "googleapis";

const DRIVE_FOLDER_ID = "1npehkH0_fUMwVuNFJOmFuY-GUXLDm6n-"; // Your Drive folder ID
const SHEET_ID = "1k-fm5djppR0hZIFB-xt-AYLDPDi9Dous-1WUV5epOgE"; // Your Sheet ID
const SHEET_NAME = "FormDB"; // Tab name

export const config = {
  api: { bodyParser: true },
};

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).json({ success: true });
  if (req.method !== "POST")
    return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });

  try {
    const formData = req.body;

    // ---------------- AUTH ----------------
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const drive = google.drive({ version: "v3", auth });
    const sheets = google.sheets({ version: "v4", auth });

    let fileLink = null;

    // ---------------- UPLOAD FILE TO DRIVE ----------------
    if (formData.letterFileBase64 && formData.letterFileName) {
      const buffer = Buffer.from(formData.letterFileBase64, "base64");

      const fileMetadata = {
        name: formData.letterFileName,
        parents: [DRIVE_FOLDER_ID],
      };

      const media = {
        mimeType: formData.letterFileType || "application/octet-stream",
        body: buffer,
      };

      const file = await drive.files.create({
        requestBody: fileMetadata,
        media,
        fields: "id, webViewLink",
      });

      fileLink = file.data.webViewLink;
    }

    // ---------------- APPEND ROW TO SHEET ----------------
    const values = [
      new Date().toISOString(),
      formData.fullName || "",
      formData.email || "",
      formData.contactNumber || "",
      (formData.requestType || []).join(", "),
      formData.agencyName || "",
      formData.agencyType || "",
      formData.region || "",
      formData.province || "",
      formData.lgu || "",
      formData.addressee || "",
      formData.position || "",
      formData.address || "",
      fileLink || "",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [values] },
    });

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
