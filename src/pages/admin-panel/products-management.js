import { useState, useEffect } from "react";
import ProductModal from "../../components/admin-panel/ProductModal";
import Image from "next/image";
import styles from "../../styles/AdminProducts.module.css";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/admin/admin-products");
      if (!res.ok) throw new Error("Ürünler alınamadı");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Ürünler yüklenemedi:", error.message);
    }
  }

  function openNewProductModal() {
    setSelectedProduct(null);
    setIsEditing(false);
    setIsModalOpen(true);
  }

  function openEditProductModal(product) {
    setSelectedProduct(product);
    setIsEditing(true);
    setIsModalOpen(true);
  }

  async function handleDeleteProduct(id) {
    if (!confirm("Bu ürünü tamamen silmek istiyor musunuz?")) return;
    try {
      await fetch(`/api/admin/admin-products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (error) {
      console.error("Silme hatası:", error.message);
    }
  }

  async function handleArchiveProduct(id) {
    if (!confirm("Bu ürünü arşivlemek istiyor musunuz?")) return;
    try {
      await fetch(`/api/admin/admin-products/${id}?archive=true`, {
        method: "DELETE",
      });
      fetchProducts();
    } catch (error) {
      console.error("Arşivleme hatası:", error.message);
    }
  }

  async function handleActivateProduct(id) {
    if (!confirm("Bu ürünü tekrar aktif etmek istiyor musunuz?")) return;
    try {
      await fetch(`/api/admin/admin-products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "aktif" }),
      });
      fetchProducts();
    } catch (error) {
      console.error("Aktifleştirme hatası:", error.message);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <h1>Ürünler</h1>
        <button onClick={openNewProductModal} className={styles.addButton}>
          Yeni Ürün Ekle
        </button>
      </div>

      <div className={styles.productGrid}>
        {products.map((product) => (
          <div
            key={product.id}
            className={`${styles.productCard} ${
              product.status === "arşivli" ? styles.archivedCard : ""
            }`}
          >
            <Image
              src={product.image}
              alt={product.name}
              width={300}
              height={300}
              className={styles.productImage}
              priority
            />
            {product.status === "arşivli" && (
              <div className={styles.badge}>Arşivli</div>
            )}
            <h3>{product.name}</h3>
            <p>{product.price}₺</p>

            <div className={styles.actions}>
              {product.status === "arşivli" ? (
                <button
                  onClick={() => handleActivateProduct(product.id)}
                  className={styles.activateButton}
                >
                  Aktifleştir
                </button>
              ) : (
                <>
                  <button
                    onClick={() => openEditProductModal(product)}
                    className={styles.editButton}
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleArchiveProduct(product.id)}
                    className={styles.archiveButton}
                  >
                    Arşivle
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className={styles.deleteButton}
                  >
                    Sil
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <ProductModal
          closeModal={() => setIsModalOpen(false)}
          refreshProducts={fetchProducts}
          selectedProduct={selectedProduct}
          isEditing={isEditing}
        />
      )}
    </div>
  );
}
