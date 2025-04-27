import "../styles/global.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AdminNavbar from "../components/admin/AdminNavbar";
import { CartProvider } from "../context/CartContext";
import { FavoritesProvider } from "../context/FavoritesContext";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith("/admin");

  return (
    <CartProvider>
      <FavoritesProvider>
        {isAdminPage ? <AdminNavbar /> : <Header />}
        
        <main>
          <Component {...pageProps} />
        </main>

        {!isAdminPage && <Footer />}
      </FavoritesProvider>
    </CartProvider>
  );
}
