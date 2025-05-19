import styles from "../../styles/CheckoutPage.module.css";
import Image from "next/image";
import { useCart } from "../../context/CartContext";

export default function OrderSummary({
  step,
  onClick,
  submitted,
  isAgreementChecked,
  setIsAgreementChecked,
  showAgreementError,
  setShowAgreementError,
}) {
  const { cartItems } = useCart();

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.finalPrice || item.price) * item.quantity,
    0
  );
  const cargoFee = cartTotal >= 150 ? 0 : 25;
  const total = cartTotal + cargoFee;
  const thumbnails = cartItems.slice(0, 4);

  return (
    <aside className={styles.orderSummary}>
      <h2 className={styles.summaryTitle}>Sipariş Özeti</h2>

      <div className={styles.thumbnailList} aria-hidden="true">
        {thumbnails.map((item, i) => (
          <div key={i} className={styles.imageWrapper}>
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="50px"
              style={{ objectFit: "cover" }}
              className={styles.productThumb}
              loading="lazy"
            />
          </div>
        ))}
        {cartItems.length > 4 && (
          <div className={styles.extraThumbnail}>+{cartItems.length - 4}</div>
        )}
      </div>

      {/* ✅ Ürün listesi: SEO & erişilebilir yapı */}
      <ul className={styles.itemList}>
        {cartItems.map((item) => (
          <li
            key={`${item.id}-${item.selectedAmount}`}
            className={styles.itemRow}
          >
            <span className={styles.itemName}>{item.name}</span>
            {item.displayAmount && (
              <span className={styles.itemDetail}>{item.displayAmount}</span>
            )}
            <span className={styles.itemDetail}>
              {(item.finalPrice || item.price).toFixed(2)}₺ × {item.quantity}
            </span>
          </li>
        ))}
      </ul>

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
        <section className={styles.agreement}>
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
                if (e.target.checked) setShowAgreementError(false);
              }}
              className={showAgreementError ? styles.checkboxError : ""}
            />
            <span>
              Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi’ni okudum,
              onaylıyorum.
            </span>
          </label>
          {showAgreementError && (
            <p className={styles.errorText}>Lütfen sözleşmeyi onaylayınız.</p>
          )}
        </section>
      )}

      <button
        onClick={onClick}
        className={styles.completeButton}
        aria-label={
          step === 1
            ? "Ödeme Yöntemi"
            : step === 2
            ? "Siparişi Tamamla"
            : "Ana Sayfa"
        }
      >
        {step === 1
          ? "Ödeme Yöntemi"
          : step === 2
          ? "Siparişi Tamamla"
          : "Ana Sayfa"}
      </button>
    </aside>
  );
}
