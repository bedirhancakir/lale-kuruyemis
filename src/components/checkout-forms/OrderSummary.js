import { useCart } from "../../context/CartContext";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import styles from "../../styles/CheckoutPage.module.css";

export default function OrderSummary({ step }) {
  const { cartItems } = useCart();
  const { getValues } = useFormContext();
  const total = cartItems.reduce((s, i) => s + i.finalPrice * i.quantity, 0);
  const kdv = (total * 0.08).toFixed(2);
  const kargo = total >= 250 ? 0 : 19.9;
  const datestr = new Date(Date.now() + 2 * 864e5).toLocaleDateString("tr-TR");

  const addressInfo = {
    full_name: getValues("full_name"),
    phone: getValues("phone"),
    email: getValues("email"),
    city: getValues("city"),
    district: getValues("district"),
    address: getValues("address"),
    note: getValues("note"),
  };

  return (
    <div className={styles.orderSummary}>
      <h2 className={styles.summaryTitle}>Sipariş Özeti</h2>

      <div className={styles.thumbnailList}>
        {cartItems.slice(0, 5).map((i, idx) => (
          <div key={idx} className={styles.imageWrapper}>
            <Image
              src={i.image}
              alt={i.name}
              width={50}
              height={50}
              className={styles.productThumb}
            />
          </div>
        ))}
        {cartItems.length > 5 && (
          <div className={styles.extraThumbnail}>+{cartItems.length - 5}</div>
        )}
      </div>

      <div className={styles.itemList}>
        {cartItems.map((i, idx) => (
          <div key={idx} className={styles.itemRow}>
            <span className={styles.itemName}>{i.name}</span>
            <span className={styles.itemDetail}>
              {i.quantity}×{i.displayAmount} ={" "}
              {(i.finalPrice * i.quantity).toFixed(2)}₺
            </span>
          </div>
        ))}
      </div>

      <div className={styles.priceLine}>
        <span>KDV (8%)</span>
        <span>{kdv}₺</span>
      </div>
      <div className={styles.priceLine}>
        <span>Kargo</span>
        <span className={kargo === 0 ? styles.freeShipping : ""}>
          {kargo === 0 ? "Ücretsiz" : `${kargo}₺`}
        </span>
      </div>
      <div className={styles.totalLine}>
        <strong>Toplam</strong>
        <strong>{(total + kargo).toFixed(2)}₺</strong>
      </div>

      {step === 2 && (
        <>
          <hr className={styles.line} />
          <p>
            <strong>Teslimat Tarihi:</strong> {datestr}
          </p>
          <p>
            <strong>Ödeme Yöntemi:</strong> Kredi Kartı
          </p>

          <div className={styles.addressSummary}>
            <h3>Teslimat Adresi</h3>
            <p>
              <strong>Ad Soyad:</strong> {addressInfo.full_name}
            </p>
            <p>
              <strong>Telefon:</strong> {addressInfo.phone}
            </p>
            <p>
              <strong>E-posta:</strong> {addressInfo.email}
            </p>
            <p>
              <strong>Adres:</strong> {addressInfo.address},{" "}
              {addressInfo.district}, {addressInfo.city}
            </p>
            {addressInfo.note && (
              <p>
                <strong>Not:</strong> {addressInfo.note}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
