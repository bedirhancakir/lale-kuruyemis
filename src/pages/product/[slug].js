import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getStaticPaths, getStaticProps } from '../../lib/getProductData'
import { addToCart } from '../../lib/cartUtils'
import { toggleFavorite, isFavorite } from '../../lib/favoritesUtils'
import { AiOutlinePlus, AiFillHeart, AiOutlineHeart, AiOutlineCheck } from 'react-icons/ai'
import styles from '../../styles/ProductDetailPage.module.css'

export { getStaticPaths, getStaticProps }

export default function ProductDetailPage({ product }) {
  const [added, setAdded] = useState(false)
  const [favorited, setFavorited] = useState(false)

  useEffect(() => {
    if (!product) return
    setFavorited(isFavorite(product.id))
  }, [product])

  const handleAddToCart = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleToggleFavorite = () => {
    toggleFavorite(product)
    setFavorited(!favorited)
  }

  if (!product) return null

  return (
    <>
      <Head>
        <title>{product.name} – Lale Kuruyemiş</title>
        <meta name="description" content={product.description} />
      </Head>

      <section className={styles.container}>
        <div className={styles.imageWrapper}>
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={400}
            className={styles.image}
          />
        </div>

        <div className={styles.infoCard}>
          <h1>{product.name}</h1>
          <p className={styles.description}>{product.description}</p>
          <p className={styles.price}>{product.price}₺</p>

          <div className={styles.actions}>
            <button onClick={handleAddToCart} className={styles.cartButton}>
              {added ? (
                <>
                  Sepete Eklendi <AiOutlineCheck className={styles.checkIcon} />
                </>
              ) : (
                <>
                  Sepete Ekle <AiOutlinePlus className={styles.addIcon} />
                </>
              )}
            </button>

            <button
              onClick={handleToggleFavorite}
              className={styles.favButton}
              aria-label="Favorilere ekle"
            >
              {favorited ? (
                <AiFillHeart className={styles.filledHeart} />
              ) : (
                <AiOutlineHeart className={styles.heartIcon} />
              )}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
