import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./ProductsFilter.module.css";

export default function ProductsFilter() {
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  // ✅ slug dizisini al: /products/[...slug].js yapısından
  const slug = router.query.slug || [];
  const category = slug[0] || null;
  const subcategory = slug[1] || null;

  // ✅ Kategorileri al
  useEffect(() => {
    fetch("/api/public/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  // ✅ Tıklamayla yönlendirme
  const handleClick = (categoryId, subcategoryId) => {
    if (!subcategoryId || subcategoryId === "tum") {
      // Tüm ürünler için sadece ana kategori
      router.push(`/products/${categoryId}`);
    } else {
      // Alt kategori için kategori + alt kategori
      router.push(`/products/${categoryId}/${subcategoryId}`);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <h2>Kategoriler</h2>

      {categories.map((cat) => (
        <div key={cat.id} className={styles.block}>
          <h3>{cat.name}</h3>
          <ul className={styles.subList}>
            {/* ✅ Tümü */}
            <li key="tum">
              <button
                onClick={() => handleClick(cat.id, "tum")}
                className={
                  category === cat.id && !subcategory ? styles.active : ""
                }
              >
                Tümü
              </button>
            </li>

            {/* ✅ Alt kategoriler */}
            {cat.subcategories.map((sub) => (
              <li key={sub.id}>
                <button
                  onClick={() => handleClick(cat.id, sub.id)}
                  className={
                    category === cat.id && subcategory === sub.id
                      ? styles.active
                      : ""
                  }
                >
                  {sub.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
