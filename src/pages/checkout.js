import Head from "next/head";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import CheckoutSteps from "../components/checkout-forms/StepIndicator";
import DeliveryForm from "../components/checkout-forms/DeliveryForm";
import PaymentForm from "../components/checkout-forms/PaymentForm";
import SuccessPayment from "../components/checkout-forms/SuccessPayment";
import OrderSummary from "../components/checkout-forms/OrderSummary";

import { useCart } from "../context/CartContext";
import styles from "../styles/CheckoutPage.module.css";

const step1Schema = Yup.object({
  full_name: Yup.string().required("Ad Soyad zorunlu"),
  phone: Yup.string()
    .matches(/^05\d{9}$/, "05xx xxx xx xx formatında")
    .required("Telefon zorunlu"),
  email: Yup.string().email("Geçersiz email").required("Email zorunlu"),
  city: Yup.string().required("Şehir seçin"),
  district: Yup.string().required("İlçe zorunlu"),
  address: Yup.string().required("Adres zorunlu"),
  note: Yup.string(),
});

const step2Schema = Yup.object({
  cardNumber: Yup.string()
    .matches(/^(\d{4} ){3}\d{4}$/, "XXXX XXXX XXXX XXXX formatında")
    .required("Kart numarası zorunlu"),
  cardName: Yup.string().required("Kart üzerindeki ad zorunlu"),
  expiry: Yup.string()
    .matches(/^\d{2}\/\d{2}$/, "MM/YY formatında girin")
    .required("Tarih zorunlu"),
  cvv: Yup.string()
    .matches(/^\d{3,4}$/, "3 veya 4 haneli CVV girin")
    .required("CVV zorunlu"),
  agreement: Yup.boolean().oneOf(
    [true],
    "Mesafeli satış sözleşmesini onaylamanız gerekiyor"
  ),
});

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState(null);
  const { cartItems, clearCart } = useCart();

  const currentSchema = step === 1 ? step1Schema : step2Schema;

  const methods = useForm({
    resolver: yupResolver(currentSchema),
    mode: "onSubmit",
    shouldUnregister: false,
    defaultValues: {
      full_name: "",
      phone: "",
      email: "",
      city: "",
      district: "",
      address: "",
      note: "",
      cardNumber: "",
      cardName: "",
      expiry: "",
      cvv: "",
      agreement: false,
    },
  });

  const onSubmit = async (data) => {
    if (step === 1) {
      setStep(2);
      return;
    }

    const total = cartItems.reduce(
      (sum, i) => sum + i.finalPrice * i.quantity,
      0
    );

    const bodyData = { ...data, cartItems, total };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    const json = await res.json();
    if (json.success) {
      setOrderId(json.orderId);
      clearCart();
      setStep(3);
    } else {
      console.error("❌ Sipariş hatası:", json);
    }
  };

  return (
    <>
      <Head>
        <title>Checkout – Lale Kuruyemiş</title>
      </Head>

      {step !== 3 && (
        <CheckoutSteps
          currentStep={step}
          onStepClick={(targetStep) => {
            if (targetStep < step) setStep(targetStep);
          }}
          allowStep2={step > 1}
        />
      )}

      <FormProvider {...methods}>
        <form className={styles.checkoutWrapper} noValidate>
          <div className={styles.checkoutLeft}>
            {step === 1 && <DeliveryForm />}
            {step === 2 && <PaymentForm />}
            {step === 3 && <SuccessPayment orderId={orderId} />}
          </div>

          {step < 3 && (
            <div className={styles.checkoutRight}>
              <OrderSummary step={step} />

              {step === 2 && (
                <div className={styles.agreement}>
                  <label className={styles.checkboxWrapper}>
                    <input
                      type="checkbox"
                      {...methods.register("agreement")}
                      className={
                        methods.formState.errors.agreement
                          ? styles.checkboxError
                          : ""
                      }
                    />
                    Mesafeli satış sözleşmesini okudum ve kabul ediyorum.
                  </label>
                  {methods.formState.errors.agreement && (
                    <p className={styles.agreementError}>
                      {methods.formState.errors.agreement.message}
                    </p>
                  )}
                </div>
              )}

              <button
                type="button"
                className={styles.completeButton}
                onClick={methods.handleSubmit(onSubmit)}
              >
                {step === 1 ? "Ödeme Yöntemine Geç" : "Siparişi Tamamla"}
              </button>
            </div>
          )}
        </form>
      </FormProvider>
    </>
  );
}
