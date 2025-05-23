import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import withAuth from "../../components/shared/withAuth";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/router";
import styles from "../../styles/AccountPage.module.css";

function AccountPage() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      const name = profile.full_name || "";
      setFullName(name);
      setOriginalName(name);
    }
  }, [profile]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase
      .from("users")
      .update({ full_name: fullName })
      .eq("id", user.id);

    if (error) {
      setMessage("Güncelleme başarısız: " + error.message);
    } else {
      setMessage("Bilgileriniz başarıyla güncellendi.");
      setOriginalName(fullName);
    }

    setLoading(false);
  };

  const handlePasswordUpdate = async () => {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage("Şifre güncellenemedi: " + error.message);
    } else {
      setMessage("Şifreniz başarıyla güncellendi.");
      setNewPassword("");
    }

    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Hesabınızı kalıcı olarak silmek istiyor musunuz?"))
      return;

    setLoading(true);
    const res = await fetch("/api/delete-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });

    const result = await res.json();
    if (result.success) {
      setMessage("Hesabınız silindi. Anasayfaya yönlendiriliyorsunuz...");
      setTimeout(() => router.push("/"), 2000);
    } else {
      setMessage("Hesap silinemedi: " + result.error);
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Hesap Bilgileri</h2>

      <form onSubmit={handleUpdate} className={styles.form}>
        <label>Ad Soyad:</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={styles.input}
        />

        <label>E-posta:</label>
        <input
          type="email"
          value={user?.email}
          disabled
          className={styles.input}
        />

        <button
          type="submit"
          disabled={loading || fullName === originalName}
          className={styles.button}
        >
          Bilgileri Güncelle
        </button>
      </form>

      <hr />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePasswordUpdate();
        }}
        className={styles.form}
      >
        <label>Yeni Şifre:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={styles.input}
          placeholder="••••••••"
        />

        <button
          type="submit"
          disabled={loading || newPassword.length < 6}
          className={styles.button}
        >
          Şifreyi Güncelle
        </button>
      </form>

      <hr />

      <button
        onClick={handleDeleteAccount}
        disabled={loading}
        className={styles.deleteBtn}
      >
        Hesabımı Kalıcı Olarak Sil
      </button>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}

export default withAuth(AccountPage, ["kurumsal"]);
