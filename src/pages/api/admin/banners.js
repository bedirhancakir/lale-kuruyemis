import { supabase } from "../../../lib/supabaseClient";

const BUCKET_NAME = "lale-assets";
const FOLDER_NAME = "hero-banners";

export default async function handler(req, res) {
  const method = req.method;

  if (method === "POST") {
    const { filename, title, link } = req.body;

    try {
      const { data: allBanners } = await supabase
        .from("banners")
        .select("order_index");

      const maxOrder = allBanners?.length
        ? Math.max(...allBanners.map((b) => b.order_index || 0))
        : 0;

      const { data, error } = await supabase.from("banners").insert([
        {
          filename,
          title,
          link,
          order_index: maxOrder + 1,
        },
      ]);

      if (error) throw error;

      return res.status(201).json({ success: true, banner: data?.[0] });
    } catch (err) {
      console.error("Banner eklenemedi:", err.message);
      return res.status(500).json({ error: "Banner eklenemedi" });
    }
  }

  if (method === "DELETE") {
    const { id, filename } = req.body;

    if (!id) return res.status(400).json({ error: "ID gerekli" });

    try {
      // Storage'dan dosyayı sil
      if (filename) {
        const filePath = `${FOLDER_NAME}/${filename}`;
        await supabase.storage.from(BUCKET_NAME).remove([filePath]);
      }

      const { error } = await supabase.from("banners").delete().eq("id", id);
      if (error) throw error;

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Banner silinemedi:", err.message);
      return res.status(500).json({ error: "Silme işlemi başarısız" });
    }
  }

  if (method === "PUT") {
    const banners = req.body;

    try {
      const updates = await Promise.all(
        banners.map((banner, index) =>
          supabase
            .from("banners")
            .update({ order_index: index + 1 })
            .eq("id", banner.id)
        )
      );

      const errors = updates.filter((r) => r.error);
      if (errors.length > 0) throw new Error("Sıralama güncellenemedi");

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Sıralama güncellenemedi:", err.message);
      return res.status(500).json({ error: "Sıralama işlemi başarısız" });
    }
  }

  return res.status(405).json({ error: "Yöntem desteklenmiyor" });
}
