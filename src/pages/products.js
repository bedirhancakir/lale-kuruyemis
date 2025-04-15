import Head from 'next/head'
import products from '../lib/products.json'
import styles from '../styles/ProductsPage.module.css'
import ProductCard from '../components/ProductCard'

export default function ProductsPage() {
  return (
    <>
      <Head>
        <title>Ürünler – Lale Kuruyemiş</title>
        <meta
          name="description"
          content="Kavrulmuş fındık, badem, yer fıstığı gibi doğal kuruyemişlerimizi keşfedin."
        />
      </Head>

      <section>
        <h1 className={styles.title}>Ürünlerimiz</h1>
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  )
}
