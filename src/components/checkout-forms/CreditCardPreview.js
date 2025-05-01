// components/Checkout/CreditCardPreview.js
import styles from "../../styles/CheckoutPage.module.css";

export default function CreditCardPreview({ cardNumber, name, expiry }) {
  const formattedNumber = cardNumber
    ? cardNumber.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim()
    : "•••• •••• •••• ••••";

  return (
    <div className={styles.cardPreview}>
      <div className={styles.cardNumber}>{formattedNumber}</div>
      <div className={styles.cardName}>{name || "Kart Sahibi"}</div>
      <div className={styles.cardExpiry}>{expiry || "AA/YY"}</div>
    </div>
  );
}
