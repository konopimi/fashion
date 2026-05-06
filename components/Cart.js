"use client";
import { useEffect, useState } from "react";

const DEMO_ITEMS = [
  {
    id: 1,
    name: "Vestido Alma",
    variant: "XS",
    price: 2100000,
    qty: 1,
    src: null,
  },
  {
    id: 2,
    name: "Blusa Cielo",
    variant: "S",
    price: 980000,
    qty: 2,
    src: null,
  },
];

const fmt = (n) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);

function CartItem({ item, onQty, onRemove }) {
  return (
    <div style={s.item}>
      <div style={s.thumb}>
        {item.src && (
          <img
            src={item.src}
            alt={item.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </div>
      <div style={s.itemBody}>
        <div style={s.itemTop}>
          <span style={s.itemName}>{item.name}</span>
          <span style={s.itemPrice}>{fmt(item.price * item.qty)}</span>
        </div>
        {item.variant && <span style={s.itemVariant}>{item.variant}</span>}
        <div style={s.itemActions}>
          <div style={s.stepper}>
            <button
              style={s.stepBtn}
              onClick={() => onQty(item.id, item.qty - 1)}
            >
              −
            </button>
            <span style={s.qty}>{item.qty}</span>
            <button
              style={s.stepBtn}
              onClick={() => onQty(item.id, item.qty + 1)}
            >
              +
            </button>
          </div>
          <button style={s.removeBtn} onClick={() => onRemove(item.id)}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartOverlay() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(DEMO_ITEMS);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  const setQty = (id, qty) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const removeItem = (id) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* floating toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ ...s.fab, ...(open ? s.fabOpen : {}) }}
        aria-label="Carrito"
      >
        {open ? (
          <span style={{ fontSize: 16, lineHeight: 1 }}>✕</span>
        ) : (
          <>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {count > 0 && <span style={s.fabBadge}>{count}</span>}
          </>
        )}
      </button>

      {/* backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          ...s.backdrop,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* drawer */}
      <aside
        style={{
          ...s.drawer,
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
      >
        <div style={s.head}>
          <span style={s.title}>Carrito</span>
          {count > 0 && <span style={s.badge}>{count}</span>}
          <button
            style={s.closeBtn}
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div style={s.body}>
          {items.length === 0 ? (
            <div style={s.empty}>
              <svg
                width="38"
                height="38"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(127,127,127,0.5)"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
              </svg>
              <p style={s.emptyText}>Tu carrito está vacío.</p>
            </div>
          ) : (
            items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onQty={setQty}
                onRemove={removeItem}
              />
            ))
          )}
        </div>

        {items.length > 0 && (
          <div style={s.footer}>
            <div style={s.subtotalRow}>
              <span style={s.subtotalLabel}>Subtotal</span>
              <span style={s.subtotalValue}>{fmt(subtotal)}</span>
            </div>
            <p style={s.taxNote}>Envío e impuestos calculados al finalizar</p>
            <button style={s.checkoutBtn}>Finalizar Compra</button>
            <button style={s.continueBtn} onClick={() => setOpen(false)}>
              Seguir comprando
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

const s = {
  fab: {
    position: "fixed",
    bottom: 28,
    right: 28,
    zIndex: 100000,
    width: 52,
    height: 52,
    borderRadius: "50%",
    background: "rgba(10,10,10,0.92)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#ededed",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
    transition: "transform .2s ease, background .2s ease",
    textShadow: "none",
  },
  fabOpen: {
    background: "rgba(40,40,40,0.98)",
    transform: "scale(0.92)",
  },
  fabBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    minWidth: 16,
    height: 16,
    padding: "0 3px",
    background: "#ededed",
    color: "#111",
    borderRadius: 999,
    fontSize: 9,
    fontFamily: "var(--font-geist-mono)",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
    pointerEvents: "none",
  },
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 99998,
    background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(3px)",
    transition: "opacity .3s",
  },
  drawer: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    width: "min(420px, 100vw)",
    zIndex: 99999,
    background: "rgba(10,10,10,0.97)",
    backdropFilter: "blur(20px)",
    color: "#ededed",
    display: "flex",
    flexDirection: "column",
    transition: "transform .38s cubic-bezier(.32,.72,0,1)",
    borderLeft: "1px solid rgba(255,255,255,0.08)",
    fontFamily: "var(--font-geist-sans)",
  },
  head: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "18px 22px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#ededed",
  },
  badge: {
    fontFamily: "var(--font-geist-mono)",
    fontSize: 10,
    color: "rgba(200,200,200,0.7)",
    padding: "2px 6px",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 4,
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "rgba(200,200,200,0.5)",
    fontSize: 14,
    padding: "2px 4px",
    lineHeight: 1,
    textShadow: "none",
  },
  body: { flex: 1, overflowY: "auto", padding: "0 22px" },
  item: {
    display: "flex",
    gap: 14,
    padding: "18px 0",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  thumb: {
    width: 68,
    height: 84,
    flexShrink: 0,
    background: "rgba(255,255,255,0.05)",
    borderRadius: 4,
    overflow: "hidden",
  },
  itemBody: { flex: 1, display: "flex", flexDirection: "column", gap: 4 },
  itemTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemName: {
    fontSize: 13,
    fontWeight: 400,
    letterSpacing: "0.04em",
    color: "#ededed",
    lineHeight: 1.35,
  },
  itemPrice: {
    fontFamily: "var(--font-geist-mono)",
    fontSize: 12,
    color: "#ededed",
    flexShrink: 0,
    marginLeft: 8,
  },
  itemVariant: {
    fontSize: 11,
    color: "rgba(200,200,200,0.45)",
    letterSpacing: "0.04em",
  },
  itemActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  stepper: {
    display: "flex",
    alignItems: "center",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 3,
    overflow: "hidden",
  },
  stepBtn: {
    width: 28,
    height: 26,
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 14,
    color: "rgba(200,200,200,0.6)",
    lineHeight: 1,
    textShadow: "none",
    padding: 0,
  },
  qty: {
    width: 26,
    textAlign: "center",
    fontFamily: "var(--font-geist-mono)",
    fontSize: 12,
    color: "#ededed",
    borderLeft: "1px solid rgba(255,255,255,0.12)",
    borderRight: "1px solid rgba(255,255,255,0.12)",
    lineHeight: "26px",
  },
  removeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 10,
    color: "rgba(200,200,200,0.35)",
    textDecoration: "underline",
    padding: 0,
    letterSpacing: "0.04em",
    textShadow: "none",
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    height: 260,
  },
  emptyText: {
    fontSize: 13,
    color: "rgba(200,200,200,0.35)",
    letterSpacing: "0.04em",
  },
  footer: {
    padding: "18px 22px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
  },
  subtotalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  subtotalLabel: {
    fontSize: 12,
    color: "rgba(200,200,200,0.5)",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  subtotalValue: {
    fontFamily: "var(--font-geist-mono)",
    fontSize: 15,
    fontWeight: 500,
    color: "#ededed",
  },
  taxNote: {
    fontSize: 10,
    color: "rgba(200,200,200,0.3)",
    marginBottom: 14,
    letterSpacing: "0.02em",
  },
  checkoutBtn: {
    width: "100%",
    height: 44,
    background: "#ededed",
    color: "#0a0a0a",
    border: "none",
    borderRadius: 3,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: 8,
    textShadow: "none",
    fontFamily: "var(--font-geist-sans)",
  },
  continueBtn: {
    width: "100%",
    height: 38,
    background: "none",
    color: "rgba(200,200,200,0.45)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 3,
    fontSize: 11,
    cursor: "pointer",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    fontFamily: "var(--font-geist-sans)",
    textShadow: "none",
  },
};
