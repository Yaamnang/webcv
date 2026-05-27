"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/* placeholder status panels — swap with your actual current state */
const PANELS = [
  {
    label: "Working on",
    value: "Crafting this very page.",
    sub: "Active — day 12",
    tone: "active",
  },
  {
    label: "Reading",
    value: "Currently between books.",
    sub: "Pick your next",
    tone: "neutral",
  },
  {
    label: "Available",
    value: "Yes — booking from June 2026.",
    sub: "1 slot open",
    tone: "active",
  },
  {
    label: "Loop",
    value: "Lo-fi beats, ambient drone.",
    sub: "On repeat",
    tone: "neutral",
  },
];

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Now — a live status panel.
 * Top strip pulses a green LIVE dot next to a real-time clock that
 * ticks every second. A huge "Currently." headline reveals on scroll,
 * followed by a 2×2 grid of status cells (each with label / value /
 * sub-text + a colored indicator dot). Cells stagger in.
 */
export default function Now() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cellsRef = useRef([]);
  const timeRef = useRef(null);
  const taglineRef = useRef(null);

  /* live clock — updates every second, SSR-safe via "--:--:--" placeholder */
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      const d = String(now.getDate()).padStart(2, "0");
      const M = MONTHS[now.getMonth()];
      const y = now.getFullYear();
      if (timeRef.current) {
        timeRef.current.textContent = `${h}:${m}:${s} · ${d} ${M} ${y}`;
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  /* scroll-driven reveal of header + cells */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const header = headerRef.current;
    const cells = cellsRef.current.filter(Boolean);
    const tagline = taglineRef.current;

    gsap.set(header, { opacity: 0, y: 40, scale: 1.15 });
    gsap.set(cells, { opacity: 0, y: 40 });
    gsap.set(tagline, { opacity: 0, y: 30 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=240%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      tl.to(
        header,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "expo.out",
          duration: 0.55,
        },
        0
      );

      cells.forEach((cell, i) => {
        tl.to(
          cell,
          {
            opacity: 1,
            y: 0,
            ease: "power3.out",
            duration: 0.45,
          },
          0.35 + i * 0.14
        );
      });

      tl.to(
        tagline,
        { opacity: 1, y: 0, ease: "expo.out", duration: 0.6 },
        ">+0.15"
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="yam-now" ref={sectionRef} id="now">
      <div className="yam-now-top">
        <div className="yam-now-time" ref={timeRef}>
          --:--:-- · -- --- ----
        </div>
      </div>

      <h2 className="yam-now-header" ref={headerRef}>
        Currently.
      </h2>

      <div className="yam-now-grid">
        {PANELS.map((p, i) => (
          <div
            key={i}
            ref={(el) => (cellsRef.current[i] = el)}
            className="yam-now-cell"
            data-tone={p.tone}
          >
            <div className="yam-now-cell-label">{p.label}</div>
            <div className="yam-now-cell-value">{p.value}</div>
            <div className="yam-now-cell-sub">{p.sub}</div>
          </div>
        ))}
      </div>

      <h3 className="yam-now-tagline" ref={taglineRef}>
        Always something happening.
      </h3>
      <div className="yam-now-caption">
        <span>Phase 19</span>
        <span>—</span>
        <span>Now.</span>
      </div>
    </section>
  );
}
