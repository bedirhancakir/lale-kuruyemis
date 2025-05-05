import Head from "next/head";
import HeroBannerSlider from "../components/home-page/HeroBannerSlider";
import BenefitsGrid from "../components/home-page/BenefitsGrid";
import RecommendedSlider from "../components/home-page/RecommendedSlider";
import SimpleProductGrid from "../components/home-page/SimpleProductGrid";

export default function HomePage({
  banners,
  recommended,
  featured,
  bestSeller,
  discounted,
}) {
  return (
    <>
      <Head>
        <title>Lale Kuruyemiş – Doğal ve Taze Kuruyemiş</title>
        <meta
          name="description"
          content="En taze kuruyemişler burada! Giresun fındığı, badem, ceviz ve daha fazlası Lale Kuruyemiş’te."
        />
      </Head>

      {banners.length > 0 && <HeroBannerSlider banners={banners} />}
      <BenefitsGrid />

      {recommended.length > 0 && (
        <RecommendedSlider products={recommended} />
      )}

      {featured.length > 0 && (
        <SimpleProductGrid title="⭐ Öne Çıkan Ürünler" products={featured} />
      )}

      {bestSeller.length > 0 && (
        <SimpleProductGrid title="🔥 En Çok Satanlar" products={bestSeller} />
      )}

      {discounted.length > 0 && (
        <SimpleProductGrid title="💸 İndirimli Ürünler" products={discounted} />
      )}
    </>
  );
}

export async function getStaticProps() {
  const [productsRes, bannersRes] = await Promise.all([
    fetch("http://localhost:3000/api/admin/admin-products"),
    fetch("http://localhost:3000/api/public/banners"),
  ]);

  const allProducts = await productsRes.json();
  const banners = await bannersRes.json();

  const recommended = allProducts.filter((p) => p.isRecommended).slice(0, 20);
  const featured = allProducts.filter((p) => p.isFeatured).slice(0, 20);
  const bestSeller = allProducts.filter((p) => p.isBestSeller).slice(0, 20);
  const discounted = allProducts.filter((p) => p.isDiscounted).slice(0, 20);

  return {
    props: {
      banners,
      recommended,
      featured,
      bestSeller,
      discounted,
    },
    revalidate: 60,
  };
}
