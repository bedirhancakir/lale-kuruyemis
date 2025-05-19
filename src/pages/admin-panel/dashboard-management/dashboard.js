import fs from "fs/promises";
import path from "path";
import styles from "../../../styles/AdminDashboard.module.css";
import {
  FaShoppingCart,
  FaMoneyBillWave,
  FaBoxOpen,
  FaArchive,
  FaCalendarDay,
  FaCalendarWeek,
  FaHourglassHalf,
  FaFire,
  FaReceipt,
  FaChartBar,
} from "react-icons/fa";

export async function getServerSideProps() {
  const ordersPath = path.join(process.cwd(), "data", "orders.json");
  const productsPath = path.join(process.cwd(), "data", "products.json");

  let orders = [];
  let products = [];

  try {
    const oData = await fs.readFile(ordersPath, "utf-8");
    orders = JSON.parse(oData);
  } catch (error) {
    console.error("orders.json okunamadı:", error.message);
  }

  try {
    const pData = await fs.readFile(productsPath, "utf-8");
    products = JSON.parse(pData);
  } catch (error) {
    console.error("products.json okunamadı:", error.message);
  }

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0).toFixed(2);
  const activeProducts = products.filter((p) => p.status === "aktif").length;
  const archivedProducts = products.filter(
    (p) => p.status === "arşivli"
  ).length;

  const today = new Date().toDateString();
  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today
  ).length;

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const weekOrders = orders.filter(
    (o) => new Date(o.createdAt) >= weekAgo
  ).length;

  const pendingOrders = orders.filter(
    (o) => o.status !== "Teslim Edildi"
  ).length;

  const productSales = {};
  orders.forEach((order) => {
    order.cartItems.forEach((item) => {
      if (!productSales[item.id]) {
        productSales[item.id] = { name: item.name, count: 0 };
      }
      productSales[item.id].count += item.quantity;
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const recentOrders = orders.slice(-5).reverse();

  return {
    props: {
      totalOrders,
      totalRevenue,
      activeProducts,
      archivedProducts,
      todayOrders,
      weekOrders,
      pendingOrders,
      topProducts,
      recentOrders,
    },
  };
}

export default function AdminDashboard(props) {
  const {
    totalOrders,
    totalRevenue,
    activeProducts,
    archivedProducts,
    todayOrders,
    weekOrders,
    pendingOrders,
    topProducts,
    recentOrders,
  } = props;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <FaChartBar /> Admin Panel – Dashboard
      </h1>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>
            <FaShoppingCart /> Toplam Sipariş
          </h3>
          <p>{totalOrders}</p>
        </div>
        <div className={styles.statCard}>
          <h3>
            <FaMoneyBillWave /> Toplam Gelir
          </h3>
          <p>{totalRevenue}₺</p>
        </div>
        <div className={styles.statCard}>
          <h3>
            <FaBoxOpen /> Aktif Ürün
          </h3>
          <p>{activeProducts}</p>
        </div>
        <div className={styles.statCard}>
          <h3>
            <FaArchive /> Arşivli Ürün
          </h3>
          <p>{archivedProducts}</p>
        </div>
        <div className={styles.statCard}>
          <h3>
            <FaCalendarDay /> Bugünkü Sipariş
          </h3>
          <p>{todayOrders}</p>
        </div>
        <div className={styles.statCard}>
          <h3>
            <FaCalendarWeek /> 7 Günde Sipariş
          </h3>
          <p>{weekOrders}</p>
        </div>
        <div className={styles.statCard}>
          <h3>
            <FaHourglassHalf /> Teslim Bekleyen
          </h3>
          <p>{pendingOrders}</p>
        </div>

        <div className={styles.statCard} style={{ flexBasis: "100%" }}>
          <h3>
            <FaFire /> En Çok Satılan Ürünler
          </h3>
          <ul className={styles.miniList}>
            {topProducts.map((product, index) => (
              <li key={index}>
                {product.name} – <strong>{product.count} adet</strong>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.statCard} style={{ flexBasis: "100%" }}>
          <h3>
            <FaReceipt /> Son 5 Sipariş
          </h3>
          <ul className={styles.miniList}>
            {recentOrders.map((o) => (
              <li key={o.id}>
                <strong>
                  {o.deliveryInfo.firstName} {o.deliveryInfo.lastName}
                </strong>{" "}
                – {new Date(o.createdAt).toLocaleDateString()} –{" "}
                {o.total.toFixed(2)}₺ – {o.status}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
