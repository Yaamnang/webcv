"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const ITEMS = ["Plan", "Build", "Test", "Ship"];

/* A pendulum on a thread swings with decaying amplitude. At each
   extreme of the swing, one process item pops into place — so the
   final lineup is "earned" by the mechanical motion. */
export default function Pendulum() {
  const sectionRef = useRef(null);
  const armRef = useRef(null);
  const itemsRef = useRef([]);
  const taglineRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const arm = armRef.current;
    const items = itemsRef.current.filter(Boolean);
    const tagline = taglineRef.current;

    gsap.set(arm, { rotation: -50, transformOrigin: "50% 0%" });
    gsap.set(items, { opacity: 0, scale: 0, transformOrigin: "center" });
    gsap.set(tagline, { opacity: 0, y: 30 });

    /* swing amplitudes decay, alternating direction */
    const SWINGS = [
      { rot: 50, dur: 0.7 },
      { rot: -38, dur: 0.65 },
      { rot: 28, dur: 0.6 },
      { rot: -20, dur: 0.55 },
      { rot: 12, dur: 0.5 },
      { rot: 0, dur: 0.45 },
    ];

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

      SWINGS.forEach((swing, i) => {
        tl.to(arm, {
          rotation: swing.rot,
          ease: "sine.inOut",
          duration: swing.dur,
        });
        if (i < items.length) {
          tl.to(
            items[i],
            {
              opacity: 1,
              scale: 1,
              ease: "back.out(2.2)",
              duration: 0.35,
            },
            ">-0.12"
          );
        }
      });

      tl.to(
        tagline,
        { opacity: 1, y: 0, ease: "expo.out", duration: 0.6 },
        ">"
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="yam-pendulum" ref={sectionRef} id="pendulum">
      <div className="yam-pendulum-mount" aria-hidden="true" />
      <div className="yam-pendulum-arm" ref={armRef} aria-hidden="true">
        <div className="yam-pendulum-thread" />
        <div className="yam-pendulum-weight">YAM</div>
      </div>
      <div className="yam-pendulum-items">
        {ITEMS.map((item, i) => (
          <div
            key={i}
            ref={(el) => (itemsRef.current[i] = el)}
            className="yam-pendulum-item"
          >
            {item}
          </div>
        ))}
      </div>
      <h2 className="yam-pendulum-tagline" ref={taglineRef}>
        Each pass, a step.
      </h2>
      <div className="yam-pendulum-caption">
        <span>Phase 15</span>
        <span>—</span>
        <span>Pendulum.</span>
      </div>
    </section>
  );
}
