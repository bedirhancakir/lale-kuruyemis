import Link from "next/link";
import styles from "./AdminNavbar.module.css";

export default function AdminNavbar() {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li>
          <Link href="/admin-panel/products-management">Ürünler</Link>
        </li>
        <li>
          <Link href="/admin-panel/orders">Siparişler</Link>
        </li>
        <li>
          <Link href="/admin-panel/dashboard-management/dashboard">Panel</Link>
        </li>
        <li>
          <Link href="/admin-panel/categories-management">Kategoriler</Link>
        </li>
        <li>
          <Link href="/admin-panel/tagged-products-management">Etiketli Ürünler</Link>
        </li>
        <li>
          <Link href="/admin-panel/banners-management">Hero Banner</Link>
        </li>
      </ul>
    </nav>
  );
}
