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
  const categories = useCategories(); // ✅ Context'ten veri al

  const handleNavigation = (url) => {
    if (router.asPath !== url) {
      router.push(url);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span className={styles.logoLink} onClick={() => handleNavigation("/")}>
          <Image
            src="/images/placeholder.jpg"
            alt="Logo"
            width={60}
            height={40}
            className={styles.logo}
          />
        </span>

        <nav className={styles.nav}>
          {categories.map((category) => (
            <div key={category.id} className={styles.navItem}>
              <span
                className={styles.navLink}
                onClick={() => handleNavigation(`/products/${category.id}`)}
              >
                {category.name}
              </span>

              {category.subcategories.length > 0 && (
                <ul className={styles.dropdown}>
                  <li key="tumu">
                    <span
                      className={styles.dropdownLink}
                      onClick={() => handleNavigation(`/products/${category.id}`)}
                    >
                      Tümü
                    </span>
                  </li>
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
          onClick={() => handleNavigation("/")}
        >
          <AiOutlineUser />
        </span>
      </div>
    </header>
  );
}
