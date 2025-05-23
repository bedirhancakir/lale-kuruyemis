import { useState } from "react";
import { login } from "../../lib/authHelpers";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./AuthForm.module.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { user } = await login({ email, password });

      // Kullanıcı doğrulama kontrolü
      if (!user.email_confirmed_at) {
        setError(
          "E-posta adresinizi doğrulamadınız. Lütfen e-posta kutunuzu kontrol edin."
        );
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        throw new Error("Rol bilgisi alınamadı");
      }

      const redirectMap = {
        admin: "/admin-panel/dashboard-management/dashboard",
        bireysel: "/",
        kurumsal: "/",
      };

      router.push(redirectMap[profile.role] || "/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>Giriş Yap</h2>
      <form onSubmit={handleLogin} className={styles.form}>
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button}>
          Giriş Yap
        </button>
      </form>

      <div className={styles.links}>
        <Link href="/forgot-password">Şifremi unuttum</Link>
        <Link href="/register">Kayıt Ol</Link>
      </div>
    </section>
  );
}
