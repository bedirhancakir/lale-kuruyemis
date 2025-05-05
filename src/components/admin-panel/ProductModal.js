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
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");

  useEffect(() => {
    fetch("/api/public/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  useEffect(() => {
    if (isEditing && selectedProduct) {
      setName(selectedProduct.name || "");
      setDescription(selectedProduct.description || "");
      setPrice(selectedProduct.price?.toString() || "");
      setImage(selectedProduct.image || "");
      setCategoryId(selectedProduct.category || "");
      setSubcategoryId(selectedProduct.subcategory || "");
      setImageFile(null);
    }
  }, [isEditing, selectedProduct]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Sadece görsel dosyaları yükleyebilirsiniz.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Görsel boyutu en fazla 5MB olabilir.");
      return;
    }

    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalImage = image;

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("name", name);
      formData.append("type", "product-images");

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok || !data.url) {
          alert("Görsel yüklenemedi.");
          return;
        }

        finalImage = data.url;
      } catch (err) {
        console.error("Upload hatası:", err);
        alert("Görsel yüklenemedi.");
        return;
      }
    }

    const productData = {
      name,
      slug: slugify(name),
      description,
      price: parseFloat(price),
      image: finalImage,
      category: categoryId,
      subcategory: subcategoryId,
      status: "aktif",
    };

    try {
      const url = isEditing
        ? `/api/admin/admin-products/${selectedProduct.id}`
        : "/api/admin/admin-products";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        throw new Error("Kayıt başarısız.");
      }

      refreshProducts();
      closeModal();
    } catch (error) {
      console.error("Ürün kaydedilemedi:", error);
      alert("Ürün kaydedilemedi.");
    }
  };

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
          />

          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Fiyat (₺)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

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

          {/* Yeni seçilen görselin önizlemesi */}
          {imageFile && (
            <div className={styles.imagePreview}>
              <Image
                src={URL.createObjectURL(imageFile)}
                alt="Yeni seçilen görsel"
                width={400}
                height={200}
                style={{ objectFit: "contain" }}
              />
            </div>
          )}

          {/* Düzenleme modundaki mevcut görselin önizlemesi */}
          {!imageFile && image && (
            <div className={styles.imagePreview}>
              <Image
                src={image}
                alt="Mevcut görsel"
                width={400}
                height={200}
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
