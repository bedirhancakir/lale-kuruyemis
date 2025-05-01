import { useState, useEffect } from "react";
import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import styles from "../../../styles/orderdetail.module.css";

export async function getServerSideProps(ctx) {
  const { id } = ctx.params;
  const filePath = path.join(process.cwd(), "data", "orders.json");

  try {
    const data = await fs.readFile(filePath, "utf-8");
    const orders = JSON.parse(data);
    const order = orders.find((o) => o.id === id) || null;

    return { props: { order } };
  } catch (error) {
    console.error("Sipariş bulunamadı:", error.message);
    return { props: { order: null } };
  }
}

export default function AdminOrderDetail({ order }) {
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  if (!order) return <p>Sipariş bulunamadı.</p>;

  const cargoFee = order.total >= 150 ? 0 : 25;
  const rawTotal = order.total - cargoFee;

  async function handleStatusChange(e) {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      const res = await fetch("/api/admin/updateStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status: newStatus }),
      });

      if (!res.ok) throw new Error("Durum güncellenemedi");
      alert("Sipariş durumu başarıyla güncellendi!");
    } catch (error) {
      console.error("Güncelleme hatası:", error.message);
      alert("Hata oluştu!");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>Sipariş Detayı - {order.id}</h1>
        <Link href="/admin-panel/orders">
          <button className={styles.backButton}>← Geri Dön</button>
        </Link>
      </div>

      <div className={styles.orderDate}>
        {new Date(order.createdAt).toLocaleDateString()}
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
          <strong>İsim:</strong> {order.deliveryInfo.firstName}{" "}
          {order.deliveryInfo.lastName}
        </p>
        <p>
          <strong>Email:</strong> {order.deliveryInfo.email}
        </p>
        <p>
          <strong>Telefon:</strong> {order.deliveryInfo.phone}
        </p>
        <p>
          <strong>Adres:</strong> {order.deliveryInfo.address},{" "}
          {order.deliveryInfo.district}, {order.deliveryInfo.city}
        </p>
      </div>

      <div className={styles.section}>
        <h2>Ürünler</h2>
        <ul className={styles.productList}>
          {order.cartItems.map((item) => (
            <li key={item.id}>
              {item.name} × {item.quantity} ={" "}
              {(item.price * item.quantity).toFixed(2)}₺
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
          <strong>Toplam:</strong> {order.total.toFixed(2)}₺
        </p>
      </div>
    </div>
  );
}
