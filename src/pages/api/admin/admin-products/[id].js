import fs from "fs/promises";
import fsSync from "fs";
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

  // ✅ Ürün Güncelleme (PUT)
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

    const currentProduct = products[productIndex];
    const oldImage = currentProduct.image;

    // ✅ Eğer yeni görsel geldiyse ve eskisinden farklıysa, eskiyi sil
    if (image && oldImage && image !== oldImage) {
      const oldImagePath = path.join(
        process.cwd(),
        "public",
        oldImage.replace(/^\//, "")
      );
      try {
        if (fsSync.existsSync(oldImagePath)) {
          await fs.unlink(oldImagePath);
        }
      } catch (err) {
        console.warn("Eski görsel silinemedi:", err.message);
      }
    }

    // ✅ Güncellenebilir alanlar
    if (name) currentProduct.name = name;
    if (slug) currentProduct.slug = slug;
    if (description) currentProduct.description = description;
    if (price) currentProduct.price = parseFloat(price);
    if (image) currentProduct.image = image;
    if (status) currentProduct.status = status;
    if (category) currentProduct.category = category;
    if (subcategory) currentProduct.subcategory = subcategory;

    await writeProducts(products);
    return res
      .status(200)
      .json({ message: "Ürün güncellendi", product: currentProduct });
  }

  // ✅ Ürün Silme (DELETE)
  if (req.method === "DELETE") {
    const { archive } = req.query;

    if (archive === "true") {
      products[productIndex].status = "arşivli";
    } else {
      // ✅ Görsel dosyasını da sil
      const imagePath = products[productIndex].image;
      if (imagePath) {
        const resolvedPath = path.join(
          process.cwd(),
          "public",
          imagePath.replace(/^\//, "")
        );
        try {
          if (fsSync.existsSync(resolvedPath)) {
            await fs.unlink(resolvedPath);
          }
        } catch (err) {
          console.warn("Görsel silinemedi:", err.message);
        }
      }

      // Ürünü diziden kaldır
      products.splice(productIndex, 1);
    }

    await writeProducts(products);
    return res.status(200).json({
      message: archive === "true" ? "Ürün arşivlendi" : "Ürün silindi",
    });
  }

  return res.status(405).json({ error: "İzin Verilmeyen Yöntem" });
}
