import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { identifier, password } = req.body;

  const adminEmail = "admin@site.com";
  const adminUsername = "admin";
  const adminPassword = "admin123";
  const jwtSecret = process.env.JWT_SECRET;

  // Admin giriş kontrolü
  const isAdmin =
    (identifier === adminEmail || identifier === adminUsername) &&
    password === adminPassword;

  if (!isAdmin) {
    return res.status(401).json({ error: "Geçersiz giriş bilgileri" });
  }

  const token = sign({ role: "admin" }, jwtSecret, { expiresIn: "1h" });

  const serialized = serialize("adminToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 3600,
  });

  res.setHeader("Set-Cookie", serialized);

  return res.status(200).json({ isAdmin: true });
}
