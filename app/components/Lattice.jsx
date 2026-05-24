"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const COLS = 10;
const ROWS = 6;
const TOTAL = COLS * ROWS;

/* hue-shifted gradient across the grid so the final formation reads as
   a smooth color field, not a random patchwork */
const cardGradient = (i) => {
  const row = Math.floor(i / COLS);
  const col = i % COLS;
  const hue = (col / COLS) * 65 + (row / ROWS) * 30 + 198;
  const light = 36 + (col / COLS) * 22;
  return `linear-gradient(135deg, hsl(${hue}, 68%, ${light}%), hsl(${
    hue + 28
  }, 72%, ${light - 18}%))`;
};

/**
 * Lattice — pinned 60-card choreography that runs four scroll-driven
 * phases on a single GSAP timeline:
 *
 *  1. Diagonal bloom — cards scale in from a top-left wave
 *  2. Stadium-wave flip — each card spins 360° in diagonal stagger
 *  3. 3D explosion — every card hurled to a random (x, y, z, rotation)
 *     while a center-radial flash whites the scene briefly
 *  4. Cinematic converge — cards return from the outside-in to perfect
 *     formation, tagline materializes
 */
export default function Lattice() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const flashRef = useRef(null);
  const taglineRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const cards = cardsRef.current.filter(Boolean);
    const flash = flashRef.current;
    const tagline = taglineRef.current;
    if (cards.length !== TOTAL || !flash || !tagline) return;

    gsap.set(cards, { scale: 0, opacity: 0 });
    gsap.set(flash, { opacity: 0 });
    gsap.set(tagline, { opacity: 0, y: 30 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=380%",
          pin: true,
          scrub: 1.15,
          anticipatePin: 1,
        },
      });

      /* PHASE 1 — diagonal bloom */
      tl.to(
        cards,
        {
          scale: 1,
          opacity: 1,
          ease: "back.out(1.4)",
          duration: 0.55,
          stagger: {
            grid: [ROWS, COLS],
            from: "start",
            amount: 0.6,
          },
        },
        0
      );

      /* PHASE 2 — stadium-wave flip (full 360° spin) */
      tl.to(
        cards,
        {
          rotationY: 360,
          ease: "power1.inOut",
          duration: 0.75,
          stagger: {
            grid: [ROWS, COLS],
            from: "start",
            amount: 0.75,
          },
        },
        0.95
      );

      /* PHASE 3 — 3D explosion + flash */
      tl.to(
        cards,
        {
          x: () => gsap.utils.random(-720, 720),
          y: () => gsap.utils.random(-460, 460),
          z: () => gsap.utils.random(-900, 500),
          rotationX: () => gsap.utils.random(-540, 540),
          rotationY: () => 360 + gsap.utils.random(-360, 360),
          rotationZ: () => gsap.utils.random(-180, 180),
          ease: "power2.out",
          duration: 1.0,
          stagger: { each: 0.005, from: "center" },
        },
        2.0
      );
      tl.to(
        flash,
        { opacity: 0.85, ease: "power2.out", duration: 0.3 },
        2.0
      );
      tl.to(
        flash,
        { opacity: 0, ease: "power2.in", duration: 0.6 },
        2.3
      );

      /* PHASE 4 — converge back, outside-in */
      tl.to(
        cards,
        {
          x: 0,
          y: 0,
          z: 0,
          rotationX: 0,
          rotationY: 0,
          rotationZ: 0,
          ease: "power3.inOut",
          duration: 1.0,
          stagger: { each: 0.008, from: "edges" },
        },
        3.2
      );

      /* tagline lands as the formation completes */
      tl.to(
        tagline,
        { opacity: 1, y: 0, ease: "expo.out", duration: 0.7 },
        3.85
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="yam-lattice" ref={sectionRef} id="lattice">
      <div className="yam-lattice-bg" aria-hidden="true" />
      <div className="yam-lattice-grid">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (cardsRef.current[i] = el)}
            className="yam-lattice-card"
            aria-hidden="true"
          >
            <div
              className="yam-lattice-face yam-lattice-face-front"
              style={{ background: cardGradient(i) }}
            />
            <div className="yam-lattice-face yam-lattice-face-back" />
          </div>
        ))}
      </div>
      <div className="yam-lattice-flash" ref={flashRef} aria-hidden="true" />
      <div className="yam-lattice-tagline" ref={taglineRef}>
        Sixty pieces. One mind.
      </div>
      <div className="yam-lattice-caption">
        <span>Phase 04</span>
        <span>—</span>
        <span>Choreographed.</span>
      </div>
    </section>
  );
}
