// pages/api/admin/updateStatus.js
import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "İzin Verilmeyen Yöntem" });
  }

  const { id, status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: "Eksik veri: id veya status" });
  }

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Durum güncelleme hatası:", error.message);
    return res.status(500).json({ error: "Güncelleme başarısız" });
  }

  return res.status(200).json({ success: true, status });
}
