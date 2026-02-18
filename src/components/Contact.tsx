"use client"

import { portfolio } from "@/data/portfolio"
import { Github, Linkedin, Mail, Download } from "lucide-react"

export const Contact = () => {
    return (
        <section id="contact" className="py-24 px-6">
            <h2
                className="text-3xl font-semibold mb-12 text-gray-500 dark:text-gray-400 text-center"
            >
                Get In Touch
            </h2>

            <div
                className="max-w-2xl mx-auto text-center"
            >
                <p className="text-lg text-gray-400 mb-8">
                    I&apos;m always interested in discussing new opportunities, collaborations, or just connecting with fellow
                    engineers and makers.
                </p>

                <div className="flex flex-wrap gap-4 justify-center">
                    <a
                        href="/portfolio/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-white text-black rounded-lg hover:opacity-90 transition-colors duration-200 font-medium"
                    >
                        <Download className="w-4 h-4" />
                        Download Resume
                    </a>
                    <a
                        href={`mailto:${portfolio.personal.email}`}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-lg hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                        Email Me
                    </a>
                    <a
                        href={portfolio.personal.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-lg hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                        LinkedIn
                    </a>
                    <a
                        href={portfolio.personal.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-lg hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                        GitHub
                    </a>
                </div>
            </div>
        </section>
    );
};
