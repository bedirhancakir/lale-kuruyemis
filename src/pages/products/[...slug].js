import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import ProductCard from "../../components/products-page/ProductCard";
import ProductsFilter from "../../components/products-page/ProductsFilter";
import styles from "../../styles/ProductsPage.module.css";
import { useCategories } from "../../context/CategoryContext";
import { useRouter } from "next/router";

export async function getStaticProps({ params }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/products`);
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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/public/categories`);
  const categories = await res.json();

  const paths = [];
  categories.forEach((cat) => {
    cat.subcategories.forEach((sub) => {
      paths.push({ params: { slug: [cat.id, sub.id] } });
    });
    paths.push({ params: { slug: [cat.id] } });
  });

  return { paths, fallback: false };
}

export default function FilteredProductsPage({
  filteredProducts,
  category,
  subcategory,
}) {
  const isAll = category === subcategory;
  const categories = useCategories();
  const router = useRouter();

  const getCategoryName = (id) =>
    categories.find((cat) => cat.id === id)?.name || "";
  const getSubcategoryName = (catId, subId) =>
    categories
      .find((cat) => cat.id === catId)
      ?.subcategories.find((sub) => sub.id === subId)?.name || "";

  const title = isAll
    ? getCategoryName(category)
    : getSubcategoryName(category, subcategory);

  const currentCategory = categories.find((cat) => cat.id === category);
  const bannerPath = currentCategory?.image?.startsWith("/")
    ? currentCategory.image
    : `/category-banners/${currentCategory?.image}`;

  const showBanner = currentCategory?.image;
  const showDescription = currentCategory?.description;

  const sort = router.query.sort || "default";
  const tagFilters = (router.query.tags || "").split(",").filter(Boolean);

  const tagFilteredProducts = filteredProducts.filter((product) =>
    tagFilters.length === 0
      ? true
      : tagFilters.every((tag) => product[tag] === true)
  );

  const sortedProducts = [...tagFilteredProducts].sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    return 0;
  });

  const [visibleCount, setVisibleCount] = useState(12);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 12, sortedProducts.length));
        }
      },
      { threshold: 1 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [sortedProducts]);

  return (
    <>
      <Head>
        <title>{`${title} Ürünleri – Lale Kuruyemiş`}</title>
        <meta
          name="description"
          content={`Lale Kuruyemiş ${title} kategorisindeki ürünleri keşfedin.`}
        />
        <meta
          name="keywords"
          content={`lale kuruyemiş, ${getCategoryName(
            category
          )}, ${getSubcategoryName(
            category,
            subcategory
          )}, kuruyemiş, doğal ürünler`}
        />
        <meta
          property="og:image"
          content={`https://www.lalekuruyemis.com/category-banners/${currentCategory?.image}`}
        />
      </Head>

      <section className={styles.container}>
        {showBanner && (
          <div className={styles.bannerWrapper}>
            <Image
              src={bannerPath}
              alt={currentCategory.name}
              fill
              className={styles.bannerImage}
              priority
            />
          </div>
        )}

        {showDescription && (
          <p className={styles.description}>{currentCategory.description}</p>
        )}

        <div className={styles.content}>
          <div className={styles.filterSection}>
            <ProductsFilter />
          </div>

          <div className={styles.mainContentWrapper}>
            <div className={styles.topBar}>
              <div className={styles.totalCount}>
                Toplam {sortedProducts.length} ürün
              </div>
              <div className={styles.sortBox}>
                <label htmlFor="sort">Sıralama: </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) =>
                    router.push(
                      {
                        pathname: router.pathname,
                        query: { ...router.query, sort: e.target.value },
                      },
                      undefined,
                      { scroll: false }
                    )
                  }
                >
                  <option value="default">Varsayılan</option>
                  <option value="price_asc">Fiyata Göre Artan</option>
                  <option value="price_desc">Fiyata Göre Azalan</option>
                </select>
              </div>
            </div>

            <div className={styles.grid}>
              {sortedProducts.length === 0 ? (
                <p>Bu kategoriye ait ürün bulunamadı.</p>
              ) : (
                sortedProducts
                  .slice(0, visibleCount)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
              )}
            </div>

            {visibleCount < sortedProducts.length && (
              <div ref={loadMoreRef} className={styles.loadingMore}>
                <p>Yükleniyor...</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
