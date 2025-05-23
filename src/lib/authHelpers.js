import { supabase } from "./supabaseClient";

export const fetchUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Profil verisi alınamadı:", error.message);
    return null;
  }

  return data;
};

// Giriş yap
export const login = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Çıkış yap
export const logout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  localStorage.removeItem("favorites"); // favoriler
  localStorage.removeItem("cart"); // sepet (eğer varsa)
  localStorage.removeItem("pending_signup_email"); // doğrulama bekleyen kayıt
};
