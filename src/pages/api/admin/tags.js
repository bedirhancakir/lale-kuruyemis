import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "products.json");

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { productId, tag, value } = req.body;

  if (
    !productId ||
    !["isFeatured", "isRecommended", "isBestSeller", "isDiscounted"].includes(tag)
  ) {
    return res.status(400).json({ message: "Geçersiz istek" });
  }

  try {
    const fileData = await fs.readFile(filePath, "utf-8");
    const products = JSON.parse(fileData);

    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        return { ...product, [tag]: value };
      }
      return product;
    });

    await fs.writeFile(filePath, JSON.stringify(updatedProducts, null, 2), "utf-8");

    res.status(200).json({ message: "Etiket güncellendi" });
  } catch (err) {
    console.error("Tag güncelleme hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
}
