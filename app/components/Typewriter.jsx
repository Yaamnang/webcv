"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const LINES = [
  "DESIGN INTERFACES THAT LISTEN.",
  "WRITE CODE THAT AGES WELL.",
  "PROTOTYPE FASTER THAN WORDS.",
  "SHIP WORK YOU CAN POINT TO.",
  "CARE ABOUT THE TENTH DETAIL.",
];

/* Each line types itself char-by-char at a slightly different speed/offset.
   Tied to scroll progress via a single onUpdate — DOM-direct textContent
   writes so no React re-render per frame. */
export default function Typewriter() {
  const sectionRef = useRef(null);
  const linesRef = useRef([]);
  const taglineRef = useRef(null);
  const stateRef = useRef({ p: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const lineEls = linesRef.current.filter(Boolean);
    const tagline = taglineRef.current;

    gsap.set(tagline, { opacity: 0, y: 30 });
    lineEls.forEach((el) => (el.textContent = ""));

    const ctx = gsap.context(() => {
      gsap.to(stateRef.current, {
        p: 1,
        ease: "none",
        onUpdate: () => {
          const progress = stateRef.current.p;
          lineEls.forEach((el, i) => {
            const startAt = i * 0.09;
            const window_ = 0.6 + i * 0.04;
            const lineP = Math.max(0, Math.min(1, (progress - startAt) / window_));
            const text = LINES[i];
            const charsVisible = Math.round(text.length * lineP);
            el.textContent = text.slice(0, charsVisible);
          });
        },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=320%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      gsap.fromTo(
        tagline,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          ease: "expo.out",
          scrollTrigger: {
            trigger: section,
            start: "85% top",
            end: "95% top",
            scrub: 0.6,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="yam-typewriter" ref={sectionRef} id="typewriter">
      <div className="yam-typewriter-lines">
        {LINES.map((_, i) => (
          <div
            key={i}
            ref={(el) => (linesRef.current[i] = el)}
            className="yam-typewriter-line"
          />
        ))}
      </div>
      <h2 className="yam-typewriter-tagline" ref={taglineRef}>
        Written into being.
      </h2>
      <div className="yam-typewriter-caption">
        <span>Phase 12</span>
        <span>—</span>
        <span>Typewriter.</span>
      </div>
    </section>
  );
}
