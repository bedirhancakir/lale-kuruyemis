import Image from "next/image";
import styles from "./HeroBannerSlider.module.css";
import Slider from "react-slick";
import { useRouter } from "next/router";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <button className={styles.arrow + " " + styles.prev} onClick={onClick}>
      <IoChevronBack />
    </button>
  );
}

function NextArrow(props) {
  const { onClick } = props;
  return (
    <button className={styles.arrow + " " + styles.next} onClick={onClick}>
      <IoChevronForward />
    </button>
  );
}

export default function HeroBannerSlider({ banners }) {
  const router = useRouter();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <section className={styles.sliderWrapper}>
      <Slider {...settings}>
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={styles.slide}
            onClick={() => banner.link && router.push(banner.link)}
          >
            <Image
              src={`/hero-banners/${banner.filename}`}
              alt={banner.title || "Banner"}
              width={1920}
              height={600}
              className={styles.image}
              priority
            />
          </div>
        ))}
      </Slider>
    </section>
  );
}
