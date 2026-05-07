// vStore/CORE/assets.js (final)
import { proxy, useSnapshot, snapshot } from "valtio";
import axios from "axios";

const state = proxy({
  products: [],
  collections: [],
  loading: false,
  error: null,
});

// Fetch helpers (use generic CORE endpoint)
async function fetchProducts() {
  const { data } = await axios.get("/api/CORE/products");
  return data.response ?? data;
}
async function fetchCollections() {
  const { data } = await axios.get("/api/CORE/collections");
  return data.response ?? data;
}

export async function initAssets() {
  if (state.loading) return;
  state.loading = true;
  state.error = null;
  try {
    const [products, collections] = await Promise.all([
      fetchProducts(),
      fetchCollections(),
    ]);
    state.products = products;
    state.collections = collections;
  } catch (err) {
    state.error = err.message;
    console.error("Failed to load assets:", err);
  } finally {
    state.loading = false;
  }
}

// Generic CRUD (unchanged from earlier)
export async function addAsset(collection, data) {
  try {
    const res = await axios.post(`/api/CORE/${collection}`, data);
    const newDoc = res.data.asset ?? res.data;
    state[collection].push(newDoc);
    return newDoc;
  } catch (err) {
    console.error(`addAsset (${collection}) failed:`, err);
    throw err;
  }
}

export async function updateAsset(collection, id, updates) {
  try {
    await axios.patch(`/api/CORE/${collection}`, { id, data: updates });
    const index = state[collection].findIndex((item) => item._id === id);
    if (index !== -1) {
      state[collection][index] = { ...state[collection][index], ...updates };
    }
  } catch (err) {
    console.error(`updateAsset (${collection}) failed:`, err);
    throw err;
  }
}

export async function deleteAsset(collection, id) {
  if (!collection || !id) throw new Error("collection and id required");
  if (!window.confirm("Are you sure you want to delete this item?")) return;
  try {
    await axios.delete(`/api/CORE/${collection}`, { params: { id } });
    const index = state[collection].findIndex((item) => item._id === id);
    if (index !== -1) state[collection].splice(index, 1);
    return true;
  } catch (err) {
    console.error(`deleteAsset (${collection}) failed:`, err);
    return false;
  }
}

// Domain-specific actions
export const addProduct = (data) => addAsset("products", data);
export const updateProduct = (id, updates) =>
  updateAsset("products", id, updates);
export const deleteProduct = (id) => deleteAsset("products", id);

export const addCollection = (data) => addAsset("collections", data);
export const updateCollection = (id, updates) =>
  updateAsset("collections", id, updates);
export const deleteCollection = (id) => deleteAsset("collections", id);

export const assignCollection = (productId, collectionId) =>
  updateAsset("products", productId, { collectionId });

// Synchronous helpers
export const getAsset = (section, _id) =>
  state[section]?.find((asset) => asset._id == _id) ?? null;

export const getAssetByHandle = (section, handle) =>
  state[section]?.find((asset) => asset.handle === handle) ?? null;

// React hook – SSR safe
export const useAssets = () =>
  typeof window === "object" ? useSnapshot(state) : snapshot(state);

export default state;
