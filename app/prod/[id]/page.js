"use client";

import { useParams } from "next/navigation";

import Scroll from "../../../components/Scroll";
import { carouselItems, getItemById } from "../../../vStore/inventory";
export default function Page() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const item = getItemById(id);

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <div style={{ minWidth: 500, flex: 1, overflow: "hidden" }}>
          {item.src && (
            <img style={{ width: "100%" }} src={item.src} alt={item.name} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 500 }}>
          <div style={{ padding: "40px 100px" }}>
            <h1>{item.name}</h1>
            <div>$2.100.000,00 COP </div>
            <div>
              {`Seleccionar Talla : XS Guía de
            Tallas`}
            </div>
            <button
              style={{
                borderRadius: 5,
                padding: 20,
                width: "100%",
                background: "rgba(127,127,127,0.62)",
                marginTop: 60,
                marginBottom: 60,
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
      <Scroll carouselItems={carouselItems} />
    </>
  );
}
