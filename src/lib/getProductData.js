import products from './products.json'

export async function getStaticPaths() {
  const paths = products.map((product) => ({
    params: { slug: product.slug }
  }))
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const product = products.find((p) => p.slug === params.slug)

  return {
    props: {
      product
    }
  }
}