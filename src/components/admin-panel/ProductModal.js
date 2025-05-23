import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Image from "next/image";
import styles from "./ProductModal.module.css";
import slugify from "../../utils/slugify";

export default function ProductModal({
  closeModal,
  refreshProducts,
  selectedProduct,
  isEditing,
}) {
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const schema = Yup.object({
    name: Yup.string().required("Ürün adı zorunludur"),
    description: Yup.string().required("Açıklama zorunludur"),
    price: Yup.number()
      .typeError("Fiyat sayısal olmalıdır")
      .positive()
      .required("Fiyat zorunludur"),
    categoryId: Yup.string().required("Kategori seçiniz"),
    subcategoryId: Yup.string().required("Alt kategori seçiniz"),
    unitType: Yup.string().oneOf(["unit", "weight"]),
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      categoryId: "",
      subcategoryId: "",
      unitType: "unit",
    },
  });

  const categoryId = watch("categoryId");

  useEffect(() => {
    fetch("/api/public/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Kategori verisi alınamadı:", err));
  }, []);

  useEffect(() => {
    if (isEditing && selectedProduct) {
      reset({
        name: selectedProduct.name || "",
        description: selectedProduct.description || "",
        price: selectedProduct.price || "",
        categoryId: selectedProduct.category_id || "",
        subcategoryId: selectedProduct.subcategory_id || "",
        unitType: selectedProduct.unitType || "unit",
      });
      setPreviewImage(selectedProduct.image || "");
      setImageFile(null);
    }
  }, [isEditing, selectedProduct, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return alert("Sadece görsel dosyaları yüklenebilir");
    if (file.size > 5 * 1024 * 1024)
      return alert("Görsel boyutu en fazla 5MB olabilir");

    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const onSubmit = async (values) => {
    let finalImage = previewImage;

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("name", values.name);
      formData.append("type", "product-images");

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok || !data.url) throw new Error("Görsel yüklenemedi");
        finalImage = data.url;
      } catch (err) {
        console.error("Upload hatası:", err);
        return alert("Görsel yüklenemedi.");
      }
    }

    const selectedCat = categories.find((c) => c.id === values.categoryId);
    const selectedSub = selectedCat?.subcategories.find(
      (s) => s.id === values.subcategoryId
    );

    const productData = {
      name: values.name,
      slug: slugify(values.name),
      description: values.description,
      price: parseFloat(values.price),
      image: finalImage,
      category: values.categoryId,
      subcategory: values.subcategoryId,
      category_slug: selectedCat?.slug || "",
      subcategory_slug: selectedSub?.slug || "",
      status: "aktif",
      unitType: values.unitType,
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

      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || "Ürün kaydedilemedi.");

      refreshProducts();
      closeModal();
    } catch (error) {
      console.error("Ürün kayıt hatası:", error);
      alert("Ürün kaydedilemedi.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{isEditing ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <input
            placeholder="Ürün Adı"
            {...register("name")}
            className={errors.name ? styles.errorInput : ""}
          />
          {errors.name && (
            <div className={styles.errorText}>{errors.name.message}</div>
          )}

          <textarea
            placeholder="Ürün Açıklaması"
            {...register("description")}
            className={errors.description ? styles.errorInput : ""}
          />
          {errors.description && (
            <div className={styles.errorText}>{errors.description.message}</div>
          )}

          <input
            type="number"
            step="0.01"
            placeholder="Fiyat (₺)"
            {...register("price")}
            className={errors.price ? styles.errorInput : ""}
          />
          {errors.price && (
            <div className={styles.errorText}>{errors.price.message}</div>
          )}

          <select
            {...register("categoryId")}
            className={errors.categoryId ? styles.errorInput : ""}
          >
            <option value="">Kategori Seçin</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <div className={styles.errorText}>{errors.categoryId.message}</div>
          )}

          {categoryId && (
            <select
              {...register("subcategoryId")}
              className={errors.subcategoryId ? styles.errorInput : ""}
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
          {errors.subcategoryId && (
            <div className={styles.errorText}>
              {errors.subcategoryId.message}
            </div>
          )}

          <select {...register("unitType")}>
            <option value="unit">Adet Bazlı</option>
            <option value="weight">Gramaj Bazlı</option>
          </select>

          <input type="file" accept="image/*" onChange={handleFileChange} />

          {previewImage && (
            <div className={styles.imagePreview}>
              <Image
                src={previewImage}
                alt="Görsel önizleme"
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
