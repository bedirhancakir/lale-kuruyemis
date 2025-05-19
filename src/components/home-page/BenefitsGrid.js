import Image from "next/image";
import styles from "./BenefitsGrid.module.css";

const benefits = [
  {
    src: "/benefits-images/placeholder.jpg",
    alt: "Ücretsiz Kargo",
    text: "Ücretsiz Kargo",
  },
  {
    src: "/benefits-images/placeholder.jpg",
    alt: "Her Zaman Taze",
    text: "Her Zaman Taze",
  },
  {
    src: "/benefits-images/placeholder.jpg",
    alt: "Güvenli Alışveriş",
    text: "Güvenli Alışveriş",
  },
  {
    src: "/benefits-images/placeholder.jpg",
    alt: "Hızlı Teslimat",
    text: "Hızlı Teslimat",
  },
];

export default function BenefitsGrid() {
  return (
    <section className={styles.grid} aria-label="Avantajlarımız">
      {benefits.map((item, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.imageWrapper}>
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className={styles.image}
              placeholder="blur"
              blurDataURL="/images/placeholder.jpg"
            />
          </div>
          <p className={styles.text}>{item.text}</p>
        </div>
      ))}
    </section>
  );
}
