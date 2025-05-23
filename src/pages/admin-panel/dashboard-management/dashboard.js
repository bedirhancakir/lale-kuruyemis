import { supabase } from "../../../lib/supabaseClient";
import styles from "../../../styles/AdminDashboard.module.css";
import withAuth from "../../../components/shared/withAuth";
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
  const { data: orders = [], error: orderError } = await supabase
    .from("orders")
    .select("id, created_at, total_amount, status, items, customer_name");

  const { data: products = [], error: productError } = await supabase
    .from("products")
    .select("id, name, status");

  if (orderError || productError) {
    console.error(
      "Sipariş veya ürün verisi çekilemedi:",
      orderError,
      productError
    );
    return {
      props: {
        totalOrders: 0,
        totalRevenue: 0,
        activeProducts: 0,
        archivedProducts: 0,
        todayOrders: 0,
        weekOrders: 0,
        pendingOrders: 0,
        topProducts: [],
        recentOrders: [],
      },
    };
  }

  const totalOrders = orders.length;
  const totalRevenue = orders
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
    .toFixed(2);
  const activeProducts = products.filter((p) => p.status === "aktif").length;
  const archivedProducts = products.filter(
    (p) => p.status === "arşivli"
  ).length;

  const today = new Date().toDateString();
  const todayOrders = orders.filter(
    (o) => new Date(o.created_at).toDateString() === today
  ).length;

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const weekOrders = orders.filter(
    (o) => new Date(o.created_at) >= weekAgo
  ).length;

  const pendingOrders = orders.filter(
    (o) => o.status !== "Teslim Edildi"
  ).length;

  const productSales = {};
  orders.forEach((order) => {
    order.items?.forEach((item) => {
      if (!productSales[item.id]) {
        productSales[item.id] = { name: item.name, count: 0 };
      }
      productSales[item.id].count += item.quantity;
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const recentOrders = orders
    .slice(-5)
    .reverse()
    .map((o) => ({
      id: o.id,
      date: o.created_at,
      total: o.total_amount,
      status: o.status,
      name: o.customer_name,
    }));

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

function AdminDashboard({
  totalOrders,
  totalRevenue,
  activeProducts,
  archivedProducts,
  todayOrders,
  weekOrders,
  pendingOrders,
  topProducts,
  recentOrders,
}) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <FaChartBar /> Admin Panel – Dashboard
      </h1>

      <div className={styles.statsGrid}>
        <StatCard
          icon={<FaShoppingCart />}
          label="Toplam Sipariş"
          value={totalOrders}
        />
        <StatCard
          icon={<FaMoneyBillWave />}
          label="Toplam Gelir"
          value={`${totalRevenue}₺`}
        />
        <StatCard
          icon={<FaBoxOpen />}
          label="Aktif Ürün"
          value={activeProducts}
        />
        <StatCard
          icon={<FaArchive />}
          label="Arşivli Ürün"
          value={archivedProducts}
        />
        <StatCard
          icon={<FaCalendarDay />}
          label="Bugünkü Sipariş"
          value={todayOrders}
        />
        <StatCard
          icon={<FaCalendarWeek />}
          label="7 Günde Sipariş"
          value={weekOrders}
        />
        <StatCard
          icon={<FaHourglassHalf />}
          label="Teslim Bekleyen"
          value={pendingOrders}
        />

        <div className={styles.statCard} style={{ flexBasis: "100%" }}>
          <h3>
            <FaFire /> En Çok Satılan Ürünler
          </h3>
          <ul className={styles.miniList}>
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <li key={index}>
                  {product.name} – <strong>{product.count} adet</strong>
                </li>
              ))
            ) : (
              <li>Veri bulunamadı</li>
            )}
          </ul>
        </div>

        <div className={styles.statCard} style={{ flexBasis: "100%" }}>
          <h3>
            <FaReceipt /> Son 5 Sipariş
          </h3>
          <ul className={styles.miniList}>
            {recentOrders.length > 0 ? (
              recentOrders.map((o) => (
                <li key={o.id}>
                  <strong>{o.name}</strong> –{" "}
                  {new Date(o.date).toLocaleDateString()} –{" "}
                  {Number(o.total).toFixed(2)}₺ – {o.status}
                </li>
              ))
            ) : (
              <li>Hiç sipariş bulunamadı</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className={styles.statCard}>
      <h3>
        {icon} {label}
      </h3>
      <p>{value}</p>
    </div>
  );
}

export default withAuth(AdminDashboard, ["admin"]);
