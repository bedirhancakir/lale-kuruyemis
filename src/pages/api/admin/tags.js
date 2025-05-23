import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { productId, tag, value } = req.body;

  if (
    !productId ||
    !["isFeatured", "isRecommended", "isBestSeller", "isDiscounted"].includes(
      tag
    )
  ) {
    return res.status(400).json({ message: "Geçersiz istek" });
  }

  try {
    const { error } = await supabase
      .from("products")
      .update({ [tag]: value })
      .eq("id", productId);

    if (error) {
      console.error("Supabase güncelleme hatası:", error.message);
      return res.status(500).json({ message: "Güncelleme başarısız" });
    }

    return res.status(200).json({ message: "Etiket güncellendi" });
  } catch (err) {
    console.error("Sunucu hatası:", err);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
}
