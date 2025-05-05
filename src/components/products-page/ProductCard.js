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
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    toggleFavorite(product);
  };

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
      <article className={`${styles.card} ${isSlider ? styles.sliderCard : ""}`}>
        <Image
          src={product.image}
          alt={`${product.name} görseli`}
          width={300}
          height={200}
          className={styles.image}
          priority
        />

        <div className={styles.headerRow}>
          <h3>{product.name}</h3>
          <button
            className={styles.heartButton}
            onClick={handleToggleFavorite}
            aria-label="Favorilere ekle"
          >
            {favorited ? (
              <AiFillHeart className={styles.filledHeart} />
            ) : (
              <AiOutlineHeart className={styles.heartIcon} />
            )}
          </button>
        </div>

        <p>
          {isSlider
            ? product.description?.substring(0, 80) + "..."
            : product.description}
        </p>

        <p className={styles.price}>
          <strong>{product.price}₺</strong>
        </p>

        <button onClick={handleAddToCart} className={styles.button}>
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
