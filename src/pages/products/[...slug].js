// ✅ pages/products/[...slug].js (SEO, Performans, Etiket + Sıralama + Lazy Loading)

import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import ProductCard from "../../components/products-page/ProductCard";
import ProductsFilter from "../../components/products-page/ProductsFilter";
import styles from "../../styles/ProductsPage.module.css";
import categoriesData from "../../../data/categories.json";
import { useCategories } from "../../context/CategoryContext";
import { useRouter } from "next/router";

// ✅ SSG ile hem ürünleri hem kategorileri getir
export async function getStaticProps({ params }) {
  const [catRes, prodRes] = await Promise.all([
    fetch(
      `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/api/public/categories`
    ),
    fetch(
      `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/api/products`
    ),
  ]);

  const categories = await catRes.json();
  const allProducts = await prodRes.json();

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
      initialCategories: categories, // ✅ burada veriyoruz
    },
    revalidate: 60,
  };
}

// ✅ Tüm kategori ve alt kategorilere path üret
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
    paths.push({ params: { slug: [cat.id] } }); // "Tümü"
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

  // ✅ Kategori adlarını getiren yardımcı fonksiyonlar
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

  // ✅ Görsel yolu fixleniyor (hatalı path'e karşı)
  const bannerPath = currentCategory?.image?.startsWith("/")
    ? currentCategory.image
    : `/category-banners/${currentCategory.image}`;

  // ✅ Sıralama ve Etiket Query Parametreleri
  const sort = router.query.sort || "default";
  const tagFilters = (router.query.tags || "").split(",").filter(Boolean);

  // ✅ Etiket filtreleme (örn: isRecommended === true)
  const tagFilteredProducts = filteredProducts.filter((product) =>
    tagFilters.length === 0
      ? true
      : tagFilters.every((tag) => product[tag] === true)
  );

  // ✅ Sıralama uygulama
  const sortedProducts = [...tagFilteredProducts].sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    return 0;
  });

  // ✅ Lazy loading için state
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

  // ✅ SEO için breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: getCategoryName(category),
        item: `https://www.lalekuruyemis.com/products/${category}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: getSubcategoryName(category, subcategory),
        item: `https://www.lalekuruyemis.com/products/${category}/${subcategory}`,
      },
    ],
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, sort: newSort },
      },
      undefined,
      { scroll: false }
    );
  };

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
        <link
          rel="canonical"
          href={`https://www.lalekuruyemis.com/products/${category}/${subcategory}`}
        />
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbData)}
        </script>
      </Head>

      <section className={styles.container}>
        <h1 className={styles.title}>{title}</h1>

        {/* ✅ Banner */}
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

        {/* ✅ Açıklama */}
        {showDescription && (
          <p className={styles.description}>{currentCategory.description}</p>
        )}

        {/* ✅ Filtreleme ve Ürün Alanı */}
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
                <select id="sort" value={sort} onChange={handleSortChange}>
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
