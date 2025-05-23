// pages/_app.js
import "../styles/global.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AdminNavbar from "../components/admin-panel/AdminNavbar";
import { CartProvider } from "../context/CartContext";
import { FavoritesProvider } from "../context/FavoritesContext";
import { CategoryProvider } from "../context/CategoryContext";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import App from "next/app";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Layout({ Component, pageProps }) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin-panel");
  const { profile } = useAuth();

  const isAdmin = profile?.role === "admin";

  return (
    <>
      {isAdminRoute && isAdmin ? <AdminNavbar /> : <Header />}
      <main>
        <Component {...pageProps} />
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default function MyApp({ Component, pageProps }) {
  const categories = pageProps.initialCategories || [];

  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <CategoryProvider initialCategories={categories}>
            <Layout Component={Component} pageProps={pageProps} />
          </CategoryProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/public/categories`);
    const categories = await res.json();

    return {
      ...appProps,
      pageProps: {
        ...appProps.pageProps,
        initialCategories: categories,
      },
    };
  } catch (err) {
    console.error("Kategoriler çekilemedi:", err.message);
    return {
      ...appProps,
      pageProps: {
        ...appProps.pageProps,
        initialCategories: [],
      },
    };
  }
};
