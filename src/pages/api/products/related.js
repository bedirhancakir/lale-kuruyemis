import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  const {
    query: { categorySlug, subcategorySlug, exclude },
    method,
  } = req;

  if (method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // 🔎 Kategori ID'sini slug üzerinden bul
    const { data: categoryData, error: catErr } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    if (catErr || !categoryData?.id) {
      return res.status(400).json({ error: "Geçersiz kategori slug" });
    }

    const categoryId = categoryData.id;
    let subcategoryId = null;

    // 🔎 Alt kategori ID'si gerekiyorsa onu da slug üzerinden bul
    if (subcategorySlug) {
      const { data: subData, error: subErr } = await supabase
        .from("subcategories")
        .select("id")
        .eq("slug", subcategorySlug)
        .eq("category_id", categoryId)
        .single();

      if (!subErr && subData?.id) {
        subcategoryId = subData.id;
      }
    }

    // 🧠 Sorguyu oluştur
    let query = supabase
      .from("products")
      .select("*")
      .eq("status", "aktif")
      .neq("id", exclude)
      .eq("category_id", categoryId);

    if (subcategoryId) {
      query = query.eq("subcategory_id", subcategoryId);
    }

    const { data: products, error } = await query;

    if (error) throw error;

    return res.status(200).json(products);
  } catch (err) {
    console.error("Benzer ürünler alınamadı:", err.message);
    return res.status(500).json({ error: "Benzer ürünler yüklenemedi" });
  }
}
