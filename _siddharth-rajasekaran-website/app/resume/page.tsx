"use client"

import { motion } from "framer-motion"
import { Download, Award, GraduationCap, Briefcase } from "lucide-react"
import Navigation from "@/components/navigation"

export default function ResumePage() {
  const education = [
    {
      degree: "Bachelor of Science in Mechanical Engineering",
      school: "University of Houston",
      period: "2022 - 2026 (Expected)",
      gpa: "3.8/4.0",
      honors: ["Dean's List", "Engineering Honors Program"],
    },
  ]

  const experience = [
    {
      title: "Research Intern",
      company: "UH Swarm Robotics Lab",
      period: "2023 - Present",
      location: "Houston, TX",
      achievements: [
        "Developed distributed algorithms for multi-robot coordination",
        "Implemented collision avoidance systems using ROS and Python",
        "Published research on swarm navigation in IEEE conference",
      ],
    },
    {
      title: "President & CAD Lead",
      company: "DeBakey Robotics Team",
      period: "2022 - Present",
      location: "Houston, TX",
      achievements: [
        "Led team of 25+ students to regional championship",
        "Designed award-winning robot using SolidWorks CAD",
        "Managed $15,000 budget and coordinated with sponsors",
      ],
    },
    {
      title: "Volunteer Instructor",
      company: "Kids Robotics Academy",
      period: "2021 - Present",
      location: "Houston, TX",
      achievements: [
        "Taught robotics fundamentals to 200+ elementary students",
        "Developed hands-on curriculum for K-12 STEM education",
        "Mentored students in regional robotics competitions",
      ],
    },
  ]

  const awards = [
    "VEX Robotics World Championship Qualifier (2023)",
    "IEEE Student Paper Competition - 2nd Place (2023)",
    "Houston Engineering Excellence Award (2022)",
    "National Merit Scholar Finalist (2022)",
  ]

  const skills = {
    Technical: ["SolidWorks", "ANSYS", "MATLAB", "Python", "C++", "ROS", "CNC Machining"],
    Software: ["Blender", "AutoCAD", "VS Code", "GitHub", "Ableton Live"],
    Languages: ["English (Native)", "Tamil (Native)", "Spanish (Intermediate)", "Mandarin (Basic)"],
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
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <h1 className="text-5xl font-light mb-4 md:mb-0 bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
                Resume
              </h1>
              <motion.a
                href="/resume.pdf"
                target="_blank"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                rel="noreferrer"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </motion.a>
            </div>
            <p className="text-xl text-gray-400">
              Engineer &amp; Roboticist passionate about building systems that bridge mechanics, code, and thoughtful design.
            </p>
          </motion.div>

          {/* Education */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="w-6 h-6 text-gray-400" />
              <h2 className="text-2xl font-semibold text-gray-500">Education</h2>
            </div>

            {education.map((edu, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-500">{edu.degree}</h3>
                    <p className="text-lg text-gray-400">{edu.school}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 font-medium">{edu.period}</p>
                    <p className="text-gray-500 font-semibold">GPA: {edu.gpa}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {edu.honors.map((honor, honorIndex) => (
                    <span key={honorIndex} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      {honor}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </motion.section>

          {/* Experience */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="w-6 h-6 text-gray-400" />
              <h2 className="text-2xl font-semibold text-gray-500">Experience</h2>
            </div>

            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div
                  key={index}
                  className="border-l-2 border-gray-200 pl-6 hover:border-gray-300 transition-colors duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-500">{exp.title}</h3>
                      <p className="text-lg text-gray-400">{exp.company}</p>
                      <p className="text-gray-400">{exp.location}</p>
                    </div>
                    <p className="text-gray-400 font-medium">{exp.period}</p>
                  </div>
                  <ul className="mt-3 space-y-1">
                    {exp.achievements.map((achievement, achIndex) => (
                      <li key={achIndex} className="text-gray-400 flex items-start">
                        <span className="w-2 h-2 bg-gray-300 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Skills */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold text-gray-500 mb-6">Skills</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(skills).map(([category, skillList]) => (
                <div key={category} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-500 mb-4">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillList.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-white text-gray-400 text-sm rounded-lg border border-gray-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Awards */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-gray-400" />
              <h2 className="text-2xl font-semibold text-gray-500">Awards & Recognition</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {awards.map((award, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                >
                  <Award className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <span className="text-gray-400">{award}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </>
  )
}
