"use client";

import { useEffect, useRef } from "react";
import { canHover, lerp } from "../lib/effects";

/**
 * Custom cursor: a precise dot + a lagging ring + a contextual label.
 * The ring grows over interactive elements; the label shows whatever
 * text an element exposes via `data-cursor="..."`.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (!canHover()) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const d = { ...target };
    const r = { ...target };
    let raf = 0;
    let visible = false;

    ring.dataset.state = "hidden";

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        ring.dataset.state = ring.dataset.hover === "true" ? "hover" : "";
      }
    };
    const onLeave = () => {
      visible = false;
      ring.dataset.state = "hidden";
      label.dataset.show = "false";
    };
    const onOver = (e) => {
      const hit = e.target.closest?.(
        "a, button, [data-cursor], .yam-magnetic, input, textarea"
      );
      if (hit) {
        ring.dataset.hover = "true";
        if (visible) ring.dataset.state = "hover";
        const text = hit.getAttribute("data-cursor");
        if (text) {
          label.textContent = text;
          label.dataset.show = "true";
        } else {
          label.dataset.show = "false";
        }
      } else {
        ring.dataset.hover = "false";
        if (ring.dataset.state !== "hidden") ring.dataset.state = "";
        label.dataset.show = "false";
      }
    };

    const render = () => {
      d.x = lerp(d.x, target.x, 0.4);
      d.y = lerp(d.y, target.y, 0.4);
      r.x = lerp(r.x, target.x, 0.16);
      r.y = lerp(r.y, target.y, 0.16);
      dot.style.transform = `translate3d(${d.x}px, ${d.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${r.x}px, ${r.y}px, 0) translate(-50%, -50%)`;
      label.style.transform = `translate3d(${r.x}px, ${
        r.y + 46
      }px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="yam-cursor" aria-hidden="true" />
      <div ref={ringRef} className="yam-cursor-ring" aria-hidden="true" />
      <div
        ref={labelRef}
        className="yam-cursor-label"
        data-show="false"
        aria-hidden="true"
      />
    </>
  );
}
