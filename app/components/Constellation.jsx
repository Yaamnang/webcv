"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const NODES = [
  /* Y endpoints (main) */
  { x: 30, y: 25, main: true, size: 1.4 },
  { x: 70, y: 25, main: true, size: 1.4 },
  { x: 50, y: 50, main: true, size: 1.7 },
  { x: 50, y: 82, main: true, size: 1.4 },
  /* ambient */
  { x: 10, y: 12, size: 0.7 },
  { x: 22, y: 10, size: 0.6 },
  { x: 50, y: 8, size: 0.6 },
  { x: 80, y: 12, size: 0.6 },
  { x: 92, y: 18, size: 0.7 },
  { x: 12, y: 38, size: 0.8 },
  { x: 38, y: 38, size: 0.6 },
  { x: 62, y: 38, size: 0.6 },
  { x: 88, y: 40, size: 0.8 },
  { x: 18, y: 62, size: 0.7 },
  { x: 36, y: 65, size: 0.6 },
  { x: 64, y: 65, size: 0.6 },
  { x: 82, y: 62, size: 0.7 },
  { x: 14, y: 84, size: 0.6 },
  { x: 28, y: 92, size: 0.6 },
  { x: 72, y: 92, size: 0.6 },
  { x: 86, y: 84, size: 0.6 },
  { x: 30, y: 50, size: 0.5 },
  { x: 70, y: 50, size: 0.5 },
  { x: 50, y: 70, size: 0.5 },
];

const CONNECTIONS = [
  /* main Y */
  { from: 0, to: 2, main: true },
  { from: 1, to: 2, main: true },
  { from: 2, to: 3, main: true },
  /* ambient mesh */
  { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 6, to: 7 }, { from: 7, to: 8 },
  { from: 4, to: 9 }, { from: 8, to: 12 },
  { from: 9, to: 10 }, { from: 10, to: 11 }, { from: 11, to: 12 },
  { from: 9, to: 13 }, { from: 12, to: 16 },
  { from: 13, to: 14 }, { from: 14, to: 15 }, { from: 15, to: 16 },
  { from: 13, to: 17 }, { from: 16, to: 20 },
  { from: 17, to: 18 }, { from: 19, to: 20 },
  { from: 21, to: 10 }, { from: 22, to: 11 }, { from: 23, to: 14 }, { from: 23, to: 15 },
];

export default function Constellation() {
  const sectionRef = useRef(null);
  const nodesRef = useRef([]);
  const linesRef = useRef([]);
  const taglineRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const nodes = nodesRef.current.filter(Boolean);
    const lines = linesRef.current.filter(Boolean);
    const tagline = taglineRef.current;

    gsap.set(nodes, { scale: 0, opacity: 0, transformOrigin: "center" });
    lines.forEach((line, i) => {
      const c = CONNECTIONS[i];
      const from = NODES[c.from];
      const to = NODES[c.to];
      const len = Math.sqrt(
        (to.x - from.x) ** 2 + (to.y - from.y) ** 2
      );
      gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
    });
    gsap.set(tagline, { opacity: 0, y: 30 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      tl.to(
        nodes,
        {
          scale: 1,
          opacity: 1,
          ease: "back.out(1.5)",
          duration: 0.4,
          stagger: { each: 0.025, from: "random" },
        },
        0
      );

      const ambient = lines.filter((_, i) => !CONNECTIONS[i].main);
      tl.to(
        ambient,
        {
          strokeDashoffset: 0,
          ease: "none",
          duration: 0.5,
          stagger: { each: 0.022, from: "random" },
        },
        1.0
      );

      const main = lines.filter((_, i) => CONNECTIONS[i].main);
      tl.to(
        main,
        {
          strokeDashoffset: 0,
          ease: "power2.out",
          duration: 0.7,
          stagger: 0.18,
        },
        2.1
      );

      const mainNodes = nodes.filter((_, i) => NODES[i].main);
      tl.to(
        mainNodes,
        {
          scale: 1.7,
          ease: "power2.inOut",
          duration: 0.4,
          yoyo: true,
          repeat: 1,
        },
        2.9
      );

      tl.to(
        tagline,
        { opacity: 1, y: 0, ease: "expo.out", duration: 0.6 },
        3.5
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="yam-constellation"
      ref={sectionRef}
      id="constellation"
    >
      <svg
        className="yam-constellation-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {CONNECTIONS.map((c, i) => {
          const from = NODES[c.from];
          const to = NODES[c.to];
          return (
            <line
              key={i}
              ref={(el) => (linesRef.current[i] = el)}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              className={`yam-constellation-line${c.main ? " main" : ""}`}
            />
          );
        })}
        {NODES.map((n, i) => (
          <circle
            key={i}
            ref={(el) => (nodesRef.current[i] = el)}
            cx={n.x}
            cy={n.y}
            r={n.size}
            className={`yam-constellation-node${n.main ? " main" : ""}`}
          />
        ))}
      </svg>
      <h2 className="yam-constellation-tagline" ref={taglineRef}>
        Every line lands.
      </h2>
      <div className="yam-constellation-caption">
        <span>Phase 10</span>
        <span>—</span>
        <span>Circuit.</span>
      </div>
    </section>
  );
}
