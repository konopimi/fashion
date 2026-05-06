"use client";

import { useState } from "react";
import { useInventory } from "../../vStore/inventoryStore";

export default function AdminDashboard() {
  const {
    products,
    collections,
    addProduct,
    deleteProduct,
    assignCollection,
    addCollection,
    deleteCollection,
  } = useInventory();

  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductSrc, setNewProductSrc] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");

  const handleAddProduct = () => {
    if (!newProductName) return;
    addProduct({
      id: Date.now().toString(),
      name: newProductName,
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
      id: Date.now().toString(),
      name: newCollectionName,
      href: `/collections/${newCollectionName.toLowerCase().replace(/\s/g, "-")}`,
      src: "",
    });
    setNewCollectionName("");
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <h1>Dashboard – Productos y Colecciones</h1>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        {/* Products section */}
        <div style={{ flex: 2, minWidth: 300 }}>
          <h2>Productos</h2>
          <div
            style={{
              marginBottom: "1rem",
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: 8,
            }}
          >
            <h3>➕ Agregar producto</h3>
            <input
              type="text"
              placeholder="Nombre"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              style={{
                display: "block",
                marginBottom: 8,
                width: "100%",
                padding: 6,
              }}
            />
            <input
              type="number"
              placeholder="Precio (COP)"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
              style={{
                display: "block",
                marginBottom: 8,
                width: "100%",
                padding: 6,
              }}
            />
            <input
              type="text"
              placeholder="URL de imagen"
              value={newProductSrc}
              onChange={(e) => setNewProductSrc(e.target.value)}
              style={{
                display: "block",
                marginBottom: 8,
                width: "100%",
                padding: 6,
              }}
            />
            <button
              onClick={handleAddProduct}
              style={{
                background: "#0070f3",
                color: "white",
                padding: "6px 12px",
                border: "none",
                borderRadius: 4,
              }}
            >
              Guardar producto
            </button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                    padding: 8,
                  }}
                >
                  Nombre
                </th>
                <th
                  style={{
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                    padding: 8,
                  }}
                >
                  Precio
                </th>
                <th
                  style={{
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                    padding: 8,
                  }}
                >
                  Colección
                </th>
                <th
                  style={{
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                    padding: 8,
                  }}
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td style={{ padding: 8 }}>{product.name}</td>
                  <td style={{ padding: 8 }}>
                    ${product.price?.toLocaleString("es-CO")}
                  </td>
                  <td style={{ padding: 8 }}>
                    <select
                      value={product.collectionId || ""}
                      onChange={(e) =>
                        assignCollection(product.id, e.target.value || null)
                      }
                    >
                      <option value="">-- Sin colección --</option>
                      {collections.map((col) => (
                        <option key={col.id} value={col.id}>
                          {col.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: 8 }}>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      style={{
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        padding: "4px 8px",
                        borderRadius: 4,
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Collections section */}
        <div style={{ flex: 1, minWidth: 250 }}>
          <h2>Colecciones</h2>
          <div
            style={{
              marginBottom: "1rem",
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: 8,
            }}
          >
            <h3>➕ Agregar colección</h3>
            <input
              type="text"
              placeholder="Nombre de colección"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              style={{
                display: "block",
                marginBottom: 8,
                width: "100%",
                padding: 6,
              }}
            />
            <button
              onClick={handleAddCollection}
              style={{
                background: "#0070f3",
                color: "white",
                padding: "6px 12px",
                border: "none",
                borderRadius: 4,
              }}
            >
              Guardar colección
            </button>
          </div>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {collections.map((col) => (
              <li
                key={col.id}
                style={{
                  borderBottom: "1px solid #eee",
                  padding: "8px 0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{col.name}</span>
                <button
                  onClick={() => deleteCollection(col.id)}
                  style={{
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    padding: "2px 8px",
                    borderRadius: 4,
                  }}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
