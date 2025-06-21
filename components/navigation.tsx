"use client"

import { useState, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"

const navItems = [
  { id: "bio", label: "BIO" },
  { id: "missions", label: "MISSIONS" },
  { id: "flight-path", label: "FLIGHT PATH" },
  { id: "docking-bay", label: "DOCKING BAY" },
  { id: "comms", label: "COMMS" },
]

interface NavigationProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export default function Navigation({ activeSection, setActiveSection }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const scrollToSection = useCallback(
    (sectionId: string) => {
      setActiveSection(sectionId)
      setIsMobileMenuOpen(false)
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    },
    [setActiveSection],
  )

  const memoizedNavItems = useMemo(() => navItems, [])

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[#0B3D91]/20"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="text-[#0B3D91] font-bold text-lg md:text-xl tracking-wider"
            whileHover={{ scale: 1.05 }}
          >
            MISSION CONTROL
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 lg:space-x-8">
            {memoizedNavItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative font-mono text-sm tracking-wider transition-colors ${
                  activeSection === item.id ? "text-[#FC3D21]" : "text-black hover:text-[#0B3D91]"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FC3D21]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 text-[#0B3D91]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>

        {/* Mobile Navigation Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? "auto" : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-2">
            {memoizedNavItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left px-4 py-2 font-mono text-sm tracking-wider transition-colors rounded ${
                  activeSection === item.id
                    ? "text-[#FC3D21] bg-[#FC3D21]/10"
                    : "text-black hover:text-[#0B3D91] hover:bg-gray-100"
                }`}
                whileTap={{ scale: 0.98 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}
