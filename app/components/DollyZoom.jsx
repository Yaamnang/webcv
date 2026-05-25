"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const LAYERS = [
  { z: -1400, gradient: "linear-gradient(135deg,#1d2438,#3a4768)" },
  { z: -900, gradient: "linear-gradient(135deg,#2c1e30,#5a3f6a)" },
  { z: -500, gradient: "linear-gradient(135deg,#1a2a1e,#3e6248)" },
  { z: -250, gradient: "linear-gradient(135deg,#5a2a18,#a8431a)" },
];

/* The Hitchcock dolly zoom — perspective shrinks AND scene moves
   forward in opposite proportions, so the focal subject keeps its
   apparent size while everything around it stretches & warps. */
export default function DollyZoom() {
  const sectionRef = useRef(null);
  const sceneRef = useRef(null);
  const layersRef = useRef([]);
  const focalRef = useRef(null);
  const taglineRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const scene = sceneRef.current;
    const layers = layersRef.current.filter(Boolean);
    const focal = focalRef.current;
    const tagline = taglineRef.current;

    layers.forEach((l, i) => gsap.set(l, { z: LAYERS[i].z }));
    gsap.set(focal, { scale: 1 });
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
          onUpdate: (self) => {
            const p = self.progress;
            scene.style.perspective = `${1800 - p * 1400}px`;
          },
        },
      });

      layers.forEach((l, i) => {
        tl.to(l, { z: LAYERS[i].z + 900, ease: "none", duration: 1 }, 0);
      });

      tl.to(focal, { scale: 0.55, ease: "none", duration: 1 }, 0);

      tl.to(
        tagline,
        { opacity: 1, y: 0, ease: "expo.out", duration: 0.7 },
        0.85
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="yam-dolly" ref={sectionRef} id="dolly">
      <div className="yam-dolly-scene" ref={sceneRef}>
        {LAYERS.map((l, i) => (
          <div
            key={i}
            ref={(el) => (layersRef.current[i] = el)}
            className="yam-dolly-layer"
            style={{ background: l.gradient }}
            aria-hidden="true"
          />
        ))}
        <div className="yam-dolly-focal" ref={focalRef}>
          ALWAYS HERE.
        </div>
      </div>
      <h2 className="yam-dolly-tagline" ref={taglineRef}>
        The world bends around the work.
      </h2>
      <div className="yam-dolly-caption">
        <span>Phase 13</span>
        <span>—</span>
        <span>Dolly zoom.</span>
      </div>
    </section>
  );
}
