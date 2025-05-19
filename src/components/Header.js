import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "../context/CartContext";
import { useCategories } from "../context/CategoryContext";
import Image from "next/image";
import styles from "./Header.module.css";
import {
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiFillHeart,
} from "react-icons/ai";

export default function Header() {
  const router = useRouter();
  const { cartItems, cartItemCount } = useCart();
  const categories = useCategories();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href="/" className={styles.logoLink} aria-label="Anasayfaya git">
          <Image
            src="/images/placeholder.jpg"
            alt="Lale Kuruyemiş Logo"
            width={60}
            height={40}
            className={styles.logo}
            priority
          />
        </Link>

        <nav className={styles.nav} aria-label="Ana Kategoriler">
          {categories.map((category) => (
            <div key={category.id} className={styles.navItem}>
              <Link
                href={`/products/${category.id}`}
                className={styles.navLink}
              >
                {category.name}
              </Link>

              {category.subcategories.length > 0 && (
                <ul className={styles.dropdown} role="menu">
                  <li key="tumu">
                    <Link
                      href={`/products/${category.id}`}
                      className={styles.dropdownLink}
                    >
                      Tümü
                    </Link>
                  </li>
                  {category.subcategories.map((sub) => (
                    <li key={sub.id} role="none">
                      <Link
                        href={`/products/${category.id}/${sub.id}`}
                        className={styles.dropdownLink}
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className={styles.right}>
        <Link
          href="/favorites"
          className={styles.iconBtn}
          aria-label="Favoriler"
        >
          <AiFillHeart />
        </Link>

        <Link href="/cart" className={styles.iconBtn} aria-label="Sepet">
          <AiOutlineShoppingCart />
          {cartItems.length > 0 && (
            <span className={styles.cartCount}>{cartItemCount()}</span>
          )}
        </Link>

        <Link href="/" className={styles.iconBtn} aria-label="Hesabım">
          <AiOutlineUser />
        </Link>
      </div>
    </header>
  );
}
