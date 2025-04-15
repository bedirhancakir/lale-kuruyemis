const FAVORITES_KEY = 'lale_favorites'

export function getFavorites() {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(FAVORITES_KEY)
  return stored ? JSON.parse(stored) : []
}

export function toggleFavorite(product) {
  const current = getFavorites()
  const exists = current.find(item => item.id === product.id)

  let updated
  if (exists) {
    updated = current.filter(item => item.id !== product.id)
  } else {
    updated = [...current, product]
  }

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
}

export function isFavorite(productId) {
  const favorites = getFavorites()
  return favorites.some(item => item.id === productId)
}
