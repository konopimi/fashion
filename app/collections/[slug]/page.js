// app/collections/[slug]/page.js
"use client";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useInventory } from "../../../vStore/inventoryStore";

const fmtPrice = (price) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);

export default function CollectionPage() {
  const { slug } = useParams();
  const { products } = useInventory(); // real products

  const title = Array.isArray(slug)
    ? slug[0]
    : slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  // Shuffle products once per render (for variety)
  const shuffledProducts = useMemo(() => {
    if (!products?.length) return [];
    const arr = [...products];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [products]);

  return (
    <>
      <h4
        style={{
          position: "sticky",
          top: "var(--topbar-height, 0px)",
          padding: 10,
          zIndex: 10,
          textAlign: "center",
          textTransform: "uppercase",
          fontWeight: 400,
          background: "rgba(127,127,127,0.72)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
          textShadow: "0 1px 4px rgba(0,0,0,0.45)",
        }}
      >
        {title}
      </h4>
      <div className="mosaicGrid">
        {shuffledProducts.map((product) => (
          <Link
            key={product.id}
            href={`/prod/${product.id}`}
            className="mosaicCard"
          >
            <div className="mosaicImgWrapper">
              {product.src ? (
                <img
                  src={product.src}
                  alt={product.name}
                  className="mosaicImg"
                />
              ) : (
                <div className="mosaicFallback" />
              )}
            </div>
            <div className="mosaicInfo">
              <span className="mosaicName">{product.name}</span>
              <span className="mosaicPrice">{fmtPrice(product.price)}</span>
            </div>
          </Link>
        ))}
      </div>
      <style jsx global>{`
        /* your existing mosaic styles – unchanged */
        .mosaicGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }
        @media (max-width: 900px) {
          .mosaicGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 500px) {
          .mosaicGrid {
            grid-template-columns: 1fr;
          }
        }
        .mosaicCard {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
        }
        .mosaicImgWrapper {
          width: 100%;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          background: #e8e4df;
        }
        .mosaicImg {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition:
            transform 500ms ease,
            opacity 300ms ease;
        }
        .mosaicFallback {
          width: 100%;
          height: 100%;
          background: #e8e4df;
        }
        .mosaicCard:hover .mosaicImg {
          opacity: 0.9;
          transform: scale(1.03);
        }
        .mosaicInfo {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 12px 4px;
        }
        .mosaicName {
          font-size: 13px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .mosaicPrice {
          font-size: 12px;
          color: #666;
        }
      `}</style>
    </>
  );
}
