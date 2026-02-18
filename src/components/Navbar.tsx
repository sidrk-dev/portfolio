"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Github, Linkedin, Mail, FileText } from "lucide-react"

const navigation = [
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
]

const socialLinks = [
    { name: "GitHub", href: "https://github.com/sidrk-dev", icon: Github },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/siddharthrajasekaran/", icon: Linkedin },
    { name: "Email", href: "mailto:siddharth@example.com", icon: Mail },
    { name: "Resume", href: "/portfolio/resume.pdf", icon: FileText },
]

export const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // We use simple anchor tags for hash checks or just highlight based on section
    // For now, let's keep it simple with hover effects as per reference

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-6xl mx-auto px-6 lg:px-12">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                        Siddharth Rajasekaran
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium transition-colors duration-200 relative group text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-0 h-0.5 bg-gray-600 dark:bg-gray-400 transition-all duration-300 w-0 group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    {/* Social Links */}
                    <div className="hidden md:flex items-center space-x-4">
                        {socialLinks.map((link) => {
                            const Icon = link.icon
                            return (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    target={link.href.startsWith("http") ? "_blank" : undefined}
                                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            )
                        })}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div
                        className="md:hidden overflow-hidden border-t border-gray-200 dark:border-gray-800"
                    >
                        <div className="py-4 space-y-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-sm font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="flex space-x-4 pt-4">
                                {socialLinks.map((link) => {
                                    const Icon = link.icon
                                    return (
                                        <a
                                            key={link.name}
                                            href={link.href}
                                            target={link.href.startsWith("http") ? "_blank" : undefined}
                                            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
                                        >
                                            <Icon className="w-4 h-4" />
                                        </a>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
