// ✅ components/products-detail/ProductInfoCard.js
import {
  AiOutlinePlus,
  AiOutlineCheck,
  AiFillHeart,
  AiOutlineHeart,
} from "react-icons/ai";
import styles from "./ProductInfoCard.module.css";

export default function ProductInfoCard({
  product,
  categoryName,
  subcategoryName,
  router,
  handleAddToCart,
  handleToggleFavorite,
  added,
  favorited,
}) {
  return (
    <div className={styles.infoCard}>
      <h1>{product.name}</h1>
      {categoryName && subcategoryName && (
        <p className={styles.breadcrumb}>
          <span onClick={() => router.push(`/products/${product.category}`)}>
            {categoryName}
          </span>{" "}
          &gt;{" "}
          <span
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
        <button onClick={handleToggleFavorite} className={styles.favButton}>
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
