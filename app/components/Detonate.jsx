"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const RING_COUNT = 14;
const PARTICLE_COUNT = 30;

/* studio vocabulary — words rush past the camera at different depths */
const WORDS = [
  { t: "design", x: "-30vw", y: "-25vh", z: -3000, c: "#ff5533" },
  { t: "code",   x: "25vw",  y: "-15vh", z: -2700, c: "#ffffff" },
  { t: "motion", x: "-15vw", y: "22vh",  z: -2400, c: "#5bd1d7" },
  { t: "craft",  x: "30vw",  y: "12vh",  z: -2100, c: "#ffffff" },
  { t: "system", x: "-26vw", y: "26vh",  z: -1800, c: "#ffd66e" },
  { t: "shape",  x: "22vw",  y: "-22vh", z: -1500, c: "#ffffff" },
  { t: "build",  x: "-20vw", y: "-10vh", z: -1200, c: "#ff5533" },
  { t: "ship",   x: "18vw",  y: "20vh",  z: -900,  c: "#ffffff" },
];

const FINAL = "Built to move.";

/**
 * Pinned GSAP section: scroll-driven 3D POV dive.
 * Tunnel rings recede then blow past the camera, brand vocabulary
 * rushes at the viewer from deep Z, particles streak by, a chromatic
 * vortex spins at the vanishing point, the background phases through
 * a bruise-red palette, and a tagline lands at the end.
 */
export default function Detonate() {
  const sectionRef = useRef(null);
  const vortexRef = useRef(null);
  const finalRef = useRef(null);
  const captionRef = useRef(null);
  const ringsRef = useRef([]);
  const wordsRef = useRef([]);
  const particlesRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const vortex = vortexRef.current;
    const finalEl = finalRef.current;
    const caption = captionRef.current;
    const rings = ringsRef.current.filter(Boolean);
    const words = wordsRef.current.filter(Boolean);
    const particles = particlesRef.current.filter(Boolean);

    /* center every actor via percent-translation so transforms compose cleanly */
    rings.forEach((r) =>
      gsap.set(r, { xPercent: -50, yPercent: -50, opacity: 0 })
    );
    words.forEach((w, i) =>
      gsap.set(w, {
        xPercent: -50,
        yPercent: -50,
        x: WORDS[i].x,
        y: WORDS[i].y,
        color: WORDS[i].c,
        opacity: 0,
      })
    );
    particles.forEach((p) =>
      gsap.set(p, {
        xPercent: -50,
        yPercent: -50,
        x: `${gsap.utils.random(-45, 45)}vw`,
        y: `${gsap.utils.random(-45, 45)}vh`,
        opacity: 0,
      })
    );
    gsap.set(vortex, { xPercent: -50, yPercent: -50, rotation: 0 });
    gsap.set(finalEl, { xPercent: -50, yPercent: -50, opacity: 0, scale: 4 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=350%",
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      /* BG color phases — dark → bruise → flash → reset */
      tl.to(section, { backgroundColor: "#2d0a1a", duration: 1.2, ease: "power1.in" }, 0.2);
      tl.to(section, { backgroundColor: "#7a1a2e", duration: 1.0, ease: "power1.inOut" }, 1.6);
      tl.to(section, { backgroundColor: "#0a0612", duration: 0.7, ease: "power1.out" }, 3.0);

      /* Vortex — spins faster + expands during dive, then blows out */
      tl.to(vortex, { rotation: 540, scale: 1.6, duration: 2.8, ease: "power1.in" }, 0);
      tl.to(vortex, { rotation: 900, scale: 3.2, opacity: 0, duration: 0.6, ease: "power2.in" }, 2.9);

      /* 14 tunnel rings — recede from deep Z, then blow past the camera */
      rings.forEach((ring, i) => {
        const start = i * 0.05;
        const initialZ = -3500 + i * 230;
        tl.fromTo(
          ring,
          { z: initialZ, opacity: 0, rotation: gsap.utils.random(-15, 15) },
          { z: 900, opacity: 1, ease: "none", duration: 1.4 },
          start
        );
        tl.to(ring, { opacity: 0, duration: 0.25, ease: "power1.in" }, start + 1.2);
      });

      /* 8 brand words rush past with Y-axis tumble */
      words.forEach((wordEl, i) => {
        const w = WORDS[i];
        const start = 0.35 + i * 0.22;
        tl.fromTo(
          wordEl,
          {
            z: w.z,
            opacity: 0,
            rotationY: gsap.utils.random(-30, 30),
            scale: 0.5,
          },
          {
            z: 1400,
            opacity: 1,
            rotationY: 0,
            scale: 1,
            ease: "power2.in",
            duration: 1.3,
          },
          start
        );
        tl.to(wordEl, { opacity: 0, duration: 0.2, ease: "power1.in" }, start + 1.1);
      });

      /* 30 particles streak past — distribute starts across the timeline */
      particles.forEach((p, i) => {
        const start = (i * 0.08) % 3;
        tl.fromTo(
          p,
          { z: -3000, opacity: 0 },
          { z: 1000, opacity: 0.9, ease: "power2.in", duration: 1.1 },
          start
        );
        tl.to(p, { opacity: 0, duration: 0.2, ease: "power1.in" }, start + 0.95);
      });

      /* Final tagline lands centered — back-tilt corrects to flat */
      tl.fromTo(
        finalEl,
        { opacity: 0, scale: 5, rotationX: -45 },
        { opacity: 1, scale: 1, rotationX: 0, ease: "expo.out", duration: 1.4 },
        3.0
      );
      tl.to(caption, { color: "rgba(255, 255, 255, 0.85)", duration: 0.4 }, 3.0);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="yam-dive" ref={sectionRef} id="detonate">
      <div className="yam-dive-vortex" ref={vortexRef} aria-hidden="true" />
      <div className="yam-dive-scene">
        {Array.from({ length: RING_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (ringsRef.current[i] = el)}
            className={`yam-dive-ring${i % 3 === 0 ? " accent" : ""}`}
            aria-hidden="true"
          />
        ))}
        {WORDS.map((w, i) => (
          <div
            key={i}
            ref={(el) => (wordsRef.current[i] = el)}
            className="yam-dive-word"
            aria-hidden="true"
          >
            {w.t}
          </div>
        ))}
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (particlesRef.current[i] = el)}
            className={`yam-dive-particle${i % 5 === 0 ? " accent" : ""}`}
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="yam-dive-final" ref={finalRef}>
        {FINAL}
      </div>
      <div className="yam-dive-caption" ref={captionRef}>
        <span>Phase 02</span>
        <span>—</span>
        <span>Dive in.</span>
      </div>
    </section>
  );
}
