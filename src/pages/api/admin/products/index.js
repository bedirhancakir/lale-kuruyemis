import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";

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
  if (req.method === "GET") {
    const products = readProducts();
    return res.status(200).json(products);
  }

  if (req.method === "POST") {
    const { name, description, price, image } = req.body;

    if (!name || !price || !description || !image) {
      return res.status(400).json({ error: "Eksik alanlar var." });
    }

    const newProduct = {
      id: nanoid(8),
      name,
      description,
      price: parseFloat(price),
      image,
      status: "aktif",
    };

    const products = readProducts();
    products.push(newProduct);
    writeProducts(products);

    return res.status(201).json({ message: "Ürün başarıyla eklendi", product: newProduct });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
