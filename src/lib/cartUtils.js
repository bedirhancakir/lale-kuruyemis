const CART_KEY = 'lale_cart'

export function getCart() {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(CART_KEY)
  return stored ? JSON.parse(stored) : []
}

export function getCartCount() {
  const cart = getCart()
  return cart.reduce((sum, item) => sum + item.quantity, 0)
}

export function addToCart(product) {
  const cart = getCart()
  const existing = cart.find(item => item.id === product.id)

  let updated
  if (existing) {
    updated = cart.map(item =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
  } else {
    updated = [...cart, { ...product, quantity: 1 }]
  }

  localStorage.setItem(CART_KEY, JSON.stringify(updated))
}

export function increaseQuantity(id) {
  const cart = getCart()
  const updated = cart.map(item =>
    item.id === id ? { ...item, quantity: item.quantity + 1 } : item
  )
  localStorage.setItem(CART_KEY, JSON.stringify(updated))
}

export function decreaseQuantity(id) {
  const cart = getCart()
  const updated = cart.map(item =>
    item.id === id
      ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
      : item
  )
  localStorage.setItem(CART_KEY, JSON.stringify(updated))
}

export function removeFromCart(id) {
  const cart = getCart()
  const updated = cart.filter(item => item.id !== id)
  localStorage.setItem(CART_KEY, JSON.stringify(updated))
}

export function clearCart() {
  localStorage.removeItem(CART_KEY)
}