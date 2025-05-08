import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./CategoryGrid.module.css";

const categoryData = [
  // 1. sıra: 4 küçük kutu
  {
    id: 1,
    title: "Kuruyemiş",
    slug: "kuruyemis",
    size: "small",
    image: "placeholder.jpg",
  },
  {
    id: 2,
    title: "Kuruyemiş",
    slug: "kuruyemis",
    size: "small",
    image: "placeholder.jpg",
  },
  {
    id: 3,
    title: "Baharat",
    slug: "baharat",
    size: "small",
    image: "placeholder.jpg",
  },
  {
    id: 4,
    title: "Kuru Meyve",
    slug: "kuru-meyve",
    size: "small",
    image: "placeholder.jpg",
  },

  // 2. sıra: 2 orta kutu
  {
    id: 5,
    title: "Şekerleme",
    slug: "sekerleme",
    size: "large",
    image: "placeholder.jpg",
  },
  {
    id: 6,
    title: "Karışık Paketler",
    slug: "karisik-paketler",
    size: "large",
    image: "placeholder.jpg",
  },

  // 3. sıra: 3 kutu
  {
    id: 7,
    title: "Yeni Ürünler",
    slug: "yeni-urunler",
    size: "medium",
    image: "placeholder.jpg",
  },
  {
    id: 8,
    title: "İndirimli",
    slug: "indirimli",
    size: "medium",
    image: "placeholder.jpg",
  },
  {
    id: 9,
    title: "Çok Satanlar",
    slug: "cok-satanlar",
    size: "medium",
    image: "placeholder.jpg",
  },
];

export default function CategoryGrid() {
  const router = useRouter();

  const handleClick = (slug) => {
    router.push(`/products/${slug}`);
  };

  return (
    <section className={styles.wrapper}>
      {categoryData.map((item) => (
        <div
          key={item.id}
          className={`${styles.card} ${styles[item.size]}`}
          onClick={() => handleClick(item.slug)}
        >
          <Image
            src={`/category-grid-images/${item.image}`}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={styles.image}
          />

          <span className={styles.title}>{item.title}</span>
        </div>
      ))}
    </section>
  );
}
