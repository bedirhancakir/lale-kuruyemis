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
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import UserMenu from "./header/UserMenu";

export default function Header() {
  const router = useRouter();
  const { cartItems, cartItemCount } = useCart();
  const categories = useCategories();
  const { user, profile } = useAuth();

  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleUserClick = (e) => {
    e.preventDefault();
    if (user) {
      setShowUserMenu((prev) => !prev);
    } else {
      router.push("/login");
    }
  };

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

        <nav className={styles.nav}>
          {categories.map((category) => (
            <div key={category.id} className={styles.navItem}>
              <Link
                href={`/products/${category.slug}`}
                className={styles.navLink}
              >
                {category.name}
              </Link>

              {category.subcategories.length > 0 && (
                <ul className={styles.dropdown}>
                  <li>
                    <Link
                      href={`/products/${category.slug}`}
                      className={styles.dropdownLink}
                    >
                      Tümü
                    </Link>
                  </li>
                  {category.subcategories.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        href={`/products/${category.slug}/${sub.slug}`}
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
          href={user ? "/favorites" : "/login"}
          className={styles.iconBtn}
          onClick={(e) => {
            if (!user) {
              e.preventDefault();
              router.push("/login");
            }
          }}
        >
          <AiFillHeart />
        </Link>

        <Link href="/cart" className={styles.iconBtn}>
          <AiOutlineShoppingCart />
          {cartItems.length > 0 && (
            <span className={styles.cartCount}>{cartItemCount()}</span>
          )}
        </Link>

        <Link
          href={user ? "#" : "/login"}
          className={styles.iconBtn}
          onClick={handleUserClick}
        >
          <AiOutlineUser />
        </Link>

        {showUserMenu && <UserMenu onClose={() => setShowUserMenu(false)} />}
      </div>
    </header>
  );
}
