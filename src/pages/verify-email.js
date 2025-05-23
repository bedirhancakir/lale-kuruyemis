import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";
import styles from "../styles/VerifyEmail.module.css";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(60);

  useEffect(() => {
    const savedEmail = localStorage.getItem("pending_signup_email");
    if (savedEmail) {
      setEmail(savedEmail);
    }

    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Kullanıcı doğrulandıktan sonra users tablosuna ekleyelim
  useEffect(() => {
    const checkEmailVerification = async () => {
      const { data, error } = await supabase.auth.getSession();
      const user = data?.session?.user;

      if (user && user.email_confirmed_at) {
        // Kullanıcı doğrulandı, şimdi 'users' tablosuna ekleyelim
        const { error: insertError } = await supabase.from("users").upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata.full_name,
          role: user.user_metadata.role || "bireysel",
        });

        if (insertError) {
          setMessage("Veritabanına eklenirken hata oluştu.");
          console.error(insertError.message);
        } else {
          setMessage(
            "E-posta doğrulaması tamamlandı ve kullanıcı veritabanına eklendi."
          );
          // Başarıyla eklendiyse login sayfasına yönlendir
          router.push("/login");
        }
      }
    };

    checkEmailVerification();
  }, [router]);

  const resendVerification = async () => {
    setMessage("");
    if (!email) return;

    const { error } = await supabase.auth.signUp({
      email,
      password: "dummy-password", // Supabase bu alanı istiyor ama yeniden kullanıcı oluşturmaz
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (error && !error.message.includes("User already registered")) {
      setMessage("E-posta tekrar gönderilemedi: " + error.message);
    } else {
      setMessage("Doğrulama e-postası tekrar gönderildi.");
      setResendCooldown(60);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>E-posta Doğrulaması</h2>
      <p className={styles.info}>
        <strong>{email}</strong> adresine doğrulama bağlantısı gönderdik. Lütfen
        e-postanı kontrol et.
      </p>

      <p className={styles.retry}>
        E-posta ulaşmadıysa{" "}
        <button
          onClick={resendVerification}
          disabled={resendCooldown > 0}
          className={styles.resendBtn}
        >
          {resendCooldown > 0
            ? `${resendCooldown} saniye içinde tekrar deneyebilirsin`
            : "Tekrar Gönder"}
        </button>
      </p>

      {message && <p className={styles.message}>{message}</p>}

      <div className={styles.footer}>
        <p>
          Doğrulamayı tamamladıysan{" "}
          <button
            className={styles.loginBtn}
            onClick={() => router.push("/login")}
          >
            Giriş Yap
          </button>
        </p>
      </div>
    </div>
  );
}
