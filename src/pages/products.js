import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import styles from "../styles/ProductsPage.module.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/products");
      const data = await res.json();
      const activeProducts = data.filter((product) => product.status === "aktif");
      setProducts(activeProducts);
    }

    fetchProducts();
  }, []);

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Ürünlerimiz</h1>
      <div className={styles.grid}>
        {products.length === 0 ? (
          <p>Şu anda aktif ürün bulunmamaktadır.</p>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </section>
  );
}
