"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import config from "@/config";

const cities = [
  { key: "New York", label: "紐約", emoji: "🗽" },
  { key: "Los Angeles", label: "洛杉磯", emoji: "🌴" },
  { key: "Boston", label: "波士頓", emoji: "🎓" },
  { key: "San Diego", label: "聖地牙哥", emoji: "🏖️" },
  { key: "San Francisco", label: "舊金山", emoji: "🌉" },
];

export default function CitySelector() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {cities.map((city, i) => (
        <motion.div
          key={city.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
        >
          <Link
            href={`/schools?city=${encodeURIComponent(city.key)}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-display font-semibold text-sm transition-all"
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.25)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span>{city.emoji}</span>
            <span>{city.label}</span>
          </Link>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.4 }}
      >
        <Link
          href="/packs"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-display font-semibold text-sm transition-all"
          style={{
            backgroundColor: "var(--color-accent)",
            color: "white",
            border: "1px solid var(--color-accent)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(224,122,95,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <span>🤷</span>
          <span>不確定？看懶人包</span>
        </Link>
      </motion.div>
    </div>
  );
}
