import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "products.json");

async function readProducts() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
}

async function writeProducts(products) {
  await fs.writeFile(filePath, JSON.stringify(products, null, 2));
}

export default async function handler(req, res) {
  const { id } = req.query;
  const products = await readProducts();
  const productIndex = products.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ error: "Ürün bulunamadı" });
  }

  if (req.method === "PUT") {
    const {
      name,
      description,
      price,
      image,
      status,
      category,
      subcategory,
      slug,
    } = req.body;

    // ✅ Güncellenebilir alanlar
    if (name) products[productIndex].name = name;
    if (slug) products[productIndex].slug = slug;
    if (description) products[productIndex].description = description;
    if (price) products[productIndex].price = parseFloat(price);
    if (image) products[productIndex].image = image;
    if (status) products[productIndex].status = status;
    if (category) products[productIndex].category = category;
    if (subcategory) products[productIndex].subcategory = subcategory;

    await writeProducts(products);
    return res
      .status(200)
      .json({ message: "Ürün güncellendi", product: products[productIndex] });
  }

  if (req.method === "DELETE") {
    const { archive } = req.query;

    if (archive === "true") {
      products[productIndex].status = "arşivli";
    } else {
      products.splice(productIndex, 1);
    }

    await writeProducts(products);
    return res.status(200).json({
      message: archive === "true" ? "Ürün arşivlendi" : "Ürün silindi",
    });
  }

  return res.status(405).json({ error: "İzin Verilmeyen Yöntem" });
}
