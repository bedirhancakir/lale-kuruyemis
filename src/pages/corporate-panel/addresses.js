import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import withAuth from "../../components/shared/withAuth";
import { supabase } from "../../lib/supabaseClient";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addressSchema } from "../../lib/schemas/addressSchema";
import styles from "../../styles/AddressesPage.module.css";

function AddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addressSchema),
    defaultValues: {
      title: "",
      full_name: "",
      phone: "",
      city: "",
      district: "",
      address: "",
      email: user?.email || "",
      note: "",
    },
  });

  useEffect(() => {
    if (user?.id) fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    setAddresses(data || []);
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    setMessage("");

    if (editingId) {
      const { error } = await supabase
        .from("addresses")
        .update(formData)
        .eq("id", editingId);

      if (!error) {
        setMessage("Adres güncellendi.");
        setEditingId(null);
        reset();
      } else {
        setMessage("Güncelleme başarısız.");
      }
    } else {
      if (addresses.length >= 3) {
        setMessage("En fazla 3 adres ekleyebilirsiniz.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.from("addresses").insert({
        ...formData,
        user_id: user.id,
      });

      if (!error) {
        setMessage("Adres başarıyla eklendi.");
        reset();
      } else {
        setMessage("Ekleme başarısız.");
      }
    }

    fetchAddresses();
    setLoading(false);
  };

  const handleEdit = (addr) => {
    reset(addr);
    setEditingId(addr.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu adresi silmek istediğinize emin misiniz?")) return;
    await supabase.from("addresses").delete().eq("id", id);
    fetchAddresses();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Adreslerim</h2>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <input
          {...register("title")}
          placeholder="Adres Başlığı"
          className={`${styles.input} ${errors.title ? styles.errorInput : ""}`}
        />
        {errors.title && (
          <p className={styles.errorText}>{errors.title.message}</p>
        )}

        <input
          {...register("full_name")}
          placeholder="Ad Soyad"
          className={`${styles.input} ${
            errors.full_name ? styles.errorInput : ""
          }`}
        />
        {errors.full_name && (
          <p className={styles.errorText}>{errors.full_name.message}</p>
        )}

        <input
          {...register("phone")}
          placeholder="Telefon"
          className={`${styles.input} ${errors.phone ? styles.errorInput : ""}`}
        />
        {errors.phone && (
          <p className={styles.errorText}>{errors.phone.message}</p>
        )}

        <input
          {...register("city")}
          placeholder="Şehir"
          className={`${styles.input} ${errors.city ? styles.errorInput : ""}`}
        />
        {errors.city && (
          <p className={styles.errorText}>{errors.city.message}</p>
        )}

        <input
          {...register("district")}
          placeholder="İlçe"
          className={`${styles.input} ${
            errors.district ? styles.errorInput : ""
          }`}
        />
        {errors.district && (
          <p className={styles.errorText}>{errors.district.message}</p>
        )}

        <textarea
          {...register("address")}
          rows={3}
          placeholder="Açık Adres"
          className={`${styles.textarea} ${
            errors.address ? styles.errorInput : ""
          }`}
        />
        {errors.address && (
          <p className={styles.errorText}>{errors.address.message}</p>
        )}

        <button type="submit" disabled={loading} className={styles.button}>
          {editingId ? "Adresi Güncelle" : "Yeni Adres Ekle"}
        </button>
      </form>

      {message && <p>{message}</p>}

      <h3>Kayıtlı Adresler Kurumsal({addresses.length}/3)</h3>
      {addresses.map((addr) => (
        <div key={addr.id} className={styles.card}>
          <p className={styles.cardTitle}>{addr.title}</p>
          <p>{addr.full_name}</p>
          <p>{addr.phone}</p>
          <p>
            {addr.city} / {addr.district}
          </p>
          <p>{addr.address}</p>
          <div className={styles.actions}>
            <button onClick={() => handleEdit(addr)} className={styles.editBtn}>
              Düzenle
            </button>
            <button
              onClick={() => handleDelete(addr.id)}
              className={styles.deleteBtn}
            >
              Sil
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default withAuth(AddressesPage, ["kurumsal"]);
