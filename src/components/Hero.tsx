import { Download } from "lucide-react";

export const Hero = () => {
    return (
        <section className="pt-32 pb-16 md:pt-48 md:pb-32 px-6 relative overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>

            <div className="max-w-4xl mx-auto space-y-6 bg-gradient-to-br from-gray-500 via-gray-200 to-white bg-clip-text text-transparent">
                <div>
                    <h1 className="text-4xl md:text-6xl font-light leading-tight pb-1">
                        Hi, I&apos;m Sid.
                    </h1>
                </div>

                <div>
                    <p className="text-4xl md:text-6xl font-light leading-tight pb-1">
                        I build systems that connect electronics, mechanics, code, and thoughtful design.
                    </p>
                </div>

                <div className="pt-8">
                    <a
                        href="/portfolio/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium text-lg"
                    >
                        <Download className="w-5 h-5" />
                        Download Resume
                    </a>
                </div>
            </div>
        </section>
    );
};
