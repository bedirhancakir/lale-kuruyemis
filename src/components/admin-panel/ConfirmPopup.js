import styles from "./ConfirmPopup.module.css";

export default function confirmPopup({ title, message, onConfirm, onCancel }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h3>{title || "Onay"}</h3>
        <p>{message || "Bu işlemi onaylıyor musunuz?"}</p>
        <div className={styles.buttonGroup}>
          <button className={styles.confirmButton} onClick={onConfirm}>
            Evet
          </button>
          <button className={styles.cancelButton} onClick={onCancel}>
            Hayır
          </button>
        </div>
      </div>
    </div>
  );
}