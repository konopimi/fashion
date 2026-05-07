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

// Helper to format price
const fmtPrice = (price) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);

// Helper to generate handle from name
const toHandle = (name) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export default function AdminDashboard() {
  const { products, collections, loading, error } = useAssets();

  // ---------- Product form state ----------
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductSrc, setNewProductSrc] = useState("");

  // ---------- Collection form state ----------
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionSrc, setNewCollectionSrc] = useState("");

  // ---------- Inline editing state ----------
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editSrc, setEditSrc] = useState("");

  // ---------- Search ----------
  const [search, setSearch] = useState("");

  // ---------- Derived filtered products ----------
  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || (p.handle && p.handle.includes(q)),
    );
  }, [products, search]);

  // ---------- Handlers ----------
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
    setNewProductName("");
    setNewProductPrice("");
    setNewProductSrc("");
  };

  const handleAddCollection = () => {
    if (!newCollectionName) return;
    addCollection({
      name: newCollectionName,
      handle: toHandle(newCollectionName),
      href: `/collections/${toHandle(newCollectionName)}`,
      src: newCollectionSrc || null,
    });
    setNewCollectionName("");
    setNewCollectionSrc("");
  };

  // Inline edit start
  const startEditing = (product) => {
    setEditingId(product._id);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditSrc(product.src || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEditing = () => {
    if (!editingId) return;
    updateProduct(editingId, {
      name: editName,
      price: parseFloat(editPrice) || 0,
      src: editSrc || null,
    });
    setEditingId(null);
  };

  // Inline delete with confirmation (already inside deleteProduct, but we keep button)
  const handleDeleteProduct = (id) => {
    deleteProduct(id);
  };

  const handleDeleteCollection = (id) => {
    deleteCollection(id);
  };

  // ---------- Styles (grouped for readability) ----------
  const s = {
    container: {
      padding: "2rem",
      fontFamily: "sans-serif",
      maxWidth: 1200,
      margin: "0 auto",
    },
    heading: {
      marginBottom: "1.5rem",
      fontWeight: 400,
      fontSize: "1.8rem",
    },
    row: {
      display: "flex",
      gap: "2rem",
      flexWrap: "wrap",
    },
    card: {
      border: "1px solid #ddd",
      borderRadius: 6,
      padding: "1rem",
      marginBottom: "1rem",
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

  // ---------- Render ----------
  if (loading) return <div style={s.container}>Cargando...</div>;
  if (error) return <div style={s.container}>Error: {error}</div>;

  return (
    <div style={s.container}>
      <h1 style={s.heading}>Dashboard – Productos y Colecciones</h1>

      <div style={s.row}>
        {/* ========== PRODUCTS SECTION ========== */}
        <div style={{ flex: 2, minWidth: 300 }}>
          <h2>Productos</h2>

          {/* Add product form */}
          <div style={s.card}>
            <h3 style={{ marginTop: 0 }}>➕ Agregar producto</h3>
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
            {newProductName && (
              <div style={{ fontSize: 12, marginBottom: 8, color: "#666" }}>
                Handle: <code>{toHandle(newProductName)}</code>
              </div>
            )}
            <button
              onClick={handleAddProduct}
              style={{ ...s.btn, ...s.btnPrimary }}
            >
              Guardar producto
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
                          style={{ ...s.input, marginBottom: 0, width: 120 }}
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
                          style={{ ...s.input, marginBottom: 0, width: 100 }}
                        />
                      </td>
                      <td style={s.td}>—</td>
                      <td style={s.td}>{product.handle}</td>
                      <td style={s.td}>
                        <button
                          onClick={saveEditing}
                          style={{ ...s.btn, ...s.btnPrimary, marginRight: 6 }}
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
                          style={{ ...s.btn, ...s.btnGhost, marginRight: 8 }}
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
          )}
        </div>

        {/* ========== COLLECTIONS SECTION ========== */}
        <div style={{ flex: 1, minWidth: 250 }}>
          <h2>Colecciones</h2>

          <div style={s.card}>
            <h3 style={{ marginTop: 0 }}>➕ Agregar colección</h3>
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
            {newCollectionName && (
              <div style={{ fontSize: 12, marginBottom: 8, color: "#666" }}>
                Handle: <code>{toHandle(newCollectionName)}</code>
              </div>
            )}
            <button
              onClick={handleAddCollection}
              style={{ ...s.btn, ...s.btnPrimary }}
            >
              Guardar colección
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
        </div>
      </div>

      {/* Responsive tweaks */}
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
