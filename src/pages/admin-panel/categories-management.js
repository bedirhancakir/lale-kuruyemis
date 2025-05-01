import { useEffect, useState } from "react";
import styles from "../../styles/AdminCategories.module.css";

export default function CategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [selectedCat, setSelectedCat] = useState("");

  useEffect(() => {
    fetch("/api/public/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  async function addCategory(e) {
    e.preventDefault();
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "category",
        name: newCategoryName,
      }),
    });

    if (res.ok) {
      const updated = await res.json();
      setCategories(updated);
      setNewCategoryName("");
    }
  }

  async function addSubcategory(e) {
    e.preventDefault();
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "subcategory",
        categoryId: selectedCat,
        name: newSubName,
      }),
    });

    if (res.ok) {
      const updated = await res.json();
      setCategories(updated);
      setNewSubName("");
    }
  }

  async function deleteCategory(id) {
    const res = await fetch("/api/admin/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "category", id }),
    });

    if (res.ok) {
      const updated = await res.json();
      setCategories(updated);
    }
  }

  async function deleteSubcategory(categoryId, subId) {
    const res = await fetch("/api/admin/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "subcategory", categoryId, id: subId }),
    });

    if (res.ok) {
      const updated = await res.json();
      setCategories(updated);
    }
  }

  return (
    <div className={styles.container}>
      <h1>Kategori Yönetimi</h1>

      <section className={styles.formSection}>
        {/* ✅ Ana Kategori */}
        <form onSubmit={addCategory} className={styles.form}>
          <h3>Yeni Ana Kategori Ekle</h3>
          <input
            type="text"
            placeholder="Kategori Adı (örn: Kuruyemiş)"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
          />
          <button type="submit">Ekle</button>
        </form>

        {/* ✅ Alt Kategori */}
        <form onSubmit={addSubcategory} className={styles.form}>
          <h3>Alt Kategori Ekle</h3>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            required
          >
            <option value="">Kategori seçiniz</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Alt Kategori Adı"
            value={newSubName}
            onChange={(e) => setNewSubName(e.target.value)}
            required
          />
          <button type="submit">Ekle</button>
        </form>
      </section>

      <section>
        <h3>Mevcut Kategoriler</h3>
        <ul className={styles.list}>
          {categories.map((cat) => (
            <li key={cat.id}>
              <strong>
                {cat.name}
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className={styles.deleteBtn}
                >
                  🗑️
                </button>
              </strong>
              <ul>
                {cat.subcategories.map((sub) => (
                  <li key={sub.id}>
                    {sub.name}
                    <button
                      onClick={() => deleteSubcategory(cat.id, sub.id)}
                      className={styles.deleteBtn}
                    >
                      🗑️
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
