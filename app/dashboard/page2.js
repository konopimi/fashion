"use client";
import { useState, useMemo } from "react";
import {
  useAssets,
  addProduct,
  updateProduct,
  deleteProduct,
  addCollection,
  updateCollection,
  deleteCollection,
  assignCollection,
} from "../../vStore/CORE/assets";

// Helpers
const fmtPrice = (price) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);

const toHandle = (name) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export default function AdminDashboard() {
  const { products, collections, loading, error } = useAssets();

  // ----- Tab state -----
  const [activeTab, setActiveTab] = useState("products");

  // ----- Modal state -----
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("product"); // 'product' | 'collection'

  // ----- Product form state -----
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductSrc, setNewProductSrc] = useState("");

  // ----- Collection form state -----
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionSrc, setNewCollectionSrc] = useState("");

  // ----- Inline editing state (for products table) -----
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editSrc, setEditSrc] = useState("");

  // ----- Search -----
  const [search, setSearch] = useState("");

  // ----- Filtered products -----
  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || (p.handle && p.handle.includes(q)),
    );
  }, [products, search]);

  // ----- Modal handlers -----
  const openModal = (type) => {
    setModalType(type);
    resetForm();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const resetForm = () => {
    setNewProductName("");
    setNewProductPrice("");
    setNewProductSrc("");
    setNewCollectionName("");
    setNewCollectionSrc("");
  };

  const handleAddProduct = () => {
    if (!newProductName) return;
    addProduct({
      name: newProductName,
      handle: toHandle(newProductName),
      price: parseFloat(newProductPrice) || 0,
      src: newProductSrc || null,
      variants: [],
      collectionId: null,
    });
    closeModal();
  };

  const handleAddCollection = () => {
    if (!newCollectionName) return;
    addCollection({
      name: newCollectionName,
      handle: toHandle(newCollectionName),
      href: `/collections/${toHandle(newCollectionName)}`,
      src: newCollectionSrc || null,
    });
    closeModal();
  };

  // Inline edit handlers
  const startEditing = (product) => {
    setEditingId(product._id);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditSrc(product.src || "");
  };

  const cancelEditing = () => setEditingId(null);

  const saveEditing = () => {
    if (!editingId) return;
    updateProduct(editingId, {
      name: editName,
      price: parseFloat(editPrice) || 0,
      src: editSrc || null,
    });
    setEditingId(null);
  };

  const handleDeleteProduct = (id) => deleteProduct(id);
  const handleDeleteCollection = (id) => deleteCollection(id);

  // ----- Styles -----
  const s = {
    topbar: {
      background: "rgba(127,127,127,0.62)",
      padding: "0.8rem 2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: 14,
      position: "sticky",
      top: 0,
    },
    tabBar: {
      display: "flex",
      paddingLeft: "2rem",
      background: "rgba(127,127,127,0.62)",
    },
    tab: (isActive) => ({
      padding: "0.7rem 1.2rem",
      cursor: "pointer",
      fontWeight: isActive ? 600 : 400,
      color: isActive ? "teal" : "",
      borderBottom: isActive ? "2px solid teal" : "2px solid transparent",
      background: "none",
      fontSize: 14,
      transition: "color 0.2s",
    }),
    content: {
      padding: "2rem",
      maxWidth: 1200,
      margin: "0 auto",
    },
    // Modal styles
    modalBackdrop: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modalCard: {
      background: "rgba(127,127,127,0.62)",
      borderRadius: 8,
      padding: "2rem",
      width: "min(400px, 90vw)",
      boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
    },
    input: {
      display: "block",
      width: "100%",
      marginBottom: 8,
      padding: "6px 8px",
      border: "1px solid #ccc",
      borderRadius: 4,
      fontSize: 14,
    },
    btn: {
      padding: "6px 12px",
      border: "none",
      borderRadius: 4,
      cursor: "pointer",
      fontSize: 14,
    },
    btnPrimary: {
      background: "#0070f3",
      color: "#fff",
    },
    btnDanger: {
      background: "#dc2626",
      color: "#fff",
    },
    btnGhost: {
      background: "transparent",
      color: "#0070f3",
      textDecoration: "underline",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      textAlign: "left",
      borderBottom: "1px solid #ddd",
      padding: 8,
      fontWeight: 500,
      fontSize: 13,
    },
    td: {
      padding: 8,
      borderBottom: "1px solid #eee",
      verticalAlign: "middle",
    },
    thumbnail: {
      width: 40,
      height: 40,
      objectFit: "cover",
      borderRadius: 4,
      background: "#f0f0f0",
    },
    searchInput: {
      marginBottom: "1rem",
      padding: "6px 8px",
      border: "1px solid #ccc",
      borderRadius: 4,
      width: "100%",
      maxWidth: 300,
    },
  };

  // ----- Loading / Error -----
  if (loading) return <div style={{ padding: "2rem" }}>Cargando...</div>;
  if (error) return <div style={{ padding: "2rem" }}>Error: {error}</div>;

  return (
    <div style={{ minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* ---- Top bar ---- */}
      <div style={s.topbar}>
        <span style={{ fontWeight: 600 }}>Panel de administración</span>
        <span style={{ color: "#888" }}>ASHERALEPH</span>
      </div>

      {/* ---- Tab navigation ---- */}
      <div style={s.tabBar}>
        <button
          style={s.tab(activeTab === "products")}
          onClick={() => setActiveTab("products")}
        >
          Productos
        </button>
        <button
          style={s.tab(activeTab === "collections")}
          onClick={() => setActiveTab("collections")}
        >
          Colecciones
        </button>
      </div>

      {/* ---- Active tab content ---- */}
      <div style={s.content}>
        {activeTab === "products" && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <h2 style={{ margin: 0 }}>Productos</h2>
              <button
                onClick={() => openModal("product")}
                style={{ ...s.btn, ...s.btnPrimary }}
              >
                + Agregar
              </button>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={s.searchInput}
            />

            {/* Products table */}
            {filteredProducts.length === 0 ? (
              <div style={{ padding: "2rem 0", color: "#888" }}>
                No hay productos aún.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}></th>
                      <th style={s.th}>Nombre</th>
                      <th style={s.th}>Precio</th>
                      <th style={s.th}>Colección</th>
                      <th style={s.th}>Handle</th>
                      <th style={s.th}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) =>
                      editingId === product._id ? (
                        <tr key={product._id}>
                          <td style={s.td}>
                            <input
                              type="text"
                              value={editSrc}
                              onChange={(e) => setEditSrc(e.target.value)}
                              style={{
                                ...s.input,
                                marginBottom: 0,
                                width: 120,
                              }}
                              placeholder="URL imagen"
                            />
                          </td>
                          <td style={s.td}>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              style={{ ...s.input, marginBottom: 0 }}
                            />
                          </td>
                          <td style={s.td}>
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              style={{
                                ...s.input,
                                marginBottom: 0,
                                width: 100,
                              }}
                            />
                          </td>
                          <td style={s.td}>—</td>
                          <td style={s.td}>{product.handle}</td>
                          <td style={s.td}>
                            <button
                              onClick={saveEditing}
                              style={{
                                ...s.btn,
                                ...s.btnPrimary,
                                marginRight: 6,
                              }}
                            >
                              Guardar
                            </button>
                            <button
                              onClick={cancelEditing}
                              style={{ ...s.btn, ...s.btnGhost }}
                            >
                              Cancelar
                            </button>
                          </td>
                        </tr>
                      ) : (
                        <tr key={product._id}>
                          <td style={s.td}>
                            {product.src ? (
                              <img
                                src={product.src}
                                alt={product.name}
                                style={s.thumbnail}
                              />
                            ) : (
                              <div style={s.thumbnail} />
                            )}
                          </td>
                          <td
                            style={{ ...s.td, cursor: "pointer" }}
                            onClick={() => startEditing(product)}
                          >
                            {product.name}
                          </td>
                          <td style={s.td}>{fmtPrice(product.price)}</td>
                          <td style={s.td}>
                            <select
                              value={product.collectionId || ""}
                              onChange={(e) =>
                                assignCollection(
                                  product._id,
                                  e.target.value || null,
                                )
                              }
                              style={{
                                padding: "4px 6px",
                                borderRadius: 4,
                                border: "1px solid #ccc",
                                fontSize: 13,
                              }}
                            >
                              <option value="">— Sin colección —</option>
                              {collections.map((col) => (
                                <option key={col._id} value={col._id}>
                                  {col.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td
                            style={{
                              ...s.td,
                              fontFamily: "monospace",
                              fontSize: 12,
                            }}
                          >
                            {product.handle}
                          </td>
                          <td style={s.td}>
                            <button
                              onClick={() => startEditing(product)}
                              style={{
                                ...s.btn,
                                ...s.btnGhost,
                                marginRight: 8,
                              }}
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              style={{ ...s.btn, ...s.btnDanger }}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === "collections" && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <h2 style={{ margin: 0 }}>Colecciones</h2>
              <button
                onClick={() => openModal("collection")}
                style={{ ...s.btn, ...s.btnPrimary }}
              >
                + Agregar
              </button>
            </div>

            {collections.length === 0 ? (
              <div style={{ padding: "2rem 0", color: "#888" }}>
                No hay colecciones aún.
              </div>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {collections.map((col) => (
                  <li
                    key={col._id}
                    style={{
                      borderBottom: "1px solid #eee",
                      padding: "8px 0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 500 }}>{col.name}</div>
                      <div style={{ fontSize: 11, color: "#888" }}>
                        {col.handle}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteCollection(col._id)}
                      style={{ ...s.btn, ...s.btnDanger }}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {/* ----- Modal (overlay) ----- */}
      {modalOpen && (
        <div style={s.modalBackdrop} onClick={closeModal}>
          <div style={s.modalCard} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h3 style={{ margin: 0 }}>
                {modalType === "product" ? "Nuevo producto" : "Nueva colección"}
              </h3>
              <button
                onClick={closeModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 20,
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            {modalType === "product" && (
              <>
                <input
                  type="text"
                  placeholder="Nombre del producto"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  style={s.input}
                />
                <input
                  type="number"
                  placeholder="Precio (COP)"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  style={s.input}
                />
                <input
                  type="text"
                  placeholder="URL de imagen"
                  value={newProductSrc}
                  onChange={(e) => setNewProductSrc(e.target.value)}
                  style={s.input}
                />
                {/* ---- IMAGE PREVIEW (product) ---- */}
                {newProductSrc && (
                  <img
                    src={newProductSrc}
                    alt="Preview"
                    style={{
                      width: "100%",
                      maxHeight: 200,
                      objectFit: "contain",
                      borderRadius: 4,
                      marginBottom: 12,
                      background: "#f0f0f0",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                {newProductName && (
                  <div
                    style={{ fontSize: 12, marginBottom: 12, color: "#666" }}
                  >
                    Handle: <code>{toHandle(newProductName)}</code>
                  </div>
                )}
                <button
                  onClick={handleAddProduct}
                  style={{ ...s.btn, ...s.btnPrimary, width: "100%" }}
                >
                  Guardar producto
                </button>
              </>
            )}

            {modalType === "collection" && (
              <>
                <input
                  type="text"
                  placeholder="Nombre de colección"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  style={s.input}
                />
                <input
                  type="text"
                  placeholder="URL de imagen (opcional)"
                  value={newCollectionSrc}
                  onChange={(e) => setNewCollectionSrc(e.target.value)}
                  style={s.input}
                />
                {/* ---- IMAGE PREVIEW (collection) ---- */}
                {newCollectionSrc && (
                  <img
                    src={newCollectionSrc}
                    alt="Preview"
                    style={{
                      width: "100%",
                      maxHeight: 200,
                      objectFit: "contain",
                      borderRadius: 4,
                      marginBottom: 12,
                      background: "#f0f0f0",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                {newCollectionName && (
                  <div
                    style={{ fontSize: 12, marginBottom: 12, color: "#666" }}
                  >
                    Handle: <code>{toHandle(newCollectionName)}</code>
                  </div>
                )}
                <button
                  onClick={handleAddCollection}
                  style={{ ...s.btn, ...s.btnPrimary, width: "100%" }}
                >
                  Guardar colección
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* responsive table for mobile */}
      <style jsx global>{`
        @media (max-width: 600px) {
          table,
          thead,
          tbody,
          th,
          td,
          tr {
            display: block;
          }
          thead tr {
            display: none;
          }
          td {
            display: flex;
            justify-content: space-between;
            padding: 10px 8px;
            border-bottom: 1px solid #f0f0f0;
          }
          td::before {
            content: attr(data-label);
            font-weight: 500;
            margin-right: 8px;
            color: #555;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}
