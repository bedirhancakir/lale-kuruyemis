import { useEffect, useState } from "react";
import styles from "../../styles/TaggedProducts.module.css";

const TAGS = [
  { key: "all", label: "🗂️ Tüm Ürünler" },
  { key: "isFeatured", label: "⭐ Öne Çıkanlar" },
  { key: "isRecommended", label: "🎯 Önerilenler" },
  { key: "isBestSeller", label: "🔥 En Çok Satanlar" },
  { key: "isDiscounted", label: "💸 İndirimli Ürünler" },
];

export default function TaggedProductsManagement() {
  const [products, setProducts] = useState([]);
  const [activeTag, setActiveTag] = useState("isFeatured");

  useEffect(() => {
    fetch("/api/admin/admin-products")
      .then((res) => res.json())
      .then((data) => {
        console.log("API'den gelen ürünler:", data); // 🔍 burayı ekle
        const normalized = data.map((p) => ({
          ...p,
          isFeatured: typeof p.isFeatured === "boolean" ? p.isFeatured : false,
          isRecommended:
            typeof p.isRecommended === "boolean" ? p.isRecommended : false,
          isBestSeller:
            typeof p.isBestSeller === "boolean" ? p.isBestSeller : false,
          isDiscounted:
            typeof p.isDiscounted === "boolean" ? p.isDiscounted : false,
        }));
        setProducts(normalized);
      });
  }, []);

  const handleTagToggle = async (productId, tag, currentValue) => {
    const updated = !currentValue;

    await fetch("/api/admin/tags", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, tag, value: updated }),
    });

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, [tag]: updated } : p))
    );
  };

  return (
    <div className={styles.container}>
      <h1>Etiketli Ürün Yönetimi</h1>

      <div className={styles.tabs}>
        {TAGS.map((tag) => (
          <button
            key={tag.key}
            onClick={() => setActiveTag(tag.key)}
            className={activeTag === tag.key ? styles.active : ""}
          >
            {tag.label}
          </button>
        ))}
      </div>

      {activeTag === "all" ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ürün</th>
              <th>⭐</th>
              <th>🎯</th>
              <th>🔥</th>
              <th>💸</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                {[
                  "isFeatured",
                  "isRecommended",
                  "isBestSeller",
                  "isDiscounted",
                ].map((tag) => (
                  <td key={tag}>
                    <input
                      type="checkbox"
                      checked={p[tag] || false}
                      onChange={() => handleTagToggle(p.id, tag, p[tag])}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <ul className={styles.list}>
          {products
            .filter((p) => p[activeTag]) // sadece o tag'e sahip ürünleri göster
            .map((product) => (
              <li key={product.id} className={styles.item}>
                <label>
                  <input
                    type="checkbox"
                    checked={product[activeTag] || false}
                    onChange={() =>
                      handleTagToggle(product.id, activeTag, product[activeTag])
                    }
                  />
                  {product.name}
                </label>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
