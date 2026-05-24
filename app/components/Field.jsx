"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * Field — a true multi-layer parallax composition.
 * Three depth layers (background blurred, midground gradient, foreground
 * sharp) each scrub-tied to scroll with different Y deltas + rotation
 * deltas, producing a strong depth illusion. Two pinned-style headlines
 * fade in and out as they pass through the viewport.
 *
 * The rectangles are placeholders — swap each `grad` for a real image
 * (background-image: url(...)) when the user's work is ready.
 */
const RECTS = [
  /* background layer — large, blurred, very slow parallax */
  { layer: "bg", x: -10, y: -10, w: 46, h: 60, dy: 100, rot: -2, drot: 6,
    grad: "linear-gradient(135deg,#1d2438,#3a4768 60%,#7b8aac)" },
  { layer: "bg", x: 56, y: 75, w: 42, h: 56, dy: 95, rot: 1, drot: -5,
    grad: "linear-gradient(135deg,#2c1e30,#5a3f6a 60%,#a489b8)" },
  { layer: "bg", x: -4, y: 158, w: 44, h: 58, dy: 92, rot: -1, drot: 7,
    grad: "linear-gradient(135deg,#1a2a1e,#3e6248 60%,#8eb39a)" },

  /* midground layer — medium gradient blocks */
  { layer: "mid", x: 50, y: 18, w: 30, h: 38, dy: 35, rot: 2, drot: -8,
    grad: "linear-gradient(140deg,#ff5533,#7a2519 65%,#2b0d08)" },
  { layer: "mid", x: 8, y: 55, w: 28, h: 36, dy: 38, rot: -3, drot: 10,
    grad: "linear-gradient(150deg,#ffd66e,#9a7322 65%,#3b2a08)" },
  { layer: "mid", x: 52, y: 110, w: 32, h: 40, dy: 32, rot: 1, drot: -6,
    grad: "linear-gradient(160deg,#5bd1d7,#1f6669 65%,#082226)" },
  { layer: "mid", x: 5, y: 168, w: 30, h: 38, dy: 36, rot: 2, drot: -9,
    grad: "linear-gradient(130deg,#d59aa3,#7a3640 65%,#2b1c1e)" },
  { layer: "mid", x: 48, y: 215, w: 28, h: 36, dy: 30, rot: -1, drot: 5,
    grad: "linear-gradient(145deg,#b0c987,#4f7237 65%,#1a2a13)" },

  /* foreground layer — small, sharp, fast parallax */
  { layer: "fg", x: 32, y: 42, w: 16, h: 22, dy: -50, rot: 4, drot: -12,
    grad: "linear-gradient(135deg,#ffffff,#dddddd)" },
  { layer: "fg", x: 70, y: 95, w: 14, h: 20, dy: -48, rot: -5, drot: 14,
    grad: "linear-gradient(135deg,#ff5533,#cc3a1a)" },
  { layer: "fg", x: 16, y: 148, w: 16, h: 22, dy: -55, rot: 3, drot: -10,
    grad: "linear-gradient(135deg,#5bd1d7,#3a8a90)" },
  { layer: "fg", x: 60, y: 200, w: 14, h: 20, dy: -46, rot: -4, drot: 11,
    grad: "linear-gradient(135deg,#ffffff,#dddddd)" },
];

const HEADLINES = [
  { y: 75, text: ["Built layer", "by layer."] },
  { y: 205, text: ["Every detail", "lives somewhere."] },
];

export default function Field() {
  const sectionRef = useRef(null);
  const rectsRef = useRef([]);
  const headlinesRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const rects = rectsRef.current.filter(Boolean);
    const headlines = headlinesRef.current.filter(Boolean);

    const ctx = gsap.context(() => {
      /* per-rect parallax — y delta + rotation delta, scrubbed to scroll */
      rects.forEach((rectEl, i) => {
        const r = RECTS[i];
        gsap.set(rectEl, { rotation: r.rot });
        gsap.to(rectEl, {
          y: `${r.dy}vh`,
          rotation: `+=${r.drot}`,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      /* headlines — fade in, hold, fade out over their viewport pass */
      headlines.forEach((h) => {
        gsap.set(h, { opacity: 0, y: 60 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: h,
            start: "top 88%",
            end: "top -5%",
            scrub: 0.6,
          },
        });
        tl.to(h, { opacity: 1, y: 0, ease: "power2.out", duration: 0.35 }, 0);
        tl.to(h, { opacity: 1, y: 0, duration: 0.3 }, 0.35);
        tl.to(h, { opacity: 0, y: -60, ease: "power2.in", duration: 0.35 }, 0.65);
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="yam-field" ref={sectionRef} id="field">
      {RECTS.map((r, i) => (
        <div
          key={i}
          ref={(el) => (rectsRef.current[i] = el)}
          className="yam-field-rect"
          data-layer={r.layer}
          style={{
            left: `${r.x}vw`,
            top: `${r.y}vh`,
            width: `${r.w}vw`,
            height: `${r.h}vh`,
            background: r.grad,
          }}
          aria-hidden="true"
        />
      ))}

      {HEADLINES.map((h, i) => (
        <h2
          key={i}
          ref={(el) => (headlinesRef.current[i] = el)}
          className="yam-field-headline"
          style={{ top: `${h.y}vh` }}
        >
          {h.text.map((line, j) => (
            <span key={j}>
              {line}
              {j < h.text.length - 1 && <br />}
            </span>
          ))}
        </h2>
      ))}

      <div className="yam-field-caption">
        <span>Phase 03</span>
        <span>—</span>
        <span>In layers.</span>
      </div>
    </section>
  );
}
