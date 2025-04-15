import Head from 'next/head'
import { useState, useEffect } from 'react'
import { getCart, clearCart } from '../lib/cartUtils'
import styles from '../styles/CheckoutPage.module.css'

export default function CheckoutPage() {
  const [cart, setCart] = useState([])
  const [orderPlaced, setOrderPlaced] = useState(false)

  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: ''
  })

  useEffect(() => {
    setCart(getCart())
  }, [])

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name || !form.address || !form.phone) {
      alert('Lütfen tüm bilgileri doldurun.')
      return
    }

    // Sipariş işlemleri (şimdilik sadece log ve temizleme)
    console.log('Sipariş Verildi:', form, cart)

    clearCart()
    setCart([])
    setOrderPlaced(true)
  }

  return (
    <>
      <Head>
        <title>Sipariş – Lale Kuruyemiş</title>
      </Head>

      <section className={styles.checkout}>
        <h1 className={styles.checkoutTitle}>Sipariş Ver</h1>

        {orderPlaced ? (
          <p className={styles.success}>✅ Siparişiniz başarıyla alındı! Teşekkür ederiz 💚</p>
        ) : (
          <>
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="text"
                name="name"
                placeholder="Ad Soyad"
                value={form.name}
                onChange={handleChange}
              />
              <input
                type="text"
                name="address"
                placeholder="Adres"
                value={form.address}
                onChange={handleChange}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Telefon"
                value={form.phone}
                onChange={handleChange}
              />
              <button type="submit">Siparişi Ver</button>
            </form>

            <div className={styles.summary}>
              <h2>Sepet Özeti</h2>
              {cart.length === 0 ? (
                <p>Sepetiniz boş.</p>
              ) : (
                <ul>
                  {cart.map((item) => (
                    <li key={item.id}>
                      {item.name} × {item.quantity} — {item.price}₺
                    </li>
                  ))}
                </ul>
              )}

              <p className={styles.total}>
                Toplam: <strong>{total}₺</strong>
              </p>
            </div>
          </>
        )}
      </section>
    </>
  )
}
