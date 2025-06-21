"use client"

import { motion } from "framer-motion"
import { Code, Database, Brain, Cpu, Wrench, Globe, Zap, Shield } from "lucide-react"
import { useMemo } from "react"

const skillModules = [
  {
    name: "PYTHON",
    category: "PROPULSION",
    level: 95,
    icon: Code,
    color: "#3776ab",
    description: "Advanced algorithms & ML",
  },
  {
    name: "REACT",
    category: "NAVIGATION",
    level: 90,
    icon: Globe,
    color: "#61dafb",
    description: "Interactive interfaces",
  },
  {
    name: "TENSORFLOW",
    category: "AI SYSTEMS",
    level: 85,
    icon: Brain,
    color: "#ff6f00",
    description: "Neural networks & ML",
  },
  {
    name: "C++",
    category: "CORE SYSTEMS",
    level: 88,
    icon: Cpu,
    color: "#00599c",
    description: "High-performance computing",
  },
  {
    name: "ROS/ROS2",
    category: "ROBOTICS",
    level: 92,
    icon: Wrench,
    color: "#22314e",
    description: "Robot operating systems",
  },
  {
    name: "POSTGRESQL",
    category: "DATA STORAGE",
    level: 82,
    icon: Database,
    color: "#336791",
    description: "Database management",
  },
  {
    name: "DOCKER",
    category: "DEPLOYMENT",
    level: 87,
    icon: Shield,
    color: "#2496ed",
    description: "Containerization",
  },
  {
    name: "CUDA",
    category: "GPU COMPUTE",
    level: 78,
    icon: Zap,
    color: "#76b900",
    description: "Parallel processing",
  },
]

export default function DockingBay() {
  const memoizedSkills = useMemo(() => skillModules, [])

  return (
    <section id="docking-bay" className="py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-[#FC3D21] font-mono tracking-widest text-xs md:text-sm mb-2">
            SPACECRAFT SYSTEMS INVENTORY
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 text-[#0B3D91]">DOCKING BAY</h2>
          <div className="w-16 md:w-24 h-1 bg-[#FC3D21] mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {memoizedSkills.map((skill, index) => {
            const Icon = skill.icon
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                viewport={{ once: true, margin: "-50px" }}
                className="group"
              >
                <motion.div
                  className="bg-white rounded-lg border-2 border-gray-200 p-4 md:p-6 lg:p-8 h-full relative overflow-hidden"
                  whileHover={{
                    scale: 1.03,
                    borderColor: skill.color,
                    boxShadow: `0 10px 20px -5px ${skill.color}20`,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Icon Container */}
                  <motion.div
                    className="w-12 h-12 md:w-16 md:h-16 rounded-lg flex items-center justify-center mb-4 md:mb-6 mx-auto relative z-10"
                    style={{ backgroundColor: `${skill.color}20` }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className="h-6 w-6 md:h-8 md:w-8" style={{ color: skill.color }} />
                  </motion.div>

                  {/* Skill Name */}
                  <motion.h3
                    className="text-lg md:text-xl font-bold text-center mb-2 relative z-10"
                    style={{ color: skill.color }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {skill.name}
                  </motion.h3>

                  {/* Category */}
                  <p className="text-gray-600 text-center text-xs md:text-sm font-mono mb-3 md:mb-4 relative z-10">
                    {skill.category}
                  </p>

                  {/* Description - Hidden on mobile for space */}
                  <p className="hidden md:block text-gray-500 text-center text-xs mb-4 lg:mb-6 relative z-10">
                    {skill.description}
                  </p>

                  {/* Power Level */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-gray-500">PWR</span>
                      <span className="text-sm font-bold" style={{ color: skill.color }}>
                        {skill.level}%
                      </span>
                    </div>

                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute top-0 left-0 h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${skill.color} 0%, ${skill.color}80 50%, #0B3D91 100%)`,
                        }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{
                          delay: index * 0.08 + 0.3,
                          duration: 0.8,
                          ease: "easeOut",
                        }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
