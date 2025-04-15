import Link from "next/link";
import { useEffect, useState } from "react";
import { getCartCount } from "../lib/cartUtils";
import styles from "./Header.module.css";
import { AiFillHeart, AiOutlineShoppingCart } from "react-icons/ai";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // İlk yüklemede sayıyı al
      setCartCount(getCartCount());

      // Her 1 saniyede bir kontrol et (geçici çözüm)
      const interval = setInterval(() => {
        setCartCount(getCartCount());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  return (
    <header>
      <nav className={styles.nav}>
        <Link href="/">Anasayfa</Link>
        <Link href="/products">Ürünler</Link>
        <Link href="/about">Hakkımızda</Link>
        <Link href="/contact">İletişim</Link>
        <Link href="/favorites">
          <AiFillHeart className={styles.heartIcon} /> Favoriler
        </Link>
        <Link href="/cart">
          <AiOutlineShoppingCart className={styles.cartIcon} /> Sepetim (
          {cartCount})
        </Link>
      </nav>
    </header>
  );
}
