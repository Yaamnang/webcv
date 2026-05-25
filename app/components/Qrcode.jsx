"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const URL = "https://www.google.com";

/* Build the real QR matrix at module load. qrcode is pure JS — runs
   the same on server and client, so the cell list is deterministic. */
const QR = QRCode.create(URL, { errorCorrectionLevel: "M" });
const SIZE = QR.modules.size;
const DATA = QR.modules.data;

const CELLS = [];
for (let r = 0; r < SIZE; r++) {
  for (let c = 0; c < SIZE; c++) {
    if (DATA[r * SIZE + c]) CELLS.push({ r, c });
  }
}

/**
 * Qrcode — particles fly in from outside the viewport and align into a
 * REAL, SCANNABLE QR code for https://www.google.com. Each "on" module
 * of the matrix is one particle; cells are dark, the panel keeps a
 * white quiet zone, and the assembly only completes at full scroll —
 * which is when the code becomes scannable.
 */
export default function Qrcode() {
  const sectionRef = useRef(null);
  const cellsRef = useRef([]);
  const taglineRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const cells = cellsRef.current.filter(Boolean);
    const tagline = taglineRef.current;

    /* scatter all cells far outside the viewport, then assemble on scroll */
    cells.forEach((cell) => {
      gsap.set(cell, {
        x: `${gsap.utils.random(-160, 160)}vw`,
        y: `${gsap.utils.random(-160, 160)}vh`,
        rotation: gsap.utils.random(-360, 360),
        opacity: 1,
      });
    });
    gsap.set(tagline, { opacity: 0, y: 30 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=380%",
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      cells.forEach((cell, i) => {
        tl.to(
          cell,
          {
            x: 0,
            y: 0,
            rotation: 0,
            ease: "power3.out",
            duration: 1.0,
          },
          i * 0.004 + gsap.utils.random(0, 0.25)
        );
      });

      tl.to(
        tagline,
        { opacity: 1, y: 0, ease: "expo.out", duration: 0.6 },
        ">-0.3"
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="yam-qr" ref={sectionRef} id="qr">
      <div className="yam-qr-panel">
        <div
          className="yam-qr-matrix"
          style={{
            "--qr-size": SIZE,
          }}
        >
          {CELLS.map((cell, i) => (
            <span
              key={i}
              ref={(el) => (cellsRef.current[i] = el)}
              className="yam-qr-cell"
              style={{
                left: `${(cell.c / SIZE) * 100}%`,
                top: `${(cell.r / SIZE) * 100}%`,
                width: `${100 / SIZE}%`,
                height: `${100 / SIZE}%`,
              }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
      <h2 className="yam-qr-tagline" ref={taglineRef}>
        Scan to leave.
      </h2>
      <div className="yam-qr-caption">
        <span>Phase 16</span>
        <span>—</span>
        <span>Exit code.</span>
      </div>
    </section>
  );
}
