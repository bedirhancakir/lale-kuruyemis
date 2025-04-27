import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "products.json");

function readProducts() {
  if (!fs.existsSync(filePath)) return [];
  const fileData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileData || "[]");
}

export default function handler(req, res) {
  if (req.method === "GET") {
    const products = readProducts();
    const activeProducts = products.filter((product) => product.status === "aktif");
    return res.status(200).json(activeProducts);
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
