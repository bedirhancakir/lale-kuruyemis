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
    <div className={styles.wrapper}>
      <h3>Benzer Diğer Ürünler</h3>
      <Slider {...sliderSettings}>
        {products.map((item) => (
          <div
            key={item.id}
            className={styles.card}
            onClick={() => router.push(`/products-detail/${item.slug}`)}
          >
            <Image
              src={item.image}
              alt={item.name}
              width={220}
              height={160}
              className={styles.image}
            />
            <p>{item.name}</p>
            <p className={styles.price}>{item.price}₺</p>
          </div>
        ))}
      </Slider>
    </div>
  );
}
