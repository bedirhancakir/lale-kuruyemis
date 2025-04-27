import { useState, useEffect } from "react";
import ProductModal from "../../components/admin/ProductModal";
import Image from "next/image";
import { parse } from "cookie";
import { verify } from "jsonwebtoken";
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
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
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
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchProducts();
  }

  async function handleArchiveProduct(id) {
    if (!confirm("Bu ürünü arşivlemek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/products/${id}?archive=true`, { method: "DELETE" });
    fetchProducts();
  }

  async function handleActivateProduct(id) {
    if (!confirm("Bu ürünü tekrar aktif etmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "aktif" }),
    });
    fetchProducts();
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
            className={`${styles.productCard} ${product.status === "arşivli" ? styles.archivedCard : ""}`}
          >
            <Image
              src={product.image}
              alt={product.name}
              width={300}
              height={300}
              className={styles.productImage}
            />
            {product.status === "arşivli" && (
              <div className={styles.badge}>Arşivli</div>
            )}
            <h3>{product.name}</h3>
            <p>{product.price}₺</p>

            <div className={styles.actions}>
              {product.status === "arşivli" ? (
                <button onClick={() => handleActivateProduct(product.id)} className={styles.activateButton}>
                  Aktifleştir
                </button>
              ) : (
                <>
                  <button onClick={() => openEditProductModal(product)} className={styles.editButton}>
                    Düzenle
                  </button>
                  <button onClick={() => handleArchiveProduct(product.id)} className={styles.archiveButton}>
                    Arşivle
                  </button>
                  <button onClick={() => handleDeleteProduct(product.id)} className={styles.deleteButton}>
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

export async function getServerSideProps({ req }) {
  const { adminToken } = parse(req.headers.cookie || "");
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminToken) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }

  try {
    verify(adminToken, jwtSecret);
    return { props: {} };
  } catch (error) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }
}
