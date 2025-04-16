import styles from "../../styles/CheckoutPage.module.css";

export default function Step2_PaymentForm({ formData, setFormData }) {
  return (
    <div className={styles.paymentForm}>
      <h2 className={styles.stepTitle}>2. Adım: Ödeme Yöntemleri</h2>
      <p>Bu alan geliştirme aşamasında. Şimdilik boş :)</p>
    </div>
  );
}
