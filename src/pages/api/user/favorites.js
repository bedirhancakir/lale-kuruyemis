// pages/api/user/favorites.js
import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  const { method } = req;

  // ✅ Token kontrolü (Bearer)
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Token bulunamadı." });

  // ✅ Kullanıcıyı çöz
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user)
    return res.status(401).json({ error: "Geçersiz oturum." });

  const user_id = user.id;

  try {
    switch (method) {
      case "GET": {
        const { data, error } = await supabase
          .from("favorites")
          .select("product_id, products:product_id(*)")
          .eq("user_id", user_id);

        if (error) throw error;

        const filtered = (data || [])
          .map((fav) => fav.products)
          .filter((p) => p?.status !== "arşivli");

        return res.status(200).json(filtered);
      }

      case "POST": {
        const { product_id } = req.body;
        if (!product_id)
          return res.status(400).json({ error: "Ürün ID zorunludur." });

        // Aynı ürün zaten favoride mi?
        const { data: existing } = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", user_id)
          .eq("product_id", product_id)
          .single();

        if (existing) {
          return res
            .status(200)
            .json({ message: "Zaten favorilerde.", already: true });
        }

        const { error } = await supabase
          .from("favorites")
          .insert({ user_id, product_id });

        if (error) throw error;

        return res.status(201).json({ message: "Favoriye eklendi." });
      }

      case "DELETE": {
        const { product_id } = req.body;
        if (!product_id)
          return res.status(400).json({ error: "Ürün ID zorunludur." });

        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user_id)
          .eq("product_id", product_id);

        if (error) throw error;

        return res.status(200).json({ message: "Favoriden çıkarıldı." });
      }

      default:
        res.setHeader("Allow", ["GET", "POST", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
