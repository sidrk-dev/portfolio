"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ExternalLink, Download, ChevronRight, Award, X, MousePointer2 } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"

const greetings = [
  "Hello",
  "வணக்கம்",
  "Hola",
  "Bonjour",
  "नमस्ते",
  "こんにちは",
  "Ciao",
  "안녕하세요",
  "مرحبا",
  "Здравствуйте",
]

// Custom Cursor Component
function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest(".clickable-hint")) {
        setIsVisible(true)
      }
    }

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(".clickable-hint")) {
        setIsVisible(false)
      }
    }

    document.addEventListener("mousemove", updateMousePosition)
    document.addEventListener("mouseover", handleMouseEnter)
    document.addEventListener("mouseout", handleMouseLeave)

    return () => {
      document.removeEventListener("mousemove", updateMousePosition)
      document.removeEventListener("mouseover", handleMouseEnter)
      document.removeEventListener("mouseout", handleMouseLeave)
    }
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-difference"
      animate={{
        x: mousePosition.x - 12,
        y: mousePosition.y - 12,
        scale: isVisible ? 1 : 0,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
        mass: 0.5,
      }}
    >
      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
        <MousePointer2 className="w-4 h-4 text-black" />
      </div>
    </motion.div>
  )
}

// 3D Parallax Project Tile Component
function ParallaxProjectTile({ project, index, onClick }: { project: any; index: number; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 })
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["25deg", "-25deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-25deg", "25deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group cursor-pointer transition-all duration-300 relative z-10 clickable-hint"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
        padding: "0.5rem",
      }}
    >
      <motion.div
        style={{
          rotateX: isHovered ? rotateX : "0deg",
          rotateY: isHovered ? rotateY : "0deg",
          transformStyle: "preserve-3d",
        }}
        animate={{
          scale: isHovered ? 1.05 : 1,
          z: isHovered ? 50 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="aspect-video relative overflow-hidden rounded-lg shadow-lg"
      >
        {/* Main Image */}
        <img
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 rounded-lg"
        />

        {/* Dynamic Glow Effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-lg"
          style={{
            background: `radial-gradient(600px circle at ${mouseXSpring}px ${mouseYSpring}px, rgba(255,255,255,0.4), transparent 40%)`,
          }}
        />

        {/* Enhanced Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent rounded-lg" />

        {/* Floating Light Effect */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-lg"
            style={{
              background: `radial-gradient(300px circle at ${mouseXSpring}px ${mouseYSpring}px, rgba(255,255,255,0.1), transparent 50%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        {/* Enhanced Title with Better Positioning */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <motion.h3
            className="text-xl font-semibold text-white text-left drop-shadow-lg"
            animate={{
              y: isHovered ? -5 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            {project.title}
          </motion.h3>
        </div>

        {/* 3D Depth Layers */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
          style={{
            transform: "translateZ(10px)",
          }}
        />
      </motion.div>
    </motion.div>
  )
}

export default function HomePage() {
  const [currentGreeting, setCurrentGreeting] = useState(0)
  const [expandedExperience, setExpandedExperience] = useState<number | null>(null)
  const [expandedSkill, setExpandedSkill] = useState<number | null>(null)
  const [selectedProject, setSelectedProject] = useState<number | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGreeting((prev) => (prev + 1) % greetings.length)
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  const skillsData = [
    {
      category: "Technical",
      skills: ["SolidWorks", "ANSYS", "CNC", "Python", "C++", "MATLAB"],
      description: "Engineering tools and programming languages for robotics development",
      expandedDescription:
        "Proficient in CAD design, finite element analysis, and control systems programming. Experience with manufacturing processes and automation. Advanced skills in mechanical design, simulation, and rapid prototyping.",
    },
    {
      category: "Software",
      skills: ["Blender", "VS Code", "GitHub", "Ableton Live", "AutoCAD"],
      description: "Development tools and creative software for design and collaboration",
      expandedDescription:
        "Full-stack development capabilities with version control expertise. Creative skills in 3D modeling and audio production. Experienced in collaborative development workflows and project management.",
    },
    {
      category: "Languages",
      skills: ["English (Fluent)", "Tamil (Fluent)", "Spanish (Intermediate)", "Chinese (Basic)"],
      description: "Multilingual communication enabling global collaboration",
      expandedDescription:
        "Native bilingual proficiency enables effective communication in diverse engineering teams and international collaborations. Cultural bridge between Western and Eastern engineering approaches.",
    },
  ]

  const timelineData = [
    {
      title: "UH Swarm Robotics Lab",
      role: "Research Intern",
      period: "2023 - Present",
      description: "Developing autonomous swarm algorithms and micro-swimmer simulations",
      expandedDescription:
        "Leading research on distributed robotics systems, implementing machine learning algorithms for swarm coordination, and publishing findings in peer-reviewed conferences. Working with ROS, Python, and custom hardware platforms. Collaborating with interdisciplinary teams on bio-inspired robotics applications.",
      achievements: [
        "Published 2 research papers",
        "Developed novel swarm algorithms",
        "Mentored 3 undergraduate researchers",
      ],
    },
    {
      title: "DeBakey Robotics",
      role: "President & CAD Lead",
      period: "2022 - Present",
      description: "Leading team of 25+ students in VEX Robotics competitions",
      expandedDescription:
        "Transformed team culture and technical capabilities, leading to regional championship qualification. Managed budget, coordinated with sponsors, and developed comprehensive training programs for new members. Established mentorship programs and technical documentation standards.",
      achievements: [
        "Regional Championship Qualifier",
        "Team growth from 8 to 25+ members",
        "Secured $15K in sponsorships",
      ],
    },
    {
      title: "Kids Robotics Academy",
      role: "Volunteer Instructor",
      period: "2021 - Present",
      description: "Teaching robotics fundamentals to elementary students",
      expandedDescription:
        "Developed age-appropriate curriculum combining hands-on building with programming concepts. Created engaging activities that make STEM accessible and fun for young learners. Established partnerships with local schools and community centers.",
      achievements: ["Taught 200+ students", "Developed K-12 curriculum", "95% student satisfaction rate"],
    },
  ]

  const featuredProjects = [
    {
      title: "Autonomous Swarm Navigation",
      description:
        "Distributed algorithms for multi-robot coordination using ROS and Python. Implemented collision avoidance and formation control for 10+ robots with real-time path planning.",
      tags: ["Python", "ROS", "Computer Vision"],
      status: "In Progress",
      image: "/robot-placeholder.png",
      detailedDescription:
        "This project focuses on developing sophisticated algorithms for coordinating multiple autonomous robots in dynamic environments. The system uses distributed consensus algorithms to maintain formation while avoiding obstacles and adapting to changing mission parameters. Key innovations include bio-inspired flocking behaviors and machine learning-based path optimization.",
    },
    {
      title: "VEX Competition Robot",
      description:
        "Championship-winning robot with optimized speed and precision using advanced mechanical design and custom control algorithms.",
      tags: ["SolidWorks", "C++", "Mechanical Design"],
      status: "Completed",
      image: "/robot-placeholder.png",
      detailedDescription:
        "Designed and built a competition robot that achieved regional championship qualification. The design process involved extensive CAD modeling, stress analysis, and iterative prototyping. Custom control algorithms were developed for autonomous operation, including computer vision for object recognition and precise manipulation tasks.",
    },
    {
      title: "Micro-swimmer Simulation",
      description:
        "ANSYS-based fluid dynamics simulation for biomedical applications, analyzing propulsion efficiency across different geometries.",
      tags: ["ANSYS", "MATLAB", "Fluid Dynamics"],
      status: "Completed",
      image: "/robot-placeholder.png",
      detailedDescription:
        "Comprehensive computational fluid dynamics study of microscale swimmers inspired by biological organisms. The research involved parametric studies of different propulsion mechanisms, optimization of swimmer geometries, and analysis of swimming efficiency in various fluid environments. Results contributed to the development of targeted drug delivery systems.",
    },
    {
      title: "Robotic Arm Controller",
      description:
        "6DOF robotic arm with computer vision integration featuring real-time object detection and precise manipulation capabilities.",
      tags: ["Python", "OpenCV", "Arduino"],
      status: "Completed",
      image: "/robot-placeholder.png",
      detailedDescription:
        "Built a fully functional 6-degree-of-freedom robotic arm with integrated computer vision system. The project combines mechanical design, electronics integration, and advanced software development. Features include real-time object recognition, path planning, and adaptive grasping strategies for various object types.",
    },
  ]

  return (
    <>
      <CustomCursor />
      <Navigation />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-8 py-16">
          {/* Hero Section */}
          <section className="mb-24">
            <div className="mb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentGreeting}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-2xl font-light bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent"
                >
                  {greetings[currentGreeting]}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="space-y-4">
              <p className="text-4xl md:text-5xl font-light leading-tight bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
                Hi, I'm Siddharth — an engineer and roboticist based in Houston, TX.
              </p>
              <p className="text-4xl md:text-5xl font-light leading-tight bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
                I build systems that connect electronics, mechanics, code, and thoughtful design.
              </p>
            </div>
          </section>

          {/* Featured Projects Section */}
          <section className="mb-24 overflow-visible">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-12"
            >
              <h2 className="text-3xl font-semibold text-gray-500">Featured Projects</h2>
              <Link
                href="/projects"
                className="flex items-center gap-2 text-gray-400 hover:text-gray-500 transition-colors duration-200"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4">
              {featuredProjects.map((project, index) => (
                <ParallaxProjectTile
                  key={index}
                  project={project}
                  index={index}
                  onClick={() => setSelectedProject(index)}
                />
              ))}
            </div>
          </section>

          {/* Project Detail Modal */}
          <AnimatePresence>
            {selectedProject !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedProject(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-semibold text-gray-600">
                        {featuredProjects[selectedProject].title}
                      </h3>
                      <button
                        onClick={() => setSelectedProject(null)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                      <img
                        src={featuredProjects[selectedProject].image || "/placeholder.svg"}
                        alt={featuredProjects[selectedProject].title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-gray-500 mb-4 leading-relaxed">
                      {featuredProjects[selectedProject].detailedDescription}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {featuredProjects[selectedProject].tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Experience Section */}
          <section className="mb-24">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-semibold mb-12 text-gray-500"
            >
              Experience
            </motion.h2>

            <div className="space-y-8">
              {timelineData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => setExpandedExperience(expandedExperience === index ? null : index)}
                  className="border-l-2 border-gray-200 pl-6 hover:border-gray-300 transition-all duration-300 cursor-pointer clickable-hint"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-500">{item.title}</h3>
                    <span className="text-sm text-gray-400 font-medium">{item.period}</span>
                  </div>
                  <p className="text-lg text-gray-400 mb-2">{item.role}</p>

                  <div>
                    <motion.p
                      className="text-gray-400 mb-3"
                      animate={{
                        opacity: 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {expandedExperience === index ? item.expandedDescription : item.description}
                    </motion.p>

                    <AnimatePresence>
                      {expandedExperience === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -10 }}
                          transition={{
                            duration: 0.4,
                            ease: "easeInOut",
                            height: { duration: 0.3 },
                          }}
                          className="space-y-2 overflow-hidden"
                        >
                          <h4 className="font-semibold text-gray-500 text-sm">Key Achievements:</h4>
                          <ul className="space-y-1">
                            {item.achievements.map((achievement, achIndex) => (
                              <motion.li
                                key={achIndex}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: achIndex * 0.1 }}
                                className="text-gray-400 flex items-start text-sm"
                              >
                                <Award className="w-3 h-3 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                                {achievement}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <section className="mb-24">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-semibold mb-12 text-gray-500"
            >
              Skills
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              {skillsData.map((category, categoryIndex) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => setExpandedSkill(expandedSkill === categoryIndex ? null : categoryIndex)}
                  className="space-y-4 cursor-pointer clickable-hint hover:bg-gray-50 p-4 rounded-lg transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-gray-500 mb-4">{category.category}</h3>

                  <div>
                    <motion.p
                      className="text-gray-400 mb-4"
                      animate={{
                        opacity: 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {expandedSkill === categoryIndex ? category.expandedDescription : category.description}
                    </motion.p>
                  </div>

                  <div className="space-y-2">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                        viewport={{ once: true }}
                        className="px-3 py-2 bg-gray-50 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors duration-200"
                      >
                        {skill}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Resume Download Section */}
          <section className="mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-8 text-center"
            >
              <h2 className="text-3xl font-semibold text-gray-500 mb-4">Resume</h2>
              <p className="text-lg text-gray-400 mb-6 max-w-2xl mx-auto">
                Download my complete resume to learn more about my experience, education, and technical skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </a>
                <Link href="/resume">
                  <button className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-400 rounded-lg hover:border-gray-400 hover:bg-white transition-colors duration-200">
                    <ExternalLink className="w-4 h-4" />
                    View Online
                  </button>
                </Link>
              </div>
            </motion.div>
          </section>

          {/* Contact Section */}
          <section>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-semibold mb-12 text-gray-500"
            >
              Get In Touch
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              <p className="text-lg text-gray-400 mb-8">
                I'm always interested in discussing new opportunities, collaborations, or just connecting with fellow
                engineers and makers.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:siddharth@example.com"
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  Email Me
                </a>
                <a
                  href="https://linkedin.com/in/siddharthr"
                  className="px-6 py-3 border border-gray-300 text-gray-400 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/siddharthr"
                  className="px-6 py-3 border border-gray-300 text-gray-400 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200"
                >
                  GitHub
                </a>
              </div>
            </motion.div>
          </section>
        </div>
      </div>
    </>
  )
}
