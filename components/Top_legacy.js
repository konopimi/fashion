"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const menuItems = ["Comprar", "Colecciones", "Novias", "Más", "Boutiques"];

export default function Top() {
  const router = useRouter();

  const topbarRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [topbarHeight, setTopbarHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (topbarRef.current) {
        setTopbarHeight(topbarRef.current.offsetHeight);
      }
    };

    updateHeight();

    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* TOPBAR */}
      <div
        ref={topbarRef}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 2000,

          padding: "15px 20px",

          display: "flex",
          alignItems: "center",

          width: "100%",

          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(14px)",

          color: "#fff",

          boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
        }}
      >
        <button
          onClick={() => setIsMenuOpen((v) => !v)}
          style={{
            color: "inherit",
            fontWeight: 600,
          }}
        >
          Menu
        </button>

        <b
          style={{
            flex: 1,
            textAlign: "center",
            cursor: "pointer",
            letterSpacing: "0.08em",
            fontWeight: 700,
            textShadow: "0 1px 4px rgba(0,0,0,0.45)",
          }}
          onClick={() => router.push("/")}
        >
          ASHERALEPH
        </b>

        <button
          onClick={() => setIsCartOpen((v) => !v)}
          style={{
            color: "inherit",
            fontWeight: 600,
          }}
        >
          Carrito
        </button>
      </div>

      {/* MENU OVERLAY */}
      <div
        style={{
          position: "fixed",

          top: topbarHeight - 1,
          left: 0,
          right: 0,

          zIndex: 1500,

          background: "rgba(0,0,0,0.94)",
          backdropFilter: "blur(18px)",

          color: "#fff",

          overflow: "hidden",

          opacity: isMenuOpen ? 1 : 0,

          transform: isMenuOpen ? "translateY(0px)" : "translateY(-18px)",

          pointerEvents: isMenuOpen ? "auto" : "none",

          transition: "opacity 0.35s ease, transform 0.35s ease",

          boxShadow: "0 14px 40px rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "300px",
          }}
        >
          {menuItems.map((item) => (
            <div
              key={item}
              className="menuItem"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
