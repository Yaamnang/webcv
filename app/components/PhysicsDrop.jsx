"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const COLORS = ["#ff5533", "#5bd1d7", "#ffd66e", "#a489b8", "#b0c987"];

/* 20 rectangles arranged at the bottom of the section as their target,
   each falls from above with a bounce.out so the landings are clearly
   physics-feeling — heavier on first impact, settling on subsequent. */
const RECTS = Array.from({ length: 20 }).map((_, i) => ({
  targetX: 6 + (i % 10) * 9, // vw
  targetY: 55 + Math.floor(i / 10) * 18, // vh
  w: 7,
  h: 16,
  color: COLORS[i % COLORS.length],
  delay: (i % 10) * 0.08 + Math.floor(i / 10) * 0.6,
}));

export default function PhysicsDrop() {
  const sectionRef = useRef(null);
  const rectsRef = useRef([]);
  const taglineRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const rects = rectsRef.current.filter(Boolean);
    const tagline = taglineRef.current;

    rects.forEach((rect) => {
      gsap.set(rect, {
        y: "-130vh",
        rotation: gsap.utils.random(-18, 18),
      });
    });
    gsap.set(tagline, { opacity: 0, y: 30 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      rects.forEach((rect, i) => {
        const meta = RECTS[i];
        tl.to(
          rect,
          {
            y: 0,
            rotation: gsap.utils.random(-3, 3),
            ease: "bounce.out",
            duration: 1.1,
          },
          meta.delay
        );
      });

      tl.to(
        tagline,
        { opacity: 1, y: 0, ease: "expo.out", duration: 0.6 },
        ">-0.2"
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="yam-physics" ref={sectionRef} id="physics">
      {RECTS.map((r, i) => (
        <div
          key={i}
          ref={(el) => (rectsRef.current[i] = el)}
          className="yam-physics-rect"
          style={{
            left: `${r.targetX}vw`,
            top: `${r.targetY}vh`,
            width: `${r.w}vw`,
            height: `${r.h}vh`,
            backgroundColor: r.color,
          }}
          aria-hidden="true"
        />
      ))}
      <h2 className="yam-physics-tagline" ref={taglineRef}>
        Gravity is honest.
      </h2>
      <div className="yam-physics-caption">
        <span>Phase 11</span>
        <span>—</span>
        <span>Drop.</span>
      </div>
    </section>
  );
}
