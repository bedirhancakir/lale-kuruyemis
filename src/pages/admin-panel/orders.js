import Link from "next/link";
import styles from "../../styles/AdminOrders.module.css";
import fs from "fs/promises";
import path from "path";

export async function getServerSideProps() {
  const filePath = path.join(process.cwd(), "data", "orders.json");

  try {
    const data = await fs.readFile(filePath, "utf-8");
    const orders = JSON.parse(data);
    return { props: { orders: orders.reverse() } };
  } catch (error) {
    console.error("Siparişler okunamadı:", error.message);
    return { props: { orders: [] } };
  }
}

export default function AdminOrdersPage({ orders }) {
  const statusList = ["Hazırlanıyor", "Kargoya Verildi", "Teslim Edildi"];

  function countOrders(status) {
    return orders.filter((order) => order.status === status).length;
  }

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
                  styles[status.replace(/\s/g, "")]
                }`}
              >
                {countOrders(status)}
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
                <td>
                  {order.deliveryInfo.firstName} {order.deliveryInfo.lastName}
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.total.toFixed(2)}₺</td>
                <td>
                  <span
                    className={`${styles.badge} ${
                      styles[order.status.replace(/\s/g, "")]
                    }`}
                  >
                    {order.status}
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
