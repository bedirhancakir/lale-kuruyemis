import Image from "next/image";
import { useRouter } from "next/router";
import Slider from "react-slick";
import styles from "./RelatedProdutcsSlider.module.css";

export default function RelatedProductsSlider({ products = [] }) {
  const router = useRouter();

  if (!Array.isArray(products) || products.length === 0) return null;

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 980, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section
      className={styles.wrapper}
      aria-labelledby="related-products-title"
    >
      <h3 id="related-products-title" className={styles.sectionTitle}>
        Benzer Diğer Ürünler
      </h3>

      <Slider {...sliderSettings}>
        {products.map((item) => (
          <div
            key={item.id}
            className={styles.card}
            role="button"
            tabIndex={0}
            onClick={() => router.push(`/products-detail/${item.slug}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                router.push(`/products-detail/${item.slug}`);
              }
            }}
            aria-label={`${item.name} detay sayfasına git`}
          >
            <Image
              src={item.image}
              alt={`${item.name} ürün görseli`}
              width={220}
              height={160}
              className={styles.image}
              placeholder="blur"
              blurDataURL="/images/placeholder.jpg"
            />
            <p className={styles.name}>{item.name}</p>
            <p className={styles.price}>{item.price}₺</p>
          </div>
        ))}
      </Slider>
    </section>
  );
}
