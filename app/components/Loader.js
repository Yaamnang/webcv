"use client";

import { useEffect, useRef, useState } from "react";
import { createTimeline } from "animejs";

/**
 * Intro loader. Click-to-start gates an anime.js timeline that
 *  - counts 000 → 100 in the bottom-right (same place/size as before)
 *  - flies three vectors into the center to form the Y at 25/50/75
 *  - reveals "amnang" sliding out from behind the Y to spell Yamnang
 * Then fires `onDone` so the page can reveal beneath the clip-path wipe.
 */
export default function Loader({ onDone }) {
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const countRef = useRef(null);
  const barRef = useRef(null);
  const arm1Ref = useRef(null);
  const arm2Ref = useRef(null);
  const stemRef = useRef(null);
  const amnangRef = useRef(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!started) return;
    let cancelled = false;

    const counter = { value: 0 };

    const tl = createTimeline({
      defaults: { ease: "outExpo" },
      onComplete: () => {
        if (cancelled) return;
        setDone(true);
        onDoneRef.current?.();
      },
    });

    tl.add(
      counter,
      {
        value: 100,
        duration: 3000,
        ease: "outQuart",
        onUpdate: () => {
          const v = counter.value;
          if (countRef.current) {
            countRef.current.textContent = String(
              Math.round(v)
            ).padStart(3, "0");
          }
          if (barRef.current) {
            barRef.current.style.transform = `scaleX(${(v / 100).toFixed(4)})`;
          }
        },
      },
      0
    );

    tl.add(
      arm1Ref.current,
      {
        translateX: [-260, 0],
        translateY: [-220, 0],
        opacity: [0, 1],
        duration: 900,
      },
      750
    );

    tl.add(
      arm2Ref.current,
      {
        translateX: [260, 0],
        translateY: [-220, 0],
        opacity: [0, 1],
        duration: 900,
      },
      1500
    );

    tl.add(
      stemRef.current,
      {
        translateY: [260, 0],
        opacity: [0, 1],
        duration: 900,
      },
      2250
    );

    tl.add(
      amnangRef.current,
      {
        translateX: ["-100%", "0%"],
        opacity: [0, 1],
        duration: 900,
        ease: "outCubic",
      },
      3100
    );

    return () => {
      cancelled = true;
      tl.pause();
    };
  }, [started]);

  return (
    <div
      className="yam-loader"
      data-done={done ? "true" : "false"}
      aria-hidden="true"
    >
      <div className="yam-loader-mark">
        <svg
          className="yam-loader-y"
          viewBox="0 0 160 180"
          overflow="visible"
          aria-hidden="true"
        >
          <g ref={arm1Ref} className="yam-loader-arm">
            <line x1="10" y1="10" x2="80" y2="90" />
          </g>
          <g ref={arm2Ref} className="yam-loader-arm">
            <line x1="150" y1="10" x2="80" y2="90" />
          </g>
          <g ref={stemRef} className="yam-loader-arm">
            <line x1="80" y1="90" x2="80" y2="170" />
          </g>
        </svg>
        <span className="yam-loader-amnang-wrap">
          <span ref={amnangRef} className="yam-loader-amnang">amnang</span>
        </span>
      </div>

      <div className="yam-loader-word">
        <span>Yamnang TM &nbsp;/&nbsp; building the experience</span>
      </div>

      <div ref={countRef} className="yam-loader-count">000</div>

      <div ref={barRef} className="yam-loader-bar" />

      {!started && (
        <button
          type="button"
          className="yam-loader-start"
          onClick={() => setStarted(true)}
        >
          Click to start
        </button>
      )}
    </div>
  );
}
