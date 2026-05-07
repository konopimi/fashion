"use client";
import { proxy, useSnapshot } from "valtio";

const loadCart = () => {
  if (typeof window === "undefined") return { items: [] };
  const stored = localStorage.getItem("cart_items");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        items: parsed.map((item) => ({
          ...item,
          handle: item.handle,
        })),
      };
    } catch {
      return { items: [] };
    }
  }
  return { items: [] };
};

const { items: initialItems } = loadCart();
const cartState = proxy({ items: initialItems });

const persistCart = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart_items", JSON.stringify(cartState.items));
  }
};

export const cartActions = {
  addItem(product, variant, qty = 1) {
    const existing = cartState.items.find(
      (i) => i.handle === product.handle && i.variant === variant,
    );
    if (existing) {
      existing.qty += qty;
    } else {
      cartState.items.push({
        handle: product.handle, // store only the handle
        variant: variant || null,
        price: product.price,
        qty,
      });
    }
    persistCart();
  },
  updateQty(handle, variant, newQty) {
    if (newQty < 1) return;
    const item = cartState.items.find(
      (i) => i.handle === handle && i.variant === variant,
    );
    if (item) {
      item.qty = newQty;
      persistCart();
    }
  },
  removeItem(handle, variant) {
    const index = cartState.items.findIndex(
      (i) => i.handle === handle && i.variant === variant,
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
