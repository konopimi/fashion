"use client";

import { proxy, useSnapshot } from "valtio";

const cartState = proxy({
  items: [],
});

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
  },

  updateQty(id, variant, newQty) {
    if (newQty < 1) return;
    const item = cartState.items.find(
      (i) => i.id === id && i.variant === variant,
    );
    if (item) item.qty = newQty;
  },

  removeItem(id, variant) {
    const index = cartState.items.findIndex(
      (i) => i.id === id && i.variant === variant,
    );
    if (index !== -1) cartState.items.splice(index, 1);
  },

  clearCart() {
    cartState.items = [];
  },
};

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
