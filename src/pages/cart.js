import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  getCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart
} from '../lib/cartUtils'
import styles from '../styles/CartPage.module.css'

import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'
import { RiDeleteBin6Line } from 'react-icons/ri'

export default function CartPage() {
  const [cart, setCart] = useState([])

  useEffect(() => {
    setCart(getCart())
  }, [])

  const handleIncrease = (id) => {
    increaseQuantity(id)
    setCart(getCart())
  }

  const handleDecrease = (id) => {
    decreaseQuantity(id)
    setCart(getCart())
  }

  const handleRemove = (id) => {
    removeFromCart(id)
    setCart(getCart())
  }

  const handleClear = () => {
    clearCart()
    setCart([])
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <>
      <Head>
        <title>Sepet – Lale Kuruyemiş</title>
        <meta name="description" content="Sepetinizdeki ürünleri görüntüleyin ve yönetin." />
      </Head>

      <section className={styles.cart}>
        <h1 className={styles.title}>Sepetim</h1>

        {cart.length === 0 ? (
          <p className={styles.empty}>Sepetiniz şu anda boş 😔</p>
        ) : (
          <>
            <ul className={styles.list}>
              {cart.map((item) => (
                <li key={item.id} className={styles.item}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={100}
                    height={80}
                    className={styles.image}
                  />
                  <div className={styles.info}>
                    <h3>{item.name}</h3>
                    <p>{item.price}₺ × {item.quantity}</p>

                    <div className={styles.controls}>
                      <button onClick={() => handleDecrease(item.id)}>
                        <AiOutlineMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleIncrease(item.id)}>
                        <AiOutlinePlus />
                      </button>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className={styles.removeBtn}
                        title="Sepetten çıkar"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <p className={styles.total}>Toplam: <strong>{total}₺</strong></p>

            <div className={styles.actions}>
              <button onClick={handleClear} className={styles.clearButton}>Sepeti Temizle</button>
              <Link href="/checkout">
                <button className={styles.checkoutButton}>Sepeti Onayla</button>
              </Link>
            </div>
          </>
        )}
      </section>
    </>
  )
}
