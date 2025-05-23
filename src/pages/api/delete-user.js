// /pages/api/delete-user.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST isteği destekleniyor." });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Kullanıcı ID eksik." });
  }

  try {
    // Sunucu tarafı Supabase client (service role ile)
    const supabaseAdmin = require("@supabase/supabase-js").createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY // dikkat: client-side'da asla kullanma!
    );

    // 1. users tablosundan sil
    await supabaseAdmin.from("users").delete().eq("id", userId);

    // 2. auth tablosundan sil
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
