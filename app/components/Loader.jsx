"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { onScroll, clamp } from "../lib/effects";

const COLS_COUNT = 28;
const CHARSET = "01アカサタナハマヤラワABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*+-={}[]|:;.,";
const randomChar = () => CHARSET[Math.floor(Math.random() * CHARSET.length)];
const randomColumn = (n) => { let s = ""; for (let i = 0; i < n; i++) s += randomChar() + "\n"; return s; };

const POSITIONS = [
  { ang: -90, r: 34, tilt: -10 },
  { ang: -18, r: 32, tilt:   8 },
  { ang:  54, r: 36, tilt:  -6 },
  { ang: 126, r: 32, tilt:  12 },
  { ang: 198, r: 34, tilt:  -9 },
];
const R_END = 130;

const GROW_END = 0.28;
const SWAP_AT  = 0.30;
const SWAP_END = 0.42;
const DONE_AT  = 0.96;
const MIDDLE   = 2;
/* distances for the 4 side cards relative to center slot */
const SIDE_DISTS = [-2, -1, 1, 2];

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export default function Loader({ onDone }) {
  const [started] = useState(true);

  const sectionRef   = useRef(null);
  const stickyRef    = useRef(null);
  const barRef       = useRef(null);
  const markRef      = useRef(null);
  const armsRef      = useRef([]);
  const amnangRef    = useRef(null);
  const tmRef        = useRef(null);
  const countRef     = useRef(null);
  const wordRef      = useRef(null);
  const cardsRef     = useRef([]);
  const tl2Ref       = useRef(null);
  const textRef      = useRef(null);
  const colsRef      = useRef([]);
  const mainRef      = useRef(null);      // the full-screen div that shrinks
  const sideCardsRef = useRef([]);        // 4 side cards that fan out
  const scrollReady  = useRef(false);
  const onDoneRef    = useRef(onDone);
  onDoneRef.current  = onDone;
  const doneFired    = useRef(false);

  useEffect(() => {
    if (!started) return;

    const bar     = barRef.current;
    const mark    = markRef.current;
    const amnang  = amnangRef.current;
    const tm      = tmRef.current;
    const arms    = armsRef.current.filter(Boolean);
    const word    = wordRef.current;
    const count   = countRef.current;
    const section = sectionRef.current;
    const cards   = cardsRef.current.filter(Boolean);
    if (arms.length !== 3 || !mark || !amnang) return;

    /* ── Phase 1 initial state ── */
    const armOffsets = [
      { x: "-80vh", y: "-110vh" },
      { x:  "80vh", y: "-110vh" },
      { x:       0, y:  "110vh" },
    ];
    gsap.set(mark,   { x: amnang.offsetWidth / 2 });
    gsap.set(amnang, { opacity: 0 });
    gsap.set(tm,     { opacity: 0 });
    arms.forEach((arm, i) =>
      gsap.set(arm, { x: armOffsets[i].x, y: armOffsets[i].y, opacity: 1 })
    );

    const vh = window.innerHeight;
    cards.forEach((card, i) => {
      const pos = POSITIONS[i];
      const rad = (pos.ang * Math.PI) / 180;
      const radius = (pos.r * vh) / 100;
      gsap.set(card, {
        xPercent: -50, yPercent: -50,
        x: Math.cos(rad) * radius, y: Math.sin(rad) * radius,
        rotation: pos.tilt, opacity: 0, scale: 0.88,
      });
    });

    /* ── Matrix rain pre-init ── */
    colsRef.current.forEach((col, i) => {
      if (!col) return;
      col.style.setProperty("--col-x",       `${(i / COLS_COUNT) * 100 + Math.random() * 3 - 1.5}vw`);
      col.style.setProperty("--col-dur",     `${4 + Math.random() * 8}s`);
      col.style.setProperty("--col-delay",   `${-Math.random() * 8}s`);
      col.style.setProperty("--col-opacity", `${0.35 + Math.random() * 0.55}`);
      col.textContent = randomColumn(120);
    });

    /* ── Phase 2 ── */
    const runPhase2 = () => {
      const tl2 = gsap.timeline({
        onComplete: () => {
          window.scrollTo(0, 0);
          scrollReady.current = true;
          if (window.__lenis) window.__lenis.start();
          else document.documentElement.style.overflow = "";
        },
      });
      tl2Ref.current = tl2;
      tl2.to([bar, count, word], { opacity: 0, duration: 0.35, ease: "power2.in" }, 0);
      tl2.to(mark, { scale: 0.22, duration: 0.65, ease: "expo.out" }, 0.15);
      cards.forEach((card, i) =>
        tl2.to(card, { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" }, 0.45 + i * 0.06)
      );
      tl2.to(tm, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0.45);
    };

    /* ── Phase 1 timeline ── */
    const tl = gsap.timeline({ onComplete: runPhase2 });
    tl.fromTo(bar, { scaleX: 0 }, {
      scaleX: 1, duration: 2.6, ease: "none",
      onUpdate: function () {
        if (countRef.current)
          countRef.current.textContent = String(Math.round(this.progress() * 100)).padStart(3, "0");
      },
    }, 0);
    tl.to(arms[0], { x: 0, y: 0, duration: 0.6,  ease: "power4.out" }, 0);
    tl.to(arms[1], { x: 0, y: 0, duration: 0.6,  ease: "power4.out" }, 0.5);
    tl.to(arms[2], { x: 0, y: 0, duration: 0.55, ease: "power4.out" }, 1.0);
    tl.to(mark,    { x: 0, duration: 0.75, ease: "expo.out" }, 1.85);
    tl.to(amnang,  { opacity: 1, duration: 0.6,  ease: "expo.out" }, 1.95);

    /* ── Phase 3: scroll-driven ── */
    const unsub = onScroll(() => {
      if (!scrollReady.current || !section) return;

      const rect  = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const raw   = total > 0 ? clamp(-rect.top / total) : 0;
      const cvh   = window.innerHeight;

      /* Rain: fades in fast, stays */
      colsRef.current.forEach(col => {
        if (col) col.style.opacity = String(clamp(raw / 0.10));
      });

      /* Yamnang mark: grows then swaps out */
      const growP = clamp(raw / GROW_END);
      const ep    = 1 - Math.pow(1 - growP, 2);
      const swapP = clamp((raw - SWAP_AT) / (SWAP_END - SWAP_AT));
      gsap.set(mark, { scale: 0.22 + (1 - 0.22) * ep, opacity: 1 - swapP });

      /* Orbit cards: fly out then fade with swap */
      cards.forEach((card, i) => {
        const pos    = POSITIONS[i];
        const rad    = (pos.ang * Math.PI) / 180;
        const radius = ((pos.r + (R_END - pos.r) * ep) * cvh) / 100;
        gsap.set(card, {
          x: Math.cos(rad) * radius,
          y: Math.sin(rad) * radius,
          rotation: pos.tilt + ep * (pos.tilt > 0 ? 22 : -22),
          opacity: 1 - swapP,
        });
      });

      /* Text: fades in during swap */
      const colP = clamp((raw - SWAP_END) / (DONE_AT - SWAP_END));
      const p    = easeInOut(colP);

      if (textRef.current) {
        if (colP <= 0) {
          textRef.current.style.opacity   = String(swapP);
          textRef.current.style.transform = "";
        } else {
          /* ScrollHero text fade-out */
          const textP  = clamp(p / 0.7);
          textRef.current.style.opacity   = (1 - textP).toFixed(3);
          textRef.current.style.transform = `translateY(${(-textP * 14).toFixed(2)}%) scale(${(1.18 - 0.18 * textP).toFixed(4)})`;
        }
      }

      /* Main view: shrinks from full screen → card shape (scaleX 1→0.17, scaleY 1→0.78) */
      if (mainRef.current) {
        const sX = 1 - p * (1 - 0.17);
        const sY = 1 - p * (1 - 0.78);
        mainRef.current.style.transform    = `scaleX(${sX.toFixed(4)}) scaleY(${sY.toFixed(4)})`;
        mainRef.current.style.borderRadius = `${(p * 28).toFixed(1)}px`;
      }

      /* 4 side cards: fan out from center (ScrollHero logic, dist = SIDE_DISTS) */
      sideCardsRef.current.forEach((card, idx) => {
        if (!card) return;
        if (colP <= 0) { card.style.opacity = "0"; return; }
        const dist   = SIDE_DISTS[idx];
        const inward = -dist * (1 - p) * 115;
        const tilt   = dist * (1 - p) * 3.5;
        card.style.transform = `translateX(${inward.toFixed(2)}%) rotate(${tilt.toFixed(2)}deg) scale(${p.toFixed(4)})`;
        card.style.opacity   = p.toFixed(3);
      });

      if (raw >= DONE_AT && !doneFired.current) {
        doneFired.current = true;
        onDoneRef.current?.();
      }
    });

    return () => {
      tl.kill();
      if (tl2Ref.current) tl2Ref.current.kill();
      unsub();
    };
  }, [started]);

  return (
    <section className="yam-loader" ref={sectionRef} aria-hidden="true">
      <div className="yam-loader-sticky" ref={stickyRef}>

        {/* 4 side cards — behind the main view, fan out on scroll */}
        <div className="yam-loader-sidestrip">
          {[1, 2, 3, 4, 5].map((n, i) =>
            i === MIDDLE
              /* invisible spacer to keep correct flex gaps */
              ? <div key={n} className="yam-scrollhero-card" style={{ opacity: 0, pointerEvents: "none" }} />
              : (
                <div
                  key={n}
                  ref={(el) => (sideCardsRef.current[i < MIDDLE ? i : i - 1] = el)}
                  className={`yam-scrollhero-card yam-scrollhero-card-${n}`}
                  style={{ opacity: 0 }}
                >
                  <div className="yam-scrollhero-card-fill" />
                </div>
              )
          )}
        </div>

        {/* Main view — this IS the middle card, shrinks to card size */}
        <div className="yam-loader-main" ref={mainRef}>

          {/* matrix rain */}
          <div className="yam-terminal-rain" aria-hidden="true">
            {Array.from({ length: COLS_COUNT }).map((_, i) => (
              <pre key={i} ref={(el) => (colsRef.current[i] = el)}
                className="yam-terminal-col" style={{ opacity: 0 }} />
            ))}
          </div>

          <div ref={wordRef} className="yam-loader-word">
            <span>Yamnang TM &nbsp;/&nbsp; building the experience</span>
          </div>
          <div ref={countRef} className="yam-loader-count">000</div>
          <div ref={barRef} className="yam-loader-bar" />

          <div className="yam-loader-tcards">
            {POSITIONS.map((_, i) => (
              <div key={i} ref={(el) => (cardsRef.current[i] = el)}
                className={`yam-loader-tcard yam-loader-tcard-${i + 1}`} />
            ))}
          </div>

          <div className="yam-loader-center">
            <div className="yam-loader-mark" ref={markRef}>
              <svg className="yam-loader-y" viewBox="0 0 100 130" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
                <g className="yam-loader-arm" ref={(el) => (armsRef.current[0] = el)}>
                  <path d="M 2,8 L 26,8 L 50,62 L 38,68 Z" />
                </g>
                <g className="yam-loader-arm" ref={(el) => (armsRef.current[1] = el)}>
                  <path d="M 74,8 L 98,8 L 62,68 L 50,62 Z" />
                </g>
                <g className="yam-loader-arm" ref={(el) => (armsRef.current[2] = el)}>
                  <path d="M 50,62 L 62,68 L 62,128 L 38,128 L 38,68 Z" />
                </g>
              </svg>
              <span className="yam-loader-amnang" ref={amnangRef}>
                amnang<span className="yam-loader-tm" ref={tmRef}>TM</span>
              </span>
            </div>

            <div className="yam-loader-textblock" ref={textRef} style={{ opacity: 0 }}>
              <p className="yam-eyebrow yam-loader-textblock-eyebrow">Yamnang Studio</p>
              <h1 className="yam-scrollhero-headline">
                Designed<br />to move.
              </h1>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
