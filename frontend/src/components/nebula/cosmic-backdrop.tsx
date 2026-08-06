"use client";

import { motion } from "framer-motion";

const stars = Array.from({ length: 32 }, (_, index) => ({
  id: index,
  top: `${(index * 37) % 100}%`,
  left: `${(index * 17) % 100}%`,
  size: 1 + (index % 2),
  duration: 8 + (index % 4),
  delay: (index % 6) * 0.45,
}));

export function CosmicBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-x-[12%] top-[5%] h-[56vh] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_rgba(107,94,255,0.18)_0%,_rgba(55,104,255,0.12)_22%,_rgba(17,30,56,0.04)_52%,_transparent_78%)] blur-2xl"
        animate={{ x: [0, 30, 0], opacity: [0.72, 0.88, 0.72] }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[22%] top-[18%] h-[30vh] w-[42vw] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_rgba(92,214,255,0.12)_0%,_rgba(34,57,96,0.05)_45%,_transparent_80%)] blur-3xl"
        animate={{ x: [0, -18, 0], y: [0, 14, 0] }}
        transition={{ duration: 22, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <div className="absolute inset-x-0 top-0 h-[72vh] bg-[linear-gradient(180deg,_rgba(3,6,18,0.03)_0%,_rgba(3,6,18,0.42)_68%,_rgba(3,6,18,0.88)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,_rgba(255,255,255,0.08),_transparent_10%),linear-gradient(115deg,_transparent_0%,_rgba(255,255,255,0.02)_38%,_transparent_60%)] opacity-60" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(136,163,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(136,163,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-70" />
      {stars.map((star) => (
        <motion.span
          key={star.id}
          className="absolute rounded-full bg-white/85 shadow-[0_0_10px_rgba(255,255,255,0.42)]"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
          }}
          animate={{
            y: [0, 10, -8, 0],
            opacity: [0.22, 0.86, 0.34, 0.22],
            scale: [1, 1.2, 0.95, 1],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
