import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";

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
  if (req.method === "GET") {
    const products = await readProducts();
    return res.status(200).json(products);
  }

  if (req.method === "POST") {
    const { name, slug, description, price, image, category, subcategory } =
      req.body;

    // ✅ Zorunlu alan kontrolü
    if (
      !name ||
      !price ||
      !description ||
      !image ||
      !category ||
      !subcategory
    ) {
      return res.status(400).json({ error: "Eksik alanlar var." });
    }

    // ✅ Yeni ürün objesi oluşturuluyor
    const newProduct = {
      id: nanoid(8),
      name,
      slug,
      description,
      price: parseFloat(price),
      image,
      category, // ✅ Kategori eklendi
      subcategory, // ✅ Alt kategori eklendi
      status: "aktif",
    };

    const products = await readProducts();
    products.push(newProduct);
    await writeProducts(products);

    return res
      .status(201)
      .json({ message: "Ürün başarıyla eklendi", product: newProduct });
  }

  return res.status(405).json({ error: "İzin Verilmeyen Yöntem" });
}
