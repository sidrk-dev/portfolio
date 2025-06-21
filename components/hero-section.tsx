"use client"

import { motion } from "framer-motion"
import { Download, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCallback } from "react"

export default function HeroSection() {
  const scrollToContact = useCallback(() => {
    const element = document.getElementById("comms")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  return (
    <section id="bio" className="min-h-screen flex items-center justify-center pt-20 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.div
              className="text-[#0B3D91] font-mono text-sm tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              CREW IDENTIFICATION
            </motion.div>

            <motion.h1
              className="text-5xl lg:text-7xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              ENGINEER
              <br />
              <span className="text-[#FC3D21]">HX-ZERO</span>
            </motion.h1>

            <motion.div
              className="space-y-2 font-mono text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div>MISSION CODE: HX-2025</div>
              <div>OBJECTIVE: ADVANCED ROBOTICS ENGINEERING</div>
              <div className="text-[#FC3D21]">STATUS: ACTIVE</div>
            </motion.div>
          </div>

          <motion.p
            className="text-lg text-gray-600 leading-relaxed max-w-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Robotics + Controls Engineer specializing in autonomous systems, machine learning, and spacecraft
            navigation. Currently deployed on advanced mission parameters.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <Button className="bg-[#FC3D21] hover:bg-[#FC3D21]/90 text-white font-mono tracking-wider" size="lg">
              <Download className="mr-2 h-4 w-4" />
              DEPLOY RESUME
            </Button>
            <Button
              variant="outline"
              className="border-[#0B3D91] text-[#0B3D91] hover:bg-[#0B3D91] hover:text-white font-mono tracking-wider"
              size="lg"
              onClick={scrollToContact}
            >
              <Radio className="mr-2 h-4 w-4" />
              CONTACT MISSION CONTROL
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="relative flex justify-center"
        >
          <div className="relative">
            {/* Simplified HUD Rings for better performance */}
            <motion.div
              className="absolute inset-0 border-2 border-[#FC3D21] rounded-full gpu-accelerated"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              style={{ width: "400px", height: "400px" }}
            />
            <motion.div
              className="absolute inset-4 border border-[#0B3D91] rounded-full opacity-50 gpu-accelerated"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />

            {/* Profile Image */}
            <div className="relative w-80 h-80 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-2xl">
              <img
                src="/placeholder.svg?height=320&width=320"
                alt="Commander Profile"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
