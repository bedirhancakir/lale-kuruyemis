import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { getStaticPaths, getStaticProps } from "../../lib/getProductData";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";

import { AiOutlinePlus, AiFillHeart, AiOutlineHeart, AiOutlineCheck } from "react-icons/ai";
import styles from "../../styles/ProductDetailPage.module.css";

export { getStaticPaths, getStaticProps };

export default function ProductDetailPage({ product }) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  if (!product) {
    return (
      <section className={styles.container}>
        <h1>Ürün bulunamadı ❌</h1>
        <p>Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
      </section>
    );
  }

  const favorited = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product);
  };

  return (
    <>
      <Head>
        <title>{product.name} – Lale Kuruyemiş</title>
        <meta name="description" content={product.description} />
      </Head>

      <section className={styles.container}>
        <div className={styles.imageWrapper}>
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={400}
            className={styles.image}
          />
        </div>

        <div className={styles.infoCard}>
          <h1>{product.name}</h1>
          <p className={styles.description}>{product.description}</p>
          <p className={styles.price}>{product.price}₺</p>

          <div className={styles.actions}>
            <button onClick={handleAddToCart} className={styles.cartButton}>
              {added ? (
                <>
                  Sepete Eklendi <AiOutlineCheck className={styles.checkIcon} />
                </>
              ) : (
                <>
                  Sepete Ekle <AiOutlinePlus className={styles.addIcon} />
                </>
              )}
            </button>

            <button
              onClick={handleToggleFavorite}
              className={styles.favButton}
              aria-label="Favorilere ekle"
            >
              {favorited ? (
                <AiFillHeart className={styles.filledHeart} />
              ) : (
                <AiOutlineHeart className={styles.heartIcon} />
              )}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
