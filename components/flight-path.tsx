"use client"

import { motion } from "framer-motion"
import { GraduationCap, Briefcase, Award, Rocket } from "lucide-react"
import { useMemo } from "react"

const milestones = [
  {
    id: "stage-1",
    title: "B.S. Aerospace Engineering",
    subtitle: "MIT",
    dateRange: "2020-2024",
    type: "education",
    location: "CAMBRIDGE, MA",
    description: "Specialized in spacecraft systems engineering with focus on autonomous navigation and robotics.",
    achievements: ["Summa Cum Laude graduate with 3.95 GPA", "NASA USRP Research Fellow (2 years)"],
    icon: GraduationCap,
    iconColor: "#0B3D91",
    iconBg: "#E3F2FD",
  },
  {
    id: "stage-2",
    title: "Systems Engineering Intern",
    subtitle: "SpaceX",
    dateRange: "2023",
    type: "internship",
    location: "HAWTHORNE, CA",
    description: "Autonomous systems research and development with focus on robotic navigation algorithms.",
    achievements: ["Implemented SLAM algorithms", "Published research on ML-based trajectory optimization"],
    icon: Briefcase,
    iconColor: "#FC3D21",
    iconBg: "#FFEBEE",
  },
  {
    id: "stage-3",
    title: "NASA Space Apps Challenge",
    subtitle: "Global Winner",
    dateRange: "2024",
    type: "achievement",
    location: "GLOBAL COMPETITION",
    description:
      "First place winner in Autonomous Navigation Category for developing an AI-powered spacecraft navigation system.",
    achievements: ["Global first place - Autonomous Navigation", "Featured in NASA technical publications"],
    icon: Award,
    iconColor: "#FFB300",
    iconBg: "#FFF8E1",
  },
  {
    id: "stage-4",
    title: "Senior Systems Engineer",
    subtitle: "Advanced Robotics Corp",
    dateRange: "2024-Present",
    type: "career",
    location: "MOUNTAIN VIEW, CA",
    description: "Leading autonomous systems development for next-generation spacecraft and robotic platforms.",
    achievements: ["Led development of 3 major autonomous systems", "Reduced system response time by 40%"],
    icon: Rocket,
    iconColor: "#4CAF50",
    iconBg: "#E8F5E8",
  },
]

export default function FlightPath() {
  const memoizedMilestones = useMemo(() => milestones, [])

  return (
    <section id="flight-path" className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-[#0B3D91]">FLIGHT</span> PATH
          </h2>
          <p className="text-gray-600 font-mono tracking-wider text-sm md:text-base">
            TRAJECTORY ANALYSIS - CAREER ORBITAL MECHANICS
          </p>
        </motion.div>

        <div className="relative">
          {/* Simplified Timeline Line */}
          <motion.div
            className="absolute top-16 left-0 right-0 h-1 bg-[#FC3D21] hidden md:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            viewport={{ once: true }}
            style={{ transformOrigin: "left" }}
          />

          {/* Timeline Icons Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 mb-12">
            {memoizedMilestones.map((milestone, index) => {
              const Icon = milestone.icon
              return (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center relative"
                >
                  <motion.div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-lg flex items-center justify-center shadow-lg border-4 border-white relative z-10"
                    style={{ backgroundColor: milestone.iconBg }}
                    whileHover={{ scale: 1.05 }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.15 + 0.2, duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <Icon className="h-8 w-8 md:h-10 md:w-10" style={{ color: milestone.iconColor }} />
                  </motion.div>

                  <motion.div
                    className="mt-4 bg-[#FC3D21] text-white px-3 py-1 rounded-full font-mono text-xs md:text-sm font-bold"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 + 0.4, duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    {milestone.dateRange}
                  </motion.div>

                  <motion.h3
                    className="mt-2 text-sm md:text-base font-bold text-[#0B3D91] text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.15 + 0.6, duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    {milestone.title}
                  </motion.h3>

                  <motion.p
                    className="text-xs md:text-sm text-gray-600 text-center font-medium"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.15 + 0.8, duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    {milestone.subtitle}
                  </motion.p>
                </motion.div>
              )
            })}
          </div>

          {/* Detailed Cards Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {memoizedMilestones.map((milestone, index) => (
              <motion.div
                key={`${milestone.id}-detail`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.6 }}
                viewport={{ once: true, margin: "-50px" }}
                className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 relative"
              >
                <div className="absolute top-4 right-4">
                  <span className="bg-[#0B3D91] text-white px-3 py-1 rounded font-mono text-xs font-bold">
                    {milestone.location}
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-[#0B3D91] mb-2">{milestone.title}</h3>
                  <p className="text-gray-600 font-medium">{milestone.subtitle}</p>
                </div>

                <p className="text-gray-700 leading-relaxed mb-6 text-sm md:text-base">{milestone.description}</p>

                <div className="space-y-2">
                  {milestone.achievements.map((achievement, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 + 0.3 + i * 0.05, duration: 0.3 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-2 h-2 bg-[#FC3D21] rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{achievement}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
