"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CosmicCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed z-[80] hidden h-24 w-24 rounded-full bg-[radial-gradient(circle,_rgba(109,240,214,0.26)_0%,_rgba(97,168,255,0.16)_35%,_transparent_72%)] blur-xl md:block"
      animate={{
        x: position.x - 48,
        y: position.y - 48,
      }}
      transition={{ type: "spring", stiffness: 140, damping: 20, mass: 0.5 }}
    />
  );
}
