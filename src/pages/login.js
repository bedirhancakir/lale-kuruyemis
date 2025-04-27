import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Login.module.css"; // yeni css dosyası oluşturacağız

export default function LoginPage() {
  const [identifier, setIdentifier] = useState(""); // Email veya Kullanıcı adı
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();

    if (res.ok) {
      if (data.isAdmin) {
        router.push("/admin/products");
      } else {
        router.push("/");
      }
    } else {
      setError(data.error || "Giriş başarısız oldu");
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Giriş Yap</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Email veya Kullanıcı Adı"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.loginButton}>Giriş Yap</button>
      </form>
    </div>
  );
}
