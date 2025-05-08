import { createContext, useContext, useEffect, useState } from "react";

const CategoryContext = createContext([]);

export function CategoryProvider({ children, initialCategories = [] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [fetched, setFetched] = useState(initialCategories.length > 0);

  useEffect(() => {
    if (fetched) return; // zaten başta initialCategories geldiyse fetch etme

    fetch("/api/public/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setFetched(true); // bir daha fetch etmesin
      })
      .catch((err) => {
        console.error("Kategori verisi alınamadı:", err);
      });
  }, [fetched]);

  return (
    <CategoryContext.Provider value={categories}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  return useContext(CategoryContext);
}
