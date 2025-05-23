import * as Yup from "yup";

export const addressSchema = Yup.object().shape({
  title: Yup.string().required("Adres başlığı zorunludur"),
  full_name: Yup.string()
    .matches(/^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/, "Geçerli bir ad soyad giriniz")
    .required("Ad soyad zorunludur"),
  phone: Yup.string()
    .matches(/^05\d{9}$/, "Telefon formatı geçersiz (05xx xxx xx xx)")
    .required("Telefon zorunludur"),
  city: Yup.string().required("Şehir seçilmelidir"),
  district: Yup.string().required("İlçe zorunludur"),
  address: Yup.string().required("Adres boş bırakılamaz"),
  email: Yup.string()
    .email("Geçerli e-posta giriniz")
    .required("E-posta zorunludur"),
  note: Yup.string().optional(),
});
