import { useState, useEffect } from "react";
import styles from "../../../styles/OrderDetail.module.css";
import Link from "next/link";

export default function OrderDetailPage({ order }) {
  const [status, setStatus] = useState("Hazırlanıyor");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (order?.status) {
      setStatus(order.status);
    }
  }, [order]);

  if (!order) return <p>Sipariş bulunamadı</p>;

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setSaving(true);

    const res = await fetch("/api/orders/updateStatus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, status: newStatus }),
    });

    if (!res.ok) {
      alert("Durum güncellenemedi!");
    }

    setSaving(false);
  };

  const {
    id,
    createdAt,
    deliveryInfo,
    paymentInfo = {}, // Eğer paymentInfo varsa, yoksa boş bir nesne al
    cartItems,
    total,
  } = order;

  const cargoFee = total >= 150 ? 0 : 25;
  const rawTotal = total - cargoFee;

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <Link href="/admin/orders">
          <button className={styles.backButton}>← Sipariş Listesine Dön</button>
        </Link>
        <p className={styles.orderDate}>
          <strong>Tarih:</strong> {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>

      <h1 className={styles.title}>Sipariş Detayı: {id}</h1>

      <div className={styles.statusBox}>
        <label htmlFor="status"><strong>Durum:</strong></label>
        <select
          id="status"
          value={status}
          onChange={handleStatusChange}
          disabled={saving}
        >
          <option value="Hazırlanıyor">Hazırlanıyor</option>
          <option value="Kargoya Verildi">Kargoya Verildi</option>
          <option value="Teslim Edildi">Teslim Edildi</option>
        </select>
      </div>

      <section className={styles.section}>
        <h2>Müşteri Bilgileri</h2>
        <p><strong>Ad Soyad:</strong> {deliveryInfo.firstName} {deliveryInfo.lastName}</p>
        <p><strong>E-posta:</strong> {deliveryInfo.email}</p>
        <p><strong>Telefon:</strong> {deliveryInfo.phone}</p>
        <p><strong>Adres:</strong> {deliveryInfo.address}, {deliveryInfo.district}, {deliveryInfo.city}</p>
      </section>

      {/* Ödeme bilgilerini alırken null kontrolü ekledik */}
      <section className={styles.section}>
        <h2>Ödeme Bilgileri</h2>
        <p><strong>Kart Sahibi:</strong> {paymentInfo?.cardName || "Bilgi Yok"}</p>
        <p><strong>Kart No:</strong> **** **** **** {paymentInfo?.cardNumber?.slice(-4) || "XXXX"}</p>
        <p><strong>Son Kullanma:</strong> {paymentInfo?.expiry || "Bilgi Yok"}</p>
      </section>

      <section className={styles.section}>
        <h2>Ürünler</h2>
        <ul className={styles.productList}>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} – {item.quantity} × {item.price}₺ = {(item.quantity * item.price).toFixed(2)}₺
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Özet</h2>
        <p><strong>Ara Toplam:</strong> {rawTotal.toFixed(2)}₺</p>
        <p><strong>Kargo:</strong> {cargoFee === 0 ? "Ücretsiz" : `${cargoFee}₺`}</p>
        <p><strong>Toplam Tutar:</strong> {total.toFixed(2)}₺</p>
      </section>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  const fs = await import("fs/promises");
  const path = (await import("path")).default;
  const filePath = path.join(process.cwd(), "data", "orders.json");
  const file = await fs.readFile(filePath, "utf-8");
  const orders = JSON.parse(file);
  const order = orders.find((o) => o.id === id) || null;

  return {
    props: {
      order,
    },
  };
}
