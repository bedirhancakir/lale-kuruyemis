// Step2_PaymentForm.js
import styles from "../../styles/CheckoutPage.module.css";
import CreditCardPreview from "./CreditCardPreview";

export default function PaymentForm({
  formData,
  setFormData,
  errors,
  setErrors,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const formatCardNumber = (val) => {
    let raw = val.replace(/\D/g, "").slice(0, 16);
    return raw.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val) => {
    let clean = val.replace(/\D/g, "").slice(0, 4);
    if (clean.length >= 3) {
      return clean.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    }
    return clean;
  };

  return (
    <div className={styles.paymentFormWrapper}>
      <div className={styles.paymentFormLeft}>
        <h2 className={styles.stepTitle}>2. Adım: Ödeme Bilgileri</h2>

        <div className={styles.formGroup}>
          <label
            htmlFor="cardNumber"
            className={errors.cardNumber ? styles.errorLabel : ""}
          >
            Kart Numarası
          </label>
          <input
            type="text"
            name="cardNumber"
            placeholder="1234 5678 9012 3456"
            className={`${styles.checkoutInput} ${
              errors.cardNumber ? styles.errorInput : ""
            }`}
            value={formData.cardNumber || ""}
            onChange={(e) => {
              const formatted = formatCardNumber(e.target.value);
              setFormData((prev) => ({ ...prev, cardNumber: formatted }));
              if (errors.cardNumber) {
                setErrors((prev) => ({ ...prev, cardNumber: "" }));
              }
            }}
            maxLength={19}
          />
          {errors.cardNumber && (
            <div className={styles.errorText}>{errors.cardNumber}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label
            htmlFor="cardName"
            className={errors.cardName ? styles.errorLabel : ""}
          >
            Kart Sahibi
          </label>
          <input
            type="text"
            name="cardName"
            placeholder="Ad Soyad"
            className={`${styles.checkoutInput} ${
              errors.cardName ? styles.errorInput : ""
            }`}
            value={formData.cardName || ""}
            onChange={handleChange}
          />
          {errors.cardName && (
            <div className={styles.errorText}>{errors.cardName}</div>
          )}
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label
              htmlFor="expiry"
              className={errors.expiry ? styles.errorLabel : ""}
            >
              Son Kullanma Tarihi
            </label>
            <input
              type="text"
              name="expiry"
              placeholder="AA/YY"
              maxLength={5}
              className={`${styles.checkoutInput} ${
                errors.expiry ? styles.errorInput : ""
              }`}
              value={formData.expiry || ""}
              onChange={(e) => {
                const formatted = formatExpiry(e.target.value);
                setFormData((prev) => ({ ...prev, expiry: formatted }));
                if (errors.expiry) {
                  setErrors((prev) => ({ ...prev, expiry: "" }));
                }
              }}
            />

            {errors.expiry && (
              <div className={styles.errorText}>{errors.expiry}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label
              htmlFor="cvv"
              className={errors.cvv ? styles.errorLabel : ""}
            >
              CVV
            </label>
            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              maxLength={4}
              className={`${styles.checkoutInput} ${
                errors.cvv ? styles.errorInput : ""
              }`}
              value={formData.cvv || ""}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                setFormData((prev) => ({ ...prev, cvv: val }));
                if (errors.cvv) {
                  setErrors((prev) => ({ ...prev, cvv: "" }));
                }
              }}
            />
            {errors.cvv && <div className={styles.errorText}>{errors.cvv}</div>}
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
