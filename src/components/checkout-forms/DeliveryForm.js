import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import styles from "../../styles/CheckoutPage.module.css";

export default function DeliveryForm() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .then(({ data }) => setAddresses(data || []));
  }, [user]);

  const pick = (a) => {
    setValue("full_name", a.full_name);
    setValue("phone", a.phone);
    setValue("email", a.email);
    setValue("city", a.city);
    setValue("district", a.district);
    setValue("address", a.address);
    setValue("note", a.note || "");
  };

  return (
    <div className={styles.deliveryForm}>
      <h2 className={styles.stepTitle}>Teslimat Bilgileri</h2>

      {addresses.length > 0 && (
        <div className={styles.savedAddresses}>
          <strong>Kayıtlı Adresler:</strong>
          <select
            className={styles.addressDropdown}
            onChange={(e) => {
              const selectedAddress = addresses.find(
                (a) => a.id === e.target.value
              );
              if (selectedAddress) pick(selectedAddress);
            }}
          >
            <option value="">Adres Seçin</option>
            {addresses.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={styles.grid}>
        {[
          ["full_name", "Ad Soyad"],
          ["phone", "Telefon"],
          ["email", "E-posta"],
          ["city", "Şehir"],
          ["district", "İlçe"],
        ].map(([name, label]) => (
          <div key={name} className={styles.formGroup}>
            <label>{label}</label>
            <input
              {...register(name)}
              className={`${styles.checkoutInput} ${
                errors[name] ? styles.errorInput : ""
              }`}
            />
            {errors[name] && (
              <p className={styles.errorText}>{errors[name].message}</p>
            )}
          </div>
        ))}

        <div className={`${styles.formGroup} ${styles.fullRow}`}>
          <label>Adres</label>
          <textarea
            rows={3}
            {...register("address")}
            className={`${styles.checkoutTextarea} ${
              errors.address ? styles.errorInput : ""
            }`}
          />
          {errors.address && (
            <p className={styles.errorText}>{errors.address.message}</p>
          )}
        </div>

        <div className={`${styles.formGroup} ${styles.fullRow}`}>
          <label>Sipariş Notu (isteğe bağlı)</label>
          <textarea
            rows={2}
            {...register("note")}
            className={styles.checkoutTextarea}
          />
        </div>
      </div>
    </div>
  );
}
