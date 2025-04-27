import { serialize } from "cookie";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const serialized = serialize("adminToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0), // geçmiş tarih
  });

  res.setHeader("Set-Cookie", serialized);

  return res.status(200).json({ message: "Başarıyla çıkış yapıldı" });
}
