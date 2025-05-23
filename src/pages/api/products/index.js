import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "aktif")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return res.status(200).json(data);
    } catch (err) {
      console.error("Ürünler alınamadı:", err.message);
      return res.status(500).json({ error: "Ürünler yüklenemedi" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
