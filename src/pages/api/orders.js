import fs from "fs";
import path from "path";
import { customAlphabet } from "nanoid";

// Benzersiz sipariş ID için nanoid
const nanoid = customAlphabet("1234567890ABCDEFGHJKLMNPQRSTUVWXYZ", 6);

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const {
      deliveryInfo,
      cartItems,
      total,
      paymentMethod = "Kart", // 🔒 Sadece "Kart" destekleniyor
    } = req.body;

    const orderId = `LAL-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${nanoid()}`;

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

    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      orders = JSON.parse(data || "[]"); // Eğer boşsa boş array olsun
    }

    orders.push(newOrder);

    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));

    return res.status(201).json({ success: true, orderId });
  } catch (error) {
    console.error("Order Save Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
