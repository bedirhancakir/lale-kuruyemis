import Link from "next/link";
import styles from "./AdminNavbar.module.css";
import {
  FaBoxOpen,
  FaShoppingCart,
  FaChartPie,
  FaTags,
  FaListAlt,
  FaImage,
} from "react-icons/fa";

export default function AdminNavbar() {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li>
          <Link href="/admin-panel/products-management">
            <FaBoxOpen /> Ürünler
          </Link>
        </li>
        <li>
          <Link href="/admin-panel/orders">
            <FaShoppingCart /> Siparişler
          </Link>
        </li>
        <li>
          <Link href="/admin-panel/dashboard-management/dashboard">
            <FaChartPie /> Panel
          </Link>
        </li>
        <li>
          <Link href="/admin-panel/categories-management">
            <FaListAlt /> Kategoriler
          </Link>
        </li>
        <li>
          <Link href="/admin-panel/tagged-products-management">
            <FaTags /> Etiketli Ürünler
          </Link>
        </li>
        <li>
          <Link href="/admin-panel/banners-management">
            <FaImage /> Hero Banner
          </Link>
        </li>
      </ul>
    </nav>
  );
}
