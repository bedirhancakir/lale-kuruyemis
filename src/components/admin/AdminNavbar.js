import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./AdminNavbar.module.css";

export default function AdminNavbar() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li>
          <Link href="/admin/products">Ürünler</Link>
        </li>
        <li>
          <Link href="/admin/orders">Siparişler</Link>
        </li>
        <li style={{ marginLeft: "auto" }}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Çıkış Yap
          </button>
        </li>
      </ul>
    </nav>
  );
}
