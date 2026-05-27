"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  /* transform-based pinning avoids the pin-spacer DOM mutation
     that conflicts with React's reconciler (removeChild errors). */
  ScrollTrigger.defaults({ pinType: "transform" });
}

/* ---------------------------------------------------------
   small helpers
   --------------------------------------------------------- */
export const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const canHover = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
export const lerp = (a, b, t) => a + (b - a) * t;

/* ---------------------------------------------------------
   shared scroll controller — one listener, rAF-batched.
   Every subscriber also fires on resize and once on mount.
   --------------------------------------------------------- */
const scrollSubs = new Set();
let ticking = false;

function flush() {
  ticking = false;
  for (const fn of scrollSubs) fn();
}
function request() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(flush);
  }
}

export function onScroll(fn) {
  if (typeof window === "undefined") return () => {};
  if (scrollSubs.size === 0) {
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
  }
  scrollSubs.add(fn);
  fn();
  return () => {
    scrollSubs.delete(fn);
    if (scrollSubs.size === 0) {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    }
  };
}

/* ---------------------------------------------------------
   SmoothScroll — Lenis momentum scrolling.
   Exposes the instance on window.__lenis for anchor jumps.
   --------------------------------------------------------- */
export function SmoothScroll({ children }) {
  useEffect(() => {
    if (reducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    window.__lenis = lenis;

    // keep GSAP ScrollTrigger in sync with Lenis-managed scroll
    lenis.on("scroll", ScrollTrigger.update);

    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return children;
}

/** Smoothly scroll to an element or position (falls back to native). */
export function scrollTo(target, opts = {}) {
  if (typeof window === "undefined") return;
  if (window.__lenis) {
    window.__lenis.scrollTo(target, { duration: 1.4, ...opts });
  } else {
    const el =
      typeof target === "string" ? document.querySelector(target) : target;
    if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth" });
    else if (typeof target === "number")
      window.scrollTo({ top: target, behavior: "smooth" });
  }
}

/* ---------------------------------------------------------
   useReveal — fires once when the element enters the viewport
   --------------------------------------------------------- */
export function useReveal({ threshold = 0.18, rootMargin = "0px 0px -8% 0px" } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) {
      setInView(true);
      return;
    }
    let active = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (active && entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => {
      active = false;
      io.disconnect();
    };
  }, [threshold, rootMargin]);

  return [ref, inView];
}

/* ---------------------------------------------------------
   Reveal — declarative reveal wrapper.
   variant: "up" | "clip" | "lines"
   --------------------------------------------------------- */
export function Reveal({
  as: Tag = "div",
  variant = "up",
  delay = 0,
  threshold,
  className = "",
  style,
  children,
  ...rest
}) {
  const [ref, inView] = useReveal(threshold != null ? { threshold } : {});
  const base =
    variant === "clip"
      ? "yam-reveal-clip"
      : variant === "lines"
      ? "yam-reveal-lines"
      : "yam-reveal";

  return (
    <Tag
      ref={ref}
      className={`${base} ${className}`.trim()}
      data-in={inView ? "true" : "false"}
      style={{ "--d": `${delay}s`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Split a string into <span class="yam-line"><span class="yam-line-inner"> lines. */
export function SplitLines({ lines, className = "" }) {
  return (
    <span className={`yam-reveal-lines ${className}`.trim()}>
      {lines.map((line, i) => (
        <span className="yam-line" key={i}>
          <span className="yam-line-inner">{line}</span>
        </span>
      ))}
    </span>
  );
}

/* ---------------------------------------------------------
   useParallax — translates an element against scroll.
   speed ~0.1 subtle, ~0.4 strong. Negative inverts.
   --------------------------------------------------------- */
export function useParallax(speed = 0.15) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;

    return onScroll(() => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < -vh || rect.top > vh * 2) return;
      const center = rect.top + rect.height / 2;
      const offset = (center - vh / 2) / vh;
      el.style.transform = `translate3d(0, ${(-offset * speed * vh).toFixed(
        2
      )}px, 0)`;
    });
  }, [speed]);

  return ref;
}

/* ---------------------------------------------------------
   Magnetic — element drifts toward the cursor when near it
   --------------------------------------------------------- */
export function Magnetic({ children, strength = 0.4, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || !canHover()) return;

    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(
        2
      )}px, 0)`;
    };
    const leave = () => {
      el.style.transform = "translate3d(0,0,0)";
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);

  return (
    <span
      ref={ref}
      className={`yam-magnetic ${className}`.trim()}
      style={{ transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)" }}
    >
      {children}
    </span>
  );
}

/* ---------------------------------------------------------
   useScrollProgress — 0..1 progress of an element through
   the viewport. Used by the showcase / services sections.
   --------------------------------------------------------- */
export function useScrollProgress(ref, { start = "top", end = "bottom" } = {}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return onScroll(() => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      if (total <= 0) {
        setProgress(rect.top <= 0 ? 1 : 0);
        return;
      }
      const p = clamp(-rect.top / total);
      setProgress(p);
    });
  }, [ref, start, end]);

  return progress;
}
