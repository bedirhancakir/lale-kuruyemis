import ProductCard from "../products-page/ProductCard";
import styles from "./SimpleProductGrid.module.css";

export default function SimpleProductGrid({ title, products }) {
  return (
    <section className={styles.gridSection}>
      <h2>{title}</h2>
      <div className={styles.grid}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
