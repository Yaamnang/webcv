"use client";

import { useEffect, useRef } from "react";
import { onScroll, clamp, lerp } from "../lib/effects";

const ITEMS = [
  "Strategy",
  "Design",
  "Development",
  "Motion",
  "Branding",
  "Support",
  "Optimization",
];

function Track({ hidden }) {
  return (
    <div className="yam-marquee-track" aria-hidden={hidden ? "true" : undefined}>
      {ITEMS.map((item, i) => (
        <span
          className="yam-marquee-item"
          key={i}
          data-outline={i % 2 === 1 ? "true" : "false"}
        >
          {item}
          <span className="yam-marquee-star" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  const ref = useRef(null);

  /* scroll velocity skews the text so it "leans" into the motion */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let last = window.scrollY;
    let raw = 0;
    let smooth = 0;
    let raf = 0;

    const unsub = onScroll(() => {
      const y = window.scrollY;
      raw = y - last;
      last = y;
    });

    const loop = () => {
      smooth = lerp(smooth, raw, 0.18);
      raw *= 0.8;
      const skew = clamp(smooth * 0.32, -11, 11);
      el.style.setProperty("--vskew", `${skew.toFixed(2)}deg`);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      unsub();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="yam-marquee" ref={ref} aria-label="Studio capabilities">
      <Track />
      <Track hidden />
    </div>
  );
}
