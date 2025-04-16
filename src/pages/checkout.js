import { useState } from "react";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Step1_DeliveryForm from "../components/Checkout/Step1_DeliveryForm";
import Step2_PaymentForm from "../components/Checkout/Step2_PaymentForm";
import Step3_Success from "../components/Checkout/Step3_Success";
import OrderSummary from "../components/Checkout/OrderSummary";
import styles from "../styles/CheckoutPage.module.css";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);

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

  const [paymentInfo, setPaymentInfo] = useState({});
  const [deliveryErrors, setDeliveryErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [showAgreementError, setShowAgreementError] = useState(false);

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
    return true; // mock ödeme kontrolü
  };

  const handleMainButtonClick = () => {
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

      if (validatePayment()) {
        setSubmitted(true);
        setStep(3);
      }
    }
  };

  return (
    <div className={styles.checkoutContainer}>

      <CheckoutSteps
        currentStep={step}
        onStepClick={(s) => setStep(s)}
        allowStep2={step >= 2}
      />

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
            />
          )}
          {step === 3 && <Step3_Success />}
        </div>

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
      </div>
    </div>
  );
}
