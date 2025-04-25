import "../styles/global.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CartProvider } from "../context/CartContext";
import { FavoritesProvider } from "../context/FavoritesContext";

export default function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <FavoritesProvider>
        <Header />
        <main>
          <Component {...pageProps} />
        </main>
        <Footer />
      </FavoritesProvider>
    </CartProvider>
  );
}
