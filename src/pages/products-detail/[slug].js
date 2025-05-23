import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useCategories } from "../../context/CategoryContext";
import styles from "../../styles/ProductDetailPage.module.css";

import ProductImage from "../../components/products-detail/ProductImage";
import ProductInfoCard from "../../components/products-detail/ProductInfoCard";
import ProductTabs from "../../components/products-detail/ProductTabs";
import RelatedProductsSlider from "../../components/products-detail/RelatedProdutcsSlider";

/* ----------  SSG paths  ---------- */
export async function getStaticPaths() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/products`);
  const data = await res.json();

  const paths = data.map((p) => ({ params: { slug: p.slug } }));
  return { paths, fallback: "blocking" };
}

/* ----------  SSG props  ---------- */
export async function getStaticProps({ params }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  /* Ana ürün ---------------------------------------------------------------- */
  const productRes = await fetch(`${baseUrl}/api/products/${params.slug}`);
  if (!productRes.ok) return { notFound: true }; // → 404

  const product = await productRes.json();

  /* İlgili ürünler – slug üzerinden ---------------------------------------- */
  const relatedRes = await fetch(
    `${baseUrl}/api/products/related` +
      `?categorySlug=${product.category_slug}` +
      `&subcategorySlug=${product.subcategory_slug || ""}` +
      `&exclude=${product.id}`
  );

  let relatedProducts = [];
  if (relatedRes.ok) {
    const tmp = await relatedRes.json();
    relatedProducts = Array.isArray(tmp) ? tmp : [];
  }

  return {
    props: {
      product,
      relatedProducts: relatedProducts.slice(0, 20), // artık garanti Array
    },
    revalidate: 60,
  };
}

/* ----------  React bileşeni  ---------- */
export default function ProductDetailPage({ product, relatedProducts }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const router = useRouter();

  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const categories = useCategories();

  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const favorited = isFavorite(product.id);

  /* Kategori / alt-kategori isimlerini slug üzerinden buluyoruz */
  const currentCategory = categories.find(
    (c) => c.slug === product.category_slug
  );
  const currentSubcategory = currentCategory?.subcategories?.find(
    (s) => s.slug === product.subcategory_slug
  );

  const categoryName = currentCategory?.name || "";
  const subcategoryName = currentSubcategory?.name || "";

  /* … Aşağısı (meta etiketleri + JSX) sadece isim/slug alanları güncellendi … */

  return (
    <>
      <Head>
        <title>{`${product.name} – Lale Kuruyemiş`}</title>

        <meta name="description" content={product.description} />
        <meta
          name="keywords"
          content={`lale kuruyemiş, ${product.name}, ${categoryName}, ${subcategoryName}`}
        />

        <link
          rel="canonical"
          href={`${baseUrl}/products-detail/${product.slug}`}
        />

        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image} />
        <meta
          property="og:url"
          content={`${baseUrl}/products-detail/${product.slug}`}
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.name} />
        <meta name="twitter:description" content={product.description} />

        {/* LD-JSON */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.name,
              image: product.image,
              description: product.description,
              sku: product.slug,
              brand: { "@type": "Organization", name: "Lale Kuruyemiş" },
              offers: {
                "@type": "Offer",
                priceCurrency: "TRY",
                price: product.price,
                itemCondition: "https://schema.org/NewCondition",
                availability: "https://schema.org/InStock",
                url: `${baseUrl}/products-detail/${product.slug}`,
              },
            }),
          }}
        />
      </Head>

      <section className={styles.container}>
        <ProductImage product={product} />

        <ProductInfoCard
          product={product}
          categoryName={categoryName}
          subcategoryName={subcategoryName}
          categorySlug={currentCategory?.slug}
          subcategorySlug={currentSubcategory?.slug}
          router={router}
          handleAddToCart={(item) => {
            addToCart(item);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
          }}
          handleToggleFavorite={() => toggleFavorite(product)}
          added={added}
          favorited={favorited}
        />
      </section>

      <ProductTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        product={product}
      />

      <RelatedProductsSlider products={relatedProducts} />
    </>
  );
}
