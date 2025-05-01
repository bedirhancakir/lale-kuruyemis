import { promises as fs } from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "İzin Verilmeyen Yöntem" });
  }

  const { id, status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: "Eksik veri: id veya status" });
  }

  try {
    const filePath = path.join(process.cwd(), "data", "orders.json");
    const data = await fs.readFile(filePath, "utf-8");
    const orders = JSON.parse(data);

    const index = orders.findIndex((order) => order.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Sipariş bulunamadı" });
    }

    orders[index].status = status;
    await fs.writeFile(filePath, JSON.stringify(orders, null, 2));

    return res.status(200).json({ success: true, status });
  } catch (error) {
    console.error("Durum Güncelleme Hatası:", error);
    return res.status(500).json({ error: "Sunucu Hatası" });
  }
}
