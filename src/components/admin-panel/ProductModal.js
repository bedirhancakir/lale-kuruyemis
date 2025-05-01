import { useState, useEffect } from "react";
import styles from "./ProductModal.module.css";
import Image from "next/image";

// ✅ Slugify fonksiyonu
function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

  // ✅ Kategori state'leri
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");

  useEffect(() => {
    // ✅ Artık API route üzerinden alıyoruz
    fetch("/api/public/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  useEffect(() => {
    if (isEditing && selectedProduct) {
      setName(selectedProduct.name || "");
      setDescription(selectedProduct.description || "");
      setPrice(selectedProduct.price || "");
      setImage(selectedProduct.image || "");
      setCategoryId(selectedProduct.category || "");
      setSubcategoryId(selectedProduct.subcategory || "");
    }
  }, [isEditing, selectedProduct]);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Yükleme hatası:", errorText);
        alert("Görsel yüklenemedi.");
        return;
      }

      const data = await res.json();
      if (data.url) {
        setImage(data.url);
      } else {
        alert("Görsel yüklenemedi.");
      }
    } catch (err) {
      console.error("Upload exception:", err);
      alert("Yükleme sırasında bir hata oluştu.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const productData = {
      name,
      slug: slugify(name),
      description,
      price,
      image,
      category: categoryId,
      subcategory: subcategoryId,
      status: "aktif",
    };

    try {
      const url = isEditing
        ? `/api/admin/admin-products/${selectedProduct.id}`
        : "/api/admin/admin-products";

      const method = isEditing ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

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

          {/* ✅ Kategori Seçimi */}
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setSubcategoryId("");
            }}
            required
          >
            <option value="">Kategori Seçin</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* ✅ Alt Kategori Seçimi */}
          {categoryId && (
            <select
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
              required
            >
              <option value="">Alt Kategori Seçin</option>
              {categories
                .find((cat) => cat.id === categoryId)
                ?.subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
            </select>
          )}

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
                fill
                sizes="500px"
                style={{ objectFit: "contain" }}
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
