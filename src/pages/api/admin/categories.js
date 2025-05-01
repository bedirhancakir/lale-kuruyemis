import fs from "fs/promises";
import path from "path";

// ✅ Türkçe karakterleri normalize eder
function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const filePath = path.join(process.cwd(), "data", "categories.json");

export default async function handler(req, res) {
  const fileData = await fs.readFile(filePath, "utf-8");
  let categories = JSON.parse(fileData);

  if (req.method === "POST") {
    const { type, name, categoryId } = req.body;

    // ✅ ID'yi otomatik slugify ediyoruz
    const id = slugify(name);

    if (type === "category") {
      if (categories.find((cat) => cat.id === id)) {
        return res.status(400).json({ error: "Kategori zaten var" });
      }
      categories.push({ id, name, subcategories: [] });
    }

    if (type === "subcategory") {
      const catIndex = categories.findIndex((cat) => cat.id === categoryId);
      if (catIndex === -1) {
        return res.status(404).json({ error: "Ana kategori bulunamadı" });
      }

      const subExists = categories[catIndex].subcategories.find(
        (sub) => sub.id === id
      );
      if (subExists) {
        return res.status(400).json({ error: "Alt kategori zaten var" });
      }

      categories[catIndex].subcategories.push({ id, name });
    }

    await fs.writeFile(filePath, JSON.stringify(categories, null, 2));
    return res.status(200).json(categories);
  }

  if (req.method === "DELETE") {
    const { type, id, categoryId } = req.body;

    if (type === "category") {
      categories = categories.filter((cat) => cat.id !== id);
    }

    if (type === "subcategory") {
      const catIndex = categories.findIndex((cat) => cat.id === categoryId);
      if (catIndex === -1) {
        return res.status(404).json({ error: "Ana kategori bulunamadı" });
      }

      categories[catIndex].subcategories = categories[
        catIndex
      ].subcategories.filter((sub) => sub.id !== id);
    }

    await fs.writeFile(filePath, JSON.stringify(categories, null, 2));
    return res.status(200).json(categories);
  }

  return res.status(405).json({ error: "Yalnızca POST ve DELETE desteklenir" });
}
