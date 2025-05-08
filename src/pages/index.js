import Head from "next/head";
import Image from "next/image";
import HeroBannerSlider from "../components/home-page/HeroBannerSlider";
import BenefitsGrid from "../components/home-page/BenefitsGrid";
import RecommendedSlider from "../components/home-page/RecommendedSlider";
import SimpleProductGrid from "../components/home-page/SimpleProductGrid";
import CategoryGrid from "../components/home-page/CategoryGrid";

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
        <title>Lale Kuruyemiş – Doğal ve Taze Kuruyemişler</title>
        <meta
          name="description"
          content="Lale Kuruyemiş'te taze fındık, badem, ceviz ve daha fazlası. Sağlıklı ve doğal atıştırmalıklar keşfedin."
        />
        <meta
          name="keywords"
          content="kuruyemiş, lale kuruyemiş, fındık, badem, ceviz, doğal atıştırmalık"
        />
        <link rel="canonical" href="https://www.lalekuruyemis.com/" />

        {/* ✅ Structured Data: WebSite */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Lale Kuruyemiş",
            url: "https://www.lalekuruyemis.com",
          })}
        </script>

        {/* ✅ Structured Data: WebPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Anasayfa",
            url: "https://www.lalekuruyemis.com",
            description:
              "Lale Kuruyemiş: Taze ve doğal kuruyemişler, fındık, badem, ceviz ve daha fazlası.",
          })}
        </script>
      </Head>

      {/* 1 - Hero Banner */}
      {banners.length > 0 && <HeroBannerSlider banners={banners} />}
      {/* 2 - Bilgilendirici kartlar */}
      <BenefitsGrid />
      {/* 3 - Önerilen ürünler */}
      {recommended.length > 0 && <RecommendedSlider products={recommended} />}
      {/* 4 - Kategori görsel grid */}
      <CategoryGrid />
      {/* 5 - Öne çıkan ürünler */}
      {featured.length > 0 && (
        <SimpleProductGrid title="⭐ Öne Çıkan Ürünler" products={featured} />
      )}
      {/* 6 - Tam sayfa banner */}
      <section style={{ margin: "2rem 0" }}>
        <Image
          src="/category-banners/placeholder.jpg"
          alt="Lale Kuruyemiş kategori"
          width={1920}
          height={300}
          style={{
            borderRadius: "12px",
            objectFit: "cover",
            width: "100%",
            height: "auto",
          }}
          priority
        />
      </section>
      {/* 7 - En çok satanlar */}
      {bestSeller.length > 0 && (
        <SimpleProductGrid title="🔥 En Çok Satanlar" products={bestSeller} />
      )}
      {/* 8 - İndirimli ürünler */}
      {discounted.length > 0 && (
        <SimpleProductGrid title="💸 İndirimli Ürünler" products={discounted} />
      )}
    </>
  );
}

export async function getStaticProps() {
  const [productsRes, bannersRes, categoriesRes] = await Promise.all([
    fetch("http://localhost:3000/api/admin/admin-products"),
    fetch("http://localhost:3000/api/public/banners"),
    fetch("http://localhost:3000/api/public/categories"),
  ]);

  const allProducts = await productsRes.json();
  const banners = await bannersRes.json();
  const initialCategories = await categoriesRes.json();

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
      initialCategories, // ✅ Header için kategori verisi
    },
    revalidate: 120, // daha az trafik için 2 dakikada bir güncelle
  };
}
