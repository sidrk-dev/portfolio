import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Siddharth Rajasekaran - Student Engineer & Roboticist",
  description:
    "Portfolio of Siddharth Rajasekaran, a student engineer and roboticist based in Houston, TX, specializing in robotics, automation, and thoughtful design.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <div className="min-h-screen bg-white">
          <main className="w-full">{children}</main>
        </div>
      </body>
    </html>
  )
}
