"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Mail, MapPin, Github, Linkedin } from "lucide-react"
import Navigation from "@/components/navigation"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Reset form
    setFormData({ name: "", email: "", message: "" })
    setIsSubmitting(false)

    // Show success message (you could implement a toast here)
    alert("Message sent successfully!")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "siddharth@example.com",
      href: "mailto:siddharth@example.com",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Houston, TX",
      href: null,
    },
    {
      icon: Github,
      label: "GitHub",
      value: "github.com/siddharthr",
      href: "https://github.com/siddharthr",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "linkedin.com/in/siddharthr",
      href: "https://linkedin.com/in/siddharthr",
    },
  ]

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
              Contact
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              I'm always interested in discussing new opportunities, collaborations, or just connecting with fellow
              engineers and makers. Let's build something amazing together.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold text-gray-500 mb-6">Send a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200 resize-none"
                    placeholder="Tell me about your project, idea, or just say hello..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-gray-500 mb-6">Get In Touch</h2>

              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon
                  const content = (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex-shrink-0">
                        <Icon className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-400">{info.label}</p>
                        <p className="text-gray-500">{info.value}</p>
                      </div>
                    </div>
                  )

                  return info.href ? (
                    <motion.a
                      key={index}
                      href={info.href}
                      target={info.href.startsWith("http") ? "_blank" : undefined}
                      rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      whileHover={{ scale: 1.02 }}
                      className="block"
                    >
                      {content}
                    </motion.a>
                  ) : (
                    <div key={index}>{content}</div>
                  )
                })}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-500 mb-3">Let's Collaborate</h3>
                <p className="text-gray-400 mb-4">
                  Whether you're working on robotics, need help with engineering projects, or want to discuss innovative
                  ideas, I'd love to hear from you.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white text-gray-400 text-sm rounded-full border border-gray-200">
                    Robotics
                  </span>
                  <span className="px-3 py-1 bg-white text-gray-400 text-sm rounded-full border border-gray-200">
                    Engineering
                  </span>
                  <span className="px-3 py-1 bg-white text-gray-400 text-sm rounded-full border border-gray-200">
                    Education
                  </span>
                  <span className="px-3 py-1 bg-white text-gray-400 text-sm rounded-full border border-gray-200">
                    Innovation
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
