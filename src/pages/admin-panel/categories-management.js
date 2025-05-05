import { useEffect, useState } from "react";
import styles from "../../styles/AdminCategories.module.css";
import { FiTrash2, FiEdit, FiPlus } from "react-icons/fi";
import CategoriesModal from "../../components/admin-panel/CategoriesModal";
import ConfirmPopup from "../../components/admin-panel/ConfirmPopup";

export default function CategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [confirmPopup, setConfirmPopup] = useState(null); // ✅

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    fetch("/api/public/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  };

  const deleteCategory = (id) => {
    setConfirmPopup({
      title: "Ana Kategori Sil",
      message: "Bu ana kategoriyi silmek istediğinize emin misiniz?",
      onConfirm: async () => {
        const res = await fetch("/api/admin/categories", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "category", id }),
        });

        if (res.ok) {
          const updated = await res.json();
          setCategories(updated);
        }

        setConfirmPopup(null); // ✅ popup kapat
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
          <FiPlus /> Kategori Ekle
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
                >
                  <FiTrash2 />
                </button>
                <button
                  onClick={() => openEditModal(cat)}
                  className={styles.editBtn}
                >
                  <FiEdit />
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
