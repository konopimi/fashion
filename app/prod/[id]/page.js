"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useInventory } from "../../../vStore/inventoryStore";
import { useCart } from "../../../vStore/cartStore";
import Scroll from "../../../components/Scroll";

export default function ProductPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { getItemById, products } = useInventory();
  const product = getItemById(id);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return <div>Producto no encontrado</div>;

  const handleAddToCart = () => {
    addItem(product, null, quantity);
    alert(`Añadido al carrito: ${product.name} x${quantity}`);
  };

  const fmtPrice = (price) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <div style={{ minWidth: 500, flex: 1, overflow: "hidden" }}>
          {product.src && (
            <img
              style={{ width: "100%" }}
              src={product.src}
              alt={product.name}
            />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 500 }}>
          <div style={{ padding: "40px 100px" }}>
            <h1>{product.name}</h1>
            <div>{fmtPrice(product.price)}</div>
            <div style={{ marginTop: 20 }}>
              <label>Cantidad: </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                style={{ width: 60, marginLeft: 8, padding: 4 }}
              />
            </div>
            <button
              onClick={handleAddToCart}
              style={{
                borderRadius: 5,
                padding: 20,
                width: "100%",
                background: "rgba(127,127,127,0.62)",
                marginTop: 60,
                marginBottom: 60,
                cursor: "pointer",
                border: "none",
                fontSize: 16,
              }}
            >
              Agregar al Carrito
            </button>
            <div className="detalles">
              <div>DETALLES</div>
              <div>ENVIOS Y DEVOLUCIONES</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: 40 }}>You may also like</div>
      <Scroll carouselItems={products} />
    </>
  );
}
