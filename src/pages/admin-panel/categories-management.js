import { useEffect, useState } from "react";
import withAuth from "../../components/shared/withAuth";
import styles from "../../styles/AdminCategories.module.css";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import CategoriesModal from "../../components/admin-panel/CategoriesModal";
import ConfirmPopup from "../../components/admin-panel/ConfirmPopup";

function CategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [confirmPopup, setConfirmPopup] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/public/categories");
      const data = await res.json();
      setCategories(data);
      console.log("Kategoriler yüklendi:", data);
    } catch (error) {
      console.error("Kategoriler yüklenemedi:", error.message);
    }
  };

  const deleteCategory = (id) => {
    setConfirmPopup({
      title: "Ana Kategori Sil",
      message: "Bu ana kategoriyi silmek istediğinize emin misiniz?",
      onConfirm: async () => {
        try {
          const res = await fetch("/api/admin/categories", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "category", id }),
          });

          if (!res.ok) throw new Error("Silme işlemi başarısız");
          const updated = await res.json();
          setCategories(updated);
          console.log("Kategori silindi:", id);
        } catch (error) {
          console.error("Kategori silinemedi:", error.message);
        } finally {
          setConfirmPopup(null);
        }
      },
    });
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedCategory(null);
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setModalMode("edit");
    setSelectedCategory(category);
    setModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1>Kategori Yönetimi</h1>
        <button onClick={openCreateModal} className={styles.createBtn}>
          <FaPlus /> Kategori Ekle
        </button>
      </div>

      <section>
        <ul className={styles.list}>
          {categories.map((cat) => (
            <li key={cat.id}>
              <strong>
                {cat.name}
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className={styles.deleteBtn}
                  title="Sil"
                >
                  <FaTrash />
                </button>
                <button
                  onClick={() => openEditModal(cat)}
                  className={styles.editBtn}
                  title="Düzenle"
                >
                  <FaEdit />
                </button>
              </strong>
              <ul className={styles.subList}>
                {cat.subcategories.map((sub) => (
                  <li key={sub.id}>{sub.name}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      {modalOpen && (
        <CategoriesModal
          mode={modalMode}
          category={selectedCategory}
          onClose={() => setModalOpen(false)}
          onSave={fetchCategories}
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

export default withAuth(CategoriesManagement, ["admin"]);
