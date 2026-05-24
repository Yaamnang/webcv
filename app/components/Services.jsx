"use client";

import { useEffect, useRef } from "react";
import { onScroll, clamp, Reveal } from "../lib/effects";

const SERVICES = [
  {
    n: "01",
    kicker: "Craft",
    title: "Digital Design",
    text: "Interfaces and identity systems that look sharp and pull their weight — every screen, state and detail designed with a clear reason behind it.",
    tags: ["UX Strategy", "UI Design", "Design Systems", "Prototyping"],
  },
  {
    n: "02",
    kicker: "Engineering",
    title: "Development",
    text: "Fast, accessible web and mobile builds with clean, maintainable code — the kind your team can keep growing long after launch day.",
    tags: ["Next.js", "React", "Headless CMS", "Motion"],
  },
  {
    n: "03",
    kicker: "Reliability",
    title: "Care & Support",
    text: "We stick around after go-live: monitoring, updates and quiet fixes that keep everything secure, current and quick — so it never becomes a problem.",
    tags: ["Monitoring", "Updates", "Hosting", "SEO"],
  },
  {
    n: "04",
    kicker: "Momentum",
    title: "Redesign & Growth",
    text: "Turning slow, dated sites into something faster and smarter — sharpening what already works instead of starting again from zero.",
    tags: ["Audit", "Performance", "Migration", "Experiments"],
  },
];

export default function Services() {
  const wrapRef = useRef(null);

  /* covered cards scale down + dim so the stack reads as depth */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const cards = [...wrap.querySelectorAll(".yam-service-card")];
    if (!cards.length) return;

    let tops = [];
    const measure = () => {
      tops = cards.map((c) => parseFloat(getComputedStyle(c).top) || 0);
    };
    measure();
    window.addEventListener("resize", measure);

    const unsub = onScroll(() => {
      const vh = window.innerHeight;
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) {
          card.style.transform = "none";
          card.style.filter = "none";
          return;
        }
        const range = vh - tops[i];
        const p =
          range > 0
            ? clamp((vh - next.getBoundingClientRect().top) / range)
            : 0;
        card.style.transform = `scale(${(1 - p * 0.13).toFixed(4)})`;
        card.style.filter = `brightness(${(1 - p * 0.4).toFixed(3)})`;
      });
    });

    return () => {
      window.removeEventListener("resize", measure);
      unsub();
    };
  }, []);

  return (
    <section
      className="yam-services yam-section yam-container"
      id="services"
      ref={wrapRef}
    >
      <div className="yam-section-head">
        <div>
          <Reveal as="p" className="yam-eyebrow">
            Services
          </Reveal>
          <Reveal
            as="h2"
            className="yam-h2"
            delay={0.06}
            style={{ marginTop: "1rem" }}
          >
            From the first idea
            <br />
            to long-term care.
          </Reveal>
        </div>
        <Reveal as="p" className="yam-body" delay={0.12} style={{ maxWidth: "24rem" }}>
          Four ways we plug into your team — pick one, or let us carry the whole
          thing end to end.
        </Reveal>
      </div>

      {SERVICES.map((s, i) => (
        <article
          key={s.n}
          className="yam-service-card"
          data-tone={i + 1}
          style={{ top: `calc(5.5rem + ${i * 1.5}rem)` }}
        >
          <div className="yam-service-top">
            <span className="yam-service-index">
              {s.n} — {s.kicker}
            </span>
            <span className="yam-mono" style={{ color: "var(--muted)" }}>
              ({s.n} / 0{SERVICES.length})
            </span>
          </div>
          <div className="yam-service-body">
            <h3 className="yam-service-title">{s.title}</h3>
            <p className="yam-body" style={{ maxWidth: "42rem" }}>
              {s.text}
            </p>
            <div className="yam-service-tags">
              {s.tags.map((t) => (
                <span className="yam-tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
