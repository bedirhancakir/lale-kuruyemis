import styles from "../../styles/CheckoutPage.module.css";
import Image from "next/image";
import { getCart, getCartCount } from "../../lib/cartUtils";
import { useEffect, useState } from "react";

export default function OrderSummary({
  step,
  onClick,
  submitted,
  isAgreementChecked,
  setIsAgreementChecked,
  showAgreementError,
  setShowAgreementError, // ✅ BUNU EKLE!
}) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems(getCart());
  }, [submitted]);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cargoFee = cartTotal >= 150 ? 0 : 25;
  const total = cartTotal + cargoFee;

  const thumbnails = cartItems.slice(0, 4);

  return (
    <div className={styles.orderSummary}>
      <h3 className={styles.summaryTitle}>Sipariş Özeti</h3>

      <div className={styles.thumbnailList}>
        {thumbnails.map((item, i) => (
          <div key={i} className={styles.imageWrapper}>
            <Image
              src={item.image}
              alt={item.name}
              layout="fill"
              objectFit="cover"
              className={styles.productThumb}
            />
          </div>
        ))}
        {cartItems.length > 4 && (
          <div className={styles.extraThumbnail}>+{cartItems.length - 4}</div>
        )}
      </div>

      <div className={styles.priceLine}>
        <span>Ara Toplam</span>
        <span>{cartTotal.toFixed(2)}₺</span>
      </div>

      <div className={styles.priceLine}>
        <span>Kargo</span>
        <span className={cargoFee === 0 ? styles.freeShipping : ""}>
          {cargoFee === 0 ? "Ücretsiz" : `${cargoFee}₺`}
        </span>
      </div>

      <hr className={styles.line} />

      <div className={styles.totalLine}>
        <strong>Toplam</strong>
        <strong>{total.toFixed(2)}₺</strong>
      </div>

      {step === 2 && (
        <div className={styles.agreement}>
          <label
            className={`${styles.checkboxWrapper} ${
              showAgreementError ? styles.agreementError : ""
            }`}
          >
            <input
              type="checkbox"
              checked={isAgreementChecked}
              onChange={(e) => {
                setIsAgreementChecked(e.target.checked);
                if (e.target.checked) setShowAgreementError(false); // 🔄 Otomatik kaldır
              }}
              className={showAgreementError ? styles.checkboxError : ""}
            />{" "}
            Ön Bilgilendirme Formunu ve Mesafeli Satış Sözleşmesi’ni okudum,
            onaylıyorum.
          </label>

          {showAgreementError && (
            <div className={styles.errorText}>
              Lütfen sözleşmeyi onaylayınız.
            </div>
          )}
        </div>
      )}

      <button onClick={onClick} className={styles.completeButton}>
        {step === 1
          ? "Ödeme Yöntemi"
          : step === 2
          ? "Siparişi Tamamla"
          : "Ana Sayfa"}
      </button>
    </div>
  );
}
