import Head from "next/head";
import ProductCard from "../components/products-page/ProductCard"; // 🔥 PATH düzeltildi
import styles from "../styles/FavoritesPage.module.css";
import { useFavorites } from "../context/FavoritesContext";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  const activeFavorites = favorites.filter(
    (product) => product.status !== "arşivli"
  ); // 🔥 SADECE aktif ürünler

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
