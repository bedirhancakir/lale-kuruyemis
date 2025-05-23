import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  try {
    const { data: categories, error } = await supabase
      .from("categories")
      .select(
        "id, name, description, image, slug, subcategories(id, name, slug)"
      );

    if (error) throw error;

    const formatted = categories.map((cat) => ({
      ...cat,
      subcategories: cat.subcategories || [],
    }));

    return res.status(200).json(formatted);
  } catch (err) {
    console.error("Kategori verisi okunamadı:", err.message);
    return res.status(500).json({ error: "Kategori verisi yüklenemedi" });
  }
}
