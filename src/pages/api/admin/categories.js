import { supabase } from "../../../lib/supabaseClient";
import slugify from "../../../utils/slugify";

export default async function handler(req, res) {
  const { type } = req.body;

  if (req.method === "POST") {
    const {
      name,
      description = "",
      image = "",
      categoryId,
      forceUpdate,
      oldId,
      oldImage = "",
    } = req.body;

    if (!name)
      return res.status(400).json({ error: "Kategori adı zorunludur" });

    const slug = slugify(name);

    try {
      if (type === "category") {
        if (forceUpdate && oldId) {
          if (oldImage && oldImage !== image) {
            const oldPath = oldImage.split("/object/public/lale-assets/")[1];
            if (oldPath) {
              await supabase.storage.from("lale-assets").remove([oldPath]);
            }
          }

          const { error } = await supabase
            .from("categories")
            .update({ name, description, image, slug })
            .eq("id", oldId);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("categories")
            .insert([{ name, description, image, slug }]);

          if (error) throw error;
        }
      }

      if (type === "subcategory") {
        if (!categoryId)
          return res.status(400).json({ error: "Ana kategori ID zorunlu" });

        const subSlug = slugify(name);

        const { error } = await supabase
          .from("subcategories")
          .insert([{ name, category_id: categoryId, slug: subSlug }]);

        if (error) throw error;
      }

      const { data: categoriesWithSubs } = await supabase
        .from("categories")
        .select(
          "id, name, description, image, slug, subcategories(id, name, slug)"
        );

      return res.status(200).json(categoriesWithSubs);
    } catch (err) {
      console.error("Kategori ekleme/güncelleme hatası:", err.message);
      return res.status(500).json({ error: "Kategori kaydedilemedi" });
    }
  }

  if (req.method === "DELETE") {
    const { type, id } = req.body;

    try {
      if (type === "category") {
        const { data: category } = await supabase
          .from("categories")
          .select("image")
          .eq("id", id)
          .single();

        const imagePath = category?.image?.split(
          "/object/public/lale-assets/"
        )[1];
        if (imagePath) {
          await supabase.storage.from("lale-assets").remove([imagePath]);
        }

        const { error } = await supabase
          .from("categories")
          .delete()
          .eq("id", id);
        if (error) throw error;
      }

      if (type === "subcategory") {
        const { error } = await supabase
          .from("subcategories")
          .delete()
          .eq("id", id);
        if (error) throw error;
      }

      const { data: updated } = await supabase
        .from("categories")
        .select(
          "id, name, description, image, slug, subcategories(id, name, slug)"
        );

      return res.status(200).json(updated);
    } catch (err) {
      console.error("Silme hatası:", err.message);
      return res.status(500).json({ error: "Silme işlemi başarısız" });
    }
  }

  return res.status(405).json({ error: "Yalnızca POST ve DELETE desteklenir" });
}
