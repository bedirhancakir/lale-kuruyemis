import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="modal">
      <h2>Yeni Şifre Belirle</h2>
      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="Yeni şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Şifreyi Güncelle</button>
      </form>
      {success && <p>Şifren başarıyla güncellendi. Yönlendiriliyorsun...</p>}
    </div>
  );
}
