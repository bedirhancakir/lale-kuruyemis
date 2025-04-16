import styles from "../../styles/CheckoutPage.module.css";
import { AiOutlineCheckCircle } from "react-icons/ai";

export default function Step3_Success() {
  return (
    <div className={styles.successMessage}>
      <AiOutlineCheckCircle size={60} color="#28a745" />
      <h2>Siparişiniz Alındı!</h2>
      <p>Teşekkür ederiz. Siparişiniz başarıyla alınmıştır ve en kısa sürede kargoya verilecektir.</p>
    </div>
  );
}
