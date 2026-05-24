"use client";

import { useEffect, useRef, useState } from "react";
import { scrollTo, Magnetic, Reveal } from "../lib/effects";

const SITEMAP = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Studio", href: "#showcase" },
  { label: "Top", href: "#top" },
];

const SOCIAL = ["Instagram", "Twitter / X", "LinkedIn", "GitHub"];

const FINAL_EMAIL = "hello@yamnang.studio";
const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

const randChar = () =>
  SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];

export default function Footer() {
  /* "--:--:--" pre-mount avoids SSR/hydration mismatch on the live clock */
  const [time, setTime] = useState("--:--:--");
  const emailRef = useRef(null);
  const scrambleRef = useRef({ raf: 0, active: false });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setTime(`${h}:${m}:${s}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  /* email scramble — chars resolve left-to-right over ~0.6s on hover */
  const onEmailEnter = () => {
    scrambleRef.current.active = true;
    const startTime = performance.now();
    const duration = 600;
    const tick = (now) => {
      if (!scrambleRef.current.active) return;
      const progress = Math.min((now - startTime) / duration, 1);
      let result = "";
      for (let i = 0; i < FINAL_EMAIL.length; i++) {
        const ch = FINAL_EMAIL[i];
        if (ch === "@" || ch === ".") {
          result += ch;
          continue;
        }
        const lockPoint = (i / FINAL_EMAIL.length) * 0.85;
        result += progress >= lockPoint ? ch : randChar();
      }
      if (emailRef.current) emailRef.current.textContent = result;
      if (progress < 1)
        scrambleRef.current.raf = requestAnimationFrame(tick);
    };
    scrambleRef.current.raf = requestAnimationFrame(tick);
  };

  const onEmailLeave = () => {
    scrambleRef.current.active = false;
    cancelAnimationFrame(scrambleRef.current.raf);
    if (emailRef.current) emailRef.current.textContent = FINAL_EMAIL;
  };

  const goInternal = (e, href) => {
    e.preventDefault();
    if (href === "#top") scrollTo(0);
    else scrollTo(href);
  };

  return (
    <footer className="yam-footer" id="contact">
      {/* live transmission strip at the very top */}
      <div className="yam-footer-stream">
        <div className="yam-footer-stream-cell">
          <span className="yam-footer-pulse" />
          <span>Transmission open</span>
        </div>
        <div className="yam-footer-stream-cell">
          <span>{time} · UTC+6</span>
        </div>
        <div className="yam-footer-stream-cell">
          <span>Thimphu · Online</span>
        </div>
      </div>

      <div className="yam-container">
        <div className="yam-footer-cta">
          <Reveal as="p" className="yam-eyebrow">
            Have something in mind?
          </Reveal>
          <Reveal as="div" delay={0.05}>
            <Magnetic strength={0.18}>
              <a
                className="yam-footer-link"
                href={`mailto:${FINAL_EMAIL}`}
                data-cursor="Email us"
                onMouseEnter={onEmailEnter}
                onMouseLeave={onEmailLeave}
              >
                <span ref={emailRef}>{FINAL_EMAIL}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path
                    d="M7 17 17 7M9 7h8v8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </Magnetic>
          </Reveal>
          <Reveal
            as="p"
            className="yam-body"
            delay={0.1}
            style={{ maxWidth: "36rem" }}
          >
            Tell us about the project — the timeline, the budget, even the
            messy parts. We reply to every serious enquiry within two working
            days.
          </Reveal>
        </div>

        <div className="yam-footer-grid">
          <div className="yam-footer-col">
            <h4>Studio</h4>
            <p className="yam-body" style={{ maxWidth: "22rem" }}>
              Yamnang is an independent design &amp; development studio
              building considered digital products for ambitious teams
              worldwide.
            </p>
          </div>

          <div className="yam-footer-col">
            <h4>Sitemap</h4>
            {SITEMAP.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => goInternal(e, l.href)}
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="yam-footer-col">
            <h4>Social</h4>
            {SOCIAL.map((s) => (
              <a key={s} href="#" onClick={(e) => e.preventDefault()}>
                {s}
              </a>
            ))}
          </div>

          <div className="yam-footer-col">
            <h4>Contact</h4>
            <a href={`mailto:${FINAL_EMAIL}`}>{FINAL_EMAIL}</a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              +975 00 00 00 00
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Privacy &amp; Terms
            </a>
          </div>
        </div>
      </div>

      {/* giant wordmark — each letter is a span so :hover triggers a wave */}
      <div className="yam-footer-wordmark" aria-hidden="true">
        {"Yamnang".split("").map((c, i) => (
          <span key={i} style={{ "--i": i }}>
            {c}
          </span>
        ))}
      </div>

      <div className="yam-container">
        <div className="yam-footer-base">
          <span>© 2026 Yamnang Studio — All rights reserved.</span>
          <span>Designed &amp; built in-house.</span>
          <Magnetic strength={0.4}>
            <button
              className="yam-totop"
              onClick={() => scrollTo(0)}
              data-cursor="Back to top"
            >
              Back to top
              <span aria-hidden="true">↑</span>
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
