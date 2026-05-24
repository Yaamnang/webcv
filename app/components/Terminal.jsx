"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const COLS_COUNT = 28;
const CHARSET =
  "01アカサタナハマヤラワABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*+-={}[]|:;.,";

const randomChar = () =>
  CHARSET[Math.floor(Math.random() * CHARSET.length)];

const randomColumn = (n) => {
  let s = "";
  for (let i = 0; i < n; i++) s += randomChar() + "\n";
  return s;
};

const WINDOWS = [
  {
    x: 7, y: 13, w: 23,
    title: "kernel.log",
    lines: [
      "$ INIT_SYSTEM --silent",
      "→ Loading modules",
      "→ [OK] core.gsap",
      "→ [OK] core.lenis",
      "→ Establishing uplink",
      "→ Handshake complete",
      "→ Ready",
    ],
  },
  {
    x: 67, y: 18, w: 23,
    title: "render.feed",
    lines: [
      "» Frame 0x4AC2",
      "» Frame 0x4AC3",
      "» Frame 0x4AC4",
      "» GPU 92.3% USE",
      "» Frame 0x4AC5",
      "» Frame 0x4AC6",
      "» DELTA NORMAL",
    ],
  },
  {
    x: 9, y: 60, w: 25,
    title: "studio.process",
    lines: [
      "[pid 1024] yamnang.studio",
      "[mem] 432MB / 2048MB",
      "[net] 0.0.0.0:443 OPEN",
      "[req] GET /work",
      "[res] 200 OK 12ms",
      "[req] GET /projects",
      "[res] 200 OK 8ms",
    ],
  },
  {
    x: 64, y: 65, w: 26,
    title: "cipher.exe",
    lines: [
      "ƒ encrypt(payload):",
      "  while(true):",
      "    payload = obfuscate()",
      "    payload = scramble()",
      "    if(check()): break",
      "  return payload",
      "Status: RUNNING",
    ],
  },
];

const FINAL_MSG = "ACCESS GRANTED";

/**
 * Terminal — hacker-feel pinned section.
 * - 28 vertical streams of cycling characters (CSS-animated matrix rain)
 * - 4 floating terminal windows revealed sequentially with scroll
 * - Central decrypt text continuously scrambles via setInterval;
 *   characters lock in left-to-right tied to scroll progress
 * - Two surprise overlays that strike at random intervals:
 *     · glitch flash (cyan / magenta RGB-shift screen)
 *     · invert flash (color-invert the whole section for ~50ms)
 * - Scan-line overlay sells the CRT vibe
 */
export default function Terminal() {
  const sectionRef = useRef(null);
  const colsRef = useRef([]);
  const windowsRef = useRef([]);
  const decryptRef = useRef(null);
  const glitchRef = useRef(null);
  const invertRef = useRef(null);
  const yamFlashRef = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    /* matrix rain — randomize per column after mount (no SSR hydration risk) */
    colsRef.current.forEach((col, i) => {
      if (!col) return;
      const x = (i / COLS_COUNT) * 100 + Math.random() * 3 - 1.5;
      const dur = 4 + Math.random() * 8;
      const delay = -Math.random() * 8;
      const opacity = 0.35 + Math.random() * 0.55;
      col.style.setProperty("--col-x", `${x}vw`);
      col.style.setProperty("--col-dur", `${dur}s`);
      col.style.setProperty("--col-delay", `${delay}s`);
      col.style.setProperty("--col-opacity", `${opacity}`);
      col.textContent = randomColumn(48);
    });

    /* terminal windows start hidden — scroll reveals them */
    windowsRef.current.forEach((w) => {
      if (w) gsap.set(w, { opacity: 0, y: 50, scale: 0.92 });
    });

    /* decrypt cycles continuously, locks each char in based on scroll progress */
    const decryptInterval = setInterval(() => {
      const progress = progressRef.current;
      let result = "";
      for (let i = 0; i < FINAL_MSG.length; i++) {
        const ch = FINAL_MSG[i];
        if (ch === " ") {
          result += " ";
          continue;
        }
        const lockPoint = 0.4 + (i / FINAL_MSG.length) * 0.5;
        result += progress >= lockPoint ? ch : randomChar();
      }
      if (decryptRef.current) decryptRef.current.textContent = result;
    }, 55);

    /* random glitch flash */
    let glitchTimeout;
    const scheduleGlitch = () => {
      glitchTimeout = setTimeout(() => {
        const el = glitchRef.current;
        if (el) {
          el.style.opacity = "0.85";
          setTimeout(() => {
            if (el) el.style.opacity = "0";
          }, 75);
        }
        scheduleGlitch();
      }, 1800 + Math.random() * 4200);
    };
    scheduleGlitch();

    /* random color-invert flash — short and brutal */
    let invertTimeout;
    const scheduleInvert = () => {
      invertTimeout = setTimeout(() => {
        const el = invertRef.current;
        if (el) {
          el.style.opacity = "1";
          setTimeout(() => {
            if (el) el.style.opacity = "0";
          }, 55);
        }
        scheduleInvert();
      }, 4500 + Math.random() * 6000);
    };
    scheduleInvert();

    /* subliminal "YAMNANG" flash — appears briefly through the chaos */
    let yamFlashTimeout;
    const scheduleYamFlash = () => {
      yamFlashTimeout = setTimeout(() => {
        const el = yamFlashRef.current;
        if (el) {
          el.style.opacity = "1";
          setTimeout(() => {
            if (el) el.style.opacity = "0";
          }, 110);
        }
        scheduleYamFlash();
      }, 4000 + Math.random() * 6000);
    };
    scheduleYamFlash();

    const ctx = gsap.context(() => {
      /* master pin + scroll progress tracker */
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });

      /* matrix columns fade in during section entry */
      gsap.fromTo(
        colsRef.current.filter(Boolean),
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          stagger: { each: 0.012, from: "random" },
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 25%",
            scrub: true,
          },
        }
      );

      /* terminal windows revealed one by one at different scroll points */
      windowsRef.current.forEach((w, i) => {
        if (!w) return;
        gsap.to(w, {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "power2.out",
          duration: 0.6,
          scrollTrigger: {
            trigger: section,
            start: `${15 + i * 10}% top`,
            end: `${28 + i * 10}% top`,
            scrub: 0.6,
          },
        });
      });
    }, section);

    return () => {
      clearInterval(decryptInterval);
      clearTimeout(glitchTimeout);
      clearTimeout(invertTimeout);
      clearTimeout(yamFlashTimeout);
      ctx.revert();
    };
  }, []);

  return (
    <section className="yam-terminal" ref={sectionRef} id="terminal">
      <div className="yam-terminal-rain" aria-hidden="true">
        {Array.from({ length: COLS_COUNT }).map((_, i) => (
          <pre
            key={i}
            ref={(el) => (colsRef.current[i] = el)}
            className="yam-terminal-col"
          />
        ))}
      </div>

      <div className="yam-terminal-scanlines" aria-hidden="true" />

      {WINDOWS.map((w, i) => (
        <div
          key={i}
          ref={(el) => (windowsRef.current[i] = el)}
          className="yam-terminal-window"
          style={{
            left: `${w.x}vw`,
            top: `${w.y}vh`,
            width: `${w.w}vw`,
          }}
        >
          <div className="yam-terminal-window-bar">
            <span className="yam-terminal-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="yam-terminal-title">{w.title}</span>
          </div>
          <div className="yam-terminal-window-body">
            {w.lines.map((line, j) => (
              <div key={j}>{line}</div>
            ))}
            <div className="yam-terminal-prompt">
              <span>$</span>
              <span className="yam-terminal-blink">█</span>
            </div>
          </div>
        </div>
      ))}

      <div className="yam-terminal-center">
        <span className="yam-terminal-decrypt" ref={decryptRef}>
          {FINAL_MSG.split("")
            .map(() => "█")
            .join("")}
        </span>
        <span className="yam-terminal-cursor">_</span>
      </div>

      <div
        className="yam-terminal-glitch"
        ref={glitchRef}
        aria-hidden="true"
      />
      <div
        className="yam-terminal-invert"
        ref={invertRef}
        aria-hidden="true"
      />

      <div
        className="yam-terminal-yamflash"
        ref={yamFlashRef}
        aria-hidden="true"
      >
        YAMNANG
      </div>

      <div className="yam-terminal-caption">
        <span>Phase 05</span>
        <span>—</span>
        <span>System online.</span>
      </div>
    </section>
  );
}
