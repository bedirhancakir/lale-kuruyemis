import Head from 'next/head'
import styles from '../styles/ContactPage.module.css'

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>İletişim – Lale Kuruyemiş</title>
        <meta name="description" content="Bizimle iletişime geçin. Telefon, e-posta ve iletişim formu bilgileri burada." />
      </Head>

      <section className={styles.contact}>
        <h1>İletişim</h1>
        <ul>
          <li>📞 0 (312) 123 45 67</li>
          <li>📧 info@lalekuruyemis.com</li>
        </ul>
      </section>
    </>
  )
}
