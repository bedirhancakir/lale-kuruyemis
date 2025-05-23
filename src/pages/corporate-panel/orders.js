import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import withAuth from "../../components/shared/withAuth";
import { supabase } from "../../lib/supabaseClient";
import Image from "next/image";

function CorporateOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("email", user.email)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Siparişler alınamadı:", error.message);
    } else {
      setOrders(data);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
      <h2>Kurumsal Siparişlerim</h2>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : orders.length === 0 ? (
        <p>Henüz hiç siparişiniz yok.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <p>
              <strong>Sipariş Tarihi:</strong>{" "}
              {new Date(order.created_at).toLocaleDateString()}
            </p>
            <p>
              <strong>Toplam Tutar:</strong> {order.total_amount.toFixed(2)} ₺
            </p>
            <p>
              <strong>Durum:</strong> {order.status}
            </p>
            <p>
              <strong>Ürünler:</strong>
            </p>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {order.items.map((item, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "0.8rem",
                  }}
                >
                  <Image
                    src={item.image || "/images/placeholder.jpg"}
                    alt={item.name}
                    width={60}
                    height={60}
                    style={{ borderRadius: "6px", objectFit: "cover" }}
                  />
                  <div>
                    <p style={{ margin: 0, fontWeight: 500 }}>{item.name}</p>
                    <p style={{ margin: 0, fontSize: "0.9rem" }}>
                      {item.quantity} {item.unit === "gram" ? "gr" : "adet"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default withAuth(CorporateOrdersPage, ["kurumsal"]);
