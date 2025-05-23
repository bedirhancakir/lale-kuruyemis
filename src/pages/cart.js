import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import styles from "../styles/CartPage.module.css";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";

const weightOptions = [
  { label: "250gr", value: 0.25 },
  { label: "500gr", value: 0.5 },
  { label: "1kg", value: 1 },
];

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    updateSelection,
    removeFromCart,
    clearCart,
  } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + (item.finalPrice || item.price) * item.quantity,
    0
  );

  const handleSelectChange = (item, e) => {
    const newVal = parseFloat(e.target.value);
    const newLabel = weightOptions.find((w) => w.value === newVal)?.label;
    const newPrice = parseFloat(item.price * newVal).toFixed(2);

    updateSelection(item.id, item.selectedAmount, newVal, newLabel, newPrice);
  };

  return (
    <>
      <Head>
        <title>Sepet – Lale Kuruyemiş</title>
        <meta
          name="description"
          content="Sepetinizdeki ürünleri görüntüleyin ve yönetin."
        />
        <link rel="canonical" href="https://www.lalekuruyemis.com/cart" />
      </Head>

      <section className={styles.cart}>
        <h1 className={styles.title}>Sepetim</h1>

        {cartItems.length === 0 ? (
          <p className={styles.empty}>Sepetiniz şu anda boş 😔</p>
        ) : (
          <>
            <ul className={styles.list}>
              {cartItems.map((item) => (
                <li
                  key={`${item.id}-${item.selectedAmount || 1}`}
                  className={styles.item}
                >
                  <Image
                    src={item.image}
                    alt={`${item.name} görseli`}
                    width={100}
                    height={80}
                    className={styles.image}
                    placeholder="blur"
                    blurDataURL="/images/placeholder.jpg"
                    loading="lazy"
                  />
                  <div className={styles.info}>
                    <h3>{item.name}</h3>

                    {item.unitType === "weight" && (
                      <select
                        className={styles.select}
                        value={item.selectedAmount}
                        onChange={(e) => handleSelectChange(item, e)}
                      >
                        {weightOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}

                    <p>
                      {parseFloat(item.finalPrice || item.price).toFixed(2)}₺ ×{" "}
                      {item.quantity}
                    </p>

                    <div className={styles.controls}>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.selectedAmount,
                            item.quantity - 1
                          )
                        }
                        aria-label="Adet azalt"
                      >
                        <AiOutlineMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.selectedAmount,
                            item.quantity + 1
                          )
                        }
                        aria-label="Adet artır"
                      >
                        <AiOutlinePlus />
                      </button>
                      <button
                        onClick={() =>
                          removeFromCart(item.id, item.selectedAmount)
                        }
                        className={styles.removeBtn}
                        aria-label="Sepetten çıkar"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <p className={styles.total}>
              Toplam: <strong>{total.toFixed(2)}₺</strong>
            </p>

            <div className={styles.actions}>
              <button onClick={clearCart} className={styles.clearButton}>
                Sepeti Temizle
              </button>
              <Link href="/checkout">
                <button className={styles.checkoutButton}>Sepeti Onayla</button>
              </Link>
            </div>
          </>
        )}
      </section>
    </>
  );
}
