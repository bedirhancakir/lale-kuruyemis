import Slider from "react-slick";
import ProductCard from "../products-page/ProductCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./RecommendedSlider.module.css";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

function NextArrow({ onClick }) {
  return (
    <div
      className={`${styles.arrow} ${styles.next}`}
      onClick={onClick}
      aria-label="Sonraki ürünler"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <AiOutlineRight size={24} />
    </div>
  );
}

function PrevArrow({ onClick }) {
  return (
    <div
      className={`${styles.arrow} ${styles.prev}`}
      onClick={onClick}
      aria-label="Önceki ürünler"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <AiOutlineLeft size={24} />
    </div>
  );
}

export default function RecommendedSlider({ products = [] }) {
  if (!Array.isArray(products) || products.length === 0) return null;

  const showCount = Math.min(products.length, 4);

  const settings = {
    dots: true,
    arrows: true,
    infinite: products.length > showCount,
    speed: 500,
    slidesToShow: showCount,
    slidesToScroll: showCount,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(products.length, 3),
          slidesToScroll: Math.min(products.length, 3),
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(products.length, 2),
          slidesToScroll: Math.min(products.length, 2),
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className={styles.sliderSection} aria-label="Önerilen Ürünler">
      <h2>🎯 Önerilen Ürünler</h2>
      <Slider {...settings}>
        {products.map((p) => (
          <div key={p.id}>
            <ProductCard product={p} isSlider />
          </div>
        ))}
      </Slider>
    </section>
  );
}
