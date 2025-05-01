import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCart } from "../context/CartContext";
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
  const [categories, setCategories] = useState([]);

  // ✅ Sayfa yüklendiğinde kategorileri al
  useEffect(() => {
    fetch("/api/public/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  // ✅ Aynı URL'e tekrar gitmeye çalışmamak için kontrol
  const handleNavigation = (url) => {
    if (router.asPath !== url) {
      router.push(url);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {/* ✅ Logo */}
        <span className={styles.logoLink} onClick={() => handleNavigation("/")}>
          <Image
            src="/images/placeholder.jpg"
            alt="Logo"
            width={60}
            height={40}
            className={styles.logo}
          />
        </span>

        {/* ✅ Ana kategoriler ve dropdown */}
        <nav className={styles.nav}>
          {categories.map((category) => (
            <div key={category.id} className={styles.navItem}>
              {/* ✅ Ana kategoriye tıklanınca Tümü sayfasına gider */}
              <span
                className={styles.navLink}
                onClick={() => handleNavigation(`/products/${category.id}`)}
              >
                {category.name}
              </span>

              {/* 🔽 Alt kategori dropdown */}
              {category.subcategories.length > 0 && (
                <ul className={styles.dropdown}>
                  {/* ✅ Tümü seçeneği */}
                  <li key="tumu">
                    <span
                      className={styles.dropdownLink}
                      onClick={() =>
                        handleNavigation(`/products/${category.id}`)
                      }
                    >
                      Tümü
                    </span>
                  </li>

                  {/* ✅ Alt kategoriler */}
                  {category.subcategories.map((sub) => (
                    <li key={sub.id}>
                      <span
                        className={styles.dropdownLink}
                        onClick={() =>
                          handleNavigation(`/products/${category.id}/${sub.id}`)
                        }
                      >
                        {sub.name}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* ✅ Sağ üst: Favori - Sepet - Kullanıcı */}
      <div className={styles.right}>
        <span
          className={styles.iconBtn}
          onClick={() => handleNavigation("/favorites")}
        >
          <AiFillHeart />
        </span>

        <span
          className={styles.iconBtn}
          onClick={() => handleNavigation("/cart")}
        >
          <AiOutlineShoppingCart />
          {cartItems.length > 0 && (
            <span className={styles.cartCount}>{cartItemCount()}</span>
          )}
        </span>

        <span
          className={styles.iconBtn}
          onClick={() => handleNavigation("/profile")}
        >
          <AiOutlineUser />
        </span>
      </div>
    </header>
  );
}
