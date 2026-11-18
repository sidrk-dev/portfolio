import type { Metadata } from "next";
import Link from "next/link";
import { devlogEntries } from "@/data/devlog";
import { SideNav } from "@/components/SideNav";
import { DevlogArchiveClient } from "@/components/DevlogArchiveClient";

export const metadata: Metadata = {
  title: "Engineering Devlog — Siddharth Rajasekaran",
  description:
    "Chronological engineering progress logs, bring-up postmortems, thermal characterizations, and SPICE/DRC design reviews across QDD actuators and 48 V power electronics.",
  openGraph: {
    title: "Engineering Devlog — Siddharth Rajasekaran",
    description:
      "Dated progress updates, SPICE corner catches, PCB layout audits, protocol reverse-engineering notes, and bench characterization runs across QDD manipulators and 48 V power electronics.",
    type: "website",
    url: "https://sidrk-dev.github.io/portfolio/devlog/",
    images: [
      {
        url: "https://sidrk-dev.github.io/portfolio/images/regen/revf-3d.png",
        width: 1600,
        height: 900,
        alt: "24–48 V Regenerative Braking & Precharge PCB (Rev F)",
      },
    ],
  },
};

export default function DevlogPage() {
  const sections = [
    { id: "notebook-top", label: "Overview & search" },
    { id: "entries", label: `Lab entries (${devlogEntries.length})` },
  ];

  return (
    <div className="shell">
      <SideNav
        mode="subpage"
        sections={sections}
        currentPath="/devlog"
        crumb={<Link href="/">← Siddharth Rajasekaran</Link>}
      />

      <main id="content" tabIndex={-1} className="project-article">
        <header id="notebook-top" tabIndex={-1} style={{ marginBottom: "1.75rem" }}>
          <h1 style={{ marginTop: "0.5rem" }}>devlog / engineering lab notebook</h1>
          <p className="lede" style={{ marginTop: "0.75rem" }}>
            Dated progress updates, SPICE corner catches, PCB layout audits, protocol reverse-engineering notes, and
            bench characterization runs across my robotics and power-electronics builds.
          </p>
        </header>

        <section id="entries" tabIndex={-1} aria-label="Filterable lab notebook archive">
          <DevlogArchiveClient entries={devlogEntries} />
        </section>
      </main>

      <footer className="foot">
        <span>Siddharth Rajasekaran · Engineering Lab Notebook</span>
        <a href="#top">top ↑</a>
      </footer>
    </div>
  );
}
