const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST desteklenir" });
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const form = new formidable.IncomingForm({
    uploadDir: uploadsDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024,
    multiples: false,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse hatası:", err);
      return res
        .status(500)
        .json({ error: "Yükleme sırasında bir hata oluştu" });
    }

    const fileArray = files.file;
    const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

    if (!file || !file.filepath) {
      return res.status(400).json({ error: "Dosya bulunamadı" });
    }

    const oldPath = file.filepath;
    const originalName = file.originalFilename || "gorsel";
    const extension = path.extname(originalName).toLowerCase();

    const allowedExts = [".jpg", ".jpeg", ".png", ".webp"];
    if (!allowedExts.includes(extension)) {
      fs.unlinkSync(oldPath);
      return res
        .status(400)
        .json({ error: "Sadece görsel dosyalar yüklenebilir" });
    }

    // ✅ Ürün adını al (gönderildiğine emin ol)
    const productName = fields.name || "urun";
    const baseName = slugify(productName);
    const newFileName = `${baseName}_${uuidv4().slice(0, 8)}${extension}`;
    const newPath = path.join(uploadsDir, newFileName);

    fs.renameSync(oldPath, newPath);

    return res.status(200).json({ url: `/uploads/${newFileName}` });
  });
}
