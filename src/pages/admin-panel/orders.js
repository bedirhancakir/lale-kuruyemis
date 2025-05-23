// pages/admin-panel/orders.js
import Link from "next/link";
import styles from "../../styles/AdminOrders.module.css";
import { supabase } from "../../lib/supabaseClient";
import withAuth from "../../components/shared/withAuth";
import { FaBoxOpen, FaShippingFast, FaCheckCircle } from "react-icons/fa";

export async function getServerSideProps() {
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Siparişler okunamadı:", error.message);
    return { props: { orders: [] } };
  }

  return { props: { orders } };
}

function AdminOrdersPage({ orders }) {
  const statusList = ["Hazırlanıyor", "Kargoya Verildi", "Teslim Edildi"];
  const icons = {
    Hazırlanıyor: <FaBoxOpen />,
    "Kargoya Verildi": <FaShippingFast />,
    "Teslim Edildi": <FaCheckCircle />,
  };

  const countOrders = (status) =>
    orders.filter((order) => order.status === status).length;

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <h1 className={styles.title}>Siparişler</h1>
        <div className={styles.topRight}>
          <span className={styles.totalCount}>
            Toplam: {orders.length} sipariş
          </span>
          <div className={styles.statusCounts}>
            {statusList.map((status) => (
              <div
                key={status}
                className={`${styles.statusBox} ${
                  styles[status.replace(/\s/g, "")] || ""
                }`}
              >
                {icons[status]} {countOrders(status)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <p>Hiç sipariş bulunamadı.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Müşteri</th>
              <th>Tarih</th>
              <th>Toplam</th>
              <th>Durum</th>
              <th>Detay</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.customer_name}</td>
                <td>
                  {new Date(order.created_at).toLocaleDateString("tr-TR")}
                </td>
                <td>{order.total_amount.toFixed(2)}₺</td>
                <td>
                  <span
                    className={`${styles.badge} ${
                      styles[order.status.replace(/\s/g, "")] || ""
                    }`}
                  >
                    {icons[order.status]} {order.status}
                  </span>
                </td>
                <td>
                  <Link href={`/admin-panel/orders-management/${order.id}`}>
                    <button className={styles.detailButton}>Detay</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default withAuth(AdminOrdersPage, ["admin"]);
