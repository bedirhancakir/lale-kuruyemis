import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="modal">
      <h2>Şifremi Unuttum</h2>
      {sent ? (
        <p>Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.</p>
      ) : (
        <form onSubmit={handleSendResetLink}>
          <input
            type="email"
            placeholder="E-posta adresiniz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Sıfırlama Bağlantısı Gönder</button>
        </form>
      )}
    </div>
  );
}
