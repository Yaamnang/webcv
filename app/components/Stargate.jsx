"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const STAR_COUNT = 90;

/* 9 planets across 3 elliptical orbits */
const ORBITS = [
  { r: 18, count: 2, speedFactor: 1.4, colors: ["#5bd1d7", "#ff5533"] },
  { r: 28, count: 3, speedFactor: 1.0, colors: ["#ffd66e", "#ffffff", "#ff5533"] },
  { r: 40, count: 4, speedFactor: 0.7, colors: ["#a489b8", "#5bd1d7", "#ffd66e", "#ffffff"] },
];
const PLANETS = ORBITS.flatMap((o, oi) =>
  Array.from({ length: o.count }, (_, j) => ({
    radius: o.r,
    angleOffset: (j / o.count) * Math.PI * 2 + oi * 0.4,
    speedFactor: o.speedFactor,
    color: o.colors[j % o.colors.length],
    size: 16 - oi * 2,
  }))
);

/**
 * Stargate — a portal opens revealing a 3D orbital scene inside.
 * The clip-path radius (a CSS variable on the portal layer) is scrubbed
 * from 0 → 100% → 0 across the scroll range. Inside the portal, a
 * glowing core has 3 elliptical orbits with 9 planets that travel
 * parametrically (polar coords from a master scroll progress). The
 * whole scene tilts in 3D mid-scroll. Final tagline reveals as the
 * portal closes.
 */
export default function Stargate() {
  const sectionRef = useRef(null);
  const portalRef = useRef(null);
  const sceneRef = useRef(null);
  const ringRef = useRef(null);
  const coreRef = useRef(null);
  const orbitsRef = useRef([]);
  const planetsRef = useRef([]);
  const starsRef = useRef([]);
  const taglineRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const portal = portalRef.current;
    const scene = sceneRef.current;
    const ring = ringRef.current;
    const core = coreRef.current;
    const tagline = taglineRef.current;
    const orbits = orbitsRef.current.filter(Boolean);
    const planets = planetsRef.current.filter(Boolean);
    const stars = starsRef.current.filter(Boolean);

    /* scatter stars deterministically per-mount */
    stars.forEach((s) => {
      gsap.set(s, {
        x: `${gsap.utils.random(-50, 50)}vw`,
        y: `${gsap.utils.random(-50, 50)}vh`,
        opacity: gsap.utils.random(0.3, 0.95),
        scale: gsap.utils.random(0.5, 1.5),
      });
    });

    /* size the orbit dashed circles + center them */
    orbits.forEach((o, i) => {
      const size = ORBITS[i].r * 2;
      gsap.set(o, {
        width: `${size}vmin`,
        height: `${size}vmin`,
        xPercent: -50,
        yPercent: -50,
      });
    });

    /* size + color the planets */
    planets.forEach((p, i) => {
      const meta = PLANETS[i];
      gsap.set(p, {
        width: meta.size,
        height: meta.size,
        xPercent: -50,
        yPercent: -50,
        backgroundColor: meta.color,
      });
    });

    gsap.set(portal, { "--portal-r": "0%" });
    gsap.set(ring, { scale: 0.2, opacity: 0 });
    gsap.set(tagline, { opacity: 0, scale: 1.3 });

    const state = { t: 0, orbitT: 0 };

    const ctx = gsap.context(() => {
      gsap.to(state, {
        t: 1,
        ease: "none",
        onUpdate: () => {
          const t = state.t;

          /* PORTAL — opens 0→100% by t=0.5, holds, closes by t=0.85 */
          let portalR;
          if (t < 0.5) portalR = (t / 0.5) * 110;
          else if (t < 0.75) portalR = 110;
          else if (t < 0.9) portalR = 110 - ((t - 0.75) / 0.15) * 90;
          else portalR = 20;
          portal.style.setProperty("--portal-r", `${portalR}%`);

          /* RING — outline that frames the portal mouth */
          let ringScale, ringOpacity;
          if (t < 0.5) {
            const wt = t / 0.5;
            ringScale = 0.2 + wt * 0.85;
            ringOpacity = wt;
          } else if (t < 0.85) {
            ringScale = 1.05 + Math.sin((t - 0.5) * 5) * 0.025;
            ringOpacity = 1;
          } else {
            const wt = (t - 0.85) / 0.15;
            ringScale = 1.05 - wt * 0.8;
            ringOpacity = 1 - wt;
          }
          gsap.set(ring, { scale: ringScale, opacity: ringOpacity });

          /* SCENE TILT — rotates in 3D mid-scroll */
          let tiltX = 0;
          let tiltZ = 0;
          if (t > 0.2 && t < 0.85) {
            const wt = (t - 0.2) / 0.65;
            tiltX = Math.sin(wt * Math.PI) * 55;
            tiltZ = Math.sin(wt * Math.PI * 0.5) * 20;
          }
          scene.style.transform = `rotateX(${tiltX.toFixed(
            2
          )}deg) rotateZ(${tiltZ.toFixed(2)}deg)`;

          /* CORE — pulses */
          const corePulse = 1 + Math.sin(t * Math.PI * 4) * 0.15;
          gsap.set(core, {
            xPercent: -50,
            yPercent: -50,
            scale: corePulse,
            opacity: t > 0.1 && t < 0.9 ? 1 : 0,
          });

          /* ORBITS — fade in with portal, fade out as portal closes */
          let orbitsOp = 0;
          if (t > 0.15 && t < 0.85) orbitsOp = 1;
          else if (t >= 0.85)
            orbitsOp = Math.max(0, 1 - (t - 0.85) / 0.1);
          orbits.forEach((o) => gsap.set(o, { opacity: orbitsOp * 0.7 }));

          /* PLANETS — orbit continuously based on scroll progress */
          state.orbitT = t * Math.PI * 5; // 2.5 revolutions per scroll
          planets.forEach((p, i) => {
            const meta = PLANETS[i];
            const angle =
              meta.angleOffset + state.orbitT * meta.speedFactor;
            const radius = meta.radius;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const planetOp =
              t > 0.15 && t < 0.85 ? 1 : Math.max(0, 1 - Math.abs(t - 0.5) * 4);
            gsap.set(p, {
              x: `${x}vmin`,
              y: `${y}vmin`,
              opacity: planetOp,
            });
          });

          /* TAGLINE — appears as portal closes */
          let tagOp = 0;
          let tagScale = 1.3;
          if (t > 0.86) {
            const wt = Math.min(1, (t - 0.86) / 0.12);
            const eased = 1 - Math.pow(1 - wt, 3);
            tagOp = eased;
            tagScale = 1.3 - eased * 0.3;
          }
          gsap.set(tagline, { opacity: tagOp, scale: tagScale });
        },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=320%",
          pin: true,
          scrub: 1.15,
          anticipatePin: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="yam-stargate" ref={sectionRef} id="stargate">
      {/* starfield */}
      <div className="yam-stargate-stars" aria-hidden="true">
        {Array.from({ length: STAR_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (starsRef.current[i] = el)}
            className="yam-stargate-star"
          />
        ))}
      </div>

      {/* portal — clip-pathed window into the orbital scene */}
      <div
        className="yam-stargate-portal"
        ref={portalRef}
        aria-hidden="true"
      >
        <div className="yam-stargate-scene" ref={sceneRef}>
          <div className="yam-stargate-core" ref={coreRef} />
          {ORBITS.map((_, i) => (
            <div
              key={i}
              ref={(el) => (orbitsRef.current[i] = el)}
              className="yam-stargate-orbit"
            />
          ))}
          {PLANETS.map((_, i) => (
            <div
              key={i}
              ref={(el) => (planetsRef.current[i] = el)}
              className="yam-stargate-planet"
            />
          ))}
        </div>
      </div>

      {/* the portal's outer glowing ring (above the scene) */}
      <div className="yam-stargate-ring" ref={ringRef} aria-hidden="true" />

      {/* tagline lands after the portal closes */}
      <div className="yam-stargate-tagline" ref={taglineRef}>
        On the other side.
      </div>

      <div className="yam-stargate-caption">
        <span>Phase 06</span>
        <span>—</span>
        <span>Stargate.</span>
      </div>
    </section>
  );
}
