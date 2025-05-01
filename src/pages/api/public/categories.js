// GET /api/public/categories

import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), "data", "categories.json");

  try {
    const data = await fs.readFile(filePath, "utf-8");
    const categories = JSON.parse(data);
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Kategori verisi okunamadı:", error);
    return res.status(500).json({ error: "Kategori verisi yüklenemedi" });
  }
}
