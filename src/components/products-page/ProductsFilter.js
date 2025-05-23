import { useRouter } from "next/router";
import { useCategories } from "../../context/CategoryContext";
import styles from "./ProductsFilter.module.css";

export default function ProductsFilter() {
  const router = useRouter();
  const categories = useCategories();

  const slug = router.query.slug || [];
  const categorySlug = slug[0] || null;
  const subcategorySlug = slug[1] || null;

  const handleClick = (catSlug, subSlug) => {
    if (!subSlug || subSlug === "tum") {
      router.push(`/products/${catSlug}`);
    } else {
      router.push(`/products/${catSlug}/${subSlug}`);
    }
  };

  return (
    <aside className={styles.sidebar} aria-label="Kategori Filtresi">
      <h2 className={styles.sidebarTitle}>Kategoriler</h2>

      {categories.map((cat) => (
        <div key={cat.id} className={styles.block}>
          <h3 className={styles.categoryName}>{cat.name}</h3>
          <ul className={styles.subList}>
            <li>
              <button
                onClick={() => handleClick(cat.slug, "tum")}
                className={
                  categorySlug === cat.slug &&
                  (!subcategorySlug || subcategorySlug === "tum")
                    ? styles.active
                    : ""
                }
              >
                Tümü
              </button>
            </li>
            {cat.subcategories.map((sub) => (
              <li key={sub.id}>
                <button
                  onClick={() => handleClick(cat.slug, sub.slug)}
                  className={
                    categorySlug === cat.slug && subcategorySlug === sub.slug
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
