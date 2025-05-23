import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;

      return res.status(200).json(data);
    } catch (err) {
      console.error("Banner verisi okunamadı:", err.message);
      return res.status(500).json({ error: "Banner verisi yüklenemedi" });
    }
  }

  return res.status(405).json({ error: "Yalnızca GET desteklenir" });
}
