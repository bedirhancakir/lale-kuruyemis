import Link from "next/link";
import styles from "./Header.module.css";
import React from 'react'; 
import { AiFillHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header>
      <nav className={styles.nav}>
        <div className={styles.leftLinks}>
          <Link href="/">Anasayfa</Link>
          <Link href="/products">Ürünler</Link>
          <Link href="/about">Hakkımızda</Link>
          <Link href="/contact">İletişim</Link>
          <Link href="/favorites">
            <AiFillHeart className={styles.heartIcon} /> Favoriler
          </Link>
          <Link href="/cart">
            <AiOutlineShoppingCart className={styles.cartIcon} /> Sepetim ({cartCount})
          </Link>
        </div>

        <div className={styles.rightLinks}>
          <Link href="/login">
            <button className={styles.loginButton}>Giriş Yap</button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
