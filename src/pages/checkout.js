import Head from "next/head";
import { useState } from "react";
import CheckoutSteps from "../components/checkout-forms/CheckoutSteps";
import Step1_DeliveryForm from "../components/checkout-forms/DeliveryForm";
import Step2_PaymentForm from "../components/checkout-forms/PaymentForm";
import Step3_Success from "../components/checkout-forms/SuccessPayment";
import OrderSummary from "../components/checkout-forms/OrderSummary";
import { useCart } from "../context/CartContext";
import styles from "../styles/CheckoutPage.module.css";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const { cartItems, clearCart } = useCart();

  const [deliveryInfo, setDeliveryInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    country: "Türkiye",
    city: "",
    district: "",
    phone: "",
    address: "",
    note: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const [deliveryErrors, setDeliveryErrors] = useState({});
  const [paymentErrors, setPaymentErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [showAgreementError, setShowAgreementError] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const validateDelivery = () => {
    const newErrors = {};
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!deliveryInfo.email || !emailRegex.test(deliveryInfo.email)) {
      newErrors.email = "Geçerli bir e-posta giriniz";
      isValid = false;
    }

    if (!/^05\d{9}$/.test(deliveryInfo.phone || "")) {
      newErrors.phone = "Geçerli bir telefon numarası giriniz (05xx xxx xx xx)";
      isValid = false;
    }

    const requiredFields = [
      { name: "firstName", label: "Lütfen ad giriniz" },
      { name: "lastName", label: "Lütfen soyad giriniz" },
      { name: "city", label: "Lütfen şehir seçiniz" },
      { name: "district", label: "Lütfen ilçe giriniz" },
      { name: "address", label: "Lütfen adres giriniz" },
    ];

    requiredFields.forEach(({ name, label }) => {
      if (!deliveryInfo[name] || deliveryInfo[name].trim() === "") {
        newErrors[name] = label;
        isValid = false;
      }
    });

    setDeliveryErrors(newErrors);
    return isValid;
  };

  const validatePayment = () => {
    const newErrors = {};
    const rawCard = paymentInfo.cardNumber?.replace(/\s/g, "");

    if (!rawCard || rawCard.length !== 16)
      newErrors.cardNumber = "Kart numarası geçersiz";

    if (!paymentInfo.cardName || paymentInfo.cardName.trim().length < 2)
      newErrors.cardName = "Kart sahibi adı gerekli";

    if (
      !paymentInfo.expiry ||
      paymentInfo.expiry.length !== 5 ||
      !paymentInfo.expiry.includes("/")
    ) {
      newErrors.expiry = "Geçersiz Tarih";
    } else {
      const [monthStr, yearStr] = paymentInfo.expiry.split("/");
      const month = parseInt(monthStr, 10);
      const year = parseInt("20" + yearStr, 10);
      const today = new Date();
      const expDate = new Date(year, month - 1);

      if (
        isNaN(month) ||
        isNaN(year) ||
        month < 1 ||
        month > 12 ||
        expDate < today
      ) {
        newErrors.expiry = "Geçersiz tarih";
      }
    }

    if (
      !paymentInfo.cvv ||
      paymentInfo.cvv.length < 3 ||
      paymentInfo.cvv.length > 4
    )
      newErrors.cvv = "Geçersiz CVV";

    setPaymentErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMainButtonClick = async () => {
    if (step === 1) {
      if (validateDelivery()) {
        setStep(2);
        setShowToast(false);
      }
    } else if (step === 2) {
      if (!isAgreementChecked) {
        setShowAgreementError(true);
        return;
      }

      if (!validatePayment()) return;

      const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            deliveryInfo,
            paymentInfo,
            cartItems,
            total,
          }),
        });

        const data = await res.json();

        if (data.success) {
          setOrderId(data.orderId);
          setSubmitted(true);
          clearCart();
          setStep(3);
        } else {
          console.error("Sipariş oluşturulamadı:", data);
        }
      } catch (err) {
        console.error("Sipariş gönderilirken hata oluştu:", err);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Checkout – Lale Kuruyemiş</title>
        <meta
          name="description"
          content="Teslimat ve ödeme bilgilerinizi girerek siparişinizi tamamlayın."
        />
        <link rel="canonical" href="https://www.lalekuruyemis.com/checkout" />
        <meta property="og:title" content="Checkout – Lale Kuruyemiş" />
        <meta
          property="og:description"
          content="Hızlı ve güvenli ödeme ile siparişinizi tamamlayın."
        />
        <meta
          property="og:url"
          content="https://www.lalekuruyemis.com/checkout"
        />
      </Head>

      {step !== 3 && (
        <CheckoutSteps
          currentStep={step}
          onStepClick={(s) => setStep(s)}
          allowStep2={step >= 2}
        />
      )}

      <div className={styles.checkoutContainer}>
        <div className={styles.checkoutWrapper}>
          <div className={styles.checkoutLeft}>
            {step === 1 && (
              <Step1_DeliveryForm
                formData={deliveryInfo}
                setFormData={setDeliveryInfo}
                errors={deliveryErrors}
                setErrors={setDeliveryErrors}
                showToast={showToast}
              />
            )}
            {step === 2 && (
              <Step2_PaymentForm
                formData={paymentInfo}
                setFormData={setPaymentInfo}
                errors={paymentErrors}
                setErrors={setPaymentErrors}
              />
            )}
            {step === 3 && <Step3_Success orderId={orderId} />}
          </div>

          {step !== 3 && (
            <div className={styles.checkoutRight}>
              <OrderSummary
                step={step}
                onClick={handleMainButtonClick}
                submitted={submitted}
                isAgreementChecked={isAgreementChecked}
                setIsAgreementChecked={setIsAgreementChecked}
                showAgreementError={showAgreementError}
                setShowAgreementError={setShowAgreementError}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
