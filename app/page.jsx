"use client";

import { useEffect, useRef, useState } from "react";
import "./yamnang.css";
import { SmoothScroll, onScroll } from "./lib/effects";
import Loader from "./components/Loader";
import Cursor from "./components/Cursor";
import Nav from "./components/Nav";
import IntroZoom from "./components/IntroZoom";
import ScrollHero from "./components/ScrollHero";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Showcase from "./components/Showcase";
import Work from "./components/Work";
import Services from "./components/Services";
import Detonate from "./components/Detonate";
import Mission from "./components/Mission";
import Field from "./components/Field";
import Terminal from "./components/Terminal";
import Lattice from "./components/Lattice";
import Stargate from "./components/Stargate";
import Morph from "./components/Morph";
import Constellation from "./components/Constellation";
import Metaballs from "./components/Metaballs";
import PhysicsDrop from "./components/PhysicsDrop";
import Typewriter from "./components/Typewriter";
import DollyZoom from "./components/DollyZoom";
import Origami from "./components/Origami";
import Pendulum from "./components/Pendulum";
import Waveform from "./components/Waveform";
import Numbers from "./components/Numbers";
import Qrcode from "./components/Qrcode";
import Footer from "./components/Footer";

export default function YamnangPage() {
  const [intro, setIntro] = useState(true);
  const [loaderGone, setLoaderGone] = useState(false);
  const progressRef = useRef(null);

  /* pin to the top and lock scrolling while the intro plays */
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    if (window.__lenis) window.__lenis.stop();
    else document.documentElement.style.overflow = "hidden";
  }, []);

  /* top scroll-progress indicator */
  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;
    return onScroll(() => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = `scaleX(${p.toFixed(4)})`;
    });
  }, []);

  const handleIntroDone = () => {
    setIntro(false);
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
      window.__lenis.start();
    } else {
      document.documentElement.style.overflow = "";
    }
    window.setTimeout(() => setLoaderGone(true), 1500);
  };

  return (
    <main className="yam">
      {!loaderGone && <Loader onDone={handleIntroDone} />}
      <Cursor />
      <div className="yam-grain" aria-hidden="true" />
      <div className="yam-progress" ref={progressRef} aria-hidden="true" />

      <SmoothScroll>
        <div className="yam-stage" data-ready={intro ? "false" : "true"}>
          <Nav />
          <IntroZoom />
          <ScrollHero start={!intro} />
          <Hero start={!intro} />
          <Marquee />
          <Showcase />
          <Work />
          <Services />
          <Detonate />
          <Mission />
          <Field />
          <Terminal />
          <Lattice />
          <Stargate />
          <Morph />
          <Constellation />
          <Metaballs />
          <PhysicsDrop />
          <Typewriter />
          <DollyZoom />
          <Origami />
          <Pendulum />
          <Waveform />
          <Numbers />
          <Qrcode />
          <Footer />
        </div>
      </SmoothScroll>
    </main>
  );
}
