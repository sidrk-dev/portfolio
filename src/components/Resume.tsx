"use client"

import { motion } from "framer-motion"
import { Download, ExternalLink } from "lucide-react"
import Link from "next/link"

export const Resume = () => {
    return (
        <section id="resume" className="py-24 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg p-12 text-center max-w-4xl mx-auto"
            >
                <h2 className="text-3xl font-semibold text-gray-500 dark:text-gray-400 mb-4">Resume</h2>
                <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                    Download my complete resume to learn more about my experience, education, and technical skills.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-colors duration-200 font-medium"
                    >
                        <Download className="w-4 h-4" />
                        Download PDF
                    </a>
                </div>
            </motion.div>
        </section>
    );
};
