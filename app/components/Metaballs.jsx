"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const BLOB_COUNT = 7;

/* Metaballs — multiple SVG circles passed through a gaussian-blur +
   color-matrix filter so they merge into mercury-like blobs when they
   overlap. Scroll-driven polar motion brings them together / apart. */
export default function Metaballs() {
  const sectionRef = useRef(null);
  const blobsRef = useRef([]);
  const taglineRef = useRef(null);
  const stateRef = useRef({ t: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const blobs = blobsRef.current.filter(Boolean);
    const tagline = taglineRef.current;

    gsap.set(tagline, { opacity: 0, y: 30 });

    const ctx = gsap.context(() => {
      gsap.to(stateRef.current, {
        t: 1,
        ease: "none",
        onUpdate: () => {
          const t = stateRef.current.t;
          blobs.forEach((blob, i) => {
            const baseAngle = (i / BLOB_COUNT) * Math.PI * 2;
            const time = t * Math.PI * 3.5 + i * 0.7;
            /* radius oscillates AND converges over scroll progress */
            const radius =
              22 + Math.sin(time) * 10 - t * 14;
            const x = 50 + Math.cos(time + baseAngle) * radius;
            const y = 50 + Math.sin(time + baseAngle) * radius;
            const r = 13 + Math.sin(time * 1.4 + i) * 5;
            blob.setAttribute("cx", `${x}%`);
            blob.setAttribute("cy", `${y}%`);
            blob.setAttribute("r", `${r}%`);
          });
        },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=280%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      gsap.to(tagline, {
        opacity: 1,
        y: 0,
        ease: "expo.out",
        scrollTrigger: {
          trigger: section,
          start: "78% top",
          end: "92% top",
          scrub: 0.6,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="yam-metaballs" ref={sectionRef} id="metaballs">
      <svg
        className="yam-metaballs-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <filter id="yam-metaballs-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
            <feColorMatrix
              in="blur"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 22 -10
              "
            />
          </filter>
        </defs>
        <g filter="url(#yam-metaballs-filter)">
          {Array.from({ length: BLOB_COUNT }).map((_, i) => (
            <circle
              key={i}
              ref={(el) => (blobsRef.current[i] = el)}
              cx="50%"
              cy="50%"
              r="13%"
              fill={
                ["#ff5533", "#5bd1d7", "#ffd66e", "#a489b8"][i % 4]
              }
            />
          ))}
        </g>
      </svg>
      <h2 className="yam-metaballs-tagline" ref={taglineRef}>
        Quicksilver.
      </h2>
      <div className="yam-metaballs-caption">
        <span>Phase 09</span>
        <span>—</span>
        <span>Liquid.</span>
      </div>
    </section>
  );
}
