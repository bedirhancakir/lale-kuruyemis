import Link from "next/link";
import { logout } from "../../lib/authHelpers";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import styles from "./UserMenu.module.css";
import { useEffect, useRef } from "react";

export default function UserMenu({ onClose }) {
  const { profile } = useAuth();
  const router = useRouter();
  const menuRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    onClose();
    router.replace("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose(); // dışarı tıklandıysa kapat
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!profile) return null;
  const { role } = profile;

  return (
    <div className={styles.menu} ref={menuRef}>
      {role === "admin" && (
        <>
          <Link
            href="/admin-panel/dashboard-management/dashboard"
            onClick={onClose}
          >
            Dashboard
          </Link>
          <Link href="/admin-panel/orders" onClick={onClose}>
            Siparişler
          </Link>
          <Link href="/admin-panel/categories-management" onClick={onClose}>
            Kategoriler
          </Link>
          <Link href="/admin-panel/products-management" onClick={onClose}>
            Ürünler
          </Link>
          <Link href="/admin-panel/banners-management" onClick={onClose}>
            Hero Banner
          </Link>
          <Link
            href="/admin-panel/tagged-products-management"
            onClick={onClose}
          >
            Etiketli Ürünler
          </Link>
        </>
      )}

      {role === "bireysel" && (
        <>
          <Link href="/user-panel/account" onClick={onClose}>
            Hesabım
          </Link>
          <Link href="/user-panel/orders" onClick={onClose}>
            Siparişlerim
          </Link>
          <Link href="/user-panel/addresses" onClick={onClose}>
            Adreslerim
          </Link>
        </>
      )}

      {role === "kurumsal" && (
        <>
          <Link href="/corporate-panel/account" onClick={onClose}>
            Kurumsal Hesap
          </Link>
          <Link href="/corporate-panel/orders" onClick={onClose}>
            Siparişler
          </Link>
          <Link href="/corporate-panel/addresses" onClick={onClose}>
            Adresler
          </Link>
        </>
      )}

      <button onClick={handleLogout}>Çıkış Yap</button>
    </div>
  );
}
