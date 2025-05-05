import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "banners.json");

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const data = await fs.readFile(filePath, "utf-8");
      const banners = JSON.parse(data);
      const sorted = banners.sort((a, b) => a.order - b.order);
      return res.status(200).json(sorted);
    } catch {
      return res.status(200).json([]); // boş liste dön
    }
  }

  return res.status(405).json({ error: "Yalnızca GET desteklenir" });
}
