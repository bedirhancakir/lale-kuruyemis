import styles from "./ProductTabs.module.css";

export default function ProductTabs({ activeTab, setActiveTab, product }) {
  const tabs = [
    { id: "info", label: "Ürün Bilgisi" },
    // Genişletmeye açık yapı
  ];

  return (
    <div className={styles.tabs}>
      <div className={styles.tabHeaders}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${
              activeTab === tab.id ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
            aria-pressed={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {activeTab === "info" && (
          <p>
            {product.detailInfo ||
              "Bu ürün hakkında detaylı bilgi yakında eklenecek."}
          </p>
        )}
      </div>
    </div>
  );
}
