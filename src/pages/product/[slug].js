import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import styles from "../../styles/ProductDetailPage.module.css";
import { AiOutlinePlus, AiFillHeart, AiOutlineHeart, AiOutlineCheck } from "react-icons/ai";

export default function ProductDetailPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!slug) return;
    
    async function fetchProduct() {
      const res = await fetch("/api/products");
      const data = await res.json();
      const foundProduct = data.find((p) => 
        p.name.toLowerCase().replace(/\s+/g, "-") === slug && p.status === "aktif"
      );
      
      if (foundProduct) {
        setProduct(foundProduct);
      }
      
      setLoading(false);
    }

    fetchProduct();
  }, [slug]);

  if (loading) return <p>Yükleniyor...</p>;

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
            priority
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
              aria-label="Favorilere ekle veya çıkar"
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
