import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
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
  const [dragging, setDragging] = useState(false);

  const favorited = isFavorite(product.id);

  const [selectedOption, setSelectedOption] = useState(1); // default 1
  const [quantity, setQuantity] = useState(1); // sadece unit ürünler için

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

    // Seçimi sıfırla
    if (product.unitType === "weight") {
      setSelectedOption(1); // 1kg
    } else {
      setQuantity(1); // 1 adet
    }
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    toggleFavorite(product);
  };

  const handleSelectClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseDown = () => setDragging(false);
  const handleMouseMove = () => setDragging(true);
  const handleClick = (e) => {
    if (dragging) e.preventDefault();
  };

  const getFinalPrice = () => {
    const amount = product.unitType === "weight" ? selectedOption : 1;
    return (product.price * amount).toFixed(2);
  };

  return (
    <Link
      href={`/products-detail/${product.slug}`}
      className={styles.link}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      aria-label={`${product.name} detay sayfası`}
    >
      <article
        className={`${styles.card} ${isSlider ? styles.sliderCard : ""}`}
      >
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
              onClick={handleSelectClick}
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
}
