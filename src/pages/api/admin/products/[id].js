import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "products.json");

function readProducts() {
  if (!fs.existsSync(filePath)) return [];
  const fileData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileData || "[]");
}

function writeProducts(products) {
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
}

export default function handler(req, res) {
  const { id } = req.query;
  const products = readProducts();
  const productIndex = products.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ error: "Ürün bulunamadı." });
  }

  if (req.method === "PUT") {
    const { name, description, price, image, status } = req.body;

    if (name) products[productIndex].name = name;
    if (description) products[productIndex].description = description;
    if (price) products[productIndex].price = parseFloat(price);
    if (image) products[productIndex].image = image;
    if (status) products[productIndex].status = status; // aktif/arşivli güncelleyebiliriz

    writeProducts(products);
    return res.status(200).json({ message: "Ürün güncellendi", product: products[productIndex] });
  }

  if (req.method === "DELETE") {
    const { archive } = req.query;

    if (archive === "true") {
      products[productIndex].status = "arşivli";
      writeProducts(products);
      return res.status(200).json({ message: "Ürün arşivlendi" });
    } else {
      products.splice(productIndex, 1);
      writeProducts(products);
      return res.status(200).json({ message: "Ürün silindi" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
