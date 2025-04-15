import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <h1>404 – Sayfa Bulunamadı</h1>
      <p>Üzgünüz, aradığınız sayfa mevcut değil.</p>
      <p>
        <Link href="/">Anasayfaya Dön</Link>
      </p>
    </div>
  )
}
