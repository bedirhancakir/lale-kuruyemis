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

export async function getStaticPaths() {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/products`);
  const data = await res.json();
  const paths = data.map((p) => ({ params: { slug: p.slug } }));
  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  const productRes = await fetch(`${baseUrl}/api/products/${params.slug}`);
  if (!productRes.ok) return { notFound: true };
  const product = await productRes.json();

  const relatedRes = await fetch(
    `${baseUrl}/api/products/related?category=${product.category}&subcategory=${product.subcategory}&exclude=${product.id}`
  );
  const relatedProducts = await relatedRes.json();

  return {
    props: {
      product,
      relatedProducts: relatedProducts.slice(0, 20),
    },
    revalidate: 60,
  };
}

export default function ProductDetailPage({ product, relatedProducts }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const categories = useCategories();

  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  const favorited = isFavorite(product.id);

  const categoryName =
    categories.find((cat) => cat.id === product.category)?.name || "";
  const subcategoryName =
    categories
      .find((cat) => cat.id === product.category)
      ?.subcategories.find((sub) => sub.id === product.subcategory)?.name || "";

  const handleAddToCart = (item) => {
    addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product);
  };

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
          href={`https://www.lalekuruyemis.com/products-detail/${product.slug}`}
        />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta
          property="og:image"
          content={`https://www.lalekuruyemis.com${product.image}`}
        />
        <meta
          property="og:url"
          content={`https://www.lalekuruyemis.com/products-detail/${product.slug}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.name} />
        <meta name="twitter:description" content={product.description} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: `https://www.lalekuruyemis.com${product.image}`,
            description: product.description,
            sku: product.slug,
            brand: { "@type": "Organization", name: "Lale Kuruyemiş" },
            offers: {
              "@type": "Offer",
              priceCurrency: "TRY",
              price: product.price,
              itemCondition: "https://schema.org/NewCondition",
              availability: "https://schema.org/InStock",
              url: `https://www.lalekuruyemis.com/products-detail/${product.slug}`,
            },
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: categoryName,
                item: `https://www.lalekuruyemis.com/products/${product.category}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: subcategoryName,
                item: `https://www.lalekuruyemis.com/products/${product.category}/${product.subcategory}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: product.name,
                item: `https://www.lalekuruyemis.com/products-detail/${product.slug}`,
              },
            ],
          })}
        </script>
      </Head>

      <section className={styles.container}>
        <ProductImage product={product} />
        <ProductInfoCard
          product={product}
          categoryName={categoryName}
          subcategoryName={subcategoryName}
          router={router}
          handleAddToCart={handleAddToCart}
          handleToggleFavorite={handleToggleFavorite}
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
