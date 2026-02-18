import { portfolio } from "@/data/portfolio"
import { ArrowLeft, Github, Calendar, Layers, ExternalLink } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
    return portfolio.projects.map((project) => ({
        slug: project.slug,
    }))
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const project = portfolio.projects.find((p) => p.slug === slug)

    if (!project) {
        notFound()
    }

    return (
        <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            {/* Grid Background */}
            <div className="fixed inset-0 -z-10 h-full w-full bg-black bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>

            <div className="max-w-4xl mx-auto px-6 py-24">
                <Link
                    href="/#projects"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-12 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Projects
                </Link>

                <header className="mb-16 space-y-6">
                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags.map((tag) => (
                                <span key={tag} className="px-3 py-1 text-xs font-mono font-medium bg-white/5 border border-white/10 text-cyan-200/80 rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white">
                            {project.title}
                        </h1>
                        {project.subtitle && (
                            <p className="text-xl text-gray-400 font-light">{project.subtitle}</p>
                        )}
                    </div>
                </header>

                <div className="grid gap-12">
                    {/* Project Image */}
                    <div className="aspect-video w-full relative overflow-hidden rounded-xl border border-white/10 bg-white/5">
                        {project.image ? (
                            <img
                                src={project.image}
                                alt={project.title}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-mono">
                                NO VISUAL DATA
                            </div>
                        )}

                        {/* Tech Overlays */}
                        <div className="absolute top-0 left-0 p-4">
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                        </div>
                        <div className="absolute bottom-0 right-0 p-4 font-mono text-xs text-cyan-500/50">
                            ID: {project.slug?.toUpperCase()}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-[2fr_1fr] gap-12">
                        {/* Content */}
                        <div className="prose prose-invert prose-lg max-w-none text-gray-300 font-light leading-relaxed whitespace-pre-line">
                            {project.longDescription || project.description}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Actions */}
                            <div className="p-6 rounded-xl border border-white/10 bg-white/5 space-y-4">
                                <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Actions</h3>
                                {project.link && project.link !== "#" && (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between w-full px-4 py-3 bg-white text-black rounded-lg font-medium hover:bg-cyan-50 transition-colors group"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Github className="w-4 h-4" />
                                            View Source
                                        </span>
                                        <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                )}
                            </div>

                            {/* Tech Stack List */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Layers className="w-4 h-4" />
                                    Technology
                                </h3>
                                <ul className="space-y-2">
                                    {project.tags.map((tag) => (
                                        <li key={tag} className="flex items-center gap-3 text-gray-300">
                                            <div className="w-1.5 h-1.5 bg-cyan-500/50 rounded-full" />
                                            {tag}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
