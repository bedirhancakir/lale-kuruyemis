import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  const {
    query: { slug },
    method,
  } = req;

  if (method === "GET") {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("status", "aktif")
        .limit(1)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: "Ürün bulunamadı." });
      }

      return res.status(200).json(data);
    } catch (err) {
      console.error("Ürün detay hatası:", err.message);
      return res.status(500).json({ error: "Ürün verisi alınamadı" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
