"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import CitySelector from "./CitySelector";

export default function HeroSection() {
  const videoRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    // Check if video can play, fallback to static photo
    const video = videoRef.current;
    if (!video) return;

    const timeout = setTimeout(() => {
      if (video.readyState < 2) setVideoFailed(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: "85vh", minHeight: "500px" }}
    >
      {/* Video / Photo background */}
      {!videoFailed ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoFailed(true)}
          poster="https://pub-a8259d97bc254f95981092323524064c.r2.dev/photos/cities/hero/1.jpg"
        >
          {/* Video source would go here — using poster as fallback */}
        </video>
      ) : (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://pub-a8259d97bc254f95981092323524064c.r2.dev/photos/cities/hero/1.jpg")',
            animation: "ken-burns 10s ease-in-out infinite alternate",
          }}
        />
      )}

      {/* Cinematic gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(26,26,46,0.3) 0%, rgba(26,26,46,0.5) 40%, rgba(26,26,46,0.92) 100%)",
        }}
      />

      {/* Teal tint overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(26,107,90,0.25)" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <motion.h1
          className="font-display font-extrabold text-white leading-tight"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            letterSpacing: "-0.04em",
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
          className="font-display mt-4 text-white/80"
          style={{ fontSize: "clamp(1rem, 2.5vw, 1.5rem)" }}
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
          <p className="text-white/60 text-sm font-display mb-4">
            你想去哪裡？
          </p>
          <CitySelector />
        </motion.div>
      </div>
    </section>
  );
}
