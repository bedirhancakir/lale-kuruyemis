// ✅ components/products-detail/ProductImage.js
import Image from "next/image";
import styles from "./ProductImage.module.css";

export default function ProductImage({ product }) {
  return (
    <div className={styles.imageWrapper}>
      {(product.isRecommended ||
        product.isBestSeller ||
        product.isDiscounted) && (
        <div className={styles.badgeContainer}>
          {product.isRecommended && (
            <span className={styles.badge}>Önerilen</span>
          )}
          {product.isBestSeller && (
            <span className={styles.badge}>Çok Satan</span>
          )}
          {product.isDiscounted && (
            <span className={styles.badge}>İndirimli</span>
          )}
        </div>
      )}

      <Image
        src={product.image}
        alt={product.name}
        width={600}
        height={400}
        className={styles.image}
        priority
      />
    </div>
  );
}
