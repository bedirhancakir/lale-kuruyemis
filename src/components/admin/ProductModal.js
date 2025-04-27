import { useState, useEffect } from "react";
import styles from "./ProductModal.module.css";
import Image from "next/image";

export default function ProductModal({
  closeModal,
  refreshProducts,
  selectedProduct,
  isEditing,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (isEditing && selectedProduct) {
      setName(selectedProduct.name || "");
      setDescription(selectedProduct.description || "");
      setPrice(selectedProduct.price || "");
      setImage(selectedProduct.image || "");
    }
  }, [isEditing, selectedProduct]);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.url) {
      setImage(data.url);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const productData = {
      name,
      description,
      price,
      image,
    };

    try {
      if (isEditing) {
        await fetch(`/api/admin/products/${selectedProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
      } else {
        await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
      }

      refreshProducts();
      closeModal();
    } catch (error) {
      console.error("Ürün kaydedilemedi:", error);
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{isEditing ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Ürün Adı"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <textarea
            placeholder="Ürün Açıklaması"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>

          <input
            type="number"
            placeholder="Fiyat (₺)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <input type="file" accept="image/*" onChange={handleFileChange} />

          {image && (
            <div
              style={{
                marginTop: "1rem",
                position: "relative",
                width: "100%",
                height: "200px",
              }}
            >
              <Image
                src={image}
                alt="Yüklenen görsel"
                layout="fill"
                objectFit="contain"
              />
            </div>
          )}

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton}>
              Kaydet
            </button>
            <button
              type="button"
              onClick={closeModal}
              className={styles.cancelButton}
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
