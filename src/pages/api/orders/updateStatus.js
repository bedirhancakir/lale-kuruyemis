import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: "Eksik veri: id veya status" });
  }

  const filePath = path.join(process.cwd(), "data", "orders.json");
  const orders = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const index = orders.findIndex((order) => order.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Sipariş bulunamadı" });
  }

  orders[index].status = status;
  fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));

  return res.status(200).json({ success: true, status });
}
