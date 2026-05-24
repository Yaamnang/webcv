"use client";

import { useEffect, useRef } from "react";
import { onScroll, clamp } from "../lib/effects";

/* word-by-word fill driven by scroll position */
const STATEMENT =
  "Great work is never simply handed over. We become part of your team — designing, building and staying close long after the launch.";
const ACCENT = new Set(["team", "launch."]);

export default function Mission() {
  const textRef = useRef(null);
  const words = STATEMENT.split(" ");

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const spans = [...el.querySelectorAll(".yam-word")];

    return onScroll(() => {
      const vh = window.innerHeight;
      const rect = el.getBoundingClientRect();
      const start = vh * 0.82;
      const end = vh * 0.34;
      const p = clamp((start - rect.top) / (start - end));
      const lit = Math.round(p * spans.length);
      spans.forEach((s, i) => {
        s.dataset.lit = i < lit ? "true" : "false";
      });
    });
  }, []);

  return (
    <section className="yam-mission yam-container" id="mission">
      <p className="yam-eyebrow" style={{ marginBottom: "clamp(1.5rem,4vw,3rem)" }}>
        Our promise
      </p>
      <p className="yam-mission-text" ref={textRef}>
        {words.map((w, i) => (
          <span key={i}>
            <span
              className={`yam-word${
                ACCENT.has(w) ? " yam-word-accent" : ""
              }`}
              data-lit="false"
            >
              {w}
            </span>{" "}
          </span>
        ))}
      </p>
    </section>
  );
}
