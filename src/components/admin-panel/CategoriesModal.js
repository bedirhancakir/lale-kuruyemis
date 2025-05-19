import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import styles from "./CategoriesModal.module.css";
import { FiTrash2 } from "react-icons/fi";

export default function CategoriesModal({
  mode = "edit",
  category = {},
  onClose = () => {},
  onSave = () => {},
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [newSubcategories, setNewSubcategories] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [deletedSubcategories, setDeletedSubcategories] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setName(category?.name || "");
    setDescription(category?.description || "");
    setImage(category?.image || "");
    setSubcategories(category?.subcategories || []);
    setImageFile(null);
    setDeletedSubcategories([]);
  }, [category]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      alert("Sadece görsel dosyası yüklenebilir.");
    }
  };

  const handleDeleteSubcategory = (subId) => {
    setSubcategories((prev) => prev.filter((s) => s.id !== subId));
    setDeletedSubcategories((prev) => [...prev, subId]);
  };

  const handleSave = async () => {
    const isEdit = mode === "edit";
    let finalImage = image;

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("name", name || "kategori");
      formData.append("type", "category-banner");

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
    }

    const body = {
      type: "category",
      name,
      description,
      image: finalImage,
    };

    if (isEdit) {
      body.forceUpdate = true;
      body.oldId = category.id;
      body.oldImage = category.image || "";
    }

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      alert("Kategori kaydedilemedi.");
      return;
    }

    const updated = await res.json();
    const categoryId = isEdit
      ? category.id
      : updated.find((c) => c.name === name)?.id;

    if (!categoryId) return alert("Kategori ID alınamadı.");

    // Yeni alt kategoriler
    if (newSubcategories.trim()) {
      const parts = newSubcategories
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      for (let sub of parts) {
        await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "subcategory", categoryId, name: sub }),
        });
      }
    }

    // Silinen alt kategoriler
    for (let subId of deletedSubcategories) {
      await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "subcategory", categoryId, id: subId }),
      });
    }

    onSave();
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{mode === "edit" ? "Kategori Düzenle" : "Yeni Kategori Ekle"}</h2>
        <div className={styles.form}>
          <input
            type="text"
            placeholder="Kategori Adı"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Açıklama"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          {(imageFile || image) && (
            <div className={styles.imagePreview}>
              <Image
                src={imageFile ? URL.createObjectURL(imageFile) : image}
                alt="Kategori Görseli"
                width={400}
                height={200}
                style={{ objectFit: "contain" }}
              />
            </div>
          )}
          <input
            type="text"
            placeholder="Yeni alt kategoriler (örn: Fıstık, Badem)"
            value={newSubcategories}
            onChange={(e) => setNewSubcategories(e.target.value)}
          />
          {mode === "edit" && (
            <ul className={styles.subList}>
              {subcategories.map((sub) => (
                <li key={sub.id} className={styles.subListItem}>
                  {sub.name}
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteSubcategory(sub.id)}
                    title="Alt kategoriyi sil"
                  >
                    <FiTrash2 />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className={styles.buttonGroup}>
            <button className={styles.saveButton} onClick={handleSave}>
              Kaydet
            </button>
            <button className={styles.cancelButton} onClick={onClose}>
              İptal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
