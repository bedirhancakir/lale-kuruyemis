import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import {
  AiOutlinePlus,
  AiOutlineCheck,
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product, isSlider = false }) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [dragging, setDragging] = useState(false);

  const favorited = isFavorite(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Link'e gitmeyi engelle
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault(); // Link'e gitmeyi engelle
    toggleFavorite(product);
  };

  // ✅ Slider sürükleme sırasında tıklamayı engelle
  const handleMouseDown = () => setDragging(false);
  const handleMouseMove = () => setDragging(true);
  const handleClick = (e) => {
    if (dragging) {
      e.preventDefault();
    }
  };

  return (
    <Link
      href={`/products-detail/${product.slug}`}
      className={styles.link}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <article
        className={`${styles.card} ${isSlider ? styles.sliderCard : ""}`}
      >
        {/* ✅ Ürün görseli */}
        <Image
          src={product.image}
          alt={`${product.name} görseli`}
          width={300}
          height={200}
          className={styles.image}
          priority
        />

        {/* ✅ Üst başlık + favori ikonu */}
        <div className={styles.headerRow}>
          <h3>{product.name}</h3>
          <button
            className={styles.heartButton}
            onClick={handleToggleFavorite}
            aria-label="Favorilere ekle"
            tabIndex={isSlider ? -1 : 0} // ✅ Slider içindeyse klavye erişimini engelle
          >
            {favorited ? (
              <AiFillHeart className={styles.filledHeart} />
            ) : (
              <AiOutlineHeart className={styles.heartIcon} />
            )}
          </button>
        </div>

        {/* ✅ Açıklama */}
        <p>
          {isSlider
            ? product.description?.substring(0, 80) + "..."
            : product.description}
        </p>

        {/* ✅ Fiyat */}
        <p className={styles.price}>
          <strong>{product.price}₺</strong>
        </p>

        {/* ✅ Sepete Ekle Butonu */}
        <button
          onClick={handleAddToCart}
          className={styles.button}
          tabIndex={isSlider ? -1 : 0} // ✅ Slider içindeyse klavyeyle geçilmesin
        >
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
      </article>
    </Link>
  );
}
