"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/* six organic blob silhouettes — same border-radius "8-value" syntax
   so GSAP can tween between them smoothly */
const FRAMES = [
  "30% 70% 70% 30% / 30% 30% 70% 70%",
  "70% 30% 50% 50% / 50% 50% 30% 70%",
  "50% 50% 30% 70% / 70% 30% 50% 50%",
  "60% 40% 60% 40% / 40% 60% 40% 60%",
  "35% 65% 45% 55% / 55% 45% 65% 35%",
  "50% 50% 50% 50% / 50% 50% 50% 50%",
];

const BG_COLORS = [
  "#1a0a2e",
  "#2a0a3e",
  "#0a2e3e",
  "#0a2e1a",
  "#3e1a0a",
  "#020308",
];

const BLOB_GRADIENTS = [
  "linear-gradient(135deg, #ff5533, #ffd66e)",
  "linear-gradient(135deg, #5bd1d7, #a489b8)",
  "linear-gradient(135deg, #ffd66e, #5bd1d7)",
  "linear-gradient(135deg, #b0c987, #5bd1d7)",
  "linear-gradient(135deg, #ff5533, #a489b8)",
  "linear-gradient(135deg, #ffffff, #5bd1d7)",
];

/**
 * Morph — a single blob whose `border-radius` (8-value syntax)
 * morphs through six organic forms across the scroll. Background hue
 * and the blob's gradient shift in sync, the blob rotates a bit each
 * step so the silhouette change reads as a true transformation, not
 * a static swap. A radial aura behind it scales gently to breathe.
 */
export default function Morph() {
  const sectionRef = useRef(null);
  const shapeRef = useRef(null);
  const auraRef = useRef(null);
  const taglineRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const shape = shapeRef.current;
    const aura = auraRef.current;
    const tagline = taglineRef.current;
    if (!section || !shape) return;

    gsap.set(shape, { xPercent: -50, yPercent: -50, rotation: 0 });
    gsap.set(aura, { xPercent: -50, yPercent: -50, scale: 1, opacity: 0.6 });
    gsap.set(tagline, { opacity: 0, y: 30 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1.1,
          anticipatePin: 1,
        },
      });

      /* step through each subsequent frame */
      for (let i = 1; i < FRAMES.length; i++) {
        tl.to(
          shape,
          {
            borderRadius: FRAMES[i],
            background: BLOB_GRADIENTS[i],
            rotation: i * 55,
            scale: 1 + (i % 2 === 0 ? 0.05 : -0.05),
            ease: "power2.inOut",
            duration: 1,
          },
          i - 1
        );
        tl.to(
          section,
          {
            backgroundColor: BG_COLORS[i],
            ease: "power2.inOut",
            duration: 1,
          },
          i - 1
        );
        /* aura pulses with each morph */
        tl.to(
          aura,
          {
            scale: 1.15,
            opacity: 0.45 + (i % 2 === 0 ? 0.2 : 0.0),
            ease: "power1.inOut",
            duration: 0.5,
            yoyo: true,
            repeat: 1,
          },
          i - 1
        );
      }

      /* tagline lands as the final form (a circle) settles */
      tl.to(
        tagline,
        { opacity: 1, y: 0, ease: "expo.out", duration: 0.7 },
        FRAMES.length - 1.4
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="yam-morph" ref={sectionRef} id="morph">
      <div className="yam-morph-aura" ref={auraRef} aria-hidden="true" />
      <div className="yam-morph-shape" ref={shapeRef} aria-hidden="true" />

      <h2 className="yam-morph-tagline" ref={taglineRef}>
        Form follows feeling.
      </h2>

      <div className="yam-morph-caption">
        <span>Phase 07</span>
        <span>—</span>
        <span>Mutate.</span>
      </div>
    </section>
  );
}
