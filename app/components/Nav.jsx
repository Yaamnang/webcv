"use client";

import { useEffect, useRef, useState } from "react";
import { onScroll, scrollTo, Magnetic } from "../lib/effects";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Studio", href: "#showcase" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);

  /* scrolled state + hide-on-scroll-down / show-on-scroll-up */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let last = window.scrollY;
    return onScroll(() => {
      const y = window.scrollY;
      nav.dataset.scrolled = y > 40 ? "true" : "false";
      if (y > 260 && y > last + 4) nav.dataset.hidden = "true";
      else if (y < last - 4 || y < 260) nav.dataset.hidden = "false";
      last = y;
    });
  }, []);

  /* lock the page while the overlay menu is open */
  useEffect(() => {
    if (open) {
      if (window.__lenis) window.__lenis.stop();
      else document.documentElement.style.overflow = "hidden";
    } else {
      if (window.__lenis) window.__lenis.start();
      else document.documentElement.style.overflow = "";
    }
  }, [open]);

  /* escape closes the menu */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (e, href) => {
    e.preventDefault();
    const wasOpen = open;
    setOpen(false);
    const run = () => (href === "#top" ? scrollTo(0) : scrollTo(href));
    if (wasOpen) setTimeout(run, 340);
    else run();
  };

  return (
    <>
      <header
        ref={navRef}
        className="yam-nav"
        data-scrolled="false"
        data-hidden="false"
      >
        <a
          className="yam-logo"
          href="#top"
          onClick={(e) => go(e, "#top")}
          data-cursor="Top"
        >
          Yamnang
        </a>

        <nav className="yam-nav-links" aria-label="Primary">
          {LINKS.map((l) => (
            <a
              key={l.href}
              className="yam-navlink"
              href={l.href}
              onClick={(e) => go(e, l.href)}
            >
              <span data-text={l.label}>{l.label}</span>
            </a>
          ))}
        </nav>

        <div className="yam-nav-right">
          <Magnetic strength={0.3}>
            <a
              className="yam-nav-cta"
              href="#contact"
              onClick={(e) => go(e, "#contact")}
              data-cursor="Let's talk"
            >
              Start a project
            </a>
          </Magnetic>
          <button
            className="yam-burger"
            data-open={open ? "true" : "false"}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className="yam-menu" data-open={open ? "true" : "false"}>
        <nav aria-label="Mobile">
          {LINKS.map((l) => (
            <a
              key={l.href}
              className="yam-menu-link"
              href={l.href}
              onClick={(e) => go(e, l.href)}
            >
              <span>{l.label}</span>
            </a>
          ))}
        </nav>
        <div className="yam-menu-foot">
          <span>hello@yamnang.studio</span>
          <span>Available for projects — 2026</span>
        </div>
      </div>
    </>
  );
}
