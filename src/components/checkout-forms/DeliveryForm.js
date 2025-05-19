import styles from "../../styles/CheckoutPage.module.css";
import { cities } from "../../lib/cities";

export default function DeliveryForm({
  formData,
  setFormData,
  errors,
  setErrors,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const fields = [
    { name: "firstName", label: "Ad*" },
    { name: "lastName", label: "Soyad*" },
    { name: "country", label: "Ülke*", type: "select" },
    { name: "city", label: "Şehir*", type: "select-dynamic" },
    { name: "district", label: "İlçe*" },
    { name: "phone", label: "Telefon*", placeholder: "05xx xxx xx xx" },
    { name: "address", label: "Adres*", type: "textarea" },
  ];

  return (
    <form className={styles.deliveryForm}>
      <h2 className={styles.stepTitle}>1. Adım: Teslimat Bilgileri</h2>

      <div className={styles.formGroup}>
        <label
          htmlFor="email"
          className={errors.email ? styles.errorLabel : ""}
        >
          E-Posta*
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="mail@ornek.com"
          className={`${styles.checkoutInput} ${
            errors.email ? styles.errorInput : ""
          }`}
          autoComplete="email"
        />
        {errors.email && <div className={styles.errorText}>{errors.email}</div>}
      </div>

      {fields.map(({ name, label, type, placeholder }) => (
        <div key={name} className={styles.formGroup}>
          <label
            htmlFor={name}
            className={errors[name] ? styles.errorLabel : ""}
          >
            {label}
          </label>

          {type === "select" && name === "country" ? (
            <select
              name="country"
              value={formData.country}
              disabled
              className={`${styles.checkoutSelect} ${
                errors[name] ? styles.errorInput : ""
              }`}
            >
              <option value="Türkiye">Türkiye</option>
            </select>
          ) : type === "select-dynamic" && name === "city" ? (
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`${styles.checkoutSelect} ${
                errors[name] ? styles.errorInput : ""
              }`}
            >
              <option value="">Şehir seçiniz</option>
              {cities.map((city, i) => (
                <option key={i} value={city}>
                  {city}
                </option>
              ))}
            </select>
          ) : type === "textarea" ? (
            <textarea
              name={name}
              value={formData[name]}
              onChange={handleChange}
              rows={3}
              className={`${styles.checkoutTextarea} ${
                errors[name] ? styles.errorInput : ""
              }`}
            />
          ) : (
            <input
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder || ""}
              className={`${styles.checkoutInput} ${
                errors[name] ? styles.errorInput : ""
              }`}
              autoComplete="off"
            />
          )}

          {errors[name] && (
            <div className={styles.errorText}>{errors[name]}</div>
          )}
        </div>
      ))}

      <div className={styles.formGroup}>
        <label htmlFor="note">Sipariş Notu</label>
        <textarea
          name="note"
          value={formData.note}
          onChange={handleChange}
          rows={2}
          className={styles.checkoutTextarea}
        />
      </div>
    </form>
  );
}
