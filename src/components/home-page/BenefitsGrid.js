import Image from "next/image";
import styles from "./BenefitsGrid.module.css";

const benefits = [
  { src: "/benefits/free-shipping.jpg", alt: "Ücretsiz Kargo", text: "Ücretsiz Kargo" },
  { src: "/benefits/fresh.jpg", alt: "Her Zaman Taze", text: "Her Zaman Taze" },
  { src: "/benefits/secure.jpg", alt: "Güvenli Alışveriş", text: "Güvenli Alışveriş" },
  { src: "/benefits/fast.jpg", alt: "Hızlı Teslimat", text: "Hızlı Teslimat" },
];

export default function BenefitsGrid() {
  return (
    <section className={styles.grid}>
      {benefits.map((item, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.imageWrapper}>
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </div>
          <p className={styles.text}>{item.text}</p>
        </div>
      ))}
    </section>
  );
}
