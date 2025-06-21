"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import LoadingScreen from "@/components/loading-screen"
import Navigation from "@/components/navigation"
import HeroSection from "@/components/hero-section"
import MissionLog from "@/components/mission-log"
import FlightPath from "@/components/flight-path"
import DockingBay from "@/components/docking-bay"
import CommsSection from "@/components/comms-section"
import StarField from "@/components/star-field"

export default function Portfolio() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("bio")

  // Memoize sections array to prevent unnecessary re-renders
  const sections = useMemo(() => ["bio", "missions", "flight-path", "docking-bay", "comms"], [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 4000) // Reduced from 6000 to 4000 for faster loading

    return () => clearTimeout(timer)
  }, [])

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + 100

    for (const section of sections) {
      const element = document.getElementById(section)
      if (element) {
        const { offsetTop, offsetHeight } = element
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          if (activeSection !== section) {
            setActiveSection(section)
          }
          break
        }
      }
    }
  }, [sections, activeSection])

  useEffect(() => {
    // Throttled scroll listener for better performance
    let ticking = false

    const throttledScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", throttledScrollHandler, { passive: true })
    return () => window.removeEventListener("scroll", throttledScrollHandler)
  }, [handleScroll])

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Optimized background elements */}
            <StarField />

            <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />

            <main className="relative z-10">
              <HeroSection />
              <MissionLog />
              <FlightPath />
              <DockingBay />
              <CommsSection />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
