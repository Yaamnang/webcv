"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * Intro loader.
 * - Click-to-start gate.
 * - Three line "arrows" fly in from outside the viewport along their own
 *   axes and land into formation to make a giant Y in dead center.
 * - The Y then shifts left and "amnang" fades in next to it to complete
 *   the wordmark.
 * - GSAP timeline drives the bar at the bottom too.
 */
export default function Loader({ onDone }) {
  const [done, setDone] = useState(false);
  const [started] = useState(true);

  const barRef = useRef(null);
  const markRef = useRef(null);
  const armsRef = useRef([]);
  const amnangRef = useRef(null);
  const countRef = useRef(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!started) return;

    const bar = barRef.current;
    const mark = markRef.current;
    const amnang = amnangRef.current;
    const arms = armsRef.current.filter(Boolean);
    if (arms.length !== 3 || !mark || !amnang) return;

    /* arrow start positions — each arm sits far off-screen along its
       own outward axis so it travels in along its line direction */
    const armOffsets = [
      { x: "-80vh", y: "-110vh" }, // upper-left arm
      { x: "80vh", y: "-110vh" }, // upper-right arm
      { x: 0, y: "110vh" }, // vertical stem (from below)
    ];

    /* measure amnang so we know how far to shift mark right initially
       (so the Y alone sits in dead-center, not the whole mark) */
    const amnangWidth = amnang.offsetWidth;
    const initialShift = amnangWidth / 2;

    /* GSAP owns the mark's transform now (overrides CSS translate) */
    gsap.set(mark, {
      xPercent: -50,
      yPercent: -50,
      x: initialShift,
    });

    /* hide amnang */
    gsap.set(amnang, { opacity: 0 });

    /* place each arm off-screen + make group visible */
    arms.forEach((arm, i) => {
      gsap.set(arm, {
        x: armOffsets[i].x,
        y: armOffsets[i].y,
        opacity: 1,
      });
    });

    const tl = gsap.timeline({
      onComplete: () => {
        window.setTimeout(() => {
          setDone(true);
          onDoneRef.current?.();
        }, 340);
      },
    });

    /* bar fills linearly + drives the 000 → 100 counter */
    tl.fromTo(
      bar,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 2.6,
        ease: "none",
        onUpdate: function () {
          if (countRef.current) {
            countRef.current.textContent = String(
              Math.round(this.progress() * 100)
            ).padStart(3, "0");
          }
        },
      },
      0
    );

    /* arrow 1 — upper-left arm */
    tl.to(arms[0], { x: 0, y: 0, duration: 0.6, ease: "power4.out" }, 0);

    /* arrow 2 — upper-right arm */
    tl.to(arms[1], { x: 0, y: 0, duration: 0.6, ease: "power4.out" }, 0.5);

    /* arrow 3 — vertical stem, fires up from below */
    tl.to(arms[2], { x: 0, y: 0, duration: 0.55, ease: "power4.out" }, 1.0);

    /* Y shifts a little to the left + amnang fades in */
    tl.to(mark, { x: 0, duration: 0.75, ease: "expo.out" }, 1.85);
    tl.to(
      amnang,
      { opacity: 1, duration: 0.6, ease: "expo.out" },
      1.95
    );

    return () => tl.kill();
  }, [started]);

  return (
    <div
      className="yam-loader"
      data-done={done ? "true" : "false"}
      aria-hidden="true"
    >
      <div className="yam-loader-word">
        <span>Yamnang TM &nbsp;/&nbsp; building the experience</span>
      </div>
      <div ref={countRef} className="yam-loader-count">000</div>
      <div ref={barRef} className="yam-loader-bar" />

      <div className="yam-loader-mark" ref={markRef}>
        <svg
          className="yam-loader-y"
          viewBox="0 0 100 140"
          aria-hidden="true"
          preserveAspectRatio="xMidYMid meet"
        >
          <g
            className="yam-loader-arm"
            ref={(el) => (armsRef.current[0] = el)}
          >
            <line x1="10" y1="10" x2="50" y2="65" />
          </g>
          <g
            className="yam-loader-arm"
            ref={(el) => (armsRef.current[1] = el)}
          >
            <line x1="90" y1="10" x2="50" y2="65" />
          </g>
          <g
            className="yam-loader-arm"
            ref={(el) => (armsRef.current[2] = el)}
          >
            <line x1="50" y1="130" x2="50" y2="65" />
          </g>
        </svg>
        <span className="yam-loader-amnang" ref={amnangRef}>
          amnang
        </span>
      </div>

    </div>
  );
}
