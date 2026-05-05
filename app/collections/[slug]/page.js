"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { carouselItems } from "../../../vStore/inventory";

const mockProducts = [
  { id: 1, name: "Vestido Alma", price: "$2.100.000" },
  { id: 2, name: "Blusa Cielo", price: "$980.000" },
  { id: 3, name: "Falda Luna", price: "$1.200.000" },
  { id: 4, name: "Vestido Sol", price: "$2.400.000" },
  { id: 5, name: "Top Brisa", price: "$750.000" },
  { id: 6, name: "Pantalón Niebla", price: "$1.100.000" },
  { id: 7, name: "Vestido Mar", price: "$1.900.000" },
  { id: 8, name: "Conjunto Río", price: "$2.800.000" },
];

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function CollectionPage() {
  const { slug } = useParams();

  const title = Array.isArray(slug)
    ? slug[0]
    : slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const shuffledImages = useMemo(() => {
    if (!carouselItems?.length) return [];
    return shuffleArray(carouselItems);
  }, []);

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
        {mockProducts.map((p, i) => {
          const randomItem =
            shuffledImages[i % shuffledImages.length] ?? shuffledImages[0];

          return (
            <Link
              key={p.id}
              href={`/prod/${randomItem.id}`}
              className="mosaicCard"
            >
              <div className="mosaicImgWrapper">
                {randomItem?.src ? (
                  <img
                    src={randomItem.src}
                    alt={p.name}
                    className="mosaicImg"
                  />
                ) : (
                  <div className="mosaicFallback" />
                )}
              </div>

              <div className="mosaicInfo">
                <span className="mosaicName">{p.name}</span>
                <span className="mosaicPrice">{p.price} COP</span>
              </div>
            </Link>
          );
        })}
      </div>

      <style jsx global>{`
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
