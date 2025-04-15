// app.js aslında root yapısını kolay yönetilebilir hale getirmek için kullanılır
import '../styles/global.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  )
}
