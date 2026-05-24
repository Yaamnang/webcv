"use client";

import { useEffect, useRef } from "react";
import { onScroll, clamp } from "../lib/effects";

const CARDS = [1, 2, 3, 4, 5];
const MIDDLE = 2;

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export default function ScrollHero({ start }) {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    const cards = cardsRef.current.filter(Boolean);
    if (!section || cards.length === 0) return;

    return onScroll(() => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const raw = total > 0 ? clamp(-rect.top / total) : 0;
      const p = easeInOut(raw);

      cards.forEach((card, i) => {
        if (i === MIDDLE) {
          const scale = 1 + (1 - p) * 5; // 6 → 1
          card.style.transform = `scale(${scale.toFixed(4)})`;
          card.style.opacity = "1";
        } else {
          const dist = i - MIDDLE;
          const inward = -dist * (1 - p) * 115; // pull to center when p=0
          const tilt = dist * (1 - p) * 3.5;
          card.style.transform =
            `translateX(${inward.toFixed(2)}%) ` +
            `rotate(${tilt.toFixed(2)}deg) ` +
            `scale(${p.toFixed(4)})`;
          card.style.opacity = p.toFixed(3);
        }
      });

      if (text) {
        const textP = clamp(p / 0.7);
        const tScale = 1.18 - 0.18 * textP;
        const tY = -textP * 14;
        text.style.transform = `translateY(${tY.toFixed(2)}%) scale(${tScale.toFixed(4)})`;
        text.style.opacity = (1 - textP).toFixed(3);
      }
    });
  }, []);

  return (
    <section className="yam-scrollhero" id="scrollhero" ref={sectionRef}>
      <div className="yam-scrollhero-sticky">
        <div className="yam-scrollhero-strip">
          {CARDS.map((n, i) => (
            <div
              key={n}
              ref={(el) => (cardsRef.current[i] = el)}
              className={`yam-scrollhero-card yam-scrollhero-card-${n}`}
              data-middle={i === MIDDLE ? "true" : "false"}
            >
              <div className="yam-scrollhero-card-fill" />
            </div>
          ))}
        </div>

        <div className="yam-scrollhero-text" ref={textRef}>
          <p
            className="yam-eyebrow yam-reveal"
            data-in={start ? "true" : "false"}
            style={{ "--d": "0.1s" }}
          >
            Yamnang Studio
          </p>
          <h1
            className="yam-scrollhero-headline yam-reveal-lines"
            data-in={start ? "true" : "false"}
          >
            <span className="yam-line">
              <span className="yam-line-inner">Designed</span>
            </span>
            <span className="yam-line">
              <span className="yam-line-inner">to move.</span>
            </span>
          </h1>
        </div>

      </div>
    </section>
  );
}
