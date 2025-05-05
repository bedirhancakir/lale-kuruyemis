import { useEffect, useState } from "react";
import Image from "next/image";
import ProductCard from "../../components/products-page/ProductCard";
import ProductsFilter from "../../components/products-page/ProductsFilter";
import styles from "../../styles/ProductsPage.module.css";
import categoriesData from "../../../data/categories.json";
import { useCategories } from "../../context/CategoryContext"; // ✅

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

export async function getStaticPaths() {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    }/api/public/categories`
  );
  const categories = await res.json();

  const paths = [];

  categories.forEach((cat) => {
    cat.subcategories.forEach((sub) => {
      paths.push({ params: { slug: [cat.id, sub.id] } });
    });

    paths.push({ params: { slug: [cat.id] } }); // Tümü
  });

  return {
    paths,
    fallback: false,
  };
}

export default function FilteredProductsPage({
  filteredProducts,
  category,
  subcategory,
}) {
  const isAll = category === subcategory;
  const categories = useCategories(); // ✅ useEffect yerine context

  const getCategoryName = (id) =>
    categories.find((cat) => cat.id === id)?.name || "";

  const getSubcategoryName = (catId, subId) =>
    categories
      .find((cat) => cat.id === catId)
      ?.subcategories.find((sub) => sub.id === subId)?.name || "";

  const title = isAll
    ? `${getCategoryName(category)}`
    : `${getSubcategoryName(category, subcategory)}`;

  const currentCategory = categoriesData.find((cat) => cat.id === category);
  const showBanner = currentCategory?.image;
  const showDescription = currentCategory?.description;

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>{title}</h1>

      {showBanner && (
        <div
          style={{
            marginBottom: "2rem",
            position: "relative",
            width: "100%",
            height: "300px",
          }}
        >
          <Image
            src={currentCategory.image}
            alt={currentCategory.name}
            layout="fill"
            objectFit="cover"
            style={{ borderRadius: "12px" }}
            priority
          />
        </div>
      )}

      {showDescription && (
        <p style={{ fontSize: "1.1rem", marginBottom: "2rem", color: "#444" }}>
          {currentCategory.description}
        </p>
      )}

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
