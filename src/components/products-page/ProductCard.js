// components/cards/ProductCard.js
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useRouter } from "next/router";
import {
  AiOutlinePlus,
  AiOutlineMinus,
  AiOutlineCheck,
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";
import styles from "./ProductCard.module.css";

const weightOptions = [
  { label: "250gr", value: 0.25 },
  { label: "500gr", value: 0.5 },
  { label: "1kg", value: 1 },
];

export default function ProductCard({ product, isSlider = false }) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const router = useRouter();

  const favorited = isFavorite(product.id);

  const [selectedOption, setSelectedOption] = useState(1);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (e) => {
    e.preventDefault();

    const label =
      product.unitType === "weight"
        ? weightOptions.find((w) => w.value === selectedOption)?.label
        : `${quantity} adet`;

    addToCart({
      ...product,
      finalPrice: parseFloat(getFinalPrice()),
      selectedAmount: product.unitType === "weight" ? selectedOption : quantity,
      displayAmount: label,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);

    if (product.unitType === "weight") {
      setSelectedOption(1);
    } else {
      setQuantity(1);
    }
  };

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await toggleFavorite(product.id);
    } catch (err) {
      console.error("Favori işlemi hatası:", err.message);
    }
  };

  return (
    <Link
      href={`/products-detail/${product.slug}`}
      className={styles.link}
      aria-label={`${product.name} detay sayfası`}
    >
      <article
        className={`${styles.card} ${isSlider ? styles.sliderCard : ""}`}
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={`${product.name} görseli`}
            width={300}
            height={200}
            className={styles.image}
            placeholder="blur"
            blurDataURL="/images/placeholder.jpg"
            priority={!isSlider}
          />
        ) : (
          <div className={styles.imageFallback}>
            <span>Görsel yok</span>
          </div>
        )}

        <div className={styles.headerRow}>
          <h3>{product.name}</h3>
          <button
            className={styles.heartButton}
            onClick={handleToggleFavorite}
            aria-label={favorited ? "Favoriden kaldır" : "Favorilere ekle"}
            tabIndex={isSlider ? -1 : 0}
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

        <div className={styles.selectRow}>
          {product.unitType === "weight" ? (
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(parseFloat(e.target.value))}
              className={styles.selectBox}
            >
              {weightOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <div
              className={`${styles.controls} ${styles.inlineControls}`}
              onClick={(e) => e.preventDefault()}
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Adet azalt"
              >
                <AiOutlineMinus />
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Adet artır"
              >
                <AiOutlinePlus />
              </button>
            </div>
          )}

          <span className={styles.price}>{getFinalPrice()}₺</span>
        </div>

        <button
          onClick={handleAddToCart}
          className={styles.button}
          tabIndex={isSlider ? -1 : 0}
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

  function getFinalPrice() {
    const amount = product.unitType === "weight" ? selectedOption : 1;
    return (product.price * amount).toFixed(2);
  }
}
