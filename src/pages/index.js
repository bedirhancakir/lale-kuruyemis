import Head from "next/head";
import Image from "next/image";
import styles from "../styles/HomePage.module.css";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Lale Kuruyemiş – Doğal ve Taze Kuruyemiş</title>
        <meta
          name="description"
          content="En taze kuruyemişler burada! Giresun fındığı, badem, ceviz ve daha fazlası Lale Kuruyemiş’te."
        />
      </Head>

      <section className={styles.hero}>
        <h1>Hoş Geldiniz!</h1>
        <p>En taze kuruyemişleri doğrudan üreticisinden alın.</p>
        <Image
          src="/images/placeholder.jpg"
          alt="Kuruyemiş görseli"
          width={600}
          height={300}
          style={{ borderRadius: "8px", objectFit: "cover" }}
          priority
        />
      </section>
    </>
  );
}
