import { useState, useEffect, useCallback } from "react";
import ProductModal from "../../components/admin-panel/ProductModal";
import ConfirmPopup from "../../components/admin-panel/ConfirmPopup";
import Image from "next/image";
import styles from "../../styles/AdminProducts.module.css";
import { FaPlus, FaEdit, FaTrash, FaArchive, FaBoxOpen } from "react-icons/fa";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmPopup, setConfirmPopup] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/admin-products");
      if (!res.ok) throw new Error("Ürünler alınamadı");
      const data = await res.json();
      console.log("Ürünler yüklendi:", data);
      setProducts(data);
    } catch (error) {
      console.error("Ürünler yüklenemedi:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []); // 🔒 StrictMode iki kez tetikler ama production'da sorun olmaz

  const openNewProductModal = () => {
    setSelectedProduct(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditProductModal = (product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleAction = (id, type) => {
    const actions = {
      delete: {
        title: "Ürünü Sil",
        message: "Bu ürünü tamamen silmek istediğinize emin misiniz?",
        url: `/api/admin/admin-products/${id}`,
        options: { method: "DELETE" },
      },
      archive: {
        title: "Ürünü Arşivle",
        message: "Bu ürünü arşivlemek istediğinize emin misiniz?",
        url: `/api/admin/admin-products/${id}?archive=true`,
        options: { method: "DELETE" },
      },
      activate: {
        title: "Ürünü Aktifleştir",
        message: "Bu ürünü tekrar aktif etmek istiyor musunuz?",
        url: `/api/admin/admin-products/${id}`,
        options: {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "aktif" }),
        },
      },
    };

    const config = actions[type];
    setConfirmPopup({
      title: config.title,
      message: config.message,
      onConfirm: async () => {
        try {
          const res = await fetch(config.url, config.options);
          if (!res.ok) throw new Error(`${type} işlemi başarısız`);
          console.log(`✅ ${type} işlemi başarılı:`, id);
          fetchProducts();
        } catch (error) {
          console.error(`${type} işlemi hatası:`, error.message);
        } finally {
          setConfirmPopup(null);
        }
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <h1>Ürünler</h1>
        <button onClick={openNewProductModal} className={styles.addButton}>
          <FaPlus /> Yeni Ürün Ekle
        </button>
      </div>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <div className={styles.productGrid}>
          {products.map((product) => (
            <div
              key={product.id}
              className={`${styles.productCard} ${
                product.status === "arşivli" ? styles.archivedCard : ""
              }`}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={300}
                  className={styles.productImage}
                  priority
                />
                <div className={styles.badgeContainer}>
                  {product.isFeatured && (
                    <span className={styles.badge}>Öne Çıkan</span>
                  )}
                  {product.isRecommended && (
                    <span className={styles.badge}>Önerilen</span>
                  )}
                  {product.isBestSeller && (
                    <span className={styles.badge}>Çok Satan</span>
                  )}
                  {product.isDiscounted && (
                    <span className={styles.badge}>İndirimli</span>
                  )}
                </div>
              </div>

              {product.status === "arşivli" && (
                <div className={styles.badge}>Arşivli</div>
              )}

              <h3>{product.name}</h3>
              <p>{product.price}₺</p>

              <div className={styles.actions}>
                {product.status === "arşivli" ? (
                  <button
                    onClick={() => handleAction(product.id, "activate")}
                    className={styles.activateButton}
                  >
                    <FaBoxOpen /> Aktifleştir
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => openEditProductModal(product)}
                      className={styles.editButton}
                    >
                      <FaEdit /> Düzenle
                    </button>
                    <button
                      onClick={() => handleAction(product.id, "archive")}
                      className={styles.archiveButton}
                    >
                      <FaArchive /> Arşivle
                    </button>
                    <button
                      onClick={() => handleAction(product.id, "delete")}
                      className={styles.deleteButton}
                    >
                      <FaTrash /> Sil
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ProductModal
          closeModal={() => setIsModalOpen(false)}
          refreshProducts={fetchProducts}
          selectedProduct={selectedProduct}
          isEditing={isEditing}
        />
      )}

      {confirmPopup && (
        <ConfirmPopup
          title={confirmPopup.title}
          message={confirmPopup.message}
          onConfirm={confirmPopup.onConfirm}
          onCancel={() => setConfirmPopup(null)}
        />
      )}
    </div>
  );
}
