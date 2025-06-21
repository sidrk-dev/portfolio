"use client"

import type React from "react"
import { useState, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import { Calendar, Cpu, Github, Globe, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// ============================================================================
// CONFIGURATION SECTION
// ============================================================================
// This section contains all customizable settings for the Mission Log component.
// Modify these values to change the appearance and behavior of the component.

/**
 * MEDIA TYPES CONFIGURATION
 * Define supported media types and their properties
 */
const MEDIA_TYPES = {
  IMAGE: "image",
  GIF: "gif",
  VIDEO: "video",
} as const

type MediaType = (typeof MEDIA_TYPES)[keyof typeof MEDIA_TYPES]

/**
 * BUTTON TYPES CONFIGURATION
 * Define available button types and their default properties
 * Add new button types here to extend functionality
 */
const BUTTON_TYPES = {
  GITHUB: {
    icon: Github,
    label: "CODE",
    variant: "outline" as const,
    defaultColor: "#333333",
  },
  LIVE_DEMO: {
    icon: Globe,
    label: "DEMO",
    variant: "outline" as const,
    defaultColor: "#0066CC",
  },
  DOCUMENTATION: {
    icon: Globe,
    label: "DOCS",
    variant: "outline" as const,
    defaultColor: "#6B7280",
  },
  VIDEO_DEMO: {
    icon: Globe,
    label: "VIDEO",
    variant: "outline" as const,
    defaultColor: "#DC2626",
  },
  EXTERNAL_LINK: {
    icon: ExternalLink,
    label: "LINK",
    variant: "outline" as const,
    defaultColor: "#7C3AED",
  },
} as const

type ButtonType = keyof typeof BUTTON_TYPES

/**
 * MEDIA CONFIGURATION
 * Settings for handling different media types
 */
interface MediaConfig {
  type: MediaType
  src: string
  alt: string
  hoverSrc?: string // Optional hover state (for GIF on hover over static image)
  autoPlay?: boolean // For videos
  loop?: boolean // For videos and GIFs
  muted?: boolean // For videos
}

/**
 * BUTTON CONFIGURATION
 * Settings for project action buttons
 */
interface ButtonConfig {
  type: ButtonType
  url: string
  label?: string // Optional custom label (overrides default)
  icon?: React.ComponentType<{ className?: string }> // Optional custom icon
  color?: string // Optional custom color
  enabled?: boolean // Whether button should be displayed
  openInNewTab?: boolean // Whether to open link in new tab
}

/**
 * LAYOUT CONFIGURATION
 * Adjust these values to change the overall layout and spacing of the component
 */
const LAYOUT_CONFIG = {
  // Section padding (top/bottom and left/right)
  sectionPadding: {
    mobile: "py-12 px-4",
    desktop: "md:py-20 md:px-6",
  },

  // Grid configuration for project cards
  gridLayout: {
    columns: "grid-cols-1 lg:grid-cols-2", // Change to "grid-cols-1" for single column, "lg:grid-cols-3" for 3 columns
    gap: "gap-6 md:gap-8", // Space between cards
  },

  // Card dimensions and spacing
  cardDimensions: {
    height: "h-[520px] md:h-[560px]", // Total card height - adjust these values to make cards taller/shorter
    padding: {
      header: "p-4 md:p-6", // Header padding
      content: "p-4 md:p-6 pt-0", // Content padding
      headerSpacing: "space-y-3 md:space-y-4", // Space between header elements
      contentSpacing: "space-y-3 md:space-y-4", // Space between content elements
    },
  },

  // Media dimensions within cards
  mediaDimensions: {
    height: "h-32 md:h-40", // Height of project images/GIFs/videos
    borderRadius: "rounded-lg",
    objectFit: "object-cover", // How media should fit within container
  },

  // Button configuration
  buttonLayout: {
    container: "flex gap-2 pt-2 mt-4", // Container for action buttons
    buttonSize: "sm" as const, // Button size
    maxButtons: 3, // Maximum number of buttons to display per row
  },

  // Animation timing
  animations: {
    cardDelay: 0.2, // Delay between each card animation (in seconds)
    flipDuration: 700, // Card flip animation duration (in milliseconds)
    hoverScale: 1.02, // Scale factor when hovering over cards
    mediaTransition: 0.3, // Media transition duration (in seconds)
  },
}

/**
 * STYLING CONFIGURATION
 * Customize colors, fonts, and visual elements here
 */
const STYLE_CONFIG = {
  // Color scheme
  colors: {
    primary: "#0B3D91", // NASA Blue
    accent: "#FC3D21", // NASA Red
    success: "#4CAF50", // Green for completed projects
    warning: "#FFB300", // Yellow/Orange for in-progress projects
    background: {
      front: "bg-white", // Front of card background
      back: "bg-[#0B0B1F]", // Back of card background (dark)
      backText: "text-white", // Text color on back of card
    },
  },

  // Typography
  typography: {
    sectionTitle: "text-3xl md:text-4xl lg:text-5xl font-bold mb-4",
    cardTitle: "text-lg md:text-xl font-bold leading-tight",
    subtitle: "font-mono text-xs md:text-sm",
    description: "text-sm line-clamp-3",
    debriefText: "text-xs md:text-sm",
  },

  // Debrief text positioning (the "HOVER FOR MISSION DEBRIEF" text)
  debriefTextPosition: {
    container: "text-center mt-4", // Container positioning
    desktop: "hidden md:block font-light", // Desktop text styling
    mobile: "md:hidden", // Mobile text styling
    textSize: "text-xs md:text-sm",
    textColor: "text-gray-500 font-mono",
  },

  // Media overlay styling
  mediaOverlay: {
    playIcon: "absolute top-2 right-2 bg-black/70 text-white p-1 rounded",
    mediaTypeIndicator: "absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-mono",
  },
}

/**
 * PROJECT DATA CONFIGURATION
 * ============================================================================
 * ADD, REMOVE, OR MODIFY PROJECTS HERE
 * ============================================================================
 *
 * MEDIA CONFIGURATION GUIDE:
 * ---------------------------
 * Each project can have multiple media items. Configure them as follows:
 *
 * For Static Images:
 * media: {
 *   type: 'image',
 *   src: '/path/to/image.jpg',
 *   alt: 'Description of image',
 *   hoverSrc: '/path/to/hover-gif.gif' // Optional: GIF to show on hover
 * }
 *
 * For GIFs:
 * media: {
 *   type: 'gif',
 *   src: '/path/to/animation.gif',
 *   alt: 'Description of GIF',
 *   loop: true // Optional: whether GIF should loop
 * }
 *
 * For Videos:
 * media: {
 *   type: 'video',
 *   src: '/path/to/video.mp4',
 *   alt: 'Description of video',
 *   autoPlay: true, // Optional: auto-play video
 *   loop: true, // Optional: loop video
 *   muted: true // Optional: mute video (required for autoplay in most browsers)
 * }
 *
 * BUTTON CONFIGURATION GUIDE:
 * ----------------------------
 * Each project can have multiple action buttons. Configure them as follows:
 *
 * buttons: [
 *   {
 *     type: 'GITHUB', // Use predefined button types
 *     url: 'https://github.com/username/repo',
 *     enabled: true, // Whether to show this button
 *     openInNewTab: true // Whether to open in new tab
 *   },
 *   {
 *     type: 'LIVE_DEMO',
 *     url: 'https://demo.example.com',
 *     label: 'CUSTOM LABEL', // Optional: override default label
 *     color: '#FF5722', // Optional: custom color
 *     enabled: true,
 *     openInNewTab: true
 *   },
 *   {
 *     type: 'DOCUMENTATION',
 *     url: 'https://docs.example.com',
 *     enabled: false // This button won't be displayed
 *   }
 * ]
 *
 * Available button types: 'GITHUB', 'LIVE_DEMO', 'DOCUMENTATION', 'VIDEO_DEMO', 'EXTERNAL_LINK'
 */

interface ProjectData {
  id: string
  title: string
  status: "ACTIVE" | "COMPLETED" | "DEVELOPMENT"
  objective: string
  launchYear: string
  stack: string[]
  description: string
  detailedDescription: string
  technologies: string[]
  achievements: string[]
  media: MediaConfig // Updated to use MediaConfig
  buttons: ButtonConfig[] // New: configurable buttons
}

const PROJECTS: ProjectData[] = [
  {
    id: "M001",
    title: "AUTONOMOUS ROVER NAVIGATION",
    status: "ACTIVE",
    objective: "Develop ML-based path planning for Mars terrain",
    launchYear: "2024",
    stack: ["Python", "ROS", "TensorFlow", "OpenCV"],
    description:
      "Advanced autonomous navigation system using computer vision and reinforcement learning for planetary exploration vehicles.",
    detailedDescription:
      "This mission involved developing a comprehensive autonomous navigation system capable of real-time terrain analysis, obstacle detection, and optimal path planning.",
    technologies: ["Python 3.9", "ROS2 Humble", "TensorFlow 2.12", "OpenCV 4.7"],
    achievements: ["95% navigation accuracy", "Real-time processing at 30Hz", "Reduced mission planning time by 60%"],
    buttons: [
      { type: "github", url: "https://github.com/username/rover-nav", label: "CODE" },
      { type: "demo", url: "https://rover-demo.com", label: "DEMO" },
    ],
  },
  {
    id: "M002",
    title: "ORBITAL MECHANICS SIMULATOR",
    status: "COMPLETED",
    objective: "Real-time spacecraft trajectory optimization",
    launchYear: "2023",
    stack: ["C++", "MATLAB", "OpenGL", "Eigen"],
    description:
      "High-fidelity orbital mechanics simulation with real-time trajectory planning and collision avoidance algorithms.",
    detailedDescription:
      "A sophisticated orbital mechanics simulation platform designed for mission planning and spacecraft trajectory optimization.",
    technologies: ["C++17", "MATLAB R2023a", "OpenGL 4.6", "Eigen 3.4"],
    achievements: ["Sub-meter accuracy predictions", "Real-time 3D visualization", "Used in 3 actual missions"],
    buttons: [
      { type: "github", url: "https://github.com/username/orbital-sim", label: "CODE" },
      { type: "demo", url: "https://orbital-sim.com", label: "DEMO" },
    ],
  },
  {
    id: "M003",
    title: "ROBOTIC ARM CONTROL SYSTEM",
    status: "ACTIVE",
    objective: "Precision manipulation for space operations",
    launchYear: "2024",
    stack: ["Python", "ROS", "Gazebo", "MoveIt"],
    description:
      "6-DOF robotic arm control system with force feedback and autonomous object manipulation capabilities.",
    detailedDescription:
      "Advanced robotic manipulation system designed for space operations requiring extreme precision.",
    technologies: ["Python 3.10", "ROS2 Iron", "MoveIt2", "Gazebo Garden"],
    achievements: ["0.1mm positioning accuracy", "Autonomous grasp success rate: 98%", "Zero-G tested"],
    buttons: [
      { type: "github", url: "https://github.com/username/robotic-arm", label: "CODE" },
      { type: "external", url: "https://research-paper.com/robotic-arm", label: "PAPER" },
    ],
  },
  {
    id: "M004",
    title: "SATELLITE CONSTELLATION MANAGER",
    status: "DEVELOPMENT",
    objective: "Coordinate multi-satellite operations",
    launchYear: "2025",
    stack: ["Rust", "gRPC", "PostgreSQL", "Docker"],
    description:
      "Distributed system for managing and coordinating large-scale satellite constellations with fault tolerance.",
    detailedDescription:
      "Next-generation constellation management system designed to coordinate hundreds of satellites simultaneously.",
    technologies: ["Rust 1.75", "gRPC", "PostgreSQL 15", "Docker"],
    achievements: ["Managing 200+ satellites", "99.99% uptime", "Automated fault recovery"],
    buttons: [
      { type: "demo", url: "https://constellation-docs.com", label: "DOCS" },
      { type: "external", url: "https://constellation-blog.com", label: "BLOG" },
    ],
  },
]

const getStatusBadgeStyle = (status: string) => {
  const baseClasses = "font-mono text-xs"
  switch (status) {
    case "ACTIVE":
      return `${baseClasses} border-[#FC3D21] text-[#FC3D21]`
    case "COMPLETED":
      return `${baseClasses} border-green-500 text-green-500`
    case "DEVELOPMENT":
      return `${baseClasses} border-yellow-500 text-yellow-500`
    default:
      return `${baseClasses} border-gray-500 text-gray-500`
  }
}

const getButtonIcon = (type: string) => {
  switch (type) {
    case "github":
      return Github
    case "demo":
      return Globe
    default:
      return ExternalLink
  }
}

export default function MissionLog() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const handleButtonClick = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }, [])

  const memoizedProjects = useMemo(() => PROJECTS, [])

  return (
    <section id="missions" className="py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-[#0B3D91]">MISSION</span> <span className="text-[#FC3D21]">LOG</span>
          </h2>
          <p className="text-gray-600 font-mono tracking-wider text-sm md:text-base">
            CLASSIFIED PROJECT ARCHIVES - CLEARANCE LEVEL: ALPHA
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {memoizedProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group perspective-1000 h-[520px]"
              onMouseEnter={() => setHoveredCard(project.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className="relative w-full h-full preserve-3d transition-transform ease-in-out gpu-accelerated"
                style={{
                  transform: hoveredCard === project.id ? "rotateY(180deg)" : "rotateY(0deg)",
                  transitionDuration: "600ms",
                }}
              >
                {/* Front of Card */}
                <Card className="absolute inset-0 backface-hidden border-2 border-gray-200 hover:border-[#FC3D21] transition-colors duration-300 hover:shadow-lg cursor-pointer">
                  <CardHeader className="space-y-3 p-6">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={getStatusBadgeStyle(project.status)}>
                        {project.status}
                      </Badge>
                      <div className="text-[#0B3D91] font-mono text-sm">{project.id}</div>
                    </div>
                    <CardTitle className="text-xl font-bold leading-tight group-hover:text-[#FC3D21] transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="font-mono text-sm">OBJECTIVE: {project.objective}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6 pt-0">
                    <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src="/placeholder.svg?height=160&width=300"
                        alt={project.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm line-clamp-3">{project.description}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>LAUNCH: {project.launchYear}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Cpu className="h-4 w-4" />
                        <span>PAYLOAD: {project.stack.length} MODULES</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-center mt-4 text-sm text-gray-500 font-mono">
                      <div className="hidden md:block">HOVER FOR MISSION DEBRIEF</div>
                      <div className="md:hidden">TAP FOR MISSION DEBRIEF</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Back of Card */}
                <Card
                  className="absolute inset-0 backface-hidden border-2 border-[#FC3D21] bg-[#0B0B1F] text-white"
                  style={{ transform: "rotateY(180deg)" }}
                >
                  <CardHeader className="p-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-[#FC3D21] text-lg font-mono">MISSION DEBRIEF</CardTitle>
                      <div className="text-[#FC3D21] font-mono text-sm">{project.id}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm p-6 pt-0 overflow-y-auto max-h-[400px]">
                    <div>
                      <h4 className="text-[#FC3D21] font-mono mb-2">DETAILED ANALYSIS:</h4>
                      <p className="text-gray-300 leading-relaxed text-sm">{project.detailedDescription}</p>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-[#FC3D21] font-mono mb-2">TECH STACK:</h4>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs border-[#FC3D21] text-[#FC3D21]">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-[#FC3D21] font-mono mb-2">KEY ACHIEVEMENTS:</h4>
                      <ul className="text-gray-300 text-xs space-y-1">
                        {project.achievements.map((achievement, i) => (
                          <li key={i}>• {achievement}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2 pt-2 mt-4">
                      {project.buttons.map((button, i) => {
                        const Icon = getButtonIcon(button.type)
                        return (
                          <Button
                            key={i}
                            size="sm"
                            variant="outline"
                            className="flex-1 border-[#FC3D21] text-[#FC3D21] hover:bg-[#FC3D21] hover:text-white text-xs"
                            onClick={() => handleButtonClick(button.url)}
                          >
                            <Icon className="h-3 w-3 mr-1" />
                            {button.label}
                          </Button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
