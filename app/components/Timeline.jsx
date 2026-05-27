"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/* placeholder career milestones — swap for the real ones */
const MILESTONES = [
  {
    year: "2020",
    title: "First commits",
    desc: "Personal site in plain HTML & CSS. Caught the bug.",
    side: "left",
    tag: "Start",
  },
  {
    year: "2021",
    title: "Joined the trade",
    desc: "Junior developer at a creative agency. Learned the rhythm.",
    side: "right",
    tag: "Work",
  },
  {
    year: "2022",
    title: "First product",
    desc: "Shipped a SaaS tool that grew past 10k users.",
    side: "left",
    tag: "Launch",
  },
  {
    year: "2023",
    title: "Recognition",
    desc: "Featured among Awwwards Sites of the Day.",
    side: "right",
    tag: "Award",
  },
  {
    year: "2024",
    title: "Independent",
    desc: "Founded the studio. Took on the first three clients.",
    side: "left",
    tag: "Studio",
  },
  {
    year: "2026",
    title: "Now",
    desc: "Building for teams who care about the craft.",
    side: "right",
    tag: "Current",
  },
];

/**
 * Timeline — vertical career history.
 * A dim background rail runs top→bottom. A bright progress line scales
 * from 0→1 as you scrub, with a glowing playhead riding its end. Six
 * milestone cards sit alternating left/right of the rail; each fades
 * and slides in toward the rail at the moment the playhead crosses it.
 */
export default function Timeline() {
  const sectionRef = useRef(null);
  const progressRef = useRef(null);
  const playheadRef = useRef(null);
  const milestonesRef = useRef([]);
  const taglineRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const progress = progressRef.current;
    const playhead = playheadRef.current;
    const milestones = milestonesRef.current.filter(Boolean);
    const tagline = taglineRef.current;

    gsap.set(progress, { scaleY: 0, transformOrigin: "50% 0%" });
    gsap.set(playhead, { top: "0%" });
    milestones.forEach((el, i) => {
      gsap.set(el, {
        opacity: 0,
        x: MILESTONES[i].side === "left" ? -40 : 40,
      });
    });
    gsap.set(tagline, { opacity: 0, y: 30 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=350%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      /* rail + playhead travel together */
      tl.to(progress, { scaleY: 1, ease: "none", duration: 1 }, 0);
      tl.to(playhead, { top: "100%", ease: "none", duration: 1 }, 0);

      /* each milestone fades + slides toward the rail at its trigger point */
      milestones.forEach((m, i) => {
        const triggerAt = (i + 0.4) / MILESTONES.length;
        tl.to(
          m,
          { opacity: 1, x: 0, ease: "power3.out", duration: 0.35 },
          triggerAt
        );
      });

      tl.to(
        tagline,
        { opacity: 1, y: 0, ease: "expo.out", duration: 0.6 },
        0.95
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="yam-timeline" ref={sectionRef} id="timeline">
      <div className="yam-timeline-stage">
        <div className="yam-timeline-rail" aria-hidden="true">
          <div className="yam-timeline-rail-bg" />
          <div className="yam-timeline-rail-fill" ref={progressRef} />
          <div className="yam-timeline-playhead" ref={playheadRef} />
        </div>

        <div className="yam-timeline-milestones">
          {MILESTONES.map((m, i) => (
            <div
              key={i}
              ref={(el) => (milestonesRef.current[i] = el)}
              className={`yam-timeline-milestone yam-timeline-${m.side}`}
              style={{
                top: `${(i / (MILESTONES.length - 1)) * 86 + 7}%`,
              }}
            >
              <div className="yam-timeline-node" />
              <div className="yam-timeline-card">
                <div className="yam-timeline-year">{m.year}</div>
                <div className="yam-timeline-title">{m.title}</div>
                <div className="yam-timeline-desc">{m.desc}</div>
                <div className="yam-timeline-tag">{m.tag}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2 className="yam-timeline-tagline" ref={taglineRef}>
        The line so far.
      </h2>
      <div className="yam-timeline-caption">
        <span>Phase 18</span>
        <span>—</span>
        <span>Timeline.</span>
      </div>
    </section>
  );
}
