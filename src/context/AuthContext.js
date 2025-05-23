import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async (authUser) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle();

    if (error || !data) {
      // Kullanıcı profili alınamadıysa, kullanıcıyı veritabanına ekle
      const { error: insertError } = await supabase.from("users").insert({
        id: authUser.id,
        email: authUser.email,
        full_name: authUser.user_metadata.full_name,
        role: authUser.user_metadata.role || "bireysel",
      });

      if (insertError) {
        console.error(
          "Kullanıcı veritabanına eklenemedi:",
          insertError.message
        );
      }
    } else {
      setUser(authUser);
      setProfile(data);
    }
  };

  useEffect(() => {
    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      const authUser = data.session?.user;
      if (authUser) {
        await loadUserProfile(authUser);
      }
      setLoading(false);
    };

    initSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const authUser = session?.user;
        if (authUser) {
          await loadUserProfile(authUser);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => listener?.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
