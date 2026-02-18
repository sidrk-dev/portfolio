"use client"

import { useState, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { portfolio } from "@/data/portfolio"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

// Helper for 3D tilt
function ParallaxProjectTile({ project, index, slug }: { project: any; index: number; slug: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)

    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 })
    const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 })

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"])

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
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="group cursor-pointer transition-all duration-300 relative z-10 w-full"
            style={{
                perspective: "1000px",
                transformStyle: "preserve-3d",
            }}
        >
            <motion.div
                style={{
                    rotateX: isHovered ? rotateX : "0deg",
                    rotateY: isHovered ? rotateY : "0deg",
                    transformStyle: "preserve-3d",
                }}
                animate={{
                    scale: isHovered ? 1.02 : 1,
                    z: isHovered ? 50 : 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                }}
                className="aspect-video relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 group-hover:border-cyan-500/50 transition-colors duration-300"
            >
                <Link href={`/projects/${slug}`} className="block w-full h-full h-full">
                    {/* Tech Corners */}
                    <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-40 rounded-tl-[1px]" />
                    <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-40 rounded-tr-[1px]" />
                    <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-40 rounded-bl-[1px]" />
                    <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-40 rounded-br-[1px]" />

                    {/* Project Content / Image Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600">
                        {project.image ? (
                            <img
                                src={project.image}
                                alt={project.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-center p-8">
                                <span className="block text-4xl mb-2 font-light opacity-20">PROJECT</span>
                                <span className="text-xl font-medium tracking-widest opacity-40">{index + 1}</span>
                            </div>
                        )}
                    </div>

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                        <motion.h3
                            className="text-xl font-semibold text-white drop-shadow-md"
                            animate={{ z: 20 }}
                        >
                            {project.title}
                        </motion.h3>
                        <motion.p
                            className="text-gray-300 text-sm mt-2 line-clamp-2"
                            animate={{ z: 20 }}
                        >
                            {project.description}
                        </motion.p>
                    </div>

                    {/* Hover Highlight */}
                    <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
                        style={{
                            background: `radial-gradient(400px circle at ${mouseXSpring}px ${mouseYSpring}px, rgba(255,255,255,0.1), transparent 40%)`,
                            z: 30
                        }}
                    />
                </Link>
            </motion.div>
        </motion.div>
    )
}

export const Projects = () => {
    return (
        <section id="projects" className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div
                    className="flex items-center justify-between mb-12"
                >
                    <h2 className="text-3xl font-semibold text-gray-500 dark:text-gray-400">Projects</h2>
                    <div
                        className="flex items-center gap-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 cursor-not-allowed"
                    >
                        View Github <ChevronRight className="w-4 h-4" />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {portfolio.projects.map((project, index) => (
                        <ParallaxProjectTile
                            key={index}
                            project={project}
                            index={index}
                            slug={project.slug}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
