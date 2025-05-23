// components/cards/ProductInfoCard.js
import Link from "next/link";
import {
  AiOutlinePlus,
  AiOutlineMinus,
  AiOutlineCheck,
  AiFillHeart,
  AiOutlineHeart,
} from "react-icons/ai";
import styles from "./ProductInfoCard.module.css";
import { useState } from "react";

const weightOptions = [
  { label: "250gr", value: 0.25 },
  { label: "500gr", value: 0.5 },
  { label: "1kg", value: 1 },
];

export default function ProductInfoCard({
  product,
  categoryName,
  subcategoryName,
  categorySlug,
  subcategorySlug,
  handleAddToCart,
  handleToggleFavorite,
  added,
  favorited,
}) {
  const [selectedOption, setSelectedOption] = useState(1);
  const [quantity, setQuantity] = useState(1);

  const isWeight = product.unitType === "weight";
  const finalPrice = (product.price * (isWeight ? selectedOption : 1)).toFixed(
    2
  );
  const displayLabel = isWeight
    ? weightOptions.find((w) => w.value === selectedOption)?.label
    : `${quantity} adet`;

  const onAddToCart = () => {
    handleAddToCart({
      ...product,
      finalPrice: parseFloat(finalPrice),
      selectedAmount: isWeight ? selectedOption : quantity,
      displayAmount: displayLabel,
    });

    isWeight ? setSelectedOption(1) : setQuantity(1);
  };

  const onToggleFavorite = () => {
    handleToggleFavorite(product.id);
  };

  return (
    <div className={styles.infoCard}>
      <h1>{product.name}</h1>

      {categoryName && subcategoryName && (
        <p className={styles.breadcrumb}>
          <Link href={`/products/${categorySlug}`}>{categoryName}</Link> &gt;{" "}
          <Link href={`/products/${categorySlug}/${subcategorySlug}`}>
            {subcategoryName}
          </Link>
        </p>
      )}

      <p className={styles.description}>{product.description}</p>

      <div className={styles.selectRow}>
        {isWeight ? (
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
          <div className={styles.inlineControls}>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              <AiOutlineMinus />
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>
              <AiOutlinePlus />
            </button>
          </div>
        )}

        <p className={styles.price}>{finalPrice}₺</p>
      </div>

      <div className={styles.actions}>
        <button onClick={onAddToCart} className={styles.cartButton}>
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
          onClick={onToggleFavorite}
          className={styles.favButton}
          aria-label="Favorilere ekle/kaldır"
        >
          {favorited ? (
            <AiFillHeart className={styles.filledHeart} />
          ) : (
            <AiOutlineHeart className={styles.heartIcon} />
          )}
        </button>
      </div>
    </div>
  );
}
