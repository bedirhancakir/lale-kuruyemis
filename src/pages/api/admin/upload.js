// upload.js
import { supabase } from "../../../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import slugify from "../../../utils/slugify";

export const config = {
  api: {
    bodyParser: false,
  },
};

const BUCKET_NAME = "lale-assets";

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
      console.error("Form parse hatası:", err);
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
      return res.status(400).json({
        error: "Sadece .jpg, .jpeg, .png, .webp dosyalar geçerli",
      });
    }

    const productName = fields.name || "resim";
    const baseName = slugify(productName);
    const newFileName = `${baseName}_${uuidv4().slice(0, 8)}${extension}`;

    let folder = "product-images";
    if (fields.type === "category-banner") folder = "category-banners";
    if (fields.type === "hero-banner") folder = "hero-banners";

    const storagePath = `${folder}/${newFileName}`;
    let fileBuffer;
    try {
      fileBuffer = fs.readFileSync(file.filepath);
    } catch (e) {
      console.error("⛔ Dosya okunamadı:", e.message);
      return res.status(500).json({ error: "Dosya okunamadı" });
    }

    if (fields.oldImage) {
      const oldPath = fields.oldImage.split(
        `/object/public/${BUCKET_NAME}/`
      )[1];
      if (oldPath) {
        await supabase.storage.from(BUCKET_NAME).remove([oldPath]);
      }
    }

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload hatası:", uploadError);
      return res.status(500).json({ error: "Dosya yüklenemedi" });
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${storagePath}`;
    return res.status(200).json({ url: publicUrl, filename: newFileName });
  });
}
