"use client";

import { useEffect, useRef } from "react";
import { lerp, clamp, canHover, Reveal } from "../lib/effects";

/* placeholder projects — swap titles / categories / links for real work */
const WORK = [
  {
    n: "01",
    title: "Lumen Health",
    cat: "Product Design · Web App",
    grad: "linear-gradient(135deg,#1d2a3a,#3f6d9e 58%,#a9c8e6)",
  },
  {
    n: "02",
    title: "Verde Market",
    cat: "E-commerce · Development",
    grad: "linear-gradient(140deg,#1f2a18,#4f7a2f 58%,#bcd99a)",
  },
  {
    n: "03",
    title: "Northpaper",
    cat: "Editorial · Brand Identity",
    grad: "linear-gradient(135deg,#2c2118,#8a5a2a 58%,#e3b486)",
  },
  {
    n: "04",
    title: "Orbit Labs",
    cat: "SaaS Platform · Web App",
    grad: "linear-gradient(150deg,#241a30,#5a3f8c 58%,#bda6e3)",
  },
  {
    n: "05",
    title: "Casa Form",
    cat: "Architecture · Website",
    grad: "linear-gradient(135deg,#2b1c1e,#7a3640 58%,#d59aa3)",
  },
];

export default function Work() {
  const previewRef = useRef(null);
  const fillRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const preview = previewRef.current;
    const fill = fillRef.current;
    const list = listRef.current;
    if (!preview || !fill || !list || !canHover()) return;

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let scale = 0.82;
    let visible = false;
    let primed = false;
    let raf = 0;

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!primed) {
        cur.x = target.x;
        cur.y = target.y;
        primed = true;
      }
    };
    const onOver = (e) => {
      const row = e.target.closest(".yam-work-row");
      if (!row) return;
      const i = Number(row.dataset.index);
      fill.style.backgroundImage = WORK[i].grad;
      visible = true;
      preview.dataset.show = "true";
    };
    const onLeave = () => {
      visible = false;
      preview.dataset.show = "false";
    };

    const render = () => {
      cur.x = lerp(cur.x, target.x, 0.15);
      cur.y = lerp(cur.y, target.y, 0.15);
      scale = lerp(scale, visible ? 1 : 0.82, 0.12);
      const vx = clamp((target.x - cur.x) * 0.35, -16, 16);
      preview.style.transform =
        `translate3d(${cur.x.toFixed(1)}px, ${cur.y.toFixed(1)}px, 0) ` +
        `translate(-50%, -50%) rotate(${vx.toFixed(2)}deg) scale(${scale.toFixed(
          3
        )})`;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    list.addEventListener("pointermove", onMove);
    list.addEventListener("pointerover", onOver);
    list.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      list.removeEventListener("pointermove", onMove);
      list.removeEventListener("pointerover", onOver);
      list.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section className="yam-section yam-container" id="work">
      <div className="yam-section-head">
        <div>
          <Reveal as="p" className="yam-eyebrow">
            Selected Work
          </Reveal>
          <Reveal
            as="h2"
            className="yam-h2"
            delay={0.06}
            style={{ marginTop: "1rem" }}
          >
            Projects we are
            <br />
            proud to ship.
          </Reveal>
        </div>
        <Reveal as="div" delay={0.12}>
          <a className="yam-link-underline" href="#contact" data-cursor="All work">
            View all work
            <span aria-hidden="true">↗</span>
          </a>
        </Reveal>
      </div>

      <div className="yam-work-list" ref={listRef}>
        {WORK.map((w, i) => (
          <Reveal key={w.n} variant="up" delay={i * 0.05}>
            <a
              className="yam-work-row"
              href="#contact"
              data-index={i}
              aria-label={`${w.title} — ${w.cat}`}
            >
              <span className="yam-work-num">{w.n}</span>
              <span className="yam-work-title">{w.title}</span>
              <span className="yam-work-cat">{w.cat}</span>
              <span className="yam-work-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      <div ref={previewRef} className="yam-work-preview" data-show="false" aria-hidden="true">
        <div ref={fillRef} className="yam-work-preview-fill" />
      </div>
    </section>
  );
}
