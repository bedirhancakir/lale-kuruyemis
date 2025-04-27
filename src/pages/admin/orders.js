import fs from "fs";
import path from "path";
import styles from "../../styles/AdminOrders.module.css";
import Link from "next/link";
import { parse } from "cookie";
import { verify } from "jsonwebtoken";

export async function getServerSideProps({ req }) {
  const { adminToken } = parse(req.headers.cookie || "");
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminToken) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }

  try {
    verify(adminToken, jwtSecret);

    const filePath = path.join(process.cwd(), "data", "orders.json");
    if (!fs.existsSync(filePath)) {
      return { props: { orders: [] } };
    }

    const fileContents = fs.readFileSync(filePath, "utf-8");
    const orders = JSON.parse(fileContents);

    return {
      props: {
        orders: orders.reverse(),
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case "Hazırlanıyor":
      return styles.Hazırlanıyor;
    case "Kargoya Verildi":
      return styles.KargoyaVerildi;
    case "Teslim Edildi":
      return styles.TeslimEdildi;
    default:
      return "";
  }
};

export default function AdminOrdersPage({ orders }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Siparişler</h1>

      <div className={styles.topRow}>
        <div className={styles.topRight}>
          <div className={styles.totalCount}>
            Toplam {orders.length} sipariş
          </div>
          <div className={styles.statusCounts}>
            <div className={`${styles.statusBox} ${styles.Hazırlanıyor}`}>
              {orders.filter((o) => o.status === "Hazırlanıyor").length}
            </div>
            <div className={`${styles.statusBox} ${styles.KargoyaVerildi}`}>
              {orders.filter((o) => o.status === "Kargoya Verildi").length}
            </div>
            <div className={`${styles.statusBox} ${styles.TeslimEdildi}`}>
              {orders.filter((o) => o.status === "Teslim Edildi").length}
            </div>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <p>Hiç sipariş bulunamadı.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Sipariş No</th>
                <th>Müşteri</th>
                <th>Tarih</th>
                <th>Tutar</th>
                <th>Durum</th>
                <th>Detay</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>{order.id}</td>
                  <td>
                    {order.deliveryInfo.firstName}{" "}
                    {order.deliveryInfo.lastName}
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.total.toFixed(2)}₺</td>
                  <td>
                    <span
                      className={`${styles.badge} ${getStatusClass(order.status)}`}
                    >
                      {order.status || "Hazırlanıyor"}
                    </span>
                  </td>
                  <td>
                    <Link href={`/admin/orders/${order.id}`}>
                      <button className={styles.detailButton}>Detay</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
