// api/public/categories.js'i birden fazla kullandığımız ekranlarda GET isteğini teke düşürüyoruz.

import { createContext, useContext, useEffect, useState } from "react";

const CategoryContext = createContext([]);

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/public/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch((err) => {
        console.error("Kategori verisi alınamadı:", err);
        setCategories([]); // fallback boş array
      });
  }, []);

  return (
    <CategoryContext.Provider value={categories}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  return useContext(CategoryContext);
}
