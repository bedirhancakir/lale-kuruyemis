import { useFormContext } from "react-hook-form";
import styles from "../../styles/CheckoutPage.module.css";

export default function PaymentForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={styles.paymentFormWrapper}>
      <div className={styles.paymentFormLeft}>
        <h2 className={styles.stepTitle}>Ödeme Bilgileri</h2>

        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label>Kart Numarası</label>
            <input
              {...register("cardNumber")}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className={`${styles.checkoutInput} ${
                errors.cardNumber ? styles.errorInput : ""
              }`}
              onInput={(e) =>
                (e.target.value = e.target.value
                  .replace(/\D/g, "")
                  .replace(/(.{4})/g, "$1 ")
                  .trim())
              }
            />
            {errors.cardNumber && (
              <p className={styles.errorText}>{errors.cardNumber.message}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Kart Üzerindeki İsim</label>
            <input
              {...register("cardName")}
              placeholder="Ad Soyad"
              className={`${styles.checkoutInput} ${
                errors.cardName ? styles.errorInput : ""
              }`}
            />
            {errors.cardName && (
              <p className={styles.errorText}>{errors.cardName.message}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Son Kullanma (MM/YY)</label>
            <input
              {...register("expiry")}
              placeholder="MM/YY"
              maxLength={5}
              className={`${styles.checkoutInput} ${
                errors.expiry ? styles.errorInput : ""
              }`}
              onInput={(e) =>
                (e.target.value = e.target.value
                  .replace(/\D/g, "")
                  .replace(/(\d{2})(\d{1,2})/, "$1/$2")
                  .substring(0, 5))
              }
            />
            {errors.expiry && (
              <p className={styles.errorText}>{errors.expiry.message}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>CVV</label>
            <input
              {...register("cvv")}
              placeholder="XXX"
              maxLength={4}
              className={`${styles.checkoutInput} ${
                errors.cvv ? styles.errorInput : ""
              }`}
              onInput={(e) =>
                (e.target.value = e.target.value
                  .replace(/\D/g, "")
                  .substring(0, 4))
              }
            />
            {errors.cvv && (
              <p className={styles.errorText}>{errors.cvv.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
