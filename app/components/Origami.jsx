"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const PANELS = [
  { color: "linear-gradient(135deg,#ff5533,#cc3a1a)", label: "Sketch" },
  { color: "linear-gradient(135deg,#ffd66e,#9a7322)", label: "Test" },
  { color: "linear-gradient(135deg,#5bd1d7,#1f6669)", label: "Ship" },
  { color: "linear-gradient(135deg,#a489b8,#5a3f6a)", label: "Care" },
];

/* Four panels share a central edge, each rotated away on Y like
   the leaves of a paper sculpture. Scroll unfolds them one by one,
   alternating origin (left vs right edge) for a hinged-paper feel. */
export default function Origami() {
  const sectionRef = useRef(null);
  const panelsRef = useRef([]);
  const taglineRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const panels = panelsRef.current.filter(Boolean);
    const tagline = taglineRef.current;

    panels.forEach((p, i) => {
      const fromLeft = i % 2 === 0;
      gsap.set(p, {
        rotationY: fromLeft ? -110 : 110,
        transformOrigin: fromLeft ? "left center" : "right center",
        opacity: 0.25,
      });
    });
    gsap.set(tagline, { opacity: 0, y: 30 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=320%",
          pin: true,
          scrub: 1.1,
          anticipatePin: 1,
        },
      });

      panels.forEach((p, i) => {
        tl.to(
          p,
          {
            rotationY: 0,
            opacity: 1,
            ease: "power3.out",
            duration: 0.85,
          },
          i * 0.75
        );
      });

      tl.to(
        tagline,
        { opacity: 1, y: 0, ease: "expo.out", duration: 0.7 },
        panels.length * 0.75 + 0.2
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="yam-origami" ref={sectionRef} id="origami">
      <div className="yam-origami-stage">
        {PANELS.map((p, i) => (
          <div
            key={i}
            ref={(el) => (panelsRef.current[i] = el)}
            className="yam-origami-panel"
            style={{ background: p.color }}
          >
            <span className="yam-origami-label">{p.label}</span>
          </div>
        ))}
      </div>
      <h2 className="yam-origami-tagline" ref={taglineRef}>
        One sheet, four turns.
      </h2>
      <div className="yam-origami-caption">
        <span>Phase 14</span>
        <span>—</span>
        <span>Fold.</span>
      </div>
    </section>
  );
}
