import { useEffect, useState } from "react";
import styles from "../../styles/AdminBanners.module.css";
import { FiTrash2, FiPlus, FiChevronUp, FiChevronDown } from "react-icons/fi";
import ConfirmPopup from "../../components/admin-panel/ConfirmPopup";
import BannerModal from "../../components/admin-panel/BannerModal";
import Image from "next/image";

export default function BannersManagementPage() {
  const [banners, setBanners] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmPopup, setConfirmPopup] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const res = await fetch("/api/public/banners");
    const data = await res.json();
    setBanners(data);
  };

  const openModal = () => setModalOpen(true);

  const deleteBanner = (id) => {
    setConfirmPopup({
      title: "Banner Sil",
      message: "Bu banner'ı silmek istediğinize emin misiniz?",
      onConfirm: async () => {
        const res = await fetch("/api/admin/banners", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (res.ok) {
          const { banners: updated } = await res.json();
          setBanners(updated);
        }

        setConfirmPopup(null);
      },
    });
  };

  const moveUp = async (index) => {
    if (index === 0) return;
    const updated = [...banners];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    await saveOrder(updated);
  };

  const moveDown = async (index) => {
    if (index === banners.length - 1) return;
    const updated = [...banners];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    await saveOrder(updated);
  };

  async function saveOrder(updatedList) {
    const res = await fetch("/api/admin/banners", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        updatedList.map((b, i) => ({ ...b, order: i + 1 }))
      ),
    });
    if (res.ok) fetchBanners();
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1>Hero Banner Yönetimi</h1>
        <button onClick={openModal} className={styles.createBtn}>
          <FiPlus /> Banner Ekle
        </button>
      </div>

      <div className={styles.grid}>
        {banners.map((banner, i) => (
          <div key={banner.id} className={styles.card}>
            <Image
              src={`/hero-banners/${banner.filename}`}
              alt={banner.title}
              width={400}
              height={200}
              className={styles.image}
            />
            <p>{banner.title}</p>
            <div className={styles.buttons}>
              <button onClick={() => moveUp(i)}><FiChevronUp /></button>
              <span className={styles.order}>{i + 1}</span>
              <button onClick={() => moveDown(i)}><FiChevronDown /></button>
              <button onClick={() => deleteBanner(banner.id)}><FiTrash2 /></button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <BannerModal
          onClose={() => setModalOpen(false)}
          onSave={fetchBanners}
        />
      )}

      {confirmPopup && (
        <ConfirmPopup
          title={confirmPopup.title}
          message={confirmPopup.message}
          onConfirm={confirmPopup.onConfirm}
          onCancel={() => setConfirmPopup(null)}
        />
      )}
    </div>
  );
}
