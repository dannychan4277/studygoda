"use client";

import { motion } from "framer-motion";

export default function AnimatedSection({
  children,
  className = "",
  style = {},
  delay = 0,
}) {
  return (
    <motion.section
      className={className}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}
