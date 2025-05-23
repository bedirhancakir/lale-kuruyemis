import Image from "next/image";
import styles from "./HeroBannerSlider.module.css";
import Slider from "react-slick";
import { useRouter } from "next/router";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL;

function PrevArrow({ onClick }) {
  return (
    <button
      className={`${styles.arrow} ${styles.prev}`}
      onClick={onClick}
      aria-label="Önceki banner"
    >
      <IoChevronBack />
    </button>
  );
}

function NextArrow({ onClick }) {
  return (
    <button
      className={`${styles.arrow} ${styles.next}`}
      onClick={onClick}
      aria-label="Sonraki banner"
    >
      <IoChevronForward />
    </button>
  );
}

export default function HeroBannerSlider({ banners = [] }) {
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
    <section className={styles.sliderWrapper} aria-label="Tanıtım Bannerları">
      <Slider {...settings}>
        {banners.map((banner) => {
          const imageUrl = `${SUPABASE_URL}/hero-banners/${banner.filename}`;

          return (
            <div
              key={banner.id}
              className={styles.slide}
              onClick={() => banner.link && router.push(banner.link)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && banner.link && router.push(banner.link)
              }
            >
              <Image
                src={imageUrl}
                alt={banner.title || "Lale Kuruyemiş Banner"}
                fill
                sizes="100vw"
                className={styles.image}
                priority
              />
            </div>
          );
        })}
      </Slider>
    </section>
  );
}
