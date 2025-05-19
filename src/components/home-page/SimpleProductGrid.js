import ProductCard from "../products-page/ProductCard";
import styles from "./SimpleProductGrid.module.css";

export default function SimpleProductGrid({ title, products = [] }) {
  if (!Array.isArray(products) || products.length === 0) return null;

  return (
    <section className={styles.gridSection} aria-label={title}>
      <h2>{title}</h2>
      <div className={styles.grid}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
