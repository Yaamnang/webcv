"use client";

import { useEffect, useRef } from "react";
import { onScroll, clamp } from "../lib/effects";

/* 6 cards roughly encircling the brand, with slight radius/tilt variation */
const POSITIONS = [
  { ang: -90, r: 34, tilt: -10 }, // top
  { ang: -30, r: 30, tilt: 8 }, // upper-right
  { ang: 30, r: 36, tilt: -6 }, // lower-right
  { ang: 90, r: 32, tilt: 12 }, // bottom
  { ang: 150, r: 36, tilt: -9 }, // lower-left
  { ang: -150, r: 30, tilt: 7 }, // upper-left
];

const NAME_SCALE_START = 1;
const NAME_SCALE_END = 1.2; // only a small nudge bigger than its base size
const R_END_VH = 130; // cards fly out past the viewport

export default function IntroZoom() {
  const sectionRef = useRef(null);
  const nameRef = useRef(null);
  const cardsRef = useRef([]);
  const taglineRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const name = nameRef.current;
    const cards = cardsRef.current.filter(Boolean);
    const tagline = taglineRef.current;
    if (!section || !name || cards.length === 0) return;

    return onScroll(() => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? clamp(-rect.top / total) : 0;
      const ep = 1 - Math.pow(1 - p, 2); // easeOutQuad — snappy
      const vh = window.innerHeight;

      cards.forEach((card, i) => {
        const pos = POSITIONS[i];
        const radius = ((pos.r + (R_END_VH - pos.r) * ep) * vh) / 100;
        const rad = (pos.ang * Math.PI) / 180;
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;
        const tilt = pos.tilt + ep * (pos.tilt > 0 ? 22 : -22);
        const opacity = clamp(1 - (p - 0.7) / 0.3);
        card.style.transform =
          `translate(-50%, -50%) translate(${x.toFixed(2)}px, ${y.toFixed(
            2
          )}px) ` + `rotate(${tilt.toFixed(2)}deg)`;
        card.style.opacity = opacity.toFixed(3);
      });

      const scale =
        NAME_SCALE_START + (NAME_SCALE_END - NAME_SCALE_START) * ep;
      // hold full until midway, then fade + drift upward like scrolling past
      const fadeP = clamp((p - 0.5) / 0.4);
      const nameOpacity = 1 - fadeP;
      const nameY = -fadeP * 25;
      name.style.transform = `translateY(${nameY.toFixed(2)}%) scale(${scale.toFixed(
        4
      )})`;
      name.style.opacity = nameOpacity.toFixed(3);

      if (tagline)
        tagline.style.opacity = (1 - clamp(p * 2.5)).toFixed(3);
    });
  }, []);

  return (
    <section className="yam-intro-zoom" id="top" ref={sectionRef}>
      <div className="yam-intro-sticky">
        <div className="yam-intro-cards" aria-hidden="true">
          {POSITIONS.map((_, i) => (
            <div
              key={i}
              ref={(el) => (cardsRef.current[i] = el)}
              className={`yam-intro-card yam-intro-card-${i + 1}`}
            >
              <div className="yam-intro-card-fill" />
            </div>
          ))}
        </div>

        <h1 className="yam-intro-name" ref={nameRef}>
          Yamnang
          <span className="yam-intro-name-mark" aria-hidden="true">
            TM
          </span>
        </h1>

      </div>
    </section>
  );
}
