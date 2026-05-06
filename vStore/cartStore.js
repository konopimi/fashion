"use client";

import { proxy, useSnapshot } from "valtio";

// ----- Load initial cart from localStorage -----
const loadCart = () => {
  if (typeof window === "undefined") return { items: [] };
  const stored = localStorage.getItem("cart_items");
  if (stored) {
    try {
      return { items: JSON.parse(stored) };
    } catch {
      return { items: [] };
    }
  }
  return { items: [] };
};

const { items: initialItems } = loadCart();

// ----- Valtio proxy -----
const cartState = proxy({
  items: initialItems,
});

// ----- Persist helper (saves after each mutation) -----
const persistCart = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart_items", JSON.stringify(cartState.items));
  }
};

// ----- Actions (mutate proxy + persist) -----
export const cartActions = {
  addItem(product, variant, qty = 1) {
    const existing = cartState.items.find(
      (i) => i.id === product.id && i.variant === variant,
    );
    if (existing) {
      existing.qty += qty;
    } else {
      cartState.items.push({
        id: product.id,
        variant: variant || null,
        price: product.price,
        qty,
      });
    }
    persistCart();
  },

  updateQty(id, variant, newQty) {
    if (newQty < 1) return;
    const item = cartState.items.find(
      (i) => i.id === id && i.variant === variant,
    );
    if (item) {
      item.qty = newQty;
      persistCart();
    }
  },

  removeItem(id, variant) {
    const index = cartState.items.findIndex(
      (i) => i.id === id && i.variant === variant,
    );
    if (index !== -1) {
      cartState.items.splice(index, 1);
      persistCart();
    }
  },

  clearCart() {
    cartState.items = [];
    persistCart();
  },
};

// ----- Custom hook for React -----
export function useCart() {
  const snap = useSnapshot(cartState);
  const count = snap.items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = snap.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  return {
    items: snap.items,
    count,
    subtotal,
    addItem: cartActions.addItem,
    updateQty: cartActions.updateQty,
    removeItem: cartActions.removeItem,
    clearCart: cartActions.clearCart,
  };
}
