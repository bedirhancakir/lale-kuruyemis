import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import ProductCard from "../../components/products-page/ProductCard";
import ProductsFilter from "../../components/products-page/ProductsFilter";
import styles from "../../styles/ProductsPage.module.css";
import { useCategories } from "../../context/CategoryContext";

export async function getStaticPaths() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/public/categories`);
  const categories = await res.json();

  const paths = [];
  categories.forEach((cat) => {
    cat.subcategories.forEach((sub) => {
      paths.push({ params: { slug: [cat.slug, sub.slug] } });
    });
    paths.push({ params: { slug: [cat.slug] } }); // Tümü için
  });

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/products`);
  const allProducts = await res.json();

  const [categorySlug, subSlug] = params.slug;
  const isAll = !subSlug || subSlug === categorySlug;

  const filtered = isAll
    ? allProducts.filter(
        (p) => p.category_slug === categorySlug && p.status === "aktif"
      )
    : allProducts.filter(
        (p) =>
          p.category_slug === categorySlug &&
          p.subcategory_slug === subSlug &&
          p.status === "aktif"
      );

  return {
    props: {
      filteredProducts: filtered,
      categorySlug,
      subSlug: subSlug || categorySlug,
    },
    revalidate: 60, // 1 dakikada bir yeniden oluşturulur
  };
}

export default function FilteredProductsPage({
  filteredProducts,
  categorySlug,
  subSlug,
}) {
  const router = useRouter();
  const categories = useCategories();

  const isAll = categorySlug === subSlug;

  const currentCategory = categories.find((c) => c.slug === categorySlug);
  const currentSubcategory = currentCategory?.subcategories?.find(
    (s) => s.slug === subSlug
  );

  const title = isAll
    ? currentCategory?.name
    : currentSubcategory?.name || currentCategory?.name;

  const description =
    currentCategory?.description ||
    `${title} kategorisindeki taze ve doğal ürünleri keşfedin.`;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const canonicalUrl = `${siteUrl}/products/${categorySlug}/${subSlug}`;

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
      {/* ✅ SEO + OG + JSON-LD */}
      <Head>
        <title>{`${title} Ürünleri – Lale Kuruyemiş`}</title>
        <meta name="description" content={description.slice(0, 155)} />
        <meta name="keywords" content={`lale kuruyemiş, ${title}`} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`${title} Ürünleri`} />
        <meta property="og:description" content={description} />
        <meta
          property="og:image"
          content={`${siteUrl}/images/placeholder.jpg`}
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: `${title} Ürünleri – Lale Kuruyemiş`,
              description,
              url: canonicalUrl,
            }),
          }}
        />
      </Head>

      <section className={styles.container}>
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
