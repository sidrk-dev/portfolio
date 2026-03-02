import { portfolio } from "@/data/portfolio"
import { ArrowLeft, Github, ExternalLink } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { promises as fs } from "fs"
import path from "path"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkDirective from "remark-directive"
import { visit } from "unist-util-visit"
import type { Root } from "mdast"

export async function generateStaticParams() {
    return portfolio.projects.map((project) => ({
        slug: project.slug,
    }))
}

// Custom remark plugin: converts ::youtube[VIDEO_ID] into an <youtube> node
function remarkYoutube() {
    return (tree: Root) => {
        visit(tree, (node: { type: string; name?: string; children?: Array<{ type: string; value?: string }> }) => {
            if (
                node.type === "leafDirective" &&
                node.name === "youtube"
            ) {
                const videoId = node.children?.[0]?.value ?? ""
                node.type = "html" as typeof node.type
                    ; (node as unknown as { value: string }).value = `<div class="youtube-embed"><iframe src="https://www.youtube.com/embed/${videoId}" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
            }
        })
    }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const project = portfolio.projects.find((p) => p.slug === slug)

    if (!project) {
        notFound()
    }

    let markdownContent = project.description
    try {
        const contentPath = path.join(process.cwd(), "src", "content", `${slug}.md`)
        markdownContent = await fs.readFile(contentPath, "utf-8")
    } catch {
        // Falls back to the short description if no .md file exists
    }

    // Strip ::kicanvas lines so they don't render as raw text
    const cleanedContent = markdownContent.replace(/::kicanvas\[.*?\]\n?/g, '')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mdComponents = { html: ({ node }: any) => <span dangerouslySetInnerHTML={{ __html: (node as any)?.value ?? "" }} /> }
    const mdPlugins = [remarkGfm, remarkDirective, remarkYoutube] as any[]

    return (
        <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            {/* Grid Background */}
            <div className="fixed inset-0 -z-10 h-full w-full bg-black bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>

            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-20">
                {/* Back link */}
                <Link
                    href="/#projects"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-10 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Projects
                </Link>

                {/* Title */}
                <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-white mb-4">
                    {project.title}
                </h1>
                {project.subtitle && (
                    <p className="text-lg text-gray-400 font-light mb-6">{project.subtitle}</p>
                )}

                {/* Metadata bar: tags + GitHub link in one horizontal row */}
                <div className="flex flex-wrap items-center gap-2 mb-8 pb-6 border-b border-white/10">
                    {project.tags.map((tag) => (
                        <span key={tag} className="px-2.5 py-0.5 text-xs font-mono bg-white/5 border border-white/10 text-cyan-200/70 rounded-full">
                            {tag}
                        </span>
                    ))}
                    {project.link && project.link !== "#" && (
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 text-xs font-medium text-white/70 hover:text-white hover:border-cyan-500/50 transition-colors"
                        >
                            <Github className="w-3.5 h-3.5" />
                            View Source
                            <ExternalLink className="w-3 h-3 opacity-50" />
                        </a>
                    )}
                </div>

                {/* Hero image */}
                {project.image && (
                    <div className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 mb-10" style={{ aspectRatio: '16/9' }}>
                        <img src={project.image} alt={project.title} className="object-cover w-full h-full" />
                        <div className="absolute bottom-0 right-0 p-3 font-mono text-xs text-cyan-500/40">
                            ID: {project.slug?.toUpperCase()}
                        </div>
                    </div>
                )}

                {/* Schematic image for foc-driver */}
                {slug === 'foc-driver' && (
                    <div className="mb-10 rounded-xl overflow-hidden border border-white/10">
                        <div className="px-4 py-2 bg-white/3 border-b border-white/10 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-500/60" />
                            <span className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase">FOC_DV — Schematic</span>
                        </div>
                        <img
                            src="/portfolio/images/foc-schematic.png"
                            alt="FOC_DV PCB Schematic"
                            className="w-full h-auto block bg-[#f5f0e8]"
                        />
                    </div>
                )}

                {/* Prose content — full width */}
                <div className="
                    prose prose-invert max-w-none
                    prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-white
                    prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-2 prose-h2:pb-2 prose-h2:border-b prose-h2:border-white/10
                    prose-h3:text-base prose-h3:mt-5 prose-h3:mb-1.5 prose-h3:text-white/90
                    prose-p:text-gray-300 prose-p:leading-[1.75] prose-p:my-3
                    prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-white prose-strong:font-semibold
                    prose-code:text-cyan-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.82em] prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:text-sm prose-pre:overflow-x-auto
                    prose-blockquote:border-l-2 prose-blockquote:border-cyan-500/40 prose-blockquote:text-gray-400 prose-blockquote:my-4
                    prose-ul:my-2 prose-li:my-1 prose-li:text-gray-300
                    prose-ol:my-2
                    prose-table:text-sm prose-th:text-white/80 prose-th:font-medium prose-td:text-gray-300
                    prose-hr:border-white/10 prose-hr:my-6
                    [&_table]:block [&_table]:overflow-x-auto [&_pre]:overflow-x-auto
                    [&_.youtube-embed]:relative [&_.youtube-embed]:w-full [&_.youtube-embed]:pb-[56.25%] [&_.youtube-embed]:h-0 [&_.youtube-embed]:my-8
                    [&_.youtube-embed_iframe]:absolute [&_.youtube-embed_iframe]:inset-0 [&_.youtube-embed_iframe]:w-full [&_.youtube-embed_iframe]:h-full [&_.youtube-embed_iframe]:rounded-xl [&_.youtube-embed_iframe]:border [&_.youtube-embed_iframe]:border-white/10
                ">
                    <ReactMarkdown remarkPlugins={mdPlugins} rehypePlugins={[]} components={mdComponents}>
                        {cleanedContent}
                    </ReactMarkdown>
                </div>
            </div>
        </main>
    )
}
