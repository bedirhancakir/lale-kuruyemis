// pages/api/register-user.js
import { supabase } from "../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST destekleniyor" });
  }

  const { id, email, full_name, role } = req.body;

  // Eğer gerekli alanlar eksikse, hata döndür
  if (!id || !email || !full_name) {
    return res.status(400).json({ error: "Eksik veri" });
  }

  try {
    // Kullanıcıyı 'users' tablosuna ekleyelim
    const { error } = await supabase.from("users").upsert({
      id,
      email,
      full_name,
      role: role || "bireysel",
    });

    if (error) {
      throw new Error(error.message);
    }

    // Başarıyla işlem tamamlandığında success yanıtı döndürüyoruz
    return res.status(200).json({ success: true });
  } catch (error) {
    // Eğer bir hata oluşursa, hata mesajını döndürüyoruz
    return res.status(500).json({ error: error.message });
  }
}
