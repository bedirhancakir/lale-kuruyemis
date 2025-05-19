import styles from "../../styles/CheckoutPage.module.css";

export default function CheckoutSteps({
  currentStep,
  onStepClick,
  allowStep2,
}) {
  return (
    <div className={styles.stepsContainer} aria-label="Checkout Adımları">
      <div
        className={`${styles.step} ${currentStep === 1 ? styles.active : ""}`}
        onClick={() => onStepClick(1)}
        role="button"
        tabIndex={0}
      >
        <span className={styles.stepNumber}>1.</span> Teslimat Bilgileri
      </div>

      <div
        className={`${styles.step} ${currentStep === 2 ? styles.active : ""} ${
          !allowStep2 ? styles.disabled : ""
        }`}
        onClick={() => allowStep2 && onStepClick(2)}
        role="button"
        tabIndex={allowStep2 ? 0 : -1}
        aria-disabled={!allowStep2}
      >
        <span className={styles.stepNumber}>2.</span> Ödeme İşlemleri
      </div>
    </div>
  );
}
