"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/* placeholder CV metrics — swap for real numbers */
const STATS = [
  { value: 4, label: "Years", desc: "Active in design + dev" },
  { value: 28, label: "Projects", desc: "Shipped, live & cared for" },
  { value: 12, label: "Tools", desc: "Daily across the stack" },
  { value: 6, label: "Awards", desc: "Industry recognition" },
];

/**
 * Numbers — animated CV stat counters.
 * Four big numbers tick from 0 → target as the section scrubs by; each
 * cell has a quietly pulsing accent ring behind it, so the field has
 * life even when a counter is steady. Real, useful content for a CV.
 */
export default function Numbers() {
  const sectionRef = useRef(null);
  const valuesRef = useRef([]);
  const ringsRef = useRef([]);
  const taglineRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const values = valuesRef.current.filter(Boolean);
    const rings = ringsRef.current.filter(Boolean);
    const tagline = taglineRef.current;

    const counters = STATS.map(() => ({ v: 0 }));
    gsap.set(tagline, { opacity: 0, y: 30 });

    /* gentle background pulse on the rings, independent of scroll */
    rings.forEach((ring, i) => {
      gsap.to(ring, {
        scale: 1.05,
        opacity: 0.7,
        repeat: -1,
        yoyo: true,
        duration: 1.8 + i * 0.15,
        ease: "sine.inOut",
      });
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      STATS.forEach((stat, i) => {
        tl.to(
          counters[i],
          {
            v: stat.value,
            ease: "power2.out",
            duration: 1,
            onUpdate: () => {
              const el = values[i];
              if (el) el.textContent = String(Math.round(counters[i].v));
            },
          },
          i * 0.18
        );
      });

      tl.to(
        tagline,
        { opacity: 1, y: 0, ease: "expo.out", duration: 0.7 },
        ">+0.2"
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="yam-numbers" ref={sectionRef} id="numbers">
      <div className="yam-numbers-grid">
        {STATS.map((stat, i) => (
          <div key={i} className="yam-numbers-cell">
            <div
              className="yam-numbers-ring"
              ref={(el) => (ringsRef.current[i] = el)}
              aria-hidden="true"
            />
            <div className="yam-numbers-label">{stat.label}</div>
            <div
              className="yam-numbers-value"
              ref={(el) => (valuesRef.current[i] = el)}
            >
              0
            </div>
            <div className="yam-numbers-desc">{stat.desc}</div>
          </div>
        ))}
      </div>
      <h2 className="yam-numbers-tagline" ref={taglineRef}>
        Receipts.
      </h2>
      <div className="yam-numbers-caption">
        <span>Phase 17</span>
        <span>—</span>
        <span>By the numbers.</span>
      </div>
    </section>
  );
}
