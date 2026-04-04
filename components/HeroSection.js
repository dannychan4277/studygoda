"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import CitySelector from "./CitySelector";

const R2_BASE = "https://pub-a8259d97bc254f95981092323524064c.r2.dev/photos/cities";

const HERO_IMAGES = [
  { src: `${R2_BASE}/new-york/1.jpg`, city: "紐約" },
  { src: `${R2_BASE}/san-francisco/1.jpg`, city: "舊金山" },
  { src: `${R2_BASE}/miami/1.jpg`, city: "邁阿密" },
  { src: `${R2_BASE}/los-angeles/1.jpg`, city: "洛杉磯" },
  { src: `${R2_BASE}/boston/1.jpg`, city: "波士頓" },
  { src: `${R2_BASE}/honolulu/1.jpg`, city: "檀香山" },
  { src: `${R2_BASE}/chicago/1.jpg`, city: "芝加哥" },
  { src: `${R2_BASE}/san-diego/1.jpg`, city: "聖地牙哥" },
];

const INTERVAL = 5000;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [transitioning, setTransitioning] = useState(false);

  const advance = useCallback(() => {
    setPrev(current);
    setTransitioning(true);
    setCurrent((c) => (c + 1) % HERO_IMAGES.length);
    setTimeout(() => {
      setTransitioning(false);
      setPrev(null);
    }, 1000);
  }, [current]);

  useEffect(() => {
    const id = setInterval(advance, INTERVAL);
    return () => clearInterval(id);
  }, [advance]);

  // Preload next image
  useEffect(() => {
    const next = (current + 1) % HERO_IMAGES.length;
    const img = new Image();
    img.src = HERO_IMAGES[next].src;
  }, [current]);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        height: "clamp(400px, 65vh, 600px)",
        minHeight: "400px",
      }}
    >
      {/* Previous image (fading out) */}
      {prev !== null && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url("${HERO_IMAGES[prev].src}")`,
            opacity: transitioning ? 0 : 1,
            transition: "opacity 1s ease-in-out",
          }}
        />
      )}

      {/* Current image (fading in) */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url("${HERO_IMAGES[current].src}")`,
          opacity: transitioning ? 1 : 1,
          transition: "opacity 1s ease-in-out",
        }}
      />

      {/* Darkened gradient overlay — strong enough for WCAG AA on any photo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(26,26,46,0.4) 0%, rgba(26,26,46,0.55) 30%, rgba(26,26,46,0.7) 60%, rgba(26,26,46,0.95) 100%)",
        }}
      />

      {/* Teal tint overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(26,107,90,0.2)" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <motion.h1
          className="font-display font-extrabold text-white leading-tight"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            letterSpacing: "-0.04em",
            textShadow: "0 2px 30px rgba(0,0,0,0.6)",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          你的第一趟
          <br />
          獨立冒險
        </motion.h1>

        <motion.p
          className="font-display mt-4 text-white/90"
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
            textShadow: "0 1px 20px rgba(0,0,0,0.5)",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          美國語言學校，透明比價、AI 配對推薦
        </motion.p>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <p
            className="text-sm font-display mb-4"
            style={{
              color: "rgba(255,255,255,0.7)",
              textShadow: "0 1px 10px rgba(0,0,0,0.4)",
            }}
          >
            你想去哪裡？
          </p>
          <CitySelector />
        </motion.div>
      </div>
    </section>
  );
}
