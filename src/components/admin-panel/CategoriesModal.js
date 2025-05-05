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
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [image, setImage] = useState(category?.image || "");
  const [imageFile, setImageFile] = useState(null);
  const [newSubcategories, setNewSubcategories] = useState("");
  const [subcategories, setSubcategories] = useState(category?.subcategories || []);
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
    if (file) {
      setImageFile(file);
    }
  };

  const handleDeleteSubcategory = (subId) => {
    setSubcategories((prev) => prev.filter((sub) => sub.id !== subId));
    setDeletedSubcategories((prev) => [...prev, subId]);
  };

  const handleSave = async () => {
    const isEdit = mode === "edit";
    let finalImage = image;

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("name", name || "kategori");
      formData.append("type", "banner");

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok || !uploadData.url) {
        alert("Görsel yüklenemedi.");
        return;
      }

      finalImage = uploadData.url;
    }

    const postBody = {
      type: "category",
      name,
      description,
      image: finalImage,
    };

    if (isEdit) {
      postBody.forceUpdate = true;
      postBody.oldId = category.id;
      postBody.oldImage = category.image || "";
    }

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postBody),
    });

    if (!res.ok) {
      alert("Kategori kaydedilemedi.");
      return;
    }

    const updatedCategories = await res.json();
    const updatedId = isEdit
      ? category.id
      : updatedCategories.find((cat) => cat.name === name)?.id;

    if (!updatedId) {
      alert("Yeni kategori oluşturuldu ama ID alınamadı.");
      return;
    }

    // ✅ Yeni alt kategoriler
    if (newSubcategories.trim() !== "") {
      const parts = newSubcategories
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);

      for (let sub of parts) {
        await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "subcategory",
            categoryId: updatedId,
            name: sub,
          }),
        });
      }
    }

    // ✅ Silinen alt kategoriler
    for (let subId of deletedSubcategories) {
      await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "subcategory",
          categoryId: updatedId,
          id: subId,
        }),
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
                alt="Kategori görseli"
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
                    onClick={() => handleDeleteSubcategory(sub.id)}
                    className={styles.deleteBtn}
                    title="Alt kategoriyi sil"
                  >
                    <FiTrash2 />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className={styles.buttonGroup}>
            <button onClick={handleSave} className={styles.saveButton}>
              Kaydet
            </button>
            <button onClick={onClose} className={styles.cancelButton}>
              İptal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
