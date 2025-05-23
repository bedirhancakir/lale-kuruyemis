import styles from "../../styles/CheckoutPage.module.css";

export default function StepIndicator({
  currentStep,
  onStepClick,
  allowStep2,
}) {
  return (
    <div className={styles.stepsContainer}>
      <div
        className={`${styles.step} ${currentStep === 1 ? styles.active : ""}`}
        onClick={() => onStepClick(1)}
      >
        <span className={styles.stepNumber}>1</span>Teslimat
      </div>
      <div
        className={`${styles.step} ${
          !allowStep2 ? styles.disabled : currentStep === 2 ? styles.active : ""
        }`}
        onClick={() => allowStep2 && onStepClick(2)}
      >
        <span className={styles.stepNumber}>2</span>Ödeme
      </div>
    </div>
  );
}
