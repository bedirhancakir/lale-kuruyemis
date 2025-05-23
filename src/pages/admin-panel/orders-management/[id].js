import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";
import withAuth from "../../../components/shared/withAuth";
import styles from "../../../styles/orderdetail.module.css";

export async function getServerSideProps({ params }) {
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", params.id)
    .single();

  return { props: { order: order || null } };
}

function AdminOrderDetail({ order }) {
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (order) setStatus(order.status);
  }, [order]);

  if (!order) return <p>Sipariş bulunamadı.</p>;

  const rawTotal = order.items.reduce(
    (sum, item) => sum + (item.finalPrice || item.price) * item.quantity,
    0
  );
  const cargoFee = rawTotal >= 150 ? 0 : 25;
  const total = rawTotal + cargoFee;

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      const res = await fetch("/api/admin/updateStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status: newStatus }),
      });

      if (!res.ok) throw new Error("Durum güncellenemedi.");
      alert("Sipariş durumu güncellendi.");
    } catch (error) {
      alert("Durum güncellenemedi.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>Sipariş Detayı – {order.id}</h1>
        <Link href="/admin-panel/orders">
          <button className={styles.backButton}>← Geri Dön</button>
        </Link>
      </div>

      <div className={styles.orderDate}>
        {new Date(order.created_at).toLocaleDateString("tr-TR")}
      </div>

      <div className={styles.statusBox}>
        <label>Durum Güncelle:</label>
        <select value={status} onChange={handleStatusChange}>
          <option value="Hazırlanıyor">Hazırlanıyor</option>
          <option value="Kargoya Verildi">Kargoya Verildi</option>
          <option value="Teslim Edildi">Teslim Edildi</option>
          <option value="İptal Edildi">İptal Edildi</option>
        </select>
      </div>

      <div className={styles.section}>
        <h2>Müşteri Bilgileri</h2>
        <p>
          <strong>İsim:</strong> {order.customer_name}
        </p>
        <p>
          <strong>Email:</strong> {order.email}
        </p>
        <p>
          <strong>Telefon:</strong> {order.phone}
        </p>
        <p>
          <strong>Adres:</strong> {order.address}, {order.district},{" "}
          {order.city}
        </p>
        {order.note && (
          <p>
            <strong>Not:</strong> {order.note}
          </p>
        )}
      </div>

      <div className={styles.section}>
        <h2>Ürünler</h2>
        <ul className={styles.productList}>
          {order.items.map((item, i) => (
            <li key={`${item.id}-${item.selectedAmount || i}`}>
              <strong>{item.name}</strong>
              {item.displayAmount && (
                <>
                  {" "}
                  – <span>{item.displayAmount}</span>
                </>
              )}
              <br />
              {item.quantity} adet ×{" "}
              {(item.finalPrice || item.price).toFixed(2)}₺ ={" "}
              <strong>
                {((item.finalPrice || item.price) * item.quantity).toFixed(2)}₺
              </strong>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h2>Özet</h2>
        <p>
          <strong>Ara Toplam:</strong> {rawTotal.toFixed(2)}₺
        </p>
        <p>
          <strong>Kargo:</strong> {cargoFee === 0 ? "Ücretsiz" : `${cargoFee}₺`}
        </p>
        <p>
          <strong>Toplam:</strong> {total.toFixed(2)}₺
        </p>
      </div>
    </div>
  );
}

export default withAuth(AdminOrderDetail, ["admin"]);
