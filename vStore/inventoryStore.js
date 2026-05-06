"use client";

import { proxy, useSnapshot } from "valtio";

// ----- Default data (seed) -----
const defaultProducts = [
  {
    id: "sabina-dress",
    name: "Sabina Dress",
    src: "https://co.silviatcherassi.com/cdn/shop/files/91_SabinaDress_White__PRESPRING2026_FRONT.jpg?v=1771536063&width=1000",
    price: 2100000,
    variants: [],
    collectionId: null,
  },
  {
    id: "rowan-dress",
    name: "Rowan Dress",
    src: "https://co.silviatcherassi.com/cdn/shop/files/89_RowanDress_White__PRESPRING2026_FRONT.jpg?v=1771535925&width=1000",
    price: 2100000,
    variants: [],
    collectionId: null,
  },
  {
    id: "norma-dress",
    name: "Norma Dress",
    src: "https://co.silviatcherassi.com/cdn/shop/files/80___Norma_Dress___Vanilla___PRE_SPRING_2026_FRONT_4b5ba98e-1241-4ad1-a9e1-05181b9a069e.jpg?v=1757978129&width=1000",
    price: 2100000,
    variants: [],
    collectionId: null,
  },
  {
    id: "naga-dress",
    name: "Naga Dress",
    src: "https://co.silviatcherassi.com/cdn/shop/files/55___Naga_Dress___Tangerine___PRE_SPRING_2026_FRONT.jpg?v=1757883456&width=1000",
    price: 2100000,
    variants: [],
    collectionId: null,
  },
  {
    id: "asher-dress",
    name: "Asher Dress",
    src: null,
    price: 2100000,
    variants: [],
    collectionId: null,
  },
];

const defaultCollections = [
  {
    id: "col1",
    name: "Collection 1",
    href: "/collections/collection-1",
    src: "https://co.silviatcherassi.com/cdn/shop/files/1402-3_1.jpg?v=1775769358&width=1500",
  },
  {
    id: "col2",
    name: "Collection 2",
    href: "/collections/collection-2",
    src: "https://co.silviatcherassi.com/cdn/shop/files/2_f3b3831b-f41c-4f32-8a48-d5b3c045bac4.jpg?v=1775754993&width=1500",
  },
  {
    id: "col3",
    name: "Collection 3",
    href: "/collections/collection-3",
    src: "https://co.silviatcherassi.com/cdn/shop/files/SPRING_2026_-_HERO_IMAGES_13_b2600db3-62f4-4632-b8e2-b433de7b77ee.jpg?v=1775489708&width=1500",
  },
  {
    id: "col4",
    name: "Collection 4",
    href: "/collections/collection-4",
    src: "https://co.silviatcherassi.com/cdn/shop/files/SPRING_2026_-_HERO_IMAGES_19_e3e6e248-ee80-432f-a4be-114ceebf414b.jpg?v=1775489710&width=832",
  },
];

// ----- Load persisted data from localStorage (for dynamic updates) -----
const loadData = () => {
  if (typeof window === "undefined")
    return { products: defaultProducts, collections: defaultCollections };
  const storedProducts = localStorage.getItem("inventory_products");
  const storedCollections = localStorage.getItem("inventory_collections");
  return {
    products: storedProducts ? JSON.parse(storedProducts) : defaultProducts,
    collections: storedCollections
      ? JSON.parse(storedCollections)
      : defaultCollections,
  };
};

const { products: initialProducts, collections: initialCollections } =
  loadData();

// ----- Valtio proxy state -----
const store = proxy({
  products: initialProducts,
  collections: initialCollections,
});

// ----- Persist helper (saves to localStorage after each mutation) -----
const persist = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("inventory_products", JSON.stringify(store.products));
    localStorage.setItem(
      "inventory_collections",
      JSON.stringify(store.collections),
    );
  }
};

// ----- Actions (mutate the proxy directly) -----
export const inventoryActions = {
  addProduct(product) {
    store.products.push(product);
    persist();
  },
  updateProduct(id, updates) {
    const product = store.products.find((p) => p.id === id);
    if (product) Object.assign(product, updates);
    persist();
  },
  deleteProduct(id) {
    const index = store.products.findIndex((p) => p.id === id);
    if (index !== -1) store.products.splice(index, 1);
    persist();
  },
  assignCollection(productId, collectionId) {
    const product = store.products.find((p) => p.id === productId);
    if (product) product.collectionId = collectionId || null;
    persist();
  },
  addCollection(collection) {
    store.collections.push(collection);
    persist();
  },
  updateCollection(id, updates) {
    const collection = store.collections.find((c) => c.id === id);
    if (collection) Object.assign(collection, updates);
    persist();
  },
  deleteCollection(id) {
    // Remove reference from all products
    store.products.forEach((p) => {
      if (p.collectionId === id) p.collectionId = null;
    });
    const index = store.collections.findIndex((c) => c.id === id);
    if (index !== -1) store.collections.splice(index, 1);
    persist();
  },
};

// ----- Helper to get a single product (reactive if used inside useSnapshot) -----
export const getItemById = (id) =>
  store.products.find((p) => p.id === id) ?? null;

// ----- Custom hook for React components -----
export function useInventory() {
  const snap = useSnapshot(store);
  return {
    products: snap.products,
    collections: snap.collections,
    ...inventoryActions,
    getItemById: (id) => snap.products.find((p) => p.id === id) ?? null,
  };
}
