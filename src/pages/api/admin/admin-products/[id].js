import { supabase } from "../../../../lib/supabaseClient";
import slugify from "../../../../utils/slugify";

const BUCKET_NAME = "lale-assets";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const {
      name,
      description,
      price,
      image,
      category,
      subcategory,
      status,
      unitType,
    } = req.body;

    const updateData = {
      description,
      price,
      image,
      category_id: category,
      subcategory_id: subcategory,
      status,
      unitType,
    };

    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name);
    }

    // Slug bilgilerini al
    const { data: catData, error: catError } = await supabase
      .from("categories")
      .select("slug, subcategories(id, slug)")
      .eq("id", category)
      .single();

    if (catError) {
      console.error("Kategori slug bilgisi alınamadı:", catError.message);
      return res.status(500).json({ error: "Slug bilgisi yüklenemedi" });
    }

    updateData.category_slug = catData?.slug || "";
    updateData.subcategory_slug =
      catData?.subcategories?.find((s) => s.id === subcategory)?.slug || "";

    // Görsel silme işlemi
    const { data: existing, error: fetchError } = await supabase
      .from("products")
      .select("image")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Eski ürün alınamadı:", fetchError.message);
      return res.status(500).json({ error: "Ürün alınamadı" });
    }

    if (
      existing?.image &&
      image &&
      existing.image !== image &&
      status !== "arşivli"
    ) {
      const oldPath = existing.image.split(`/object/public/${BUCKET_NAME}/`)[1];
      if (oldPath) {
        await supabase.storage.from(BUCKET_NAME).remove([oldPath]);
      }
    }

    const { data: updatedData, error: updateError } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select();

    if (updateError) {
      console.error("Ürün güncellenemedi:", updateError.message);
      return res.status(500).json({ error: "Ürün güncellenemedi" });
    }

    return res.status(200).json({
      message: "Ürün güncellendi",
      product: updatedData?.[0] || null,
    });
  }

  if (req.method === "DELETE") {
    const isArchive = req.query.archive === "true";

    if (isArchive) {
      const { error: archiveError } = await supabase
        .from("products")
        .update({ status: "arşivli" })
        .eq("id", id);

      if (archiveError) {
        console.error("Arşivleme hatası:", archiveError.message);
        return res.status(500).json({ error: "Arşivleme başarısız" });
      }

      return res.status(200).json({ message: "Ürün arşivlendi" });
    }

    // Gerçek silme
    const { data: existing, error: fetchError } = await supabase
      .from("products")
      .select("image")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Ürün bilgisi alınamadı:", fetchError.message);
      return res.status(500).json({ error: "Ürün bilgisi alınamadı" });
    }

    if (existing?.image) {
      const oldPath = existing.image.split(`/object/public/${BUCKET_NAME}/`)[1];
      if (oldPath) {
        await supabase.storage.from(BUCKET_NAME).remove([oldPath]);
      }
    }

    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Ürün silinemedi:", deleteError.message);
      return res.status(500).json({ error: "Ürün silinemedi" });
    }

    return res.status(200).json({ message: "Ürün silindi" });
  }

  return res.status(405).json({ error: "İzin verilmeyen yöntem" });
}
