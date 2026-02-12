// pages/api/form.js
import { google } from "googleapis";

const DRIVE_FOLDER_ID = "1npehkH0_fUMwVuNFJOmFuY-GUXLDm6n-"; // your Drive folder
const SHEET_ID = "1k-fm5djppR0hZIFB-xt-AYLDPDi9Dous-1WUV5epOgE"; // your Sheet
const SHEET_NAME = "FormDB";

export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  try {
    if (req.method === "OPTIONS") return res.status(200).json({ success: true });
    if (req.method !== "POST")
      return res.status(200).json({ success: false, error: `Method ${req.method} not allowed` });

    const formData = req.body;

    // ---------------- AUTH ----------------
    let credentials;
    try {
      credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
    } catch (err) {
      return res.status(200).json({ success: false, error: "Invalid GOOGLE_SERVICE_ACCOUNT JSON" });
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const drive = google.drive({ version: "v3", auth });
    const sheets = google.sheets({ version: "v4", auth });

    let fileLink = "";

    // ---------------- UPLOAD FILE TO DRIVE ----------------
    if (formData.letterFileBase64 && formData.letterFileName) {
      try {
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
      } catch (err) {
        return res.status(200).json({ success: false, error: `Drive upload failed: ${err.message}` });
      }
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

    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_NAME}!A1`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [values] },
      });
    } catch (err) {
      return res.status(200).json({ success: false, error: `Sheet append failed: ${err.message}` });
    }

    // ---------------- SUCCESS RESPONSE ----------------
    return res.status(200).json({
      success: true,
      id: new Date().getTime(),
      fileLink,
    });

  } catch (err) {
    // Catch-all fallback
    return res.status(200).json({ success: false, error: `Server error: ${err.message}` });
  }
}
