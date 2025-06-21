"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Send, Radio, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function CommsSection() {
  const [formData, setFormData] = useState({
    senderID: "",
    subject: "",
    message: "",
  })
  const [isTransmitting, setIsTransmitting] = useState(false)
  const [transmitted, setTransmitted] = useState(false)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsTransmitting(true)

    // Simulate transmission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsTransmitting(false)
    setTransmitted(true)

    // Reset after 3 seconds
    setTimeout(() => {
      setTransmitted(false)
      setFormData({ senderID: "", subject: "", message: "" })
    }, 3000)
  }, [])

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  return (
    <section id="comms" className="py-20 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-[#0B3D91]">COMMS</span> ARRAY
          </h2>
          <p className="text-gray-600 font-mono tracking-wider">ESTABLISH COMMUNICATION LINK - MISSION CONTROL</p>
          <motion.div
            className="mt-4 p-4 bg-[#FC3D21]/10 border border-[#FC3D21] rounded-lg inline-block"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(252, 61, 33, 0.4)",
                "0 0 0 10px rgba(252, 61, 33, 0)",
                "0 0 0 0 rgba(252, 61, 33, 0)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <p className="text-[#FC3D21] font-mono font-bold">STATUS: AVAILABLE FOR PROJECTS &amp; COLLABORATIONS</p>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Status Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
              <h3 className="text-xl font-bold text-[#0B3D91] mb-6 font-mono">TRANSMISSION STATUS</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">SIGNAL STRENGTH:</span>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-6 bg-[#FC3D21] rounded-sm"
                        animate={{
                          opacity: [0.3, 1, 0.3],
                          scaleY: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">COMMS STATUS:</span>
                  <motion.div
                    className="flex items-center gap-2"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-green-500 font-mono text-sm">ONLINE</span>
                  </motion.div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">ENCRYPTION:</span>
                  <span className="text-[#0B3D91] font-mono text-sm">AES-256</span>
                </div>
              </div>
            </div>

            <div className="bg-black text-green-400 rounded-lg p-6 font-mono text-sm">
              <div className="mb-2">{">"} MISSION_CONTROL_TERMINAL v2.1.0</div>
              <div className="mb-2">{">"} Awaiting transmission...</div>
              <div className="mb-2">{">"} Type 'help' for available commands</div>
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
              >
                {">"} _
              </motion.div>
            </div>
          </motion.div>

          {/* Communication Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-lg border-2 border-gray-200 p-8 space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <Radio className="h-6 w-6 text-[#FC3D21]" />
                <h3 className="text-xl font-bold text-[#0B3D91] font-mono">TRANSMISSION INTERFACE</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="senderID" className="font-mono text-sm text-[#0B3D91]">
                    SENDER ID
                  </Label>
                  <Input
                    id="senderID"
                    value={formData.senderID}
                    onChange={(e) => handleInputChange("senderID", e.target.value)}
                    placeholder="Enter your callsign..."
                    className="mt-2 font-mono"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="font-mono text-sm text-[#0B3D91]">
                    TRANSMISSION SUBJECT
                  </Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    placeholder="Mission briefing, collaboration request..."
                    className="mt-2 font-mono"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="font-mono text-sm text-[#0B3D91]">
                    MESSAGE PAYLOAD
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Compose your transmission..."
                    className="mt-2 font-mono min-h-[120px]"
                    required
                  />
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isTransmitting || transmitted}
                  className={`w-full font-mono tracking-wider ${
                    transmitted ? "bg-green-500 hover:bg-green-500" : "bg-[#FC3D21] hover:bg-[#FC3D21]/90"
                  }`}
                  size="lg"
                >
                  {isTransmitting ? (
                    <motion.div
                      className="flex items-center gap-2"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <Radio className="h-4 w-4" />
                      TRANSMITTING...
                    </motion.div>
                  ) : transmitted ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      SIGNAL TRANSMITTED
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      TRANSMIT SIGNAL
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
