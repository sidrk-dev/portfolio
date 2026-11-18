import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Siddharth Rajasekaran — Robotics & Hardware Engineering",
  description:
    "Siddharth Rajasekaran — Robotics and hardware engineering at Texas A&M. 24–48 V regen/precharge power electronics, QDD capstan & rolling-contact actuators, 1 kHz CAN/RS-485 motor control, and Physical AI.",
  openGraph: {
    title: "Siddharth Rajasekaran — Robotics & Hardware Engineering",
    description:
      "Full-stack robot hardware: 48 V regen/precharge PCBs, QDD capstan & rolling-contact manipulators, 6 Mbps RS-485 / 1 kHz CAN firmware, and physics-gated VLA systems.",
    type: "website",
    url: "https://sidrk-dev.github.io/portfolio/",
    images: [
      {
        url: "https://sidrk-dev.github.io/portfolio/images/regen/revf-3d.png",
        width: 1600,
        height: 900,
        alt: "24–48 V Regenerative Braking & Linear-SOA Precharge PCB (Rev F)",
      },
    ],
  },
};

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem("color-scheme");
    var meta = document.querySelector('meta[name="color-scheme"]');
    if (stored === "light" || stored === "dark") {
      if (meta) meta.setAttribute("content", stored);
      document.documentElement.setAttribute("data-theme", stored);
    } else {
      if (meta) meta.setAttribute("content", "light dark");
      document.documentElement.removeAttribute("data-theme");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="text-scale" content="scale" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
