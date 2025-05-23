import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./AuthForm.module.css";

export default function RegisterForm() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "bireysel",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password, full_name, role } = form;

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: { full_name, role },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    const userId = data.user?.id;

    // ✅ E-posta doğrulaması gerekiyorsa yönlendir
    if (!data.session) {
      localStorage.setItem("pending_signup_email", email);
      router.push("/verify-email");
      return;
    }

    // ✅ E-posta doğrulama kapalıysa → veritabanına ekle
    try {
      const { error: insertError } = await supabase.from("users").insert({
        id: userId,
        email,
        full_name,
        role,
      });

      if (insertError) {
        throw new Error(
          "Kullanıcı veritabanına eklenirken hata oluştu: " +
            insertError.message
        );
      }

      router.push("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>Kayıt Ol</h2>
      <form onSubmit={handleRegister} className={styles.form}>
        <input
          name="full_name"
          placeholder="Ad Soyad"
          value={form.full_name}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="E-posta"
          value={form.email}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Şifre"
          value={form.password}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className={styles.input}
        >
          <option value="bireysel">Bireysel Kullanıcı</option>
          <option value="kurumsal">Kurumsal Müşteri</option>
        </select>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.button}>
          Kayıt Ol
        </button>
      </form>

      <div className={styles.links}>
        <Link href="/login">Zaten hesabınız var mı? Giriş Yap</Link>
      </div>
    </section>
  );
}
