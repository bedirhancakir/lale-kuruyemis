import Head from "next/head";
import ProductCard from "../components/products-page/ProductCard";
import styles from "../styles/FavoritesPage.module.css";
import { useFavorites } from "../context/FavoritesContext";
import { useMemo } from "react";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  const activeFavorites = useMemo(
    () => favorites.filter((product) => product.status !== "arşivli"),
    [favorites]
  );

  return (
    <>
      <Head>
        <title>Favoriler – Lale Kuruyemiş</title>
        <meta
          name="description"
          content="Favorilerinizi görüntüleyin ve tek tıkla ulaşın."
        />
        <link rel="canonical" href="https://www.lalekuruyemis.com/favorites" />
        <meta property="og:title" content="Favoriler – Lale Kuruyemiş" />
        <meta
          property="og:description"
          content="Favori ürünlerinize hızlıca erişin."
        />
        <meta property="og:image" content="/images/placeholder.jpg" />
        <meta
          property="og:url"
          content="https://www.lalekuruyemis.com/favorites"
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
