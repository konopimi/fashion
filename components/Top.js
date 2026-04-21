"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const menuItems = ["Comprar", "Colecciones", "Novias", "Más", "Boutiques"];
export default function Top() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  return (
    <>
      <div
        style={{
          border: "",
          padding: 15,
          display: "flex",
          alignIems: "center",
          position: "sticky",
          top: 0,
          width: "100%",
          background: "rgba(127,127,127,0.62)",
        }}
      >
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>Menu</button>
        <b
          style={{ flex: 1, textAlign: "center", cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          ASHERALEPH
        </b>
        <button onClick={() => setIsCartOpen(!isCartOpen)}>Carrito</button>
      </div>

      <div
        style={{
          display: isMenuOpen ? "flex" : "none",
          flexDirection: "column",
          flex: 1,
          minHeight: "100vh",
          minWidth: "100%",
        }}
      >
        {menuItems.map((item) => (
          <div style={{ padding: 10 }} key={item}>
            {item}
          </div>
        ))}
      </div>
    </>
  );
}
