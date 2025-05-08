// ✅ pages/api/products/related.js
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "products.json");

function readProducts() {
  if (!fs.existsSync(filePath)) return [];
  const fileData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileData || "[]");
}

export default function handler(req, res) {
  const {
    query: { category, subcategory, exclude },
    method,
  } = req;

  if (method === "GET") {
    const products = readProducts();
    const related = products.filter((p) => {
      const matchCategory = p.category === category;
      const matchSubcategory = p.subcategory === subcategory;
      const isNotExcluded = p.id !== exclude;
      return (
        p.status === "aktif" &&
        isNotExcluded &&
        (matchSubcategory || matchCategory)
      );
    });

    return res.status(200).json(related);
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
