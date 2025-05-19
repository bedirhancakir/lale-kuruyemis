import { createContext, useContext, useEffect, useState } from "react";

const CategoryContext = createContext([]);

export function CategoryProvider({ children, initialCategories = [] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [fetched, setFetched] = useState(initialCategories.length > 0);

  useEffect(() => {
    if (fetched) return;

    // Bu sadece SSR ile veri gelmezse çalışır (mesela client-side yüklemelerde)
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/public/categories");
        const data = await res.json();
        setCategories(data);
        setFetched(true);
      } catch (err) {
        console.error("Kategori verisi çekilemedi:", err.message);
      }
    };

    fetchCategories();
  }, [fetched]);

  return (
    <CategoryContext.Provider value={categories}>
      {children}
    </CategoryContext.Provider>
  );
}

export const useCategories = () => useContext(CategoryContext);
