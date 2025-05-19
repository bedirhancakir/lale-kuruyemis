import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
const CART_KEY = "cart";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) setCartItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const existing = cartItems.find(
      (item) =>
        item.id === product.id && item.selectedAmount === product.selectedAmount
    );

    const isUnit = product.unitType === "unit";
    const quantityToAdd = isUnit ? product.selectedAmount : 1;

    if (existing) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === product.id &&
          item.selectedAmount === product.selectedAmount
            ? {
                ...item,
                quantity: item.quantity + quantityToAdd,
              }
            : item
        )
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        { ...product, quantity: quantityToAdd },
      ]);
    }
  };

  const removeFromCart = (id, selectedAmount) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.id === id && item.selectedAmount === selectedAmount)
      )
    );
  };

  const updateQuantity = (id, selectedAmount, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.selectedAmount === selectedAmount
          ? { ...item, quantity: Math.max(quantity, 1) }
          : item
      )
    );
  };

  const updateSelection = (id, oldAmount, newAmount, label, newPrice) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.selectedAmount === oldAmount
          ? {
              ...item,
              selectedAmount: newAmount,
              displayAmount: label,
              finalPrice: newPrice,
            }
          : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const cartItemCount = () =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateSelection,
        clearCart,
        cartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
