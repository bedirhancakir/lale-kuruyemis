import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Image from "next/image";
import { FiTrash2 } from "react-icons/fi";
import styles from "./CategoriesModal.module.css";

export default function CategoriesModal({
  mode = "edit",
  category = {},
  onClose = () => {},
  onSave = () => {},
}) {
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [newSubcategories, setNewSubcategories] = useState("");
  const [deletedSubcategories, setDeletedSubcategories] = useState([]);
  const fileInputRef = useRef(null);

  const isEdit = mode === "edit";

  const schema = Yup.object({
    name: Yup.string().required("Kategori adı zorunludur"),
    description: Yup.string().required("Açıklama zorunludur"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    reset({
      name: category?.name || "",
      description: category?.description || "",
    });
    setPreviewImage(category?.image || "");
    setSubcategories(category?.subcategories || []);
    setImageFile(null);
    setDeletedSubcategories([]);
  }, [category, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Sadece görsel dosyaları yükleyebilirsiniz.");
      return;
    }
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleDeleteSubcategory = (subId) => {
    setSubcategories((prev) => prev.filter((s) => s.id !== subId));
    setDeletedSubcategories((prev) => [...prev, subId]);
  };

  const onSubmit = async (values) => {
    let finalImage = previewImage;

    // Görseli yükle
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("name", values.name || "kategori");
      formData.append("type", "category-banner");

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.url) {
          throw new Error("Görsel yüklenemedi.");
        }
        finalImage = data.url;
      } catch (err) {
        alert("Görsel yüklenemedi.");
        return;
      }
    }

    // Kategori kaydı
    const body = {
      type: "category",
      name: values.name,
      description: values.description,
      image: finalImage,
    };

    if (isEdit) {
      body.forceUpdate = true;
      body.oldId = category.id;
      body.oldImage = category.image || "";
    }

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Kategori kaydedilemedi");

      const updated = await res.json();
      const categoryId = isEdit
        ? category.id
        : updated.find((c) => c.name === values.name)?.id;

      if (!categoryId) throw new Error("Kategori ID alınamadı.");

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
            body: JSON.stringify({
              type: "subcategory",
              categoryId,
              name: sub,
            }),
          });
        }
      }

      // Silinecek alt kategoriler
      for (let subId of deletedSubcategories) {
        await fetch("/api/admin/categories", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "subcategory",
            categoryId,
            id: subId,
          }),
        });
      }

      onSave();
      onClose();
    } catch (err) {
      console.error("Hata:", err);
      alert("Kategori işlemi başarısız.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{isEdit ? "Kategori Düzenle" : "Yeni Kategori Ekle"}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <input
            type="text"
            placeholder="Kategori Adı"
            {...register("name")}
            className={errors.name ? styles.errorInput : ""}
          />
          {errors.name && (
            <div className={styles.errorText} role="alert">
              {errors.name.message}
            </div>
          )}

          <textarea
            placeholder="Açıklama"
            {...register("description")}
            className={errors.description ? styles.errorInput : ""}
          />
          {errors.description && (
            <div className={styles.errorText} role="alert">
              {errors.description.message}
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />

          {previewImage && (
            <div className={styles.imagePreview}>
              <Image
                src={previewImage}
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

          {isEdit && (
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
            <button type="submit" className={styles.saveButton}>
              Kaydet
            </button>
            <button
              type="button"
              onClick={onClose}
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
