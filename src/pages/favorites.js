import Head from 'next/head'
import { useEffect, useState } from 'react'
import { getFavorites } from '../lib/favoritesUtils'
import ProductCard from '../components/ProductCard'
import styles from '../styles/FavoritesPage.module.css'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    setFavorites(getFavorites())

    const syncInterval = setInterval(() => {
      setFavorites(getFavorites())
    }, 500)

    return () => clearInterval(syncInterval)
  }, [])

  return (
    <>
      <Head>
        <title>Favoriler – Lale Kuruyemiş</title>
        <meta name="description" content="Favorilerinizi görüntüleyin ve tek tıkla ulaşın." />
      </Head>

      <section className={styles.favorites}>
        <h1 className={styles.title}>Favorilerim</h1>

        {favorites.length === 0 ? (
          <p className={styles.empty}>Henüz favori ürün eklemediniz 😢</p>
        ) : (
          <div className={styles.grid}>
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
