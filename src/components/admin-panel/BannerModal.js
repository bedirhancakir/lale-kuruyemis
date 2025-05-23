import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Image from "next/image";
import styles from "./BannerModal.module.css";

export default function BannerModal({ onClose = () => {}, onSave = () => {} }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const schema = Yup.object({
    title: Yup.string().max(100, "En fazla 100 karakter olabilir"),
    link: Yup.string()
      .url("Geçerli bir URL girin")
      .nullable()
      .notRequired()
      .transform((value) => (value === "" ? null : value)),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      link: "",
    },
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile || !selectedFile.type.startsWith("image/")) {
      alert("Lütfen geçerli bir görsel seçin.");
      return;
    }
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const onSubmit = async (data) => {
    if (!file) {
      alert("Lütfen bir görsel seçin.");
      return;
    }

    setLoading(true);

    try {
      // Görseli yükle
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "hero-banner");
      formData.append("name", data.title || "banner");

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.filename)
        throw new Error("Görsel yükleme başarısız");

      // Banner kaydı
      const saveRes = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: uploadData.filename,
          title: data.title,
          link: data.link,
        }),
      });

      if (!saveRes.ok) throw new Error("Banner verisi kaydedilemedi");

      reset(); // RHF temizle
      setFile(null);
      setPreviewUrl(null);
      onSave();
      onClose();
    } catch (err) {
      console.error("Banner hatası:", err);
      alert("Yükleme sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Yeni Banner Ekle</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />

          <input
            type="text"
            placeholder="Başlık (opsiyonel)"
            {...register("title")}
            className={errors.title ? styles.errorInput : ""}
          />
          {errors.title && (
            <div className={styles.errorText} role="alert">
              {errors.title.message}
            </div>
          )}

          <input
            type="text"
            placeholder="Link (örn: /products/lokum)"
            {...register("link")}
            className={errors.link ? styles.errorInput : ""}
          />
          {errors.link && (
            <div className={styles.errorText} role="alert">
              {errors.link.message}
            </div>
          )}

          {previewUrl && (
            <div className={styles.imagePreview}>
              <Image
                src={previewUrl}
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
