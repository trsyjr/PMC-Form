// pages/api/form.js
import { google } from "googleapis";
import path from "path";

// ---------------- CONFIG ----------------
const SERVICE_ACCOUNT_FILE = path.join(process.cwd(), "service-account.json"); // keep this out of GitHub!
const DRIVE_FOLDER_ID = "1npehkH0_fUMwVuNFJOmFuY-GUXLDm6n-"; // Replace with your Drive folder ID
const SPREADSHEET_ID = "1k-fm5djppR0hZIFB-xt-AYLDPDi9Dous-1WUV5epOgE"; // Replace with your Google Sheet ID

export const config = {
  api: { bodyParser: true },
};

export default async function handler(req, res) {
  // Preflight for browser
  if (req.method === "OPTIONS") return res.status(200).json({ success: true });
  if (req.method !== "POST")
    return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });

  try {
    const formData = req.body;
    let fileLink = null;

    // ---------------- AUTHENTICATE ----------------
    const auth = new google.auth.GoogleAuth({
      keyFile: SERVICE_ACCOUNT_FILE,
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const drive = google.drive({ version: "v3", auth });
    const sheets = google.sheets({ version: "v4", auth });

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

    // ---------------- APPEND DATA TO GOOGLE SHEET ----------------
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "FormDB!A2", // change sheet/range if needed
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
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
            new Date().toLocaleString(),
          ],
        ],
      },
    });

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
