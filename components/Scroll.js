"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Scroll({ carouselItems }) {
  const scrollRef = useRef(null);
  const router = useRouter();
  const dragRef = useRef({
    isDown: false,
    moved: false,
    startX: 0,
    scrollLeft: 0,
    pointerId: null,
    target: null,
  });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const endDrag = () => {
      const { pointerId, moved, target } = dragRef.current;
      dragRef.current.isDown = false;

      if (pointerId !== null && el.hasPointerCapture?.(pointerId)) {
        el.releasePointerCapture(pointerId);
      }
      dragRef.current.pointerId = null;

      if (!moved && target) {
        const itemEl = target.closest("[data-item-id]");
        if (itemEl) {
          router.push(`/prod/${itemEl.dataset.itemId}`);
        }
      }

      dragRef.current.moved = false;
      dragRef.current.target = null;
    };

    const onPointerDown = (e) => {
      dragRef.current.isDown = true;
      dragRef.current.moved = false;
      dragRef.current.startX = e.clientX;
      dragRef.current.scrollLeft = el.scrollLeft;
      dragRef.current.pointerId = e.pointerId;
      dragRef.current.target = e.target;
      el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!dragRef.current.isDown) return;
      const dx = e.clientX - dragRef.current.startX;
      if (Math.abs(dx) > 5) dragRef.current.moved = true;
      el.scrollLeft = dragRef.current.scrollLeft - dx;
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("lostpointercapture", endDrag);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("lostpointercapture", endDrag);
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      style={{
        overflowX: "scroll",
        maxWidth: "100%",
        cursor: "grab",
        userSelect: "none",
        touchAction: "pan-y",
      }}
    >
      <div style={{ display: "flex" }}>
        {carouselItems.map((item) => (
          <div
            key={item.id}
            data-item-id={item.id}
            style={{ overflow: "hidden", minWidth: "300px", cursor: "pointer" }}
          >
            <div className="carousel-img-wrapper">
              <img
                className="carousel-img"
                style={{
                  maxHeight: "300px",
                  minHeight: "300px",
                  pointerEvents: "none",
                }}
                src={item.src}
                alt={item.name}
              />
            </div>
            <div style={{ padding: 20, pointerEvents: "none" }}>
              {item.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
