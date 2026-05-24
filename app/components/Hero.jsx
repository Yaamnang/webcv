"use client";

import { useEffect, useRef, useState } from "react";
import { useParallax } from "../lib/effects";

/* the five crossfading background panels */
const SLIDES = [
  { n: 1, label: "Sunrise / Warmth" },
  { n: 2, label: "Coastline / Calm" },
  { n: 3, label: "Concrete / Form" },
  { n: 4, label: "Deep Water / Focus" },
  { n: 5, label: "Canopy / Growth" },
];
const SLIDE_MS = 5000;

const HEADLINE = ["We design &", "build for the", "modern web."];

export default function Hero({ start }) {
  const [active, setActive] = useState(0);
  const timer = useRef(null);
  const bgRef = useParallax(0.1);
  const headRef = useParallax(-0.05);

  const arm = () => {
    clearInterval(timer.current);
    timer.current = setInterval(
      () => setActive((a) => (a + 1) % SLIDES.length),
      SLIDE_MS
    );
  };

  /* start the carousel only once the intro is finished */
  useEffect(() => {
    if (!start) return;
    arm();
    return () => clearInterval(timer.current);
  }, [start]);

  const jump = (i) => {
    setActive(i);
    arm();
  };

  return (
    <section className="yam-hero" id="hero">
      <div className="yam-hero-bg" ref={bgRef}>
        {SLIDES.map((s, i) => (
          <div
            key={s.n}
            className={`yam-slide yam-slide-${s.n}`}
            data-active={i === active ? "true" : "false"}
          >
            <div className="yam-slide-inner" />
          </div>
        ))}
      </div>
      <div className="yam-hero-scrim" />

      <div className="yam-hero-top yam-container">
        <div className="yam-hero-toprow">
          <p
            className="yam-eyebrow yam-reveal"
            data-in={start ? "true" : "false"}
            style={{ "--d": "0.1s" }}
          >
            Creative Development Studio
          </p>
          <p
            className="yam-mono yam-reveal"
            data-in={start ? "true" : "false"}
            style={{ "--d": "0.2s", color: "var(--muted)" }}
          >
            Est. 2026 — Working worldwide
          </p>
        </div>
      </div>

      <div className="yam-hero-inner yam-container">
        <h1
          className="yam-display yam-hero-headline yam-reveal-lines"
          data-in={start ? "true" : "false"}
          ref={headRef}
        >
          {HEADLINE.map((line, i) => (
            <span className="yam-line" key={i}>
              <span className="yam-line-inner">{line}</span>
            </span>
          ))}
        </h1>

        <div className="yam-hero-meta">
          <p
            className="yam-body yam-reveal"
            data-in={start ? "true" : "false"}
            style={{ "--d": "0.45s", maxWidth: "34rem" }}
          >
            An independent studio shaping brands, websites and products —
            through design, engineering and long-term care.
          </p>

          <div
            className="yam-hero-dots yam-reveal"
            data-in={start ? "true" : "false"}
            style={{ "--d": "0.55s" }}
          >
            {SLIDES.map((s, i) => (
              <button
                key={s.n}
                className="yam-hero-dot"
                data-active={i === active ? "true" : "false"}
                onClick={() => jump(i)}
                aria-label={`Show ${s.label}`}
              />
            ))}
            <span className="yam-mono" style={{ marginLeft: "0.7rem" }}>
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(SLIDES.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

    </section>
  );
}
