// context/FavoritesContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const fetchFavorites = async () => {
    const { data: ids, error } = await supabase
      .from("favorites")
      .select("product_id")
      .eq("user_id", user.id);

    if (error) {
      console.error("Favoriler alınamadı:", error.message);
      return;
    }

    const productIds = ids.map((fav) => fav.product_id);

    if (productIds.length === 0) {
      setFavorites([]);
      return;
    }

    const { data: products, error: productError } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds)
      .neq("status", "arşivli");

    if (productError) {
      console.error("Ürünler alınamadı:", productError.message);
      return;
    }

    setFavorites(products);
  };

  const toggleFavorite = async (productId) => {
    if (!user) {
      router.push("/login");
      return;
    }

    const isFav = favorites.some((fav) => fav.id === productId); // ✅ doğru kontrol

    if (isFav) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (!error) {
        setFavorites(favorites.filter((fav) => fav.id !== productId)); // ✅ ürün objesinden çıkar
      }
    } else {
      const { data, error } = await supabase
        .from("favorites")
        .insert([{ user_id: user.id, product_id: productId }])
        .select("product_id"); // gerekirse fetch et

      if (!error) {
        fetchFavorites();
      }
    }
  };

  const isFavorite = (productId) => {
    return favorites.some((fav) => fav.id === productId);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
