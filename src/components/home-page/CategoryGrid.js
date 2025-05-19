import Image from "next/image";
import Link from "next/link";
import styles from "./CategoryGrid.module.css";

const categoryData = [
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
  return (
    <section className={styles.wrapper} aria-label="Kategori Görselleri">
      {categoryData.map((item) => (
        <Link
          key={item.id}
          href={`/products/${item.slug}`}
          className={`${styles.card} ${styles[item.size]}`}
          aria-label={`${item.title} kategorisine git`}
        >
          <Image
            src={`/category-grid-images/${item.image}`}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={styles.image}
            placeholder="blur"
            blurDataURL="/images/placeholder.jpg"
          />
          <span className={styles.title}>{item.title}</span>
        </Link>
      ))}
    </section>
  );
}
