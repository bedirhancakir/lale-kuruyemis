import { useState } from "react";
import styles from "./BannerModal.module.css";
import Image from "next/image";

export default function BannerModal({ onClose = () => {}, onSave = () => {} }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Lütfen bir görsel seçin.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "hero-banner");
    formData.append("name", title || "banner");
    formData.append("title", title);
    formData.append("link", link);

    setLoading(true);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (!res.ok) {
      alert("Yükleme başarısız.");
    } else {
      setFile(null);
      setTitle("");
      setLink("");
      onSave();
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Yeni Banner Ekle</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
          <input
            type="text"
            placeholder="Başlık (opsiyonel)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Link (örn: /products/lokum)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />

          {file && (
            <div className={styles.imagePreview}>
              <Image
                src={URL.createObjectURL(file)}
                alt="Banner önizlemesi"
                width={400}
                height={200}
              />
            </div>
          )}

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={loading}
            >
              {loading ? "Yükleniyor..." : "Kaydet"}
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Vazgeç
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
