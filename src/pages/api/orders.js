import { supabase } from "../../lib/supabaseClient";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890ABCDEFGHJKLMNPQRSTUVWXYZ", 6);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "İzin Verilmeyen Yöntem" });
  }

  try {
    const {
      full_name,
      email,
      phone,
      address,
      city,
      district,
      note,
      cartItems,
      total,
    } = req.body;

    // ✅ Güvenlik ve boşluk kontrolleri
    if (
      !full_name ||
      !email ||
      !address ||
      !city ||
      !cartItems ||
      !Array.isArray(cartItems) ||
      cartItems.length === 0 ||
      typeof total !== "number"
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Eksik veya geçersiz sipariş verisi" });
    }

    const orderId = `LAL-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${nanoid()}`;

    const { error } = await supabase.from("orders").insert([
      {
        id: orderId,
        created_at: new Date().toISOString(),
        customer_name: full_name,
        email,
        phone: phone || null,
        address,
        city,
        district: district || null,
        note: note || null,
        items: cartItems,
        total_amount: total,
        status: "Hazırlanıyor",
      },
    ]);

    if (error) {
      console.error("🔴 Supabase DB hatası:", error.message);
      return res
        .status(500)
        .json({ success: false, error: "Sipariş kaydedilemedi." });
    }

    return res.status(201).json({ success: true, orderId });
  } catch (err) {
    console.error("🔴 API sunucu hatası:", err);
    return res.status(500).json({ success: false, error: "Sunucu Hatası" });
  }
}
