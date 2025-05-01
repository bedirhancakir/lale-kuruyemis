import { promises as fs } from "fs";
import path from "path";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890ABCDEFGHJKLMNPQRSTUVWXYZ", 6);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "İzin Verilmeyen Yöntem" });
  }

  try {
    const { deliveryInfo, cartItems, total, paymentMethod = "Kart" } = req.body;
    const orderId = `LAL-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${nanoid()}`;

    const newOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      deliveryInfo,
      cartItems,
      total,
      paymentMethod,
      status: "Hazırlanıyor",
    };

    const filePath = path.join(process.cwd(), "data", "orders.json");

    let orders = [];
    try {
      const data = await fs.readFile(filePath, "utf-8");
      orders = JSON.parse(data || "[]");
    } catch (error) {
      // Dosya yoksa boş array kullan
    }

    orders.push(newOrder);
    await fs.writeFile(filePath, JSON.stringify(orders, null, 2));

    return res.status(201).json({ success: true, orderId });
  } catch (error) {
    console.error("Order Save Error:", error);
    return res.status(500).json({ error: "Sunucu Hatası" });
  }
}
