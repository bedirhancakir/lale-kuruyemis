// pages/favorites.js
import Head from "next/head";
import ProductCard from "../components/products-page/ProductCard";
import styles from "../styles/FavoritesPage.module.css";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

export default function FavoritesPage() {
  const { favorites } = useFavorites(); // supabase üzerinden geliyor
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // login olmayan kullanıcıyı yönlendir
    if (!loading && (!user || !profile)) {
      router.replace("/login");
    }
  }, [user, profile, loading]);

  const activeFavorites = useMemo(
    () => favorites?.filter((product) => product?.status !== "arşivli"),
    [favorites]
  );

  // sayfa yükleniyorken veya login değilse boş döndür
  if (loading || !user || !profile) return null;

  return (
    <>
      <Head>
        <title>Favoriler – Lale Kuruyemiş</title>
        <meta
          name="description"
          content="Favorilerinizi görüntüleyin ve tek tıkla ulaşın."
        />
      </Head>

      <section className={styles.favorites}>
        <h1 className={styles.title}>Favorilerim</h1>

        {activeFavorites.length === 0 ? (
          <p className={styles.empty}>Henüz favori ürün eklemediniz 😢</p>
        ) : (
          <div className={styles.grid}>
            {activeFavorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
