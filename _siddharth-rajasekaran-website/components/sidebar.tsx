"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Menu, X, Github, Linkedin, Mail, FileText } from "lucide-react"

const navigation = [
  { name: "About", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Resume", href: "/resume" },
  { name: "Contact", href: "/contact" },
]

const categories = [
  { name: "Engineering", items: ["Robotics", "Simulation", "Hardware"] },
  { name: "Leadership", items: ["Team Management", "Project Planning"] },
  { name: "Outreach", items: ["Education", "Mentoring", "Community"] },
]

const socialLinks = [
  { name: "GitHub", href: "https://github.com/siddharthr", icon: Github },
  { name: "LinkedIn", href: "https://linkedin.com/in/siddharthr", icon: Linkedin },
  { name: "Email", href: "mailto:siddharth@example.com", icon: Mail },
  { name: "Resume", href: "/resume.pdf", icon: FileText },
]

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{
          x: isMobileMenuOpen ? 0 : -300,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`
          fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-40 overflow-y-auto
          lg:translate-x-0 lg:static lg:z-0 lg:w-80
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full p-8">
          {/* Name/Logo */}
          <div className="mb-12">
            <Link href="/" className="block">
              <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
                Siddharth
                <br />
                Rajasekaran
              </h1>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="mb-12">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      block px-3 py-2 text-lg font-medium rounded-lg transition-colors duration-200 relative group
                      ${
                        isActive(item.href)
                          ? "text-gray-900 bg-gray-50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }
                    `}
                  >
                    {item.name}
                    <span
                      className={`
                      absolute bottom-0 left-3 h-0.5 bg-gray-900 transition-all duration-300
                      ${isActive(item.href) ? "w-6" : "w-0 group-hover:w-6"}
                    `}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Categories */}
          <div className="mb-12 space-y-8">
            {categories.map((category) => (
              <div key={category.name}>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">{category.name}</h3>
                <ul className="space-y-1">
                  {category.items.map((item) => (
                    <li key={item}>
                      <span className="block px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 cursor-default">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="mt-auto">
            <div className="grid grid-cols-2 gap-3">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </motion.a>
                )
              })}
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
