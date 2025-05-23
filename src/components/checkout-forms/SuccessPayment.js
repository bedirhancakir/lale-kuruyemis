import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import styles from "../../styles/CheckoutPage.module.css";

export default function SuccessPayment({ orderId }) {
  return (
    <div className={styles.successContainer} role="alert" aria-live="polite">
      <div className={styles.successIcon}>
        <FaCheckCircle size={80} color="#4BB543" aria-hidden="true" />
      </div>

      <h2 className={styles.successTitle}>Teşekkürler!</h2>
      <p className={styles.successMessage}>Siparişiniz başarıyla alınmıştır.</p>

      {orderId && (
        <p className={styles.orderId}>
          Sipariş Numaranız: <strong>{orderId}</strong>
        </p>
      )}

      <Link href="/" passHref>
        <button className={styles.successButton}>Alışverişe Devam Et</button>
      </Link>
    </div>
  );
}
