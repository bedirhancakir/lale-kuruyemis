import Head from 'next/head'
import styles from '../styles/AboutPage.module.css'

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>Hakkımızda – Lale Kuruyemiş</title>
        <meta name="description" content="Lale Kuruyemiş’in hikayesi, misyonu ve değerleri hakkında bilgi edinin." />
      </Head>

      <section className={styles.container}>
        <h1>Hakkımızda</h1>
        <p>Yıllardır doğallık ve tazelik ilkemizle Türkiye’nin dört bir yanına kuruyemiş ulaştırıyoruz.</p>
      </section>
    </>
  )
}
