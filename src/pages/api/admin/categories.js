import fs from "fs/promises";
import path from "path";

// ✅ Slugify fonksiyonu
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
    const {
      type,
      name,
      description = "",
      image = "",
      categoryId,
      forceUpdate,
      oldId,
    } = req.body;
    const id = slugify(name);

    if (type === "category") {
      if (forceUpdate && oldId) {
        const index = categories.findIndex((cat) => cat.id === oldId);
        if (index === -1) {
          return res.status(404).json({ error: "Kategori bulunamadı" });
        }

        // Eski görsel varsa ve değişmişse sil
        const oldImage = categories[index].image;
        if (oldImage && oldImage !== image) {
          const oldImagePath = path.join(
            process.cwd(),
            "public",
            oldImage.replace(/^\//, "")
          );
          try {
            await fs.unlink(oldImagePath);
          } catch (err) {
            console.warn("Eski kategori görseli silinemedi:", err.message);
          }
        }

        categories[index] = {
          ...categories[index],
          id,
          name,
          description,
          image,
        };
      } else {
        if (categories.find((cat) => cat.id === id)) {
          return res.status(400).json({ error: "Kategori zaten var" });
        }

        categories.push({
          id,
          name,
          description,
          image,
          subcategories: [],
        });
      }
    }

    if (type === "subcategory") {
      const catIndex = categories.findIndex((cat) => cat.id === categoryId);
      if (catIndex === -1) {
        return res.status(404).json({ error: "Ana kategori bulunamadı" });
      }

      const subId = slugify(name);
      const exists = categories[catIndex].subcategories.find(
        (sub) => sub.id === subId
      );
      if (exists) {
        return res.status(400).json({ error: "Alt kategori zaten var" });
      }

      categories[catIndex].subcategories.push({ id: subId, name });
    }

    await fs.writeFile(filePath, JSON.stringify(categories, null, 2));
    return res.status(200).json(categories);
  }

  if (req.method === "DELETE") {
    const { type, id, categoryId } = req.body;

    if (type === "category") {
      const deletedCat = categories.find((cat) => cat.id === id);

      if (deletedCat?.image) {
        const imagePath = path.join(
          process.cwd(),
          "public",
          deletedCat.image.replace(/^\//, "")
        );
        try {
          await fs.unlink(imagePath);
        } catch (err) {
          console.warn("Kategori görseli silinemedi:", err.message);
        }
      }

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
