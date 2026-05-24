"use client";

import { useEffect, useRef } from "react";
import { onScroll, clamp, Reveal } from "../lib/effects";

/* the five panels that scroll horizontally while the section is pinned */
const PANELS = [
  { n: 1, title: "Discovery", tag: "Research & Strategy" },
  { n: 2, title: "Design", tag: "Interface & Identity" },
  { n: 3, title: "Motion", tag: "Prototype & Interaction" },
  { n: 4, title: "Build", tag: "Engineering" },
  { n: 5, title: "Care", tag: "Launch & Support" },
];

export default function Showcase() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let maxShift = 0;
    const measure = () => {
      maxShift = Math.max(0, track.scrollWidth - window.innerWidth);
    };
    measure();
    // re-measure once layout/fonts settle
    const t = setTimeout(measure, 400);
    window.addEventListener("resize", measure);

    const unsub = onScroll(() => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? clamp(-rect.top / total) : 0;
      track.style.transform = `translate3d(${(-p * maxShift).toFixed(
        1
      )}px,0,0)`;
    });

    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
      unsub();
    };
  }, []);

  return (
    <section className="yam-showcase" id="showcase" ref={sectionRef}>
      <div className="yam-showcase-sticky">
        <div className="yam-showcase-track" ref={trackRef}>
          <div className="yam-showcase-intro">
            <Reveal as="p" className="yam-eyebrow">
              Inside the studio
            </Reveal>
            <Reveal as="h2" className="yam-h2" delay={0.06}>
              A process built
              <br />
              for momentum.
            </Reveal>
            <Reveal as="p" className="yam-body" delay={0.12}>
              Keep scrolling — here is how an idea travels from a first rough
              sketch to a living product that keeps getting better.
            </Reveal>
          </div>

          {PANELS.map((p) => (
            <article
              key={p.n}
              className={`yam-panel yam-panel-${p.n}`}
              data-cursor={`0${p.n}`}
            >
              <div className="yam-panel-fill" />
              <div className="yam-panel-meta">
                <div>
                  <div className="yam-h3">{p.title}</div>
                  <div
                    className="yam-mono"
                    style={{ color: "rgba(244,242,236,0.65)", marginTop: "0.4rem" }}
                  >
                    {p.tag}
                  </div>
                </div>
                <span className="yam-panel-num">
                  0{p.n} / 0{PANELS.length}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
