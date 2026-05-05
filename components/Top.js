"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const leftItems = ["Comprar", "Colecciones", "Novias", "Más"];
const rightItems = ["Buscar", "Carrito"];

export default function Top() {
  const router = useRouter();

  const topbarRef = useRef(null);
  const measureRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [topbarHeight, setTopbarHeight] = useState(0);
  const [canInlineNav, setCanInlineNav] = useState(true);

  useEffect(() => {
    const updateLayout = () => {
      if (topbarRef.current) {
        const h = topbarRef.current.offsetHeight;
        setTopbarHeight(h);
        document.documentElement.style.setProperty("--topbar-height", `${h}px`);
      }
      if (measureRef.current && topbarRef.current) {
        const available = topbarRef.current.clientWidth;
        const needed = measureRef.current.scrollWidth + 24;
        setCanInlineNav(available >= needed);
      }
    };

    updateLayout();
    const ro = new ResizeObserver(updateLayout);
    if (topbarRef.current) ro.observe(topbarRef.current);
    window.addEventListener("resize", updateLayout);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateLayout);
    };
  }, []);

  useEffect(() => {
    if (canInlineNav) {
      setIsMenuOpen(false);
    }
    setActiveItem(null);
  }, [canInlineNav]);

  useEffect(() => {
    const handleScroll = () => {
      if (!canInlineNav && window.scrollY > 80) {
        setIsMenuOpen(false);
      }
      if (canInlineNav && window.scrollY > 80) {
        setActiveItem(null);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [canInlineNav]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!activeItem) return;
    const handleClickOutside = (e) => {
      if (topbarRef.current && !topbarRef.current.contains(e.target)) {
        setActiveItem(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeItem]);

  const handleLeftItemClick = (item) => {
    setActiveItem((prev) => (prev === item ? null : item));
  };

  const isDropdownOpen = canInlineNav && activeItem !== null;

  return (
    <>
      <div
        ref={topbarRef}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 2000,
          width: "100%",
          background: "rgba(127,127,127,0.72)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            padding: "15px 20px",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              minWidth: 0,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {canInlineNav ? (
              leftItems.map((item) => (
                <button
                  key={item}
                  className={`topLink${activeItem === item ? " topLinkActive" : ""}`}
                  type="button"
                  onClick={() => handleLeftItemClick(item)}
                >
                  {item}
                </button>
              ))
            ) : (
              <button
                className="topLink"
                type="button"
                onClick={() => setIsMenuOpen((v) => !v)}
              >
                Menu
              </button>
            )}
          </div>

          <b
            style={{
              textAlign: "center",
              cursor: "pointer",
              letterSpacing: "0.18em",
              fontWeight: 700,
              whiteSpace: "nowrap",
              textShadow: "0 1px 4px rgba(0,0,0,0.45)",
            }}
            onClick={() => {
              router.push("/");
              setActiveItem(null);
            }}
          >
            ASHERALEPH
          </b>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 18,
              minWidth: 0,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {rightItems.map((item) => (
              <button key={item} className="topLink" type="button">
                {item}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={measureRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            visibility: "hidden",
            pointerEvents: "none",
            left: -99999,
            top: -99999,
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "15px 20px",
          }}
        >
          {leftItems.map((item) => (
            <span key={item} style={{ padding: "6px 0" }}>
              {item}
            </span>
          ))}
          <span style={{ letterSpacing: "0.18em", fontWeight: 700 }}>
            ASHERALEPH
          </span>
          {rightItems.map((item) => (
            <span key={item} style={{ padding: "6px 0" }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Desktop dropdown */}
      <div
        style={{
          position: "fixed",
          top: Math.max(0, topbarHeight - 1),
          left: 0,
          right: 0,
          zIndex: 1500,
          background: "rgba(0,0,0,0.94)",
          backdropFilter: "blur(18px)",
          color: "#fff",
          overflow: "hidden",
          opacity: isDropdownOpen ? 1 : 0,
          transform: isDropdownOpen ? "translateY(0px)" : "translateY(-12px)",
          pointerEvents: isDropdownOpen ? "auto" : "none",
          transition: "opacity 0.28s ease, transform 0.28s ease",
          boxShadow: "0 14px 40px rgba(0,0,0,0.45)",
        }}
      >
        <div style={{ padding: "32px 40px 28px" }}>
          <h4
            style={{
              margin: 0,
              fontWeight: 600,
              fontSize: 20,
              letterSpacing: "0.08em",
              color: "#fff",
            }}
          >
            {activeItem}
          </h4>
        </div>
      </div>

      {/* Mobile dropdown */}
      {!canInlineNav && (
        <div
          style={{
            position: "fixed",
            top: Math.max(0, topbarHeight - 1),
            left: 0,
            right: 0,
            zIndex: 1500,
            background: "rgba(0,0,0,0.94)",
            backdropFilter: "blur(18px)",
            color: "#fff",
            overflow: "hidden",
            opacity: isMenuOpen ? 1 : 0,
            transform: isMenuOpen ? "translateY(0px)" : "translateY(-12px)",
            pointerEvents: isMenuOpen ? "auto" : "none",
            transition: "opacity 0.28s ease, transform 0.28s ease",
            boxShadow: "0 14px 40px rgba(0,0,0,0.45)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {leftItems.map((item) => (
              <button
                key={item}
                type="button"
                className="menuItem menuItemMobile"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      <style jsx global>{`
        .topLink {
          appearance: none;
          border: 0;
          background: transparent;
          color: inherit;
          font: inherit;
          font-size: 14px;
          cursor: pointer;
          padding: 6px 0;
          letter-spacing: 0.02em;
          transition:
            opacity 180ms ease,
            transform 180ms ease;
        }

        .topLink:hover {
          opacity: 0.72;
          transform: translateY(-1px);
        }

        .topLinkActive {
          opacity: 0.72;
          transform: translateY(-1px);
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .menuItem {
          appearance: none;
          border: 0;
          background: transparent;
          color: inherit;
          font: inherit;
          font-size: 18px;
          letter-spacing: 0.02em;
          cursor: pointer;
          text-align: left;
          transition:
            background-color 180ms ease,
            transform 180ms ease;
        }

        .menuItem:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateX(4px);
        }

        .menuItemMobile {
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
      `}</style>
    </>
  );
}
