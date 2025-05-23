import { useEffect, useState } from "react";
import styles from "../../styles/TaggedProducts.module.css";
import withAuth from "../../components/shared/withAuth";
import {
  FaFolderOpen,
  FaStar,
  FaBullseye,
  FaFire,
  FaTags,
} from "react-icons/fa";

const TAGS = [
  { key: "all", label: "Tüm Ürünler", icon: <FaFolderOpen /> },
  { key: "isFeatured", label: "Öne Çıkanlar", icon: <FaStar /> },
  { key: "isRecommended", label: "Önerilenler", icon: <FaBullseye /> },
  { key: "isBestSeller", label: "En Çok Satanlar", icon: <FaFire /> },
  { key: "isDiscounted", label: "İndirimliler", icon: <FaTags /> },
];

function TaggedProductsManagement() {
  const [products, setProducts] = useState([]);
  const [activeTag, setActiveTag] = useState("isFeatured");

  useEffect(() => {
    fetch("/api/admin/admin-products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) =>
        console.error("Etiketli ürünler alınamadı:", err.message)
      );
  }, []);

  const handleTagToggle = async (productId, tag, currentValue) => {
    const updated = !currentValue;

    try {
      await fetch("/api/admin/tags", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, tag, value: updated }),
      });

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, [tag]: updated } : p))
      );
    } catch (err) {
      console.error("Etiket güncellenemedi:", err.message);
    }
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
            {tag.icon} {tag.label}
          </button>
        ))}
      </div>

      {activeTag === "all" ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ürünler</th>
              <th>Öne Çıkan Ürünler</th>
              <th>Önerilen Ürünler</th>
              <th>En Çok Satanlar</th>
              <th>İndirimli Ürünler</th>
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
                      checked={!!p[tag]}
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
            .filter((p) => p[activeTag])
            .map((product) => (
              <li key={product.id} className={styles.item}>
                <label>
                  <input
                    type="checkbox"
                    checked={product[activeTag]}
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

export default withAuth(TaggedProductsManagement, ["admin"]);
