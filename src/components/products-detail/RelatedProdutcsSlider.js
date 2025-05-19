import Image from "next/image";
import { useRouter } from "next/router";
import Slider from "react-slick";
import styles from "./RelatedProdutcsSlider.module.css";

export default function RelatedProductsSlider({ products = [] }) {
  const router = useRouter();

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

  if (!products.length) return null;

  return (
    <section className={styles.wrapper} aria-label="Benzer Ürünler">
      <h3>Benzer Diğer Ürünler</h3>
      <Slider {...sliderSettings}>
        {products.map((item) => (
          <div
            key={item.id}
            className={styles.card}
            onClick={() => router.push(`/products-detail/${item.slug}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === "Enter" && router.push(`/products-detail/${item.slug}`)
            }
            aria-label={`${item.name} detay sayfasına git`}
          >
            <Image
              src={item.image}
              alt={`${item.name} görseli`}
              width={220}
              height={160}
              className={styles.image}
              placeholder="blur"
              blurDataURL="/images/placeholder.jpg"
            />
            <p>{item.name}</p>
            <p className={styles.price}>{item.price}₺</p>
          </div>
        ))}
      </Slider>
    </section>
  );
}
