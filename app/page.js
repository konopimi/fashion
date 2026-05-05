"use client";
import { useEffect, useRef } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Scroll from "../components/Scroll";
import { carouselItems, collections } from "../vStore/inventory";

const LABEL_H = 46;
const MARGIN = 16;

export default function Home() {
  const cardRefs = useRef([]);
  const labelRefs = useRef([]);

  useEffect(() => {
    const update = () => {
      const vh = window.innerHeight;
      cardRefs.current.forEach((card, i) => {
        const label = labelRefs.current[i];
        if (!card || !label) return;
        const rect = card.getBoundingClientRect();
        if (rect.bottom > vh && rect.top < vh) {
          label.style.top = `${vh - rect.top - LABEL_H - MARGIN}px`;
          label.style.bottom = "auto";
        } else {
          label.style.top = "";
          label.style.bottom = `${MARGIN}px`;
        }
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className="collectionGrid">
          {collections.map((item, i) => (
            <div
              key={item.title}
              ref={(el) => (cardRefs.current[i] = el)}
              className="collectionCard"
            >
              <Link
                href={item.href}
                style={{ display: "block", width: "100%", height: "100%" }}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="collectionImage"
                />
              </Link>
              <div
                ref={(el) => (labelRefs.current[i] = el)}
                className="collectionLabel"
              >
                {item.title}
              </div>
            </div>
          ))}
        </section>
        <Scroll carouselItems={carouselItems} />
      </main>
      <style jsx global>{`
        .collectionGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0;
          width: 100%;
        }
        @media (max-width: 768px) {
          .collectionGrid {
            grid-template-columns: 1fr;
          }
        }
        .collectionCard {
          position: relative;
          display: block;
          overflow: hidden;
          cursor: pointer;
          aspect-ratio: 4 / 5;
          line-height: 0;
        }
        .collectionLabel {
          position: absolute;
          left: 16px;
          bottom: 16px;
          width: fit-content;
          padding: 8px 14px;
          background: rgba(20, 20, 20, 0.62);
          color: #fff;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 12px;
          line-height: normal;
          pointer-events: none;
        }
        .collectionImage {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 350ms ease;
        }
        .collectionCard:hover .collectionImage {
          transform: scale(1.03);
        }
      `}</style>
    </div>
  );
}
