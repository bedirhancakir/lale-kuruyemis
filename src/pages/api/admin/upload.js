import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const chunks = [];

  req.on("data", (chunk) => {
    chunks.push(chunk);
  });

  req.on("end", () => {
    const buffer = Buffer.concat(chunks);
    const boundary = req.headers["content-type"].split("boundary=")[1];
    const parts = buffer.toString().split(boundary);

    const filePart = parts.find((part) => part.includes("filename="));

    if (!filePart) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const match = /filename="(.+?)"/.exec(filePart);
    const filename = match?.[1];

    if (!filename) {
      return res.status(400).json({ error: "Filename not found" });
    }

    const fileData = filePart.split("\r\n\r\n")[1];
    const cleanedFileData = fileData.slice(0, -4); // "\r\n--" kaldır

    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const savePath = path.join(uploadsDir, filename);
    fs.writeFileSync(savePath, cleanedFileData, "binary");

    return res.status(200).json({ url: `/uploads/${filename}` });
  });
}
