// components/Checkout/Step3_Success.js
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import styles from "../../styles/CheckoutPage.module.css";

export default function Step3_Success({ orderId }) {
  return (
    <div className={styles.successContainer}>
      <div className={styles.successIcon}>
        <FaCheckCircle size={80} color="#4BB543" />
      </div>

      <h2 className={styles.successTitle}>Teşekkürler!</h2>
      <p className={styles.successMessage}>
        Siparişiniz başarıyla alınmıştır.
      </p>

      {orderId && (
        <p className={styles.orderId}>
          Sipariş Numaranız: <strong>{orderId}</strong>
        </p>
      )}

      <Link href="/">
        <button className={styles.successButton}>Alışverişe Devam Et</button>
      </Link>
    </div>
  );
}
