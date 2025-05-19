import { useRouter } from "next/router";
import { useCategories } from "../../context/CategoryContext";
import styles from "./ProductsFilter.module.css";

export default function ProductsFilter() {
  const router = useRouter();
  const categories = useCategories();

  const slug = router.query.slug || [];
  const category = slug[0] || null;
  const subcategory = slug[1] || null;

  const handleClick = (categoryId, subcategoryId) => {
    if (!subcategoryId || subcategoryId === "tum") {
      router.push(`/products/${categoryId}`);
    } else {
      router.push(`/products/${categoryId}/${subcategoryId}`);
    }
  };

  return (
    <aside className={styles.sidebar} aria-label="Kategori Filtresi">
      <h2 className={styles.sidebarTitle}>Kategoriler</h2>

      {categories.map((cat) => (
        <div key={cat.id} className={styles.block}>
          <h3 className={styles.categoryName}>{cat.name}</h3>
          <ul className={styles.subList}>
            <li key="tum">
              <button
                onClick={() => handleClick(cat.id, "tum")}
                className={
                  category === cat.id && !subcategory ? styles.active : ""
                }
                aria-current={
                  category === cat.id && !subcategory ? "true" : "false"
                }
              >
                Tümü
              </button>
            </li>

            {cat.subcategories.map((sub) => (
              <li key={sub.id}>
                <button
                  onClick={() => handleClick(cat.id, sub.id)}
                  className={
                    category === cat.id && subcategory === sub.id
                      ? styles.active
                      : ""
                  }
                  aria-current={
                    category === cat.id && subcategory === sub.id
                      ? "true"
                      : "false"
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
