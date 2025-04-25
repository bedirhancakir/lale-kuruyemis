import fs from "fs";
import path from "path";
import { customAlphabet } from "nanoid";

// Benzersiz sipariş ID için nanoid
const nanoid = customAlphabet("1234567890ABCDEFGHJKLMNPQRSTUVWXYZ", 6);

export default function handler(req, res) {
  if (req.method === "POST") {
    const {
      deliveryInfo,
      cartItems,
      total,
      paymentMethod = "Kart", // 👈 varsayılan olarak sadece 'Kart'
    } = req.body;

    // 📦 Sipariş ID (SEO dostu, benzersiz)
    const orderId = `LAL-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${nanoid()}`;

    const newOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      deliveryInfo,
      cartItems,
      total,
      paymentMethod, // 🔒 sadece "Kart"
      status: "Hazırlanıyor",
    };

    const filePath = path.join(process.cwd(), "data", "orders.json");

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([newOrder], null, 2));
    } else {
      const existingData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      existingData.push(newOrder);
      fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
    }

    return res.status(201).json({ success: true, orderId });
  }

  res.status(405).json({ error: "Method Not Allowed" });
}
