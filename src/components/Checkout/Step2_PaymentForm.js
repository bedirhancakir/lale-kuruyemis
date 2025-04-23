// components/Checkout/Step2_PaymentForm.js
import styles from "../../styles/CheckoutPage.module.css";
import CreditCardPreview from "./CreditCardPreview";

export default function Step2_PaymentForm({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.paymentFormWrapper}>
      <div className={styles.paymentFormLeft}>
        <h2 className={styles.stepTitle}>2. Adım: Ödeme Bilgileri</h2>

        <div className={styles.formGroup}>
          <label htmlFor="cardNumber">Kart Numarası</label>
          <input
            type="text"
            name="cardNumber"
            placeholder="1234 5678 9012 3456"
            className={styles.checkoutInput}
            value={formData.cardNumber || ""}
            onChange={(e) => {
              let raw = e.target.value.replace(/\D/g, "").slice(0, 16); // Sadece 16 rakam
              let formatted = raw.replace(/(.{4})/g, "$1 ").trim(); // Her 4 rakamdan sonra boşluk
              setFormData((prev) => ({ ...prev, cardNumber: formatted }));
            }}
            maxLength={19}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="cardName">Kart üzerindeki Ad Soyad</label>
          <input
            type="text"
            name="cardName"
            placeholder="Ad Soyad"
            className={styles.checkoutInput}
            value={formData.cardName || ""}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="expiry">Son Kullanma Tarihi</label>
            <input
              type="text"
              name="expiry"
              placeholder="AA/YY"
              maxLength={5}
              className={styles.checkoutInput}
              value={formData.expiry || ""}
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, "").slice(0, 4); // Sadece rakam ve max 4 hane
                if (val.length >= 3) {
                  val = val.replace(/(\d{2})(\d{1,2})/, "$1/$2");
                }
                setFormData((prev) => ({ ...prev, expiry: val }));
              }}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cvv">CVV</label>
            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              className={styles.checkoutInput}
              value={formData.cvv || ""}
              maxLength={4}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 4); // sadece sayı
                setFormData((prev) => ({ ...prev, cvv: val }));
              }}
            />
          </div>
        </div>
      </div>

      <div className={styles.paymentFormRight}>
        <CreditCardPreview
          cardNumber={formData.cardNumber || ""}
          name={formData.cardName || ""}
          expiry={formData.expiry || ""}
        />
      </div>
    </div>
  );
}
