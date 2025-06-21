"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"

export default function StarField() {
  // Memoize star positions to prevent recalculation on re-renders
  const stars = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 2,
        duration: Math.random() * 2 + 3,
        size: Math.random() * 0.5 + 0.5,
      })),
    [],
  )

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-gray-300 rounded-full gpu-accelerated"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: star.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
