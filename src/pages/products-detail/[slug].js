import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import styles from "../../styles/ProductDetailPage.module.css";
import {
  AiOutlinePlus,
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineCheck,
} from "react-icons/ai";

export default function ProductDetailPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [added, setAdded] = useState(false);

  // Ürün ve kategori verilerini aynı anda çekiyoruz
  useEffect(() => {
    if (!slug) return;

    async function fetchProductAndCategories() {
      const [productRes, catRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/public/categories"),
      ]);

      const productsData = await productRes.json();
      const categoriesData = await catRes.json();

      const foundProduct = productsData.find(
        (p) => p.slug === slug && p.status === "aktif"
      );

      if (foundProduct) {
        setProduct(foundProduct);
        setCategories(categoriesData);
      }

      setLoading(false);
    }

    fetchProductAndCategories();
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

  // Ürünün kategori ve alt kategori adlarını bul
  const categoryName =
    categories.find((cat) => cat.id === product.category)?.name || "";

  const subcategoryName =
    categories
      .find((cat) => cat.id === product.category)
      ?.subcategories.find((sub) => sub.id === product.subcategory)?.name || "";

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

          {/* Breadcrumb: Kategori ve alt kategori ayrı ayrı tıklanabilir */}
          {categoryName && subcategoryName && (
            <p className={styles.breadcrumb}>
              <span
                className={styles.breadcrumb}
                onClick={() => router.push(`/products/${product.category}`)}
              >
                {categoryName}
              </span>{" "}
              &gt;{" "}
              <span
                className={styles.breadcrumb}
                onClick={() =>
                  router.push(
                    `/products/${product.category}/${product.subcategory}`
                  )
                }
              >
                {subcategoryName}
              </span>
            </p>
          )}

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
