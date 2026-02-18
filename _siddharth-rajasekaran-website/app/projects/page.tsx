"use client"

import { motion } from "framer-motion"
import { ExternalLink, Github } from "lucide-react"
import Navigation from "@/components/navigation"

const projects = [
  {
    title: "Autonomous Swarm Navigation",
    description:
      "Developed distributed algorithms for multi-robot coordination using ROS and Python. Implemented collision avoidance and formation control for 10+ robots.",
    tags: ["Python", "ROS", "Computer Vision", "Machine Learning"],
    category: "Robotics",
    status: "In Progress",
    links: {
      github: "https://github.com/siddharthr/swarm-nav",
      demo: "https://swarm-demo.example.com",
    },
  },
  {
    title: "Micro-swimmer Simulation",
    description:
      "ANSYS-based fluid dynamics simulation of microscale swimmers for biomedical applications. Analyzed propulsion efficiency across different geometries.",
    tags: ["ANSYS", "MATLAB", "Fluid Dynamics", "Bioengineering"],
    category: "Simulation",
    status: "Completed",
    links: {
      paper: "https://paper-link.example.com",
    },
  },
  {
    title: "VEX Competition Robot",
    description:
      "Led design and manufacturing of championship-winning robot. Optimized for speed and precision using SolidWorks CAD and custom control algorithms.",
    tags: ["SolidWorks", "C++", "Mechanical Design", "Controls"],
    category: "Competition",
    status: "Completed",
    links: {
      video: "https://youtube.com/watch?v=example",
    },
  },
  {
    title: "Robotic Arm Controller",
    description:
      "Built 6-DOF robotic arm with computer vision integration. Features real-time object detection and precise manipulation capabilities.",
    tags: ["Python", "OpenCV", "Arduino", "3D Printing"],
    category: "Hardware",
    status: "Completed",
    links: {
      github: "https://github.com/siddharthr/robot-arm",
      demo: "https://robot-demo.example.com",
    },
  },
  {
    title: "Educational Robotics Curriculum",
    description:
      "Designed hands-on robotics curriculum for K-12 students. Includes lesson plans, activities, and assessment tools used by 200+ students.",
    tags: ["Education", "Curriculum Design", "STEM Outreach"],
    category: "Education",
    status: "Ongoing",
    links: {
      website: "https://robotics-curriculum.example.com",
    },
  },
  {
    title: "Drone Swarm Visualization",
    description:
      "Real-time 3D visualization tool for drone swarm operations. Built with Three.js and WebGL for interactive mission planning and monitoring.",
    tags: ["JavaScript", "Three.js", "WebGL", "Data Visualization"],
    category: "Software",
    status: "Completed",
    links: {
      github: "https://github.com/siddharthr/drone-viz",
      demo: "https://drone-viz.example.com",
    },
  },
]

export default function ProjectsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700"
      case "In Progress":
        return "bg-blue-100 text-blue-700"
      case "Ongoing":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const getLinkIcon = (linkType: string) => {
    switch (linkType) {
      case "github":
        return <Github className="w-4 h-4" />
      default:
        return <ExternalLink className="w-4 h-4" />
    }
  }

  return (
    <>
      <Navigation />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-8 py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h1 className="text-5xl font-light mb-6 bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
              Projects
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              A collection of robotics, engineering, and software projects that showcase my passion for building systems
              that bridge the physical and digital worlds.
            </p>
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-8"
          >
            {projects.map((project, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.2 },
                }}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-500 mb-2 group-hover:text-gray-400 transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-400 font-medium">{project.category}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-400 mb-4 leading-relaxed">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-gray-100 text-gray-400 text-sm rounded-full hover:bg-gray-200 transition-colors duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Project Links */}
                <div className="flex gap-3">
                  {Object.entries(project.links).map(([linkType, url]) => (
                    <motion.a
                      key={linkType}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-500 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200"
                    >
                      {getLinkIcon(linkType)}
                      <span className="capitalize">{linkType}</span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <p className="text-lg text-gray-400 mb-6">
              Interested in collaborating or learning more about any of these projects?
            </p>
            <motion.a
              href="mailto:siddharth@example.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              <span>Get In Touch</span>
              <ExternalLink className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </>
  )
}
