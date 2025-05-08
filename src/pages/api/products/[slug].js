// ✅ pages/api/products/[slug].js - ürün bazlı veri çekme
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
    query: { slug },
    method,
  } = req;

  if (method === "GET") {
    const products = readProducts();
    const product = products.find(
      (p) => p.slug === slug && p.status === "aktif"
    );

    if (!product) {
      return res.status(404).json({ error: "Ürün bulunamadı." });
    }

    return res.status(200).json(product);
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
