"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const BAR_COUNT = 64;

/* Waveform — vertical bars that react to live scroll velocity (audio-EQ vibe)
   plus a baseline sine wave so the field is never flat. */
export default function Waveform() {
  const sectionRef = useRef(null);
  const barsRef = useRef([]);
  const taglineRef = useRef(null);
  const velRef = useRef({ smoothed: 0, raw: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const bars = barsRef.current.filter(Boolean);
    const tagline = taglineRef.current;

    let raf = 0;
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      velRef.current.raw = y - lastY;
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    /* per-bar STATIC baseline — varied heights, no time component.
       Bars sit at this resting pattern unless scroll velocity wakes them. */
    const baseline = bars.map(
      (_, i) => 0.06 + (((i * 13) % 23) / 23) * 0.18
    );

    const tick = () => {
      const v = velRef.current;
      v.smoothed += (v.raw - v.smoothed) * 0.18;
      v.raw *= 0.86;
      const speed = Math.min(Math.abs(v.smoothed) * 0.04, 1);

      if (speed < 0.002) {
        /* at rest → render static pattern only, no time-based wave */
        bars.forEach((bar, i) => {
          bar.style.transform = `scaleY(${baseline[i]})`;
        });
      } else {
        /* scrolling → wave rides on top of the baseline, scaled by speed */
        const time = performance.now() * 0.005;
        bars.forEach((bar, i) => {
          const wave = Math.sin(time + i * 0.22) * 0.45 * speed;
          const h = baseline[i] + speed * 0.6 + wave;
          bar.style.transform = `scaleY(${Math.max(0.04, h)})`;
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    gsap.set(tagline, { opacity: 0, y: 30 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=220%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
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
            start: "70% top",
            end: "92% top",
            scrub: 0.6,
          },
        }
      );
    }, section);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      ctx.revert();
    };
  }, []);

  return (
    <section className="yam-waveform" ref={sectionRef} id="waveform">
      <div className="yam-waveform-bars">
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <span
            key={i}
            ref={(el) => (barsRef.current[i] = el)}
            className="yam-waveform-bar"
          />
        ))}
      </div>
      <h2 className="yam-waveform-tagline" ref={taglineRef}>
        Scroll to play.
      </h2>
      <div className="yam-waveform-caption">
        <span>Phase 08</span>
        <span>—</span>
        <span>Audio.</span>
      </div>
    </section>
  );
}
