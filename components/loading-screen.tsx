"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const bootMessages = [
  "BOOTING FLIGHT SYSTEMS...",
  "VERIFYING MISSION PAYLOAD...",
  "SYNCHRONIZING TELEMETRY FEED...",
  "SYSTEMS NOMINAL",
]

const countdownNumbers = [3, 2, 1]

export default function LoadingScreen() {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [showCountdown, setShowCountdown] = useState(false)
  const [currentCount, setCurrentCount] = useState(0)
  const [showIgnition, setShowIgnition] = useState(false)

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setCurrentMessage((prev) => {
        if (prev < bootMessages.length - 1) {
          return prev + 1
        } else {
          clearInterval(messageTimer)
          setTimeout(() => setShowCountdown(true), 300)
          return prev
        }
      })
    }, 400) // Faster message display

    return () => clearInterval(messageTimer)
  }, [])

  useEffect(() => {
    if (showCountdown) {
      const countdownTimer = setInterval(() => {
        setCurrentCount((prev) => {
          if (prev < countdownNumbers.length - 1) {
            return prev + 1
          } else {
            clearInterval(countdownTimer)
            setTimeout(() => setShowIgnition(true), 300)
            return prev
          }
        })
      }, 600) // Faster countdown

      return () => clearInterval(countdownTimer)
    }
  }, [showCountdown])

  return (
    <motion.div
      className="fixed inset-0 bg-[#0B0B1F] flex items-center justify-center z-50 px-4"
      exit={{ y: "-100%", opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* Simplified scanlines for better performance */}
      <div className="absolute inset-0 opacity-5">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="absolute w-full h-px bg-[#FC3D21]" style={{ top: `${i * 6.67}%` }} />
        ))}
      </div>

      {/* Reduced status dots */}
      <div className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 md:w-3 md:h-3 bg-[#FC3D21] rounded-full gpu-accelerated"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-4xl mx-auto">
        {!showCountdown && !showIgnition && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg border border-[#FC3D21]/30 shadow-2xl overflow-hidden">
              <div className="bg-[#FC3D21]/20 px-4 py-2 md:px-6 md:py-3 border-b border-[#FC3D21]/30 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-[#FC3D21] font-mono text-xs md:text-sm">MISSION_CONTROL_TERMINAL v2.1.0</div>
              </div>

              <div className="p-4 md:p-8 min-h-[200px] md:min-h-[250px]">
                <div className="text-[#FC3D21] font-mono text-sm md:text-lg tracking-wider space-y-3">
                  <div className="text-green-400 text-xs md:text-sm mb-4">
                    {">"} Initializing NASA Mission Control Systems...
                  </div>

                  {bootMessages.slice(0, currentMessage + 1).map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.5 }}
                      className="flex items-center space-x-2"
                    >
                      <span className="text-green-400">{">"}</span>
                      <span className="text-[#FC3D21]">{message}</span>
                      {index === currentMessage && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8 }}
                          className="text-white"
                        >
                          _
                        </motion.span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {showCountdown && !showIgnition && (
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white text-sm md:text-lg mb-6 tracking-widest font-mono"
            >
              LAUNCH SEQUENCE INITIATED
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.div
                key={countdownNumbers[currentCount]}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-[#FC3D21] text-6xl md:text-8xl font-bold font-mono"
              >
                T-MINUS {countdownNumbers[currentCount]}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {showIgnition && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [1, 1, 0],
              y: [0, -30, -100],
            }}
            transition={{ duration: 1.5 }}
            className="text-center"
          >
            <div className="text-[#FC3D21] text-6xl md:text-8xl font-bold font-mono">IGNITION</div>
           
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
