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

  const form = new formidable.IncomingForm({
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024,
    multiples: false,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Yükleme hatası" });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file || !file.filepath) {
      return res.status(400).json({ error: "Dosya bulunamadı" });
    }

    const originalName = file.originalFilename || "gorsel";
    const extension = path.extname(originalName).toLowerCase();
    const allowedExts = [".jpg", ".jpeg", ".png", ".webp"];

    if (!allowedExts.includes(extension)) {
      fs.unlinkSync(file.filepath);
      return res
        .status(400)
        .json({ error: "Sadece .jpg, .png, .webp dosyalar geçerli" });
    }

    // ✅ imageType tanımı
    let imageType = "product-images";
    if (fields.type === "category-banner") imageType = "category-banners";
    if (fields.type === "hero-banner") imageType = "hero-banners";

    const uploadDir = path.join(process.cwd(), "public", imageType);
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const productName = fields.name || "resim";
    const baseName = slugify(productName);
    const newFileName = `${baseName}_${uuidv4().slice(0, 8)}${extension}`;
    const newPath = path.join(uploadDir, newFileName);

    fs.renameSync(file.filepath, newPath);

    // ✅ Eğer hero-banner ise JSON'a da yaz
    if (fields.type === "hero-banner") {
      const bannersPath = path.join(process.cwd(), "data", "banners.json");

      let banners = [];
      try {
        const raw = fs.readFileSync(bannersPath, "utf-8");
        banners = JSON.parse(raw);
      } catch {
        banners = [];
      }

      banners.push({
        id: uuidv4(),
        filename: newFileName,
        order: banners.length + 1,
        title: fields.title || "",
        link: fields.link || ""
      });

      fs.writeFileSync(bannersPath, JSON.stringify(banners, null, 2));
    }

    return res.status(200).json({ url: `/${imageType}/${newFileName}` });
  });
}
