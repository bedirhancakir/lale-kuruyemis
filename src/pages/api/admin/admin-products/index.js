import { supabase } from "../../../../lib/supabaseClient";
import slugify from "../../../../utils/slugify";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Ürünler alınamadı:", error.message);
      return res.status(500).json({ error: "Ürünler yüklenemedi" });
    }

    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const {
      name,
      description,
      price,
      image,
      category,
      subcategory,
      unitType = "unit",
    } = req.body;

    if (
      !name ||
      !price ||
      !description ||
      !image ||
      !category ||
      !subcategory
    ) {
      return res.status(400).json({ error: "Eksik alanlar var." });
    }

    const slug = slugify(name);

    // Slug'ları al
    const { data: catData, error: catError } = await supabase
      .from("categories")
      .select("slug, subcategories(id, slug)")
      .eq("id", category)
      .single();

    if (catError) {
      console.error("Kategori verisi alınamadı:", catError.message);
      return res.status(500).json({ error: "Kategori verisi okunamadı" });
    }

    const category_slug = catData?.slug || "";
    const subcategory_slug =
      catData?.subcategories?.find((s) => s.id === subcategory)?.slug || "";

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          slug,
          description,
          price,
          image,
          category_id: category,
          subcategory_id: subcategory,
          category_slug,
          subcategory_slug,
          status: "aktif",
          unitType,
          isFeatured: false,
          isRecommended: false,
          isBestSeller: false,
          isDiscounted: false,
        },
      ])
      .select();

    if (error) {
      console.error("Ürün eklenemedi:", error.message);
      return res.status(500).json({ error: "Ürün eklenemedi" });
    }

    return res.status(201).json({
      message: "Ürün başarıyla eklendi",
      product: data?.[0] || null,
    });
  }

  return res.status(405).json({ error: "İzin verilmeyen yöntem" });
}
