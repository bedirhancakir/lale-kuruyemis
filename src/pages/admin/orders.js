import fs from "fs";
import path from "path";
import styles from "../../styles/AdminOrders.module.css";
import Link from "next/link";
import { useState } from "react";

export async function getServerSideProps() {
  const filePath = path.join(process.cwd(), "data", "orders.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const orders = JSON.parse(fileContents);
  return {
    props: {
      orders: orders.reverse(),
    },
  };
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Sayfalama işlemi
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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

      {paginatedOrders.length === 0 ? (
        <p>Hiç sipariş bulunamadı.</p>
      ) : (
        <>
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
              {paginatedOrders.map((order, index) => (
                <tr key={order.id}>
                  <td>{startIndex + index + 1}</td>
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
        </>
      )}

      <div className={styles.pagination}>
        {/* Sayfalama butonları kaldırılmadı */}
      </div>
    </div>
  );
}
