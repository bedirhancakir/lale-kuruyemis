import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ProductCard from "../../components/products-page/ProductCard";
import ProductsFilter from "../../components/products-page/ProductsFilter";
import styles from "../../styles/ProductsPage.module.css";

// ✅ Build time'da ürünleri filtreleyip yolları üret
export async function getStaticProps({ params }) {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    }/api/products`
  );
  const allProducts = await res.json();

  const [category, subcategory] = params.slug;

  const isAll = !subcategory || subcategory === category;

  const filtered = isAll
    ? allProducts.filter((p) => p.category === category && p.status === "aktif")
    : allProducts.filter(
        (p) =>
          p.category === category &&
          p.subcategory === subcategory &&
          p.status === "aktif"
      );

  return {
    props: {
      filteredProducts: filtered,
      category,
      subcategory: subcategory || category,
    },
    revalidate: 60,
  };
}

// ✅ Dynamic paths
export async function getStaticPaths() {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    }/api/public/categories`
  );
  const categories = await res.json();

  const paths = [];

  categories.forEach((cat) => {
    // Alt kategoriler
    cat.subcategories.forEach((sub) => {
      paths.push({ params: { slug: [cat.id, sub.id] } });
    });

    // Tümü
    paths.push({ params: { slug: [cat.id] } });
  });

  return {
    paths,
    fallback: false,
  };
}

// ✅ Sayfa bileşeni
export default function FilteredProductsPage({
  filteredProducts,
  category,
  subcategory,
}) {
  const isAll = category === subcategory;
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/public/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  const getCategoryName = (id) =>
    categories.find((cat) => cat.id === id)?.name || "";

  const getSubcategoryName = (catId, subId) =>
    categories
      .find((cat) => cat.id === catId)
      ?.subcategories.find((sub) => sub.id === subId)?.name || "";

  const title = isAll
    ? `${getCategoryName(category)} Ürünleri`
    : `${getSubcategoryName(category, subcategory)} Ürünleri`;

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.content}>
        <ProductsFilter />
        <div className={styles.grid}>
          {filteredProducts.length === 0 ? (
            <p>Bu kategoriye ait ürün bulunamadı.</p>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
