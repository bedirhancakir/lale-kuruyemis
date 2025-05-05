import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";

const filePath = path.join(process.cwd(), "data", "banners.json");
const bannersDir = path.join(process.cwd(), "public", "hero-banners");

function readBanners() {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
}

function writeBanners(banners) {
  fs.writeFileSync(filePath, JSON.stringify(banners, null, 2));
}

export default async function handler(req, res) {
  const method = req.method;
  const banners = readBanners();

  if (method === "PUT") {
    // Sıralama güncelleme
    writeBanners(req.body);
    return res.status(200).json({ message: "Sıralama güncellendi" });
  }

  if (method === "DELETE") {
    const { id } = req.body;
    const banner = banners.find((b) => b.id === id);
    if (!banner) return res.status(404).json({ error: "Banner bulunamadı" });

    // Görsel dosyasını sil
    const imagePath = path.join(bannersDir, banner.filename);
    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
      } catch (err) {
        console.warn("Görsel silinemedi:", err.message);
      }
    }

    // JSON'dan sil
    const updated = banners.filter((b) => b.id !== id);
    writeBanners(updated);

    return res.status(200).json({ message: "Silindi", banners: updated });
  }

  return res.status(405).json({ error: "Yöntem desteklenmiyor" });
}
